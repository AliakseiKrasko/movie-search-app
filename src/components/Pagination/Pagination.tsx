import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { searchMovies } from '@/store/slices/moviesSlice';
import styles from './Pagination.module.scss';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange?: (page: number) => void; // optional, если используешь свой handlePageChange
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const dispatch = useDispatch<AppDispatch>();
    const loading = useSelector((state: RootState) => state.movies.loading);
    const currentQuery = useSelector((state: RootState) => state.search.query);
    const filters = useSelector((state: RootState) => state.movies.filters);

    const handlePageChange = (page: number) => {
        if (page === currentPage || loading) return;
        // Если onPageChange передали — вызываем его, иначе выполняем свой пагинатор
        if (onPageChange) {
            onPageChange(page);
        } else {
            dispatch(searchMovies({
                query: currentQuery || '',
                page,
                filters
            }));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];
        for (let i = Math.max(2, currentPage - delta);
             i <= Math.min(totalPages - 1, currentPage + delta);
             i++) {
            range.push(i);
        }
        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }
        rangeWithDots.push(...range);
        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else {
            rangeWithDots.push(totalPages);
        }
        return rangeWithDots;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className={styles.pagination}>
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className={styles.pageButton}
            >
                ← Назад
            </button>

            <div className={styles.pages}>
                {visiblePages.map((page, index) => (
                    <span key={index}>
                        {page === '...' ? (
                            <span className={styles.dots}>...</span>
                        ) : (
                            <button
                                onClick={() => handlePageChange(page as number)}
                                disabled={loading}
                                className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                            >
                                {page}
                            </button>
                        )}
                    </span>
                ))}
            </div>

            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className={styles.pageButton}
            >
                Вперед →
            </button>
        </div>
    );
};

export default Pagination;