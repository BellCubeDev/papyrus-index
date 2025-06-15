import {remark} from 'remark';
import remarkGFM from 'remark-gfm';
import strip from 'strip-markdown';


export function stripMD(md: string): string {
    const remarkProcessor = remark()
        .use(remarkGFM)
        .use(strip);

    return remarkProcessor.processSync(md).toString().trim();
}
