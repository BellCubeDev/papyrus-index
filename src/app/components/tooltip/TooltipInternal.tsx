/* eslint-disable react-hooks/refs -- Floating UI is not designed with React Compiler in mind, so we're forced to bail on the Tooltip component */
'use client';

import { arrow, autoUpdate, flip, FloatingArrow, FloatingPortal, offset, shift, useDismiss, useFloating, useFocus, useHover, useInteractions, useRole } from './FloatingUIClient';
import React, { Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './Tooltip.module.scss';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useRefObjectValue } from '../../hooks/useRefValue';
import 'scheduler-polyfill';

export default function TooltipRenderPerformanceHelper({children, wrapperClassName, role: roleRaw, tooltipContents}: {
    readonly children: ReactNode;
    readonly wrapperClassName?: string | undefined;
    /**
     * If your reference element has its own label (text), use 'tooltip'.
     * If your reference element does not have its own label, e.g. an icon, use 'label'.
    */
    readonly role: 'tooltip' | 'label';
    readonly tooltipContents: ReactNode;
}) {
    const [hasRenderedAlready, setHasRenderedAlready] = useState(false);
    useEffect(() => {
        scheduler.postTask(() => {
            setHasRenderedAlready(true);
        }, {delay: 50, priority: 'background'});
    }, []);

    if (!hasRenderedAlready) {
        return <span className={wrapperClassName}>
            {children}
        </span>;
    }

    return <Tooltip wrapperClassName={wrapperClassName} role={roleRaw} tooltipContents={tooltipContents}>
        {children}
    </Tooltip>;
}

function Tooltip({children, wrapperClassName, role: roleRaw, tooltipContents}: Parameters<typeof TooltipRenderPerformanceHelper>[0]) {
    const prefersReducedMotion = usePrefersReducedMotion();

    const [isOpen, setIsOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const arrowRef = useRef<SVGSVGElement>(null);
    const arrowElement = useRefObjectValue(arrowRef);

    const setOpenState = useCallback((open: boolean) => {
        if (prefersReducedMotion) return setIsOpen(open);
        setIsTransitioning(true);
        requestAnimationFrame(()=> requestAnimationFrame(()=> setIsOpen(open) ));
    }, [prefersReducedMotion]);

    const {refs, floatingStyles, context} = useFloating({
      open: isOpen,
      onOpenChange: (open) => setOpenState(open),
      middleware: [offset(20), flip(), shift({
          padding: 30,
          crossAxis: false,
      }), arrow({element: arrowElement})],
      whileElementsMounted: autoUpdate,
      strategy: 'absolute',
    });

    const floatingRef = refs.floating;


    useEffect(() => {
        const floating = floatingRef.current;
        if (!floating || prefersReducedMotion)
            return setIsTransitioning(false);

        const handler = () => { setIsTransitioning(false) };
        floating.addEventListener('transitionend', handler);
        return () => {
            floating.removeEventListener('transitionend', handler);
        };
    }, [floatingRef, prefersReducedMotion]);

    useEffect(() => {
        if (!isTransitioning) return;
        const timeout = setTimeout(() => setIsTransitioning(false), 1000);
        return () => clearTimeout(timeout);
    }, [isTransitioning]);


    const hover = useHover(context, {move: false});
    const focus = useFocus(context);
    const dismiss = useDismiss(context);
    const role = useRole(context, {
      role: roleRaw,
    });

    // Merge all the interactions into prop getters
    const {getReferenceProps, getFloatingProps} = useInteractions([
      hover,
      focus,
      dismiss,
      role,
    ]);

    const areTooltipContentsMounted = useRefObjectValue(arrowRef) !== null;

    return <>
        <span ref={refs.setReference} {...getReferenceProps()} className={wrapperClassName}>
            {children}
        </span>
        <Suspense fallback={null}>
            {isOpen || isTransitioning ? <FloatingPortal><div
                ref={refs.setFloating}
                {...getFloatingProps()}
                style={{
                    ...floatingStyles,
                    opacity: areTooltipContentsMounted ? undefined : 0,
                }}
                data-is-open={isOpen}
                data-side={context.placement}
                className={styles.tooltip}
            >
                <FloatingArrow
                    width={48}
                    height={16}
                    ref={arrowRef}
                    className={styles.tooltipArrow}
                    context={context}
                    additive='sum' />
                {tooltipContents}
            </div></FloatingPortal> : null}
        </Suspense>
    </>;
}
