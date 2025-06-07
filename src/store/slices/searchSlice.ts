import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie } from '@/types/movie';

interface HistoryItem {
    movie: Movie;
    viewedAt: string;
}

interface SearchState {
    query: string;
    results: Movie[];
    isLoading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    totalResults: number;
    history: HistoryItem[];
    recentSearches: string[];
}

const initialState: SearchState = {
    query: '',
    results: [],
    isLoading: false,
    error: null,
    currentPage: 1,
    totalPages: 0,
    totalResults: 0,
    history: [],
    recentSearches: [],
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setQuery: (state, action: PayloadAction<string>) => {
            state.query = action.payload;
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        setResults: (state, action: PayloadAction<{
            results: Movie[];
            page: number;
            totalPages: number;
            totalResults: number;
        }>) => {
            state.results = action.payload.results;
            state.currentPage = action.payload.page;
            state.totalPages = action.payload.totalPages;
            state.totalResults = action.payload.totalResults;
            state.error = null;
        },

        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },

        clearResults: (state) => {
            state.results = [];
            state.currentPage = 1;
            state.totalPages = 0;
            state.totalResults = 0;
            state.error = null;
        },

        setPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },

        addToHistory: (state, action: PayloadAction<Movie>) => {
            // Удаляем существующую запись, если она есть
            state.history = state.history.filter(item => item.movie.id !== action.payload.id);

            // Добавляем новую запись в начало
            state.history.unshift({
                movie: action.payload,
                viewedAt: new Date().toISOString(),
            });

            // Ограничиваем размер истории (например, 100 записей)
            if (state.history.length > 100) {
                state.history = state.history.slice(0, 100);
            }
        },

        removeFromHistory: (state, action: PayloadAction<number>) => {
            state.history = state.history.filter(item => item.movie.id !== action.payload);
        },

        clearHistory: (state) => {
            state.history = [];
        },

        addRecentSearch: (state, action: PayloadAction<string>) => {
            const query = action.payload.trim();
            if (query) {
                // Удаляем существующий поисковый запрос, если он есть
                state.recentSearches = state.recentSearches.filter(search => search !== query);

                // Добавляем в начало
                state.recentSearches.unshift(query);

                // Ограничиваем количество недавних поисков
                if (state.recentSearches.length > 10) {
                    state.recentSearches = state.recentSearches.slice(0, 10);
                }
            }
        },

        clearRecentSearches: (state) => {
            state.recentSearches = [];
        },

        // Действия для загрузки данных из localStorage (будет использовано middleware)
        loadHistory: (state, action: PayloadAction<HistoryItem[]>) => {
            state.history = action.payload;
        },

        loadRecentSearches: (state, action: PayloadAction<string[]>) => {
            state.recentSearches = action.payload;
        },
    },
});

export const {
    setQuery,
    setLoading,
    setResults,
    setError,
    clearResults,
    setPage,
    addToHistory,
    removeFromHistory,
    clearHistory,
    addRecentSearch,
    clearRecentSearches,
    loadHistory,
    loadRecentSearches,
} = searchSlice.actions;

export default searchSlice.reducer;