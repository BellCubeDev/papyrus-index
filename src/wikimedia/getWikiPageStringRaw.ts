import type { PapyrusWiki } from "./getWiki";
import { wikiFetchGet } from "./wikiFetch";

/** You probably did not mean to call this.
 *
 * This is a lower-level function that bypasses the "storage" layer and fetches the page directly from the wiki.
 */
export async function getWikiPageHTMLStringRaw(wiki: PapyrusWiki, pageTitle: string): Promise<string | null> {

    const json = await wikiFetchGet(wiki, `/w/api.php?action=visualeditor&format=json&page=${encodeURIComponent(pageTitle)}&paction=parse`);
    if (!json) return null;

    if (!('visualeditor' in json)) throw new TypeError(`Failed to fetch page "${pageTitle}" from ${wiki.wikiTrueGame} Wiki; response does not contain the 'visualeditor' key!`, {cause: json});
    if (!json.visualeditor || typeof json.visualeditor !== 'object') throw new TypeError(`Failed to fetch page "${pageTitle}" from ${wiki.wikiTrueGame} Wiki; response's 'visualeditor' value is not an object!`, {cause: json});

    if (!('content' in json.visualeditor)) throw new TypeError(`Failed to fetch page "${pageTitle}" from ${wiki.wikiTrueGame} Wiki; response's 'visualeditor' value does not contain the 'content' key!`, {cause: json});
    if (typeof json.visualeditor.content !== 'string') throw new TypeError(`Failed to fetch page "${pageTitle}" from ${wiki.wikiTrueGame} Wiki; response's 'visualeditor' value's 'content' is not a string!`, {cause: json});

    const res = json.visualeditor.content;
    if (res.trim() === '') return null; // empty page; yes this does happen

    return res;
}
