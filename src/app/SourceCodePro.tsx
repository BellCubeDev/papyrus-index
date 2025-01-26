import {Source_Code_Pro as SourceCodeProFont} from 'next/font/google';
export const SourceCodePro = SourceCodeProFont({
    weight: ['400', '600', '900'],
    display: 'swap',
    preload: false,
    subsets: ['cyrillic', 'cyrillic-ext', 'greek', 'greek-ext', 'latin', 'latin-ext', 'vietnamese'],
    variable: '--code-font',
});
