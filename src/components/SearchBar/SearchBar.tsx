import { useState } from 'react';
import styles from './SearchBar.module.scss';

interface SearchBarProps {
    onSearch: (query: string) => void;
    initialValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialValue = '' }) => {
    const [value, setValue] = useState(initialValue);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = value.trim();
        if (trimmed) {
            onSearch(trimmed);
        }
    };

    return (
        <form className={styles.searchBar} onSubmit={handleSubmit} autoComplete="off">
            <input
                className={styles.input}
                type="text"
                placeholder="Поиск фильмов и сериалов..."
                value={value}
                onChange={e => setValue(e.target.value)}
                aria-label="Поиск"
            />
            <button className={styles.button} type="submit" aria-label="Найти">
                🔍
            </button>
        </form>
    );
};

export default SearchBar;