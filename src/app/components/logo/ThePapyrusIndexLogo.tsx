import styles from './ThePapyrusIndexLogo.module.scss';

export function ThePapyrusIndexLogo() {
    return <div className={styles.title}>
        <h1>THE <span className={styles.papyrus}>
            <span>PAPYRUS</span>
            <span hidden>PAPYRUS</span> {/* Here for styling purposes */}
            <span hidden>PAPYRUS</span>
        </span> INDEX</h1>
    </div>;
}
