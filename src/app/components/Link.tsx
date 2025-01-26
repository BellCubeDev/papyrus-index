'use client';

import NextLink, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, useMemo } from "react";

function stripFinalSlash(url: string) {
    return url.endsWith('/') ? url.slice(0, -1) : url;
}

function getWindowURL() {
    if (typeof window === 'undefined') return new URL('http://localhost/');
    return window.location;
}

function LinkComponent({href, children, ...props}: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & Omit<LinkProps, 'href'> & {
    readonly children?: React.ReactNode | undefined;
    readonly href: URL | Lowercase<string>;
} & React.RefAttributes<HTMLAnchorElement>, ref: React.Ref<HTMLAnchorElement>) {

    const currentPathname = usePathname();
    const hrefAsUrl = useMemo(() => new URL(href, getWindowURL().href), [href]);
    const isCurrent = hrefAsUrl.origin === getWindowURL().origin && stripFinalSlash(hrefAsUrl.pathname) === stripFinalSlash(currentPathname);

    return <NextLink {...props} href={href} aria-current={isCurrent ? 'page' : undefined} ref={ref}>
        {children}
    </NextLink>;
}

export const Link = forwardRef(LinkComponent);
