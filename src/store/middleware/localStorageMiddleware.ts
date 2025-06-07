import { Middleware } from '@reduxjs/toolkit';

export const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
    const result = next(action);

    if (
        typeof window !== 'undefined' &&
        typeof action === 'object' &&
        action !== null &&
        'type' in action &&
        typeof (action as { type: unknown }).type === 'string'
    ) {
        const state = store.getState();

        if ((action as { type: string }).type.startsWith('favorites/')) {
            localStorage.setItem('movieApp_favorites', JSON.stringify(state.favorites.favorites));
        }

        if ((action as { type: string }).type.startsWith('search/')) {
            localStorage.setItem('movieApp_searchHistory', JSON.stringify(state.search.history));
        }
    }

    return result;
};