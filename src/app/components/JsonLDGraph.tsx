import type { Graph } from 'schema-dts';
import 'server-only';
import { toLowerCase } from '../../utils/toLowerCase';

export function JsonLDGraph({data}: {readonly data: Graph['@graph']}) {

    const casedContent = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": data,
    });

    const lowercaseContent = toLowerCase(casedContent);

    let isErroring = true;
    try {
        if (lowercaseContent.includes('</script')) throw new Error('JSON-LD data appears to contain a closing script tag ("</script"); refusing to render for security reasons');
        if (lowercaseContent.includes('<!--')) throw new Error('JSON-LD data appears to contain a comment start ("<!--"); refusing to render for security reasons');
        isErroring = false;
    } finally {
        if (isErroring) console.log('Refusing to render JSON-LD data for security reasons. See error for more details. Refused JSON-LD was:', casedContent);
    }

    // eslint-disable-next-line react/no-danger -- we're using JSON.stringify to set a <script> tag's contents; it's fine
    return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: casedContent }} />;
}
