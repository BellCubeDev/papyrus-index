/* eslint-disable complexity */
export interface LinearMediaWikiPageData {
    document: Document;
    categories: string[];
    sections: LinearMediaWikiPageDataSection[];
    sectionsById: Record<string, LinearMediaWikiPageDataSection>;

    isFlaggedIncomplete: boolean;
    minimumXSEVersion: string | null;
}

export interface LinearMediaWikiPageDataSection {
    header: Element | null;
    contents: Element[];
}

const headerElementTagNames = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);


function removeElement(el: Element): void {
    el.remove();
    el.parentElement?.removeChild(el);
    el.setAttribute('data-papyrus-index-page-data-parser-removed', 'true');
}

function isMarkedRemoved(el: Element): boolean {
    return el.getAttribute('data-papyrus-index-page-data-parser-removed') === 'true';
}

export function extractLinearWikiPageData(document: Document): LinearMediaWikiPageData {
    //const doDebug = document.location.href === 'https://falloutck.uesp.net/wiki/GetAttackDamage_-_InstanceData';

    const categories = Array.from(document.body.querySelectorAll('link[rel="mw:PageProp/Category"]'))
        .map(e => {
            const attr = e.getAttribute('data-parsoid');
            if (!attr) return null;
            return JSON.parse(attr)?.sa?.href;
        })
        .filter(a => typeof a === 'string');

    const sections: LinearMediaWikiPageDataSection[] = [];

    let isIncomplete = false;
    let minimumXSEVersion: string | null = null;

    // example: data-mw='{"parts":[{"template":{"target":{"wt":"Template:Incomplete Article","href":"./Template:Incomplete_Article"},"params":{},"i":0}}]}'
    const transclusions = document.body.querySelectorAll('[typeof="mw:Transclusion"]');
    for (const el of transclusions) {
        removeElement(el); // so we don't include this data when we don't mean to
        const about = el.getAttribute('about');
        if (!about) {
            console.warn(`[MediaWiki Scraping - extractLinearWikiPageData()] A transclusion for "${document.location.href}" has no about attribute!`);
        } else {
            const otherElements = document.body.querySelectorAll(`[about="${about}"]`);
            for (const otherElement of otherElements) removeElement(otherElement);
        }
        //if (doDebug) console.log(`[MediaWiki Scraping - extractLinearWikiPageData()] Found a transclusion for "${document.location.href}"; removed it from the document!\n${el.outerHTML}\n\n`);
        const mwData = el.getAttribute('data-mw');
        if (!mwData) {
            console.warn(`[MediaWiki Scraping - extractLinearWikiPageData()] A transclusion for "${document.location.href}" has no data-mw attribute!`);
            continue;
        }
        const mwDataParsed = JSON.parse(mwData);

        if (!Array.isArray(mwDataParsed.parts)) {
            console.warn(`[MediaWiki Scraping - extractLinearWikiPageData()] A transclusion for "${document.location.href}" has no valid target wt attribute!`);
            continue;
        }

        for (const part of mwDataParsed.parts) {
            const wt = part.template.target.wt;
            if (!wt || typeof wt !== 'string') {
                console.warn(`[MediaWiki Scraping - extractLinearWikiPageData()] A transclusion for "${document.location.href}" has no valid target wt attribute!`);
                continue;
            }

            switch (wt) {
                // <span about="#mwt1" typeof="mw:Transclusion" data-parsoid='{"pi":[[]],"dsr":[0,31,null,null]}' data-mw='{"parts":[{"template":{"target":{"wt":"Template:Incomplete Article","href":"./Template:Incomplete_Article"},"params":{},"i":0}}]}'>
                case 'Template:Incomplete Article':
                    isIncomplete = true;
                    break;
                case 'Template:Papyrus:RequiredF4S':
                    // <br about="#mwt2" typeof="mw:Transclusion" data-parsoid='{"stx":"html","srcTagName":"BR","noClose":true,"pi":[[{"k":"version","named":true}]],"dsr":[78,125,null,null]}' data-mw='{"parts":[{"template":{"target":{"wt":"Template:Papyrus:RequiredF4SE","href":"./Template:Papyrus:RequiredF4SE"},"params":{"version":{"wt":"0.3.1"}},"i":0}}]}'/><span about="#mwt2">Requires </span><a rel="mw:WikiLink" href="./Category:F4SE" title="Category:F4SE" about="#mwt2">F4SE</a><span about="#mwt2"> version 0.3.1 or higher.</span></p>
                    minimumXSEVersion = part.template.params.version.wt;
                    break;
            }
        }
    }

    let currentSection: LinearMediaWikiPageDataSection = {
        header: null,
        contents: [],
    };
    for (const el of document.body.children) {
        if (isMarkedRemoved(el)) continue; // skip if the element was removed
        if (!headerElementTagNames.has(el.tagName.toLowerCase())) {
            currentSection.contents.push(el);
            //if (doDebug) console.log(`[MediaWiki Scraping - extractLinearWikiPageData()] Found a non-header element for "${document.location.href}"; added it to the current section!\n${el.outerHTML}\n\n`);
            continue;
        }
        if (currentSection.header || currentSection.contents.length > 0) sections.push(currentSection);
        currentSection = {
            header: el,
            contents: [],
        };
    }
    if (currentSection.header || currentSection.contents.length > 0) sections.push(currentSection);

    const sectionsById: Record<string, LinearMediaWikiPageDataSection> = {};
    for (const section of sections) {
        if (!section.header) continue;
        const headerId = section.header?.getAttribute('id');
        if (!headerId) {
            console.warn(`[MediaWiki Scraping - extractLinearWikiPageData()] A section header for "${document.location.href}" has no ID!`);
            continue;
        }
        const headerIdLower = headerId.toLowerCase();
        if (sectionsById[headerIdLower]) console.warn(`[MediaWiki Scraping - extractLinearWikiPageData()] A section header for "${document.location.href}" has a duplicate lowercase ID "${headerIdLower}"!`);
        sectionsById[headerIdLower] = section;
    }

    //if (doDebug) {
    //    console.log(`[MediaWiki Scraping - extractLinearWikiPageData()] Found ${sections.length} sections for "${document.location.href}":`, {
    //        document,
    //        categories,
    //        sections,
    //        sectionsById,
    //
    //        isFlaggedIncomplete: isIncomplete,
    //        minimumXSEVersion,
    //    });
    //}

    return {
        document,
        categories,
        sections,
        sectionsById,

        isFlaggedIncomplete: isIncomplete,
        minimumXSEVersion,
    };
}
