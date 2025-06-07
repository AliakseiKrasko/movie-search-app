import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Movie, MovieDetails, Cast, Video, Review, SearchFilters } from '@/types/movie';
import { tmdbService } from '@/services/tmdb';

interface MoviesState {
    searchResults: Movie[];
    currentMovie: MovieDetails | null;
    cast: Cast[];
    videos: Video[];
    reviews: Review[];
    similarMovies: Movie[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    totalResults: number;
    filters: SearchFilters;
}

const initialState: MoviesState = {
    searchResults: [],
    currentMovie: null,
    cast: [],
    videos: [],
    reviews: [],
    similarMovies: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 0,
    totalResults: 0,
    filters: {
        type: 'all',
        sortBy: 'popularity.desc'
    }
};

export const searchMovies = createAsyncThunk(
    'movies/search',
    async ({ query, page, filters }: { query: string; page: number; filters: SearchFilters }) => {
        let response;

        switch (filters.type) {
            case 'movie':
                response = await tmdbService.searchMovies({ query, page, year: filters.year });
                break;
            case 'tv':
                response = await tmdbService.searchTV({ query, page, year: filters.year });
                break;
            default:
                response = await tmdbService.searchMulti({ query, page });
        }

        return response;
    }
);

export const getMovieDetails = createAsyncThunk(
    'movies/getDetails',
    async ({ id, type }: { id: number; type: 'movie' | 'tv' }) => {
        const [details, credits, videos, reviews, similar] = await Promise.all([
            type === 'movie' ? tmdbService.getMovieDetails(id) : tmdbService.getTVDetails(id),
            type === 'movie' ? tmdbService.getMovieCredits(id) : tmdbService.getTVCredits(id),
            type === 'movie' ? tmdbService.getMovieVideos(id) : tmdbService.getTVVideos(id),
            type === 'movie' ? tmdbService.getMovieReviews(id) : tmdbService.getTVReviews(id),
            type === 'movie' ? tmdbService.getSimilarMovies(id) : tmdbService.getSimilarTV(id)
        ]);

        return {
            details,
            cast: credits.cast.slice(0, 10),
            videos: videos.results.filter((v: Video) => v.site === 'YouTube').slice(0, 5),
            reviews: reviews.results,
            similar: similar.results.slice(0, 6)
        };
    }
);

const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<Partial<SearchFilters>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearSearch: (state) => {
            state.searchResults = [];
            state.currentPage = 1;
            state.totalPages = 0;
            state.totalResults = 0;
        },
        clearMovieDetails: (state) => {
            state.currentMovie = null;
            state.cast = [];
            state.videos = [];
            state.reviews = [];
            state.similarMovies = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.searchResults = action.payload.results;
                state.currentPage = action.payload.page;
                state.totalPages = action.payload.total_pages;
                state.totalResults = action.payload.total_results;
            })
            .addCase(searchMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Search failed';
            })
            .addCase(getMovieDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMovieDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.currentMovie = action.payload.details;
                state.cast = action.payload.cast;
                state.videos = action.payload.videos;
                state.reviews = action.payload.reviews;
                state.similarMovies = action.payload.similar;
            })
            .addCase(getMovieDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to load movie details';
            });
    }
});

export const { setFilters, clearSearch, clearMovieDetails } = moviesSlice.actions;
export default moviesSlice.reducer;