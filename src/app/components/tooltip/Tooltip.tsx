'use client';

import { arrow, autoUpdate, flip, FloatingArrow, offset, shift, useDismiss, useFloating, useFocus, useHover, useInteractions, useRole } from './FloatingUIClient';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './Tooltip.module.scss';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export function Tooltip({children, wrapperClassName, role: roleRaw, tooltipContents}: {
    readonly children: ReactNode;
    readonly wrapperClassName?: string;
    /**
     * If your reference element has its own label (text), use 'tooltip'.
     * If your reference element does not have its own label, e.g. an icon, use 'label'.
    */
    readonly role: 'tooltip' | 'label';
    readonly tooltipContents: ReactNode;
}) {
    const prefersReducedMotion = usePrefersReducedMotion();

    const [isOpen, setIsOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const arrowRef = useRef(null);

    const setOpenState = useCallback((open: boolean) => {
        if (prefersReducedMotion) return setIsOpen(open);
        setIsTransitioning(true);
        requestAnimationFrame(()=> requestAnimationFrame(()=> setIsOpen(open) ));
    }, [prefersReducedMotion]);

    const {refs, floatingStyles, context} = useFloating({
      open: isOpen,
      onOpenChange: (open) => setOpenState(open),
      // eslint-disable-next-line react-compiler/react-compiler
      middleware: [offset(20), flip(), shift(), arrow({element: arrowRef})],
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

    return <>
        <span ref={refs.setReference} {...getReferenceProps()} className={wrapperClassName}>
            {children}
        </span>
        {isOpen || isTransitioning ? <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
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
        </div> : null}
    </>;
}
