import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie } from '@/types/movie';

export interface FavoriteItem extends Movie {
    dateAdded: string;
}

export interface FavoritesState {
    items: FavoriteItem[];
    favorites: Movie[];
}

const initialState: FavoritesState = {
    items: [],
    favorites: [],
};

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        addToFavorites: (state, action: PayloadAction<Movie>) => {
            const existingIndex = state.items.findIndex(item => item.id === action.payload.id);

            if (existingIndex === -1) {
                state.items.push({
                    ...action.payload,
                    dateAdded: new Date().toISOString(),
                });
            }
        },

        removeFromFavorites: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },

        clearFavorites: (state) => {
            state.items = [];
        },

        // Действие для загрузки избранного из localStorage (будет использовано middleware или при инициализации)
        loadFavorites: (state, action: PayloadAction<FavoriteItem[]>) => {
            state.items = action.payload;
        },
    },
});

export const {
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    loadFavorites,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;