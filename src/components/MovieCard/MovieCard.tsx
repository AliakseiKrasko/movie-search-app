import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addToFavorites, removeFromFavorites } from '@/store/slices/favoritesSlice';
import { Movie } from '@/types/movie';
import styles from './MovieCard.module.scss';

export interface MovieCardProps {
    movie: Movie;
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    if (!movie.poster_path) return null;
    const dispatch = useDispatch();
    const favorites = useSelector((state: RootState) => state.favorites.favorites);
    const isFavorite = favorites.some((fav: Movie) => fav.id === movie.id);

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isFavorite) {
            dispatch(removeFromFavorites(movie.id));
        } else {
            dispatch(addToFavorites(movie));
        }
    };

    const posterUrl = movie.poster_path
        ? `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/w500'}${movie.poster_path}`
        : '/placeholder-image.jpg';

    return (
        <Link href={`/movie/${movie.id}`} className={styles.card}>
            <div className={styles.posterWrap}>
                <img
                    src={posterUrl}
                    alt={movie.title || movie.name}
                    className={styles.poster}
                    loading="lazy"
                />
                <button
                    className={`${styles.favoriteBtn} ${isFavorite ? styles.active : ''}`}
                    onClick={handleFavorite}
                    aria-label={isFavorite ? 'Удалить из избранного' : 'В избранное'}
                >
                    {isFavorite ? '❤️' : '🤍'}
                </button>
            </div>
            <div className={styles.info}>
                <div className={styles.title}>{movie.title || movie.name}</div>
                <div className={styles.meta}>
                    {(movie.release_date ?? movie.first_air_date)
                        ? <span>{String(movie.release_date || movie.first_air_date).slice(0, 4)}</span>
                        : null}
                    {typeof movie.vote_average === 'number' ? <span>★ {movie.vote_average.toFixed(1)}</span> : null}
                </div>
                {movie.overview && (
                    <div className={styles.overview}>
                        {movie.overview.length > 100
                            ? movie.overview.slice(0, 97) + '...'
                            : movie.overview}
                    </div>
                )}
            </div>
        </Link>
    );
};

export default MovieCard;