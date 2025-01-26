import type { PapyrusWiki } from './getWiki';
import { getWikiPageHTMLString } from './wikiStorage';

async function parseDocument(html: string, url: string): Promise<Document> {
    if (typeof DOMParser !== 'undefined') return new DOMParser().parseFromString(html, 'text/html');
    const { JSDOM } = await import('jsdom');
    return new JSDOM(html, {url}).window.document;
}

export async function getWikiPageHTMLDocument(wiki: PapyrusWiki, pageTitle: string): Promise<Document | null> {
    const html = await getWikiPageHTMLString(wiki, pageTitle);
    if (!html) return null;
    const doc = await parseDocument(html, new URL(`/wiki/${pageTitle.replaceAll(' ', '_')}`, wiki.wikiBaseUrl).href);
    doc.querySelectorAll<HTMLAnchorElement>('a[href^="."]').forEach(a => {
        a.href = new URL(a.href, doc.baseURI).href;
    });
    return doc;
}
