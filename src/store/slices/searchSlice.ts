import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchHistory } from '../../types/movie';

interface SearchState {
    history: SearchHistory[];
    currentQuery: string;
}

const initialState: SearchState = {
    history: [],
    currentQuery: ''
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        addSearchHistory: (state, action: PayloadAction<Omit<SearchHistory, 'id' | 'timestamp'>>) => {
            const newSearch: SearchHistory = {
                ...action.payload,
                id: Date.now().toString(),
                timestamp: Date.now()
            };

            // Remove if already exists
            state.history = state.history.filter(item => item.query !== newSearch.query);

            // Add to beginning
            state.history.unshift(newSearch);

            // Keep only last 20 searches
            if (state.history.length > 20) {
                state.history = state.history.slice(0, 20);
            }
        },
        removeSearchHistory: (state, action: PayloadAction<string>) => {
            state.history = state.history.filter(item => item.id !== action.payload);
        },
        clearSearchHistory: (state) => {
            state.history = [];
        },
        setCurrentQuery: (state, action: PayloadAction<string>) => {
            state.currentQuery = action.payload;
        },
        setSearchHistory: (state, action: PayloadAction<SearchHistory[]>) => {
            state.history = action.payload;
        }
    }
});

export const {
    addSearchHistory,
    removeSearchHistory,
    clearSearchHistory,
    setCurrentQuery,
    setSearchHistory
} = searchSlice.actions;
export default searchSlice.reducer;