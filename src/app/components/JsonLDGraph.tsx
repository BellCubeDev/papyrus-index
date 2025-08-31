import type { Graph } from 'schema-dts';
import 'server-only';

export function JsonLDGraph({data}: {readonly data: Graph['@graph']}) {
    // eslint-disable-next-line react/no-danger -- we're using JSON.stringify to set a <script> tag's contents; it's fine
    return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context": "http://schema.org",
        "@type": "Graph",
        graph: data,
    }) }} />;
}
