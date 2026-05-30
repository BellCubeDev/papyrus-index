import styles from './NotFoundChip.module.scss';

export function NotFoundChip({emSize}: {emSize?: number}) {
    return <span className={styles.notFoundChip} style={{fontSize: emSize === undefined ? undefined : `${emSize}em`}}>not found</span>;
}
