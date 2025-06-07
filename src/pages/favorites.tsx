import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout/Layout';
import MovieCard from '../components/MovieCard/MovieCard';
import type { RootState } from '@/store';
import { removeFromFavorites, clearFavorites } from '@/store/slices/favoritesSlice';
import type { Movie } from '@/types/movie';
import styles from './Favorites.module.scss';

export default function Favorites() {
    const dispatch = useDispatch();
    const favorites = useSelector((state: RootState) => state.favorites.items) as Movie[];
    const [sortBy, setSortBy] = useState<'title' | 'date_added' | 'rating'>('date_added');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [filterGenre, setFilterGenre] = useState<string>('');

    // Получаем уникальные жанры из избранных фильмов
    const genres = Array.from(
        new Set(
            favorites
                .flatMap((movie: Movie) => movie.genre_ids || [])
                .filter(Boolean)
        )
    );

    // Сортируем и фильтруем фильмы
    const sortedAndFilteredMovies = favorites
        .filter((movie: Movie) => {
            if (!filterGenre) return true;
            return movie.genre_ids?.includes(Number(filterGenre));
        })
        .sort((a: Movie, b: Movie) => {
            let comparison = 0;

            switch (sortBy) {
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'rating':
                    comparison = a.vote_average - b.vote_average;
                    break;
                case 'date_added':
                default:
                    // Предполагаем, что у нас есть поле dateAdded в store
                    comparison = 0; // Можно добавить dateAdded в favoritesSlice
                    break;
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

    const handleRemoveFromFavorites = (movieId: number) => {
        dispatch(removeFromFavorites(movieId));
    };

    const handleClearAll = () => {
        if (window.confirm('Вы уверены, что хотите удалить все фильмы из избранного?')) {
            dispatch(clearFavorites());
        }
    };

    const handleSortChange = (newSortBy: typeof sortBy) => {
        if (newSortBy === sortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortOrder('desc');
        }
    };

    return (
        <>
            <Head>
                <title>Избранное - Movie App</title>
                <meta name="description" content="Ваши избранные фильмы" />
            </Head>

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Избранное</h1>
                    <div className={styles.stats}>
                        {favorites.length > 0 ? (
                            <span>{favorites.length} {favorites.length === 1 ? 'фильм' : 'фильмов'}</span>
                        ) : (
                            <span>Нет избранных фильмов</span>
                        )}
                    </div>
                </div>

                {favorites.length > 0 && (
                    <div className={styles.controls}>
                        <div className={styles.filters}>
                            <div className={styles.filterGroup}>
                                <label htmlFor="genre-filter">Жанр:</label>
                                <select
                                    id="genre-filter"
                                    value={filterGenre}
                                    onChange={(e) => setFilterGenre(e.target.value)}
                                    className={styles.select}
                                >
                                    <option value="">Все жанры</option>
                                    {genres.map(genreId => (
                                        <option key={genreId} value={genreId}>
                                            Жанр {genreId} {/* Здесь можно добавить маппинг ID на названия жанров */}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.sorting}>
                            <span>Сортировать по:</span>
                            <div className={styles.sortButtons}>
                                <button
                                    onClick={() => handleSortChange('title')}
                                    className={`${styles.sortButton} ${sortBy === 'title' ? styles.active : ''}`}
                                >
                                    Названию {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </button>
                                <button
                                    onClick={() => handleSortChange('rating')}
                                    className={`${styles.sortButton} ${sortBy === 'rating' ? styles.active : ''}`}
                                >
                                    Рейтингу {sortBy === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </button>
                                <button
                                    onClick={() => handleSortChange('date_added')}
                                    className={`${styles.sortButton} ${sortBy === 'date_added' ? styles.active : ''}`}
                                >
                                    Дате добавления {sortBy === 'date_added' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleClearAll}
                            className={styles.clearButton}
                        >
                            Очистить все
                        </button>
                    </div>
                )}

                {favorites.length === 0 ? (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}>❤️</div>
                        <h2>Нет избранных фильмов</h2>
                        <p>
                            Добавляйте фильмы в избранное, нажимая на сердечко на карточке фильма
                            или на странице фильма.
                        </p>
                    </div>
                ) : (
                    <div className={styles.moviesGrid}>
                        {sortedAndFilteredMovies.map((movie: Movie) => (
                            <div key={movie.id} className={styles.movieCardWrapper}>
                                <MovieCard
                                    movie={movie}
                                    onToggleFavorite={() => handleRemoveFromFavorites(movie.id)}
                                    isFavorite={true}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {sortedAndFilteredMovies.length === 0 && favorites.length > 0 && (
                    <div className={styles.noResults}>
                        <h3>Нет фильмов, соответствующих фильтрам</h3>
                        <p>Попробуйте изменить параметры фильтрации</p>
                    </div>
                )}
            </div>
        </>
    );
}