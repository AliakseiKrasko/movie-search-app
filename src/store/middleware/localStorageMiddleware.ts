import type { Middleware } from '@reduxjs/toolkit';


const STORAGE_KEYS = {
    FAVORITES: 'movieApp_favorites',
    HISTORY: 'movieApp_history',
    RECENT_SEARCHES: 'movieApp_recentSearches',
};

const storage = {
    get: <T>(key: string, defaultValue: T): T => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    },
    set: <T>(key: string, value: T): void => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {}
    },
    remove: (key: string): void => {
        try {
            localStorage.removeItem(key);
        } catch {}
    },
};

const localStorageMiddleware: Middleware<{}> =
    storeAPI => next => action => {
        if (
            typeof action === 'object' &&
            action !== null &&
            'type' in action &&
            typeof (action as any).type === 'string'
        ) {
            const result = next(action);
            const state = storeAPI.getState();

            if ((action as any).type.startsWith('favorites/')) {
                storage.set(STORAGE_KEYS.FAVORITES, state.favorites.items);
            }
            if (
                (action as any).type.startsWith('search/') &&
                ((action as any).type.includes('History') || (action as any).type === 'search/addToHistory')
            ) {
                storage.set(STORAGE_KEYS.HISTORY, state.search.history);
            }
            if (
                (action as any).type === 'search/addRecentSearch' ||
                (action as any).type === 'search/clearRecentSearches'
            ) {
                storage.set(STORAGE_KEYS.RECENT_SEARCHES, state.search.recentSearches);
            }
            return result;
        }
        return next(action);
    };

export default localStorageMiddleware
