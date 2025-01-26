import type { PapyrusWiki } from "../../../wikimedia/getWiki";
import { getWikiLicense } from "../../../wikimedia/getWikiLicense";
import styles from './WikiAttribution.module.scss';

const licenseWordRegex = /\blicense\b/iu;

export async function WikiAttribution(wiki: PapyrusWiki): Promise<JSX.Element> {
    const licenseData = await getWikiLicense(wiki);

    if (!licenseData) {
        return <div className={styles.attributionBox}>
            Data provided by{wiki.wikiDeterminer ? ` ${wiki.wikiDeterminer}` : ''} <a href={wiki.wikiBaseUrl}>{wiki.wikiName}</a> may not be available under a free license. Please visit the wiki for accurate licensing information.
        </div>;
    }

    return <div className={styles.attributionBox}>
        Data provided by{wiki.wikiDeterminer ? ` ${wiki.wikiDeterminer}` : ''} <a href={wiki.wikiBaseUrl}>{wiki.wikiName}</a>. Licensed under the {
            licenseData.rightsInfoUrl
                ? <a href={licenseData.rightsInfoUrl}>{licenseData.rightsText}</a>
                : licenseData.rightsText
        }{licenseWordRegex.test(licenseData.rightsText) ? '' : ' license'}.
    </div>;
}
