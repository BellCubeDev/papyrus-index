import type { PapyrusWiki } from "./getWiki";
import { WIKI_FETCH_403FORBIDDEN, wikiFetchGet } from "./wikiFetch";

// eslint-disable-next-line complexity -- most of this is caught up in guard clauses
export async function getWikiLicense(wiki: PapyrusWiki): Promise<null | {rightsText: string, rightsInfoUrl: string|null}> {
    const rightsJson = await wikiFetchGet(wiki, '/w/api.php?action=query&meta=siteinfo&siprop=rightsinfo&format=json');
    if (!rightsJson) throw new Error(`Failed to fetch rights data from ${rightsJson}; not found!`);
    if (rightsJson === WIKI_FETCH_403FORBIDDEN) {
        if (process.env.NODE_ENV === 'development') return {rightsText: 'COULD NOT FETCH RIGHTS INFO BECAUSE OF A 403 FORBIDDEN ERROR', rightsInfoUrl: null};
        throw new Error(`The ${wiki.wikiTrueGame} wiki returned a 403 Forbidden error when trying to fetch the rights info! This is likely due to the wiki's rate limiting settings, and is not an error on our end.`);
    }

    if (!('query' in rightsJson)) throw new TypeError(`Failed to fetch rights data from ${wiki.wikiTrueGame} Wiki; response does not contain the 'query' key!`, {cause: rightsJson});
    if (!rightsJson.query || typeof rightsJson.query !== 'object') throw new TypeError(`Failed to fetch rights data from ${wiki.wikiTrueGame} Wiki; response is not an object!`);

    if (!('rightsinfo' in rightsJson.query)) throw new TypeError(`Failed to fetch rights data from ${wiki.wikiTrueGame} Wiki; response does not contain the 'rightsinfo' key!`, {cause: rightsJson});
    if (!rightsJson.query.rightsinfo || typeof rightsJson.query.rightsinfo !== 'object') throw new TypeError(`Failed to fetch rights data from ${wiki.wikiTrueGame} Wiki; response's 'rightsinfo' value is not an object!`);

    if (!('text' in rightsJson.query.rightsinfo) || typeof rightsJson.query.rightsinfo.text !== 'string' && rightsJson.query.rightsinfo.text !== null) throw new TypeError(`Failed to fetch rights data from ${wiki.wikiTrueGame} Wiki; response's 'rightsinfo' value does not contain a 'text' key with a valid type!`);
    let rightsText: string | null = rightsJson.query.rightsinfo.text;
    if (typeof rightsText !== 'string' && rightsText !== null) throw new TypeError(`Failed to fetch rights data from ${wiki.wikiTrueGame} Wiki; response's 'rightsinfo' value does not contain a 'text' key with a valid type!`);

    if (!('url' in rightsJson.query.rightsinfo) || typeof rightsJson.query.rightsinfo.url !== 'string' && rightsJson.query.rightsinfo.url !== null) throw new TypeError(`Failed to fetch rights data from ${wiki.wikiTrueGame} Wiki; response's 'rightsinfo' value does not contain a 'url' key with a valid type!`);
    let rightsInfoUrl: string | null = rightsJson.query.rightsinfo.url;
    if (typeof rightsInfoUrl !== 'string' && rightsInfoUrl !== null) throw new TypeError(`Failed to fetch rights data from ${wiki.wikiTrueGame} Wiki; response's 'rightsinfo' value does not contain a 'url' key with a valid type!`);

    if (rightsText === '' && rightsInfoUrl === '') return null;

    if (!rightsText) {
        rightsText = `Unknown License`;
    } else if (!rightsInfoUrl) {
        switch (rightsText) {
            case 'Creative Commons Attribution-ShareAlike':
                rightsText = 'Creative Commons Attribution-Share Alike 4.0';
                rightsInfoUrl = 'https://creativecommons.org/licenses/by-sa/4.0/deed';
                break;
            default:
                rightsInfoUrl = null;
        }
    }

    return {rightsText, rightsInfoUrl};
}
