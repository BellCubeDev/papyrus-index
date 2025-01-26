import '/node_modules/.pnpm/@wooorm+starry-night@3.6.0/node_modules/@wooorm/starry-night/style/dark.css'; // this is ugly but the only way Next.js will recognize it
import { getStarryNightInstance } from './StarryNightInstance';
import './CodeBlock.scss';
import type { ElementContent, Root, RootContent } from 'hast';
import { UnreachableError } from '../../../UnreachableError';
import React from 'react';
import { FloatingDelayGroup } from '../tooltip/FloatingUIClient';

export enum CodeBlockLanguage {
    Papyrus = 'source.papyrus',
}

const starryNight = await getStarryNightInstance();

export function CodeBlock({language, code, doLineNumbers}: {readonly language: CodeBlockLanguage, readonly code: string, readonly doLineNumbers?: boolean}) {
    return <FloatingDelayGroup delay={300}><pre>
        <code data-language={language}>
            <HighlightCode language={language} code={code} doLineNumbers={doLineNumbers} />
        </code>
    </pre></FloatingDelayGroup>;
}

function HighlightCode({language, code, doLineNumbers}: {readonly language: CodeBlockLanguage, readonly code: string, readonly doLineNumbers?: boolean}) {
    const root = starryNight.highlight(code, language);
    if (doLineNumbers) createStarryNightGutter(root);
    // eslint-disable-next-line react/no-array-index-key -- should never have to rerender this
    return root.children.map((child, index) => <HighlightCodeToken key={index} node={child} language={language} />);
}

function HighlightCodeToken({node, language}: {readonly node: RootContent, readonly language: CodeBlockLanguage}) {
    if (node.type === 'comment' || node.type === 'doctype') return null;
    if (node.type === 'text' || node.type === 'raw') return node.value;
    if (node.type !== 'element') throw new UnreachableError(node, 'Encountered an invalid node type while parsing Starry Night\'s Hast tree output');
    //console.log(node);
    if (node.properties.dataLineNumber) return <HighlightCodeLine node={node} language={language} />;
    return React.createElement(node.tagName, {
        className: node.properties.className,
        // eslint-disable-next-line react/no-array-index-key -- should never have to rerender this
    }, node.children.map((child, index) => <HighlightCodeToken key={index} node={child} language={language} />));
}

function HighlightCodeLine({node, language}: {readonly node: ElementContent & {type: 'element'}, readonly language: CodeBlockLanguage}) {
    return <span data-l="">
        {
            // eslint-disable-next-line react/no-array-index-key -- should never have to rerender this
            node.children.map((child, index) => <HighlightCodeToken key={index} node={child} language={language} />)
        }
    </span>;
}





// The below code is taken from Starry Night's examples.
// Copyright (c) 2022 Titus Wormer <tituswormer@gmail.com>

/**
 * @param {Root} tree
 *   Tree.
 * @returns {undefined}
 *   Nothing.
 */
export function createStarryNightGutter(tree: Root) {
    const replacement: RootContent[] = [];
    const search = /\r?\n|\r/gu;
    let index = -1;
    let start = 0;
    let startTextRemainder = '';
    let lineNumber = 0;

    while (++index < tree.children.length) {
        const child = tree.children[index]!;

        if (child.type === 'text') {
            let textStart = 0;
            let match = search.exec(child.value);

            while (match) {
                // Nodes in this line.
                const line = tree.children.slice(start, index) as ElementContent[];

                // Prepend text from a partial matched earlier text.
                if (startTextRemainder) {
                    line.unshift({type: 'text', value: startTextRemainder});
                    startTextRemainder = '';
                }

                // Append text from this text.
                if (match.index > textStart) {
                    line.push({
                    type: 'text',
                    value: child.value.slice(textStart, match.index)
                    });
                }

                // Add a line, and the eol.
                lineNumber += 1;
                replacement.push(createLine(line, lineNumber), {
                    type: 'text',
                    value: match[0]
                });

                start = index + 1;
                textStart = match.index + match[0].length;
                match = search.exec(child.value);
            }

            // If we matched, make sure to not drop the text after the last line ending.
            if (start === index + 1) startTextRemainder = child.value.slice(textStart);
        }
    }

    const line = /** @type {Array<ElementContent>} */ (tree.children.slice(start));
    // Prepend text from a partial matched earlier text.
    if (startTextRemainder) {
      line.unshift({type: 'text', value: startTextRemainder});
      startTextRemainder = ''; // eslint-disable-line no-useless-assignment
    }

    if (line.length > 0) {
      lineNumber += 1;
      replacement.push(createLine(line as ElementContent[], lineNumber));
    }

    // Replace children with new array.
    tree.children = replacement;
}

function createLine(children: ElementContent[], line: number): ElementContent {
    return {
        type: 'element',
        tagName: 'span',
        properties: {dataLineNumber: line},
        children
    };
}
