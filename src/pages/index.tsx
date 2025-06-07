import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { searchMovies, setFilters, clearSearch } from '@/store/slices/moviesSlice';
import Layout from '../components/Layout/Layout';
import SearchBar from '../components/SearchBar/SearchBar';
import FilterBar from '../components/FilterBar/FilterBar';
import MovieCard from '../components/MovieCard/MovieCard';
import Pagination from '../components/Pagination/Pagination';

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    searchResults,
    loading,
    error,
    currentPage,
    totalPages,
    filters
  } = useSelector((state: RootState) => state.movies);

  useEffect(() => {
    if (!filters.query || filters.query.trim() === '') {
      dispatch(searchMovies({ query: 'Marvel', page: 1, filters: { ...filters, query: 'Marvel' } }));
    }
  }, []);

  const handleSearch = (query: string) => {
    dispatch(clearSearch());
    dispatch(searchMovies({ query, page: 1, filters: { ...filters, query } }));
  };

  const handlePageChange = (page: number) => {
    dispatch(searchMovies({ query: filters.query || 'Marvel', page, filters }));
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    const mergedFilters = { ...filters, ...newFilters };
    dispatch(setFilters(newFilters));
    dispatch(clearSearch());
    dispatch(searchMovies({ query: mergedFilters.query || 'Marvel', page: 1, filters: mergedFilters }));
  };

  return (
        <main>
          <SearchBar onSearch={handleSearch} initialValue={filters.query || ''} />
          <FilterBar filters={filters} onChange={handleFilterChange} />
          {loading && <div style={{ textAlign: 'center', margin: '2rem 0' }}>Загрузка...</div>}
          {error && <div style={{ color: 'red', textAlign: 'center', margin: '2rem 0' }}>{error}</div>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', margin: '2rem 0' }}>
            {searchResults.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          {totalPages > 1 && (
              <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
              />
          )}
        </main>
  );
};

export default HomePage;