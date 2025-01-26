import htmlToMarkdown from "@wcj/html-to-markdown";

export async function parsoidElementsToMarkdown(elements: Element[], url: string): Promise<string> {
    return await parsoidToMarkdown(elements.map(e => e.outerHTML).join(''), url);
}

export async function parsoidToMarkdown(html: string, url: string): Promise<string> {
    return (await htmlToMarkdown({
        html,
        url,
        rehypeParseOption: {
            fragment: true,
            space: 'html',
            emitParseErrors: true,
        }
    })).trim();
}
