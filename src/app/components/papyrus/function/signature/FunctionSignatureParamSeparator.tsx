'use client';

import { useEffect, useRef, useState } from "react";
import styles from "./FunctionSignature.module.scss";
import 'scheduler-polyfill';

export function PapyrusFunctionSignatureParamWrapper({children}: {readonly children: React.ReactNode}) {
    return <span className={styles.functionParametersParamWrapper}>{children}</span>;
}

const CanceledNominalError = new Error('This is not a real error! This "error" object is used to cancel a task, be it through an AbortController or as an escape hatch');

export function PapyrusFunctionSignatureParamSeparator({isInWrapper, noComma = false}: {readonly isInWrapper: boolean, readonly noComma?: boolean}) {
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

        let hasRecalcedThisFrame = false;
        function recalc() {
            if (hasRecalcedThisFrame) return;
            requestAnimationFrame(() => {
                hasRecalcedThisFrame = false;
            });
            hasRecalcedThisFrame = true;

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
        let resizeObserver: ResizeObserver | null = null;

        const abortController = new AbortController();
        const signal = abortController.signal;

        scheduler.postTask(() => {
            if (signal.aborted) return;
            resizeObserver = new ResizeObserver(recalc);
            resizeObserver.observe(wrapableSection);
            recalc();
        }, {
            signal,
            priority: 'user-visible',
            delay: 20,
        }).catch((err) => {
            if (err === CanceledNominalError) return;
            throw err;
        });

        return () => {
            abortController.abort(CanceledNominalError);
            mutationObserver.disconnect();
            resizeObserver?.disconnect();
        };
    }, [sepRef, storedWrapableSection, isInWrapper]);


    return <span ref={sepRef} className={styles.functionParametersSeparator}>
        {noComma ? '' : ', '}{isEndOfLine ? <span aria-hidden className={styles.functionParametersSeparatorBackslash + (isInWrapper ? '' : ` ${styles['functionParametersSeparatorBackslash--no-wrapper']}`) + (noComma ? ` ${styles['functionParametersSeparatorBackslash--no-comma']}` : '')}>\</span> : ''}
    </span>;
}
