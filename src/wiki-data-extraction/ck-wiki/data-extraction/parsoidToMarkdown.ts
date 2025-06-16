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
        },
    }))
    .trim()
     // When you have a link like `<a href="https://example.com">SomeFunction</a>()`,
     // because we replace SomeFunction with Script.SomeFunction() during our rendering process,
     // it results in a link like `Script.SomeFunction()()`, which is not valid Markdown.
     // This simply and blindly removes the second `()`.
    .replaceAll(')()', ')')
    ;
}
