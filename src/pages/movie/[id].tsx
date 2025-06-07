import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Movie } from '@/types/movie';
import { tmdbService } from '@/services/tmdb';
import { addToFavorites, removeFromFavorites } from '@/store/slices/favoritesSlice';
import { addToHistory } from '@/store/slices/searchSlice';
import { RootState } from '@/store';
import styles from './MovieDetail.module.scss';

interface MovieDetailProps {
    movie: Movie | null;
    error?: string;
}

export default function MovieDetail({ movie, error }: MovieDetailProps) {
    const router = useRouter();
    const dispatch = useDispatch();
    const favorites = useSelector((state: RootState) => state.favorites.items);
    const [isLoading, setIsLoading] = useState(false);

    const isFavorite = movie
        ? favorites.some((fav: Movie) => fav.id === movie.id)
        : false;

    useEffect(() => {
        if (movie) {
            // Добавляем фильм в историю просмотров
            dispatch(addToHistory(movie));
        }
    }, [movie, dispatch]);

    const handleToggleFavorite = () => {
        if (!movie) return;

        if (isFavorite) {
            dispatch(removeFromFavorites(movie.id));
        } else {
            dispatch(addToFavorites(movie));
        }
    };

    const handleBack = () => {
        router.back();
    };

    if (error) {
        return (
            <>
                <Head>
                    <title>Ошибка - Movie App</title>
                </Head>
                <div className={styles.error}>
                    <h1>Ошибка</h1>
                    <p>{error}</p>
                    <button onClick={handleBack} className={styles.backButton}>
                        Назад
                    </button>
                </div>
         </>
        );
    }

    if (!movie) {
        return (
            <>
                <Head>
                    <title>Фильм не найден - Movie App</title>
                </Head>
                <div className={styles.error}>
                    <h1>Фильм не найден</h1>
                    <button onClick={handleBack} className={styles.backButton}>
                        Назад
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>{movie.title} - Movie App</title>
                <meta name="description" content={movie.overview} />
            </Head>

            <div className={styles.container}>
                <button onClick={handleBack} className={styles.backButton}>
                    ← Назад
                </button>

                <div className={styles.movieDetail}>
                    <div className={styles.posterSection}>
                        <img
                            src={movie.poster_path
                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                : '/placeholder-movie.jpg'
                            }
                            alt={movie.title}
                            className={styles.poster}
                        />

                        <button
                            onClick={handleToggleFavorite}
                            className={`${styles.favoriteButton} ${isFavorite ? styles.favorite : ''}`}
                            disabled={isLoading}
                        >
                            {isFavorite ? '❤️ Убрать из избранного' : '🤍 Добавить в избранное'}
                        </button>
                    </div>

                    <div className={styles.infoSection}>
                        <h1 className={styles.title}>{movie.title}</h1>

                        {movie.original_title !== movie.title && (
                            <p className={styles.originalTitle}>
                                Оригинальное название: {movie.original_title}
                            </p>
                        )}

                        <div className={styles.metadata}>
                            <div className={styles.rating}>
                                <span className={styles.star}>⭐</span>
                                <span>{movie.vote_average.toFixed(1)}</span>
                                <span className={styles.voteCount}>({movie.vote_count} голосов)</span>
                            </div>

                            <div className={styles.releaseDate}>
                                <strong>Дата выхода:</strong> {new Date(movie.release_date).toLocaleDateString('ru-RU')}
                            </div>

                            {movie.runtime && (
                                <div className={styles.runtime}>
                                    <strong>Продолжительность:</strong> {movie.runtime} мин
                                </div>
                            )}

                            {movie.genres && movie.genres.length > 0 && (
                                <div className={styles.genres}>
                                    <strong>Жанры:</strong>
                                    <div className={styles.genreList}>
                                        {movie.genres.map(genre => (
                                            <span key={genre.id} className={styles.genre}>
                        {genre.name}
                      </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {movie.overview && (
                            <div className={styles.overview}>
                                <h2>Описание</h2>
                                <p>{movie.overview}</p>
                            </div>
                        )}

                        {movie.production_companies && movie.production_companies.length > 0 && (
                            <div className={styles.production}>
                                <h3>Производство</h3>
                                <div className={styles.companies}>
                                    {movie.production_companies.map(company => (
                                        <span key={company.id} className={styles.company}>
                      {company.name}
                    </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params!;

    try {
        const movie = await tmdbService.getMovieById(Number(id));

        return {
            props: {
                movie,
            },
        };
    } catch (error) {
        console.error('Error fetching movie:', error);

        return {
            props: {
                movie: null,
                error: 'Не удалось загрузить информацию о фильме',
            },
        };
    }
};