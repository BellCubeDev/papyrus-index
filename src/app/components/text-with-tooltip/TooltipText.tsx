import type { ReactNode } from 'react';
import styles from './TooltipText.module.scss';
import { Tooltip } from '../tooltip/Tooltip';

export function TextWithTooltip({children, tooltipContents, wrapperClassName}: {readonly children: ReactNode, readonly tooltipContents: ReactNode, readonly wrapperClassName?: string}) {
    return <Tooltip wrapperClassName={wrapperClassName ? `${styles.textWithTooltip} ${wrapperClassName}` : styles.textWithTooltip} role="tooltip" tooltipContents={tooltipContents}>
        {children}
    </Tooltip>;
}
