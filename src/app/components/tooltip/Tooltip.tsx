'use client';

import dynamic from "next/dynamic";
import { memo } from "react";
import { memoizeDevServerConst } from "../../../utils/memoizeDevServerConst";

const tooltipImport = memoizeDevServerConst('TOOLTIP_IMPORT_DYNAMIC',
    () => dynamic(() => import('./TooltipInternal'), {
        loading: () => null,
    })
);

export const Tooltip = memo(tooltipImport);
