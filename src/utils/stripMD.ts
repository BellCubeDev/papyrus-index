import removeMd from "remove-markdown";

export function stripMD(md: string): string {
    return removeMd(md, {
        useImgAltText: false,
        gfm /* GitHub-Flavored Markdown*/: false,
        replaceLinksWithURL: false,
        stripListLeaders: false,
    });
}
