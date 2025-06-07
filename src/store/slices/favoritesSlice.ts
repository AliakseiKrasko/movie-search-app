import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie } from '../../types/movie';

interface FavoritesState {
    favorites: Movie[];
}

const initialState: FavoritesState = {
    favorites: []
};

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        addToFavorites: (state, action: PayloadAction<Movie>) => {
            const exists = state.favorites.find(movie => movie.id === action.payload.id);
            if (!exists) {
                state.favorites.push(action.payload);
            }
        },
        removeFromFavorites: (state, action: PayloadAction<number>) => {
            state.favorites = state.favorites.filter(movie => movie.id !== action.payload);
        },
        setFavorites: (state, action: PayloadAction<Movie[]>) => {
            state.favorites = action.payload;
        }
    }
});

export const { addToFavorites, removeFromFavorites, setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;