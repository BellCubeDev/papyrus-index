'use client';

import { lazy, memo, Suspense } from "react";
import { memoizeDevServerConst } from "../../../utils/memoizeDevServerConst";

type Props = React.ComponentProps<typeof import('./TooltipInternal').default>
function TOOLTIP_WRAPPER_ONLY({children, wrapperClassName}: Props) {
    return <span className={wrapperClassName}>
        {children}
    </span>;
}

const tooltipImport = memoizeDevServerConst('TOOLTIP_IMPORT_DYNAMIC',
    () => lazy(() => import('./TooltipInternal'))
);

const TooltipComponentNoSuspense = typeof window === 'undefined' ? TOOLTIP_WRAPPER_ONLY : memo(tooltipImport);

export function Tooltip(props: Props) {
    return <Suspense fallback={<TOOLTIP_WRAPPER_ONLY {...props} />}>
        <TooltipComponentNoSuspense {...props} />
    </Suspense>;
}
