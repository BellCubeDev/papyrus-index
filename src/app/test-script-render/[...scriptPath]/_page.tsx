import fs from 'fs/promises';
import { notFound } from 'next/navigation';
import { CodeBlock, CodeBlockLanguage } from '../../components/code-block/CodeBlock';

export default async function TestScriptRenderPage({params}: {readonly params: Promise<{scriptPath: string[]}>}) {
    if (process.env.NODE_ENV !== 'development') return notFound();
    const {scriptPath} = await params;
    const scriptPathString = scriptPath.map(c=>decodeURI(c)).join('/');
    const code = await fs.readFile(`./data/${scriptPathString}`, 'utf8');
    return <CodeBlock language={CodeBlockLanguage.Papyrus} code={code} doLineNumbers />;
}
