import styles from './ThePapyrusIndexLogo.module.scss';

export function ThePapyrusIndexLogo() {
    return <div className={styles.title}><div>
        THE <span className={styles.papyrus}>
            <span>PAPYRUS</span>
            <span hidden>PAPYRUS</span> {/* Here for styling purposes */}
            <span hidden>PAPYRUS</span>
        </span> INDEX
    </div></div>;
}
