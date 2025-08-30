
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition, type ListboxOptionsProps } from '@headlessui/react';
import { useEffect, useMemo, useState, type Key } from 'react';
import styles from './MultiBox.module.scss';
import { useEffectEvent } from '@floating-ui/react/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';

export type MultiBoxOption = { displayNode: React.ReactNode, value: any, key: Key; };
type MultiBoxOptionFilledExtraProps<_T extends MultiBoxOption> = { deselect: () => void; };
export type MultiBoxOptionFilled<T extends MultiBoxOption> = Omit<T, keyof MultiBoxOptionFilledExtraProps<T>> & MultiBoxOptionFilledExtraProps<T>;

const MULTIBOX_LIST_ANCHOR: NonNullable<ListboxOptionsProps['anchor']> = {
    gap: '0.03rem',
    to: 'bottom start',
};

export function MultiBox<T extends MultiBoxOption>({ options, onChange: parentOnChange_, children }: {
    readonly options: readonly T[],
    readonly onChange: (selectedValues: readonly MultiBoxOptionFilled<T>[]) => void;
    readonly children: React.ReactNode;
}) {
    const parentOnChange = useEffectEvent(parentOnChange_);

    const [selected, setSelected] = useState<readonly MultiBoxOptionFilled<T>[]>([]);
    useEffect(() => { parentOnChange(selected) }, [selected, parentOnChange]);

    const deselectOption = useEffectEvent((option: T)=>{
        setSelected((prevSelected) => prevSelected.filter((o) => o.key !== option.key));
    });

    const optionsFilled = useMemo(() =>
        options.map((option) => ({
            ...option,
            deselect: () => deselectOption(option),
        }))
    , [options, deselectOption]);

    useEffect(() => {
        setSelected((prevSelected) => prevSelected.map((o) => optionsFilled.find((opt) => opt.key === o.key)).filter((o): o is NonNullable<typeof o> => Boolean(o)));
    }, [optionsFilled]);

    return <div className={styles.listBoxWrapper}>
        <Listbox multiple value={selected} onChange={setSelected}>
            <ListboxButton className={styles.listBoxButton}>
                {children}
                <FontAwesomeIcon icon={faChevronDown} />
            </ListboxButton>
            <ListboxOptions as='menu' modal transition anchor={MULTIBOX_LIST_ANCHOR} className={styles.listBoxOptionsWrapper}>
                {optionsFilled.map((option) => <li key={option.key}><ListboxOption as='button' value={option} className={styles.listBoxOption}>
                    <span>{option.displayNode}</span>
                    {selected.includes(option) ? <FontAwesomeIcon icon={faCheck} className={styles.listBoxOptionSelectedIcon!} /> : <span className={styles.listBoxOptionSelectedIcon!} />}
                </ListboxOption></li>)}
            </ListboxOptions>
            <ul className={styles.selectedOptionsList}>
                {optionsFilled.map((option) => <Transition as='li' key={option.key} show={selected.includes(option)} className={styles.selectedOptionsListItem}>
                    {option.displayNode}
                    <button type="button" onClick={option.deselect} className={styles.deselectSelectedOptionsListItemButton} aria-label={`Deselect${typeof option.displayNode === 'string' ? `: ${option.displayNode}` : ' this option'}`}>×</button>
                </Transition>)}
            </ul>
        </Listbox>
    </div>;
}
