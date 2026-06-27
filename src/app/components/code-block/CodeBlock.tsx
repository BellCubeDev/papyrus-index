import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { Fragment } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';
import { createHighlighterCore } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';
import { FloatingDelayGroup } from '../tooltip/FloatingUIClient';
import { transformerColorizedBrackets } from '@shikijs/colorized-brackets';
import './CodeBlock.scss';
import { transformerRenderIndentGuides } from '@shikijs/transformers';
import { SuspenseIfDevelopment } from '@/app/components/SuspenseIfDevelopment';

const shikiPromise = createHighlighterCore({
    themes: [
        import('@shikijs/themes/dark-plus'),
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

export function CodeBlock({ language, code, doLineNumbers }: { readonly language: CodeBlockLanguage, readonly code: string, readonly doLineNumbers?: boolean; }) {
    return <FloatingDelayGroup delay={300}>
        <pre className={doLineNumbers ? 'line-numbers' : undefined}>
            <code data-language={language}>
                <HighlightCodeContents language={language} code={code.replaceAll('\t', '    ')} />
            </code>
        </pre>
    </FloatingDelayGroup>;
}


function HighlightCodeContents({ language, code }: { readonly language: CodeBlockLanguage, readonly code: string; }) {
    return <SuspenseIfDevelopment fallback={code}>
        <HighlightCodeContentsAsync language={language} code={code} />
    </SuspenseIfDevelopment>;
}

async function HighlightCodeContentsAsync({ language, code }: { readonly language: CodeBlockLanguage, readonly code: string; }) {
    const shiki = await shikiPromise;

    const out = shiki.codeToHast(code, {
        lang: language,
        theme: 'dark-plus',
        transformers: [
            transformerColorizedBrackets({}),
            transformerRenderIndentGuides({
                indent: 4,
            }),
        ],
    });

    return toJsxRuntime(out, {
        Fragment,
        jsx,
        jsxs,
        components: {
            // we handle our own pre/code tags
            pre: props => props.children,
            code: props => props.children,
        },
    });
}
