import './CodeBlock.scss';
import type { ElementContent, Root, RootContent, Text } from 'hast';
import { UnreachableError } from '../../../UnreachableError';
import React, { Suspense } from 'react';
import { FloatingDelayGroup } from '../tooltip/FloatingUIClient';
import { createHighlighterCore } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';

const shikiPromise = createHighlighterCore({
    themes: [
        import('@shikijs/themes/github-dark'),
    ],
    langs: [
        import('./Papyrus/papyrusTMLanguage').then(m => m.PapyrusTMLanguage),
    ],
    // `shiki/wasm` contains the wasm binary inlined as base64 string.
    engine: createOnigurumaEngine(import('shiki/wasm'))
});

export enum CodeBlockLanguage {
    Papyrus = 'papyrus',
}

export function CodeBlock({ language, code, doLineNumbers }: { readonly language: CodeBlockLanguage, readonly code: string, doLineNumbers?: boolean }) {
    return <FloatingDelayGroup delay={300}>
        <pre className={doLineNumbers ? 'line-numbers' : undefined}>
            <code data-language={language}>
                <HighlightCode language={language} code={code.replaceAll('\t', '    ')} />
            </code>
        </pre>
    </FloatingDelayGroup>;
}


async function HighlightCode({ language, code }: { readonly language: CodeBlockLanguage, readonly code: string }) {
    return <Suspense fallback={code}>
        <HighlightCodeAsync language={language} code={code} />
    </Suspense>;
}

async function HighlightCodeAsync({ language, code }: { readonly language: CodeBlockLanguage, readonly code: string }) {
    const shiki = await shikiPromise;

    const out = await shiki.codeToHtml(code, {
        lang: language,
        theme: 'github-dark',
        transformers: [
            {
                root(rootNode) {
                    let hasError = true;
                    try {
                        if (rootNode.children.length !== 1) throw new Error('Unexpected number of children in root of shiki output.');
                        const preElement = rootNode.children[0]!;
                        if (preElement.type !== 'element' || preElement.tagName !== 'pre') throw new Error('Unexpected root child in shiki output; expected <pre>.');
                        const codeElement = preElement.children[0]!;
                        if (codeElement.type !== 'element' || codeElement.tagName !== 'code') throw new Error('Unexpected <pre> child in shiki output; expected <code>.');

                        const newRoot: Root = {
                            ...rootNode,
                            children: codeElement.children,
                        }

                        hasError = false;
                        return newRoot;
                    } finally {
                        if (hasError) console.log('Shiki output root node for debugging:\n\n' + JSON.stringify(rootNode, null, 4) + '\n\n', rootNode);
                    }
                }
            }
        ]
    });

    return <div dangerouslySetInnerHTML={{ __html: out }} />;

}
