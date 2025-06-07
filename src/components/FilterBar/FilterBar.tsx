import styles from './FilterBar.module.scss';
import {SearchFilters} from "@/types/movie";


interface FilterBarProps {
    filters: SearchFilters;
    onChange: (filters: Partial<SearchFilters>) => void;
}

const typeOptions = [
    { value: 'all', label: 'Все' },
    { value: 'movie', label: 'Фильмы' },
    { value: 'tv', label: 'Сериалы' },
];

const sortOptions = [
    { value: 'popularity.desc', label: 'По популярности' },
    { value: 'vote_average.desc', label: 'По рейтингу' },
    { value: 'release_date.desc', label: 'По дате (новые)' },
    { value: 'release_date.asc', label: 'По дате (старые)' },
];

const yearOptions = [
    { value: '', label: 'Все годы' },
    ...Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => {
        const year = new Date().getFullYear() - i;
        return { value: year.toString(), label: year.toString() };
    })
];

const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange }) => {
    return (
        <div className={styles.filterBar}>
            <div className={styles.group}>
                <label htmlFor="type" className={styles.label}>Тип:</label>
                <select
                    id="type"
                    className={styles.select}
                    value={filters.type}
                    onChange={e => onChange({ type: e.target.value as SearchFilters['type'] })}
                >
                    {typeOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className={styles.group}>
                <label htmlFor="sortBy" className={styles.label}>Сортировка:</label>
                <select
                    id="sortBy"
                    className={styles.select}
                    value={filters.sortBy}
                    onChange={e => onChange({ sortBy: e.target.value })}
                >
                    {sortOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className={styles.group}>
                <label htmlFor="year" className={styles.label}>Год:</label>
                    <select
                        id="year"
                        className={styles.select}
                        value={filters.year || ''}
                        onChange={e => onChange({ year: e.target.value ? Number(e.target.value) : undefined })}
                    >
                        {yearOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
    );
};

export default FilterBar;