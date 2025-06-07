import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout/Layout';
import MovieCard from '../components/MovieCard/MovieCard';
import { RootState } from '@/store';
import { clearHistory, removeFromHistory } from '@/store/slices/searchSlice';
import { addToFavorites, removeFromFavorites } from '@/store/slices/favoritesSlice';
import { Movie } from '@/types/movie';
import styles from './History.module.scss';

// Описание одного элемента истории
interface HistoryItem {
    movie: Movie;
    viewedAt: string;
}

export default function History() {
    const dispatch = useDispatch();
    const history = useSelector((state: RootState) => state.search.history) as HistoryItem[];
    const favorites = useSelector((state: RootState) => state.favorites.items) as Movie[];
    const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
    const [sortBy, setSortBy] = useState<'recent' | 'title' | 'rating'>('recent');

    // Фильтруем историю по времени
    const filteredHistory = history.filter((item: HistoryItem) => {
        if (timeFilter === 'all') return true;

        const now = new Date();
        const itemDate = new Date(item.viewedAt);

        switch (timeFilter) {
            case 'today':
                return itemDate.toDateString() === now.toDateString();
            case 'week': {
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return itemDate >= weekAgo;
            }
            case 'month': {
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                return itemDate >= monthAgo;
            }
            default:
                return true;
        }
    });

    // Сортируем историю
    const sortedHistory = [...filteredHistory].sort((a: HistoryItem, b: HistoryItem) => {
        switch (sortBy) {
            case 'title':
                return a.movie.title.localeCompare(b.movie.title);
            case 'rating':
                return b.movie.vote_average - a.movie.vote_average;
            case 'recent':
            default:
                return new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime();
        }
    });

    const handleToggleFavorite = (movie: Movie) => {
        const isFavorite = favorites.some((fav: Movie) => fav.id === movie.id);

        if (isFavorite) {
            dispatch(removeFromFavorites(movie.id));
        } else {
            dispatch(addToFavorites(movie));
        }
    };

    const handleRemoveFromHistory = (movieId: number) => {
        dispatch(removeFromHistory(movieId));
    };

    const handleClearHistory = () => {
        if (window.confirm('Вы уверены, что хотите очистить всю историю просмотров?')) {
            dispatch(clearHistory());
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return `Сегодня в ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
        } else if (diffDays === 2) {
            return `Вчера в ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
        } else if (diffDays <= 7) {
            return `${diffDays - 1} дн. назад`;
        } else {
            return date.toLocaleDateString('ru-RU');
        }
    };

    return (
        <Layout>
            <Head>
                <title>История просмотров - Movie App</title>
                <meta name="description" content="История просмотренных фильмов" />
            </Head>

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>История просмотров</h1>
                    <div className={styles.stats}>
                        {history.length > 0 ? (
                            <span>Всего просмотрено: {history.length} {history.length === 1 ? 'фильм' : 'фильмов'}</span>
                        ) : (
                            <span>История пуста</span>
                        )}
                    </div>
                </div>

                {history.length > 0 && (
                    <div className={styles.controls}>
                        <div className={styles.filters}>
                            <div className={styles.filterGroup}>
                                <label htmlFor="time-filter">Период:</label>
                                <select
                                    id="time-filter"
                                    value={timeFilter}
                                    onChange={(e) => setTimeFilter(e.target.value as typeof timeFilter)}
                                    className={styles.select}
                                >
                                    <option value="all">Все время</option>
                                    <option value="today">Сегодня</option>
                                    <option value="week">Неделя</option>
                                    <option value="month">Месяц</option>
                                </select>
                            </div>

                            <div className={styles.filterGroup}>
                                <label htmlFor="sort-by">Сортировка:</label>
                                <select
                                    id="sort-by"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                                    className={styles.select}
                                >
                                    <option value="recent">По дате просмотра</option>
                                    <option value="title">По названию</option>
                                    <option value="rating">По рейтингу</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleClearHistory}
                            className={styles.clearButton}
                        >
                            Очистить историю
                        </button>
                    </div>
                )}

                {history.length === 0 ? (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}>📺</div>
                        <h2>История просмотров пуста</h2>
                        <p>
                            Здесь будут отображаться фильмы, которые вы просматривали.
                            История автоматически пополняется при переходе на страницу фильма.
                        </p>
                    </div>
                ) : filteredHistory.length === 0 ? (
                    <div className={styles.noResults}>
                        <h3>Нет фильмов за выбранный период</h3>
                        <p>Попробуйте выбрать другой временной период</p>
                    </div>
                ) : (
                    <div className={styles.historyList}>
                        {sortedHistory.map((item: HistoryItem) => {
                            const isFavorite = favorites.some((fav: Movie) => fav.id === item.movie.id);

                            return (
                                <div key={`${item.movie.id}-${item.viewedAt}`} className={styles.historyItem}>
                                    <div className={styles.movieCardWrapper}>
                                        <MovieCard
                                            movie={item.movie}
                                            onToggleFavorite={() => handleToggleFavorite(item.movie)}
                                            isFavorite={isFavorite}
                                        />
                                    </div>

                                    <div className={styles.historyInfo}>
                                        <div className={styles.viewedAt}>
                                            Просмотрено: {formatDate(item.viewedAt)}
                                        </div>

                                        <button
                                            onClick={() => handleRemoveFromHistory(item.movie.id)}
                                            className={styles.removeButton}
                                            title="Удалить из истории"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {filteredHistory.length > 0 && (
                    <div className={styles.summary}>
                        <p>
                            Показано {filteredHistory.length} из {history.length} записей
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
}