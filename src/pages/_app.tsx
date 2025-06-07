import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/store';
import { loadFavorites } from '@/store/slices/favoritesSlice';
import { loadHistory } from '@/store/slices/searchSlice';
import Layout from '../components/Layout/Layout';
import '../styles/globals.scss';

function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedFavorites = localStorage.getItem('movieApp_favorites');
        if (savedFavorites) {
          dispatch(loadFavorites(JSON.parse(savedFavorites)));
        }

        const savedSearchHistory = localStorage.getItem('movieApp_history');
        if (savedSearchHistory) {
          dispatch(loadHistory(JSON.parse(savedSearchHistory)));
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      }
    }
  }, [dispatch]);

  return <>{children}</>;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
      <Provider store={store}>
        <AppInitializer>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AppInitializer>
      </Provider>
  );
}
