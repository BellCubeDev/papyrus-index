'use client';

import { useEffect, useRef, useState } from "react";
import styles from "./FunctionSignature.module.scss";


export function PapyrusFunctionSignatureParamWrapper({children}: {readonly children: React.ReactNode}) {
    return <span className={styles.functionParametersParamWrapper}>{children}</span>;
}

export function PapyrusFunctionSignatureParamSeparator({isInWrapper}: {readonly isInWrapper: boolean}) {
    const [isEndOfLine, setIsEndOfLine] = useState(false);
    const sepRef = useRef<HTMLSpanElement>(null);
    const [storedWrapableSection, setStoredWrapableSection] = useState<Element | null>(null);

    useEffect(() => {
        const sep = sepRef.current;
        if (!sep) return;

        const wrapper = isInWrapper ? sep.parentElement! : sep;
        if (!wrapper) return console.warn('No wrapper found for function parameter separator component! This should... not be possible?');

        const wrapableSection = sep.parentElement?.parentElement;
        if (!wrapableSection) return setStoredWrapableSection(null);
        if (wrapableSection !== storedWrapableSection) setStoredWrapableSection(wrapableSection);

        const mutationObserver = new MutationObserver((_mutations) => {
            if (wrapableSection.parentElement !== storedWrapableSection) setStoredWrapableSection(sep.parentElement);
        });
        mutationObserver.observe(wrapableSection, {childList: true});

        function recalc() {
            const nextSibling = wrapper.nextElementSibling;
            if (!nextSibling) {
                console.warn('No next sibling found for wrapable section in function parameter separator component! This should... not be possible?');
            } else {
                if (nextSibling.classList.contains(styles.functionParametersSeparator ?? '__')) return setIsEndOfLine(false);
                const wrapperRect = wrapper.getBoundingClientRect();
                const nextRect = nextSibling.getBoundingClientRect();
                if (wrapperRect.x >= nextRect.x) return setIsEndOfLine(true);
                if (wrapperRect.y < nextRect.y) return setIsEndOfLine(true);
            }

            setIsEndOfLine(false);
        }

        const resizeObserver = new ResizeObserver(recalc);
        resizeObserver.observe(wrapableSection);
        recalc();

        return () => {
            mutationObserver.disconnect();
            resizeObserver.disconnect();
        };
    }, [sepRef, storedWrapableSection, isInWrapper]);


    return <span ref={sepRef} className={styles.functionParametersSeparator}>
        {isInWrapper ? ', ' : ''}{isEndOfLine ? <span className={styles.functionParametersSeparatorBackslash + (isInWrapper ? '' : ` ${styles['functionParametersSeparatorBackslash--no-wrapper']}`)}>\</span> : ''}
    </span>;
}
