
import {Source_Code_Pro as SourceCodeProFont, Roboto as RobotoFont } from 'next/font/google';

export const SourceCodePro = SourceCodeProFont({
    weight: ['400', '600', '900'],
    display: 'swap',
    preload: false,
    subsets: ['cyrillic', 'cyrillic-ext', 'greek', 'greek-ext', 'latin', 'latin-ext', 'vietnamese'],
    variable: '--code-font',
    fallback: ["monospace"]
});

export const Roboto = RobotoFont({
    display: 'block',
    weight: ['400', '500', '700'],
    subsets: ['latin-ext'],
    variable: '--font',
    fallback: ["sans-serif"]
});
