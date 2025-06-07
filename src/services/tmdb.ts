import {Movie, MovieResponse, MovieSearchParams, Genre, MovieDetails} from '@/types/movie';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

if (!API_KEY) {
    throw new Error('TMDB API key is not configured');
}

class TMDBService {
    private async fetchFromAPI<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
        const url = new URL(`${BASE_URL}${endpoint}`);

        // Добавляем API ключ
        url.searchParams.append('api_key', API_KEY!);

        // Добавляем параметры
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, String(value));
            }
        });

        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }

    async searchMovies(params: MovieSearchParams): Promise<MovieResponse> {
        return this.fetchFromAPI<MovieResponse>('/search/movie', {
            query: params.query,
            page: params.page || 1,
            year: params.year,
            primary_release_year: params.primary_release_year,
            region: params.region,
            include_adult: params.include_adult || false,
            language: 'ru-RU',
        });
    }


    async getPopularMovies(page: number = 1): Promise<MovieResponse> {
        return this.fetchFromAPI<MovieResponse>('/movie/popular', {
            page,
            language: 'ru-RU',
        });
    }
    async getTVDetails(id: number): Promise<MovieDetails> {
        return this.fetchFromAPI<MovieDetails>(`/tv/${id}`, {
            language: 'ru-RU',
        });
    }
    async getMovieDetails(id: number): Promise<MovieDetails> {
        return this.fetchFromAPI<MovieDetails>(`/movie/${id}`, {
            language: 'ru-RU',
        });
    }

    async getMovieCredits(id: number): Promise<any> {
        return this.fetchFromAPI(`/movie/${id}/credits`, { language: 'ru-RU' });
    }

    async getMovieVideos(id: number): Promise<any> {
        return this.fetchFromAPI(`/movie/${id}/videos`, { language: 'ru-RU' });
    }

    async getMovieReviews(id: number): Promise<any> {
        return this.fetchFromAPI(`/movie/${id}/reviews`, { language: 'ru-RU' });
    }


    async getTVCredits(id: number): Promise<any> {
        return this.fetchFromAPI(`/tv/${id}/credits`, { language: 'ru-RU' });
    }
    async getSimilarTV(id: number): Promise<any> {
        return this.fetchFromAPI(`/tv/${id}/similar`, { language: 'ru-RU' });
    }

    async getTVVideos(id: number): Promise<any> {
        return this.fetchFromAPI(`/tv/${id}/videos`, { language: 'ru-RU' });
    }

    async getTVReviews(id: number): Promise<any> {
        return this.fetchFromAPI(`/tv/${id}/reviews`, { language: 'ru-RU' });
    }

    async getTopRatedMovies(page: number = 1): Promise<MovieResponse> {
        return this.fetchFromAPI<MovieResponse>('/movie/top_rated', {
            page,
            language: 'ru-RU',
        });
    }

    async getNowPlayingMovies(page: number = 1): Promise<MovieResponse> {
        return this.fetchFromAPI<MovieResponse>('/movie/now_playing', {
            page,
            language: 'ru-RU',
        });
    }

    async getUpcomingMovies(page: number = 1): Promise<MovieResponse> {
        return this.fetchFromAPI<MovieResponse>('/movie/upcoming', {
            page,
            language: 'ru-RU',
        });
    }

    async getMovieById(id: number): Promise<Movie> {
        return this.fetchFromAPI<Movie>(`/movie/${id}`, {
            language: 'ru-RU',
        });
    }

    async searchTV(params: MovieSearchParams): Promise<MovieResponse> {
        return this.fetchFromAPI<MovieResponse>('/search/tv', {
            query: params.query,
            page: params.page || 1,
            year: params.year,
            language: 'ru-RU',
        });
    }

    async getMoviesByGenre(genreId: number, page: number = 1): Promise<MovieResponse> {
        return this.fetchFromAPI<MovieResponse>('/discover/movie', {
            with_genres: genreId,
            page,
            language: 'ru-RU',
            sort_by: 'popularity.desc',
        });
    }

    async getGenres(): Promise<{ genres: Genre[] }> {
        return this.fetchFromAPI<{ genres: Genre[] }>('/genre/movie/list', {
            language: 'ru-RU',
        });
    }

    async discoverMovies(params: {
        page?: number;
        sort_by?: string;
        with_genres?: string;
        primary_release_year?: number;
        'vote_average.gte'?: number;
        'vote_average.lte'?: number;
    } = {}): Promise<MovieResponse> {
        return this.fetchFromAPI<MovieResponse>('/discover/movie', {
            ...params,
            language: 'ru-RU',
            page: params.page || 1,
        });
    }

    async getSimilarMovies(movieId: number, page: number = 1): Promise<MovieResponse> {
        return this.fetchFromAPI<MovieResponse>(`/movie/${movieId}/similar`, {
            page,
            language: 'ru-RU',
        });
    }

    async searchMulti(params: MovieSearchParams): Promise<any> {
        return this.fetchFromAPI('/search/multi', {
            query: params.query,
            page: params.page || 1,
            language: 'ru-RU',
        });
    }

    async getMovieRecommendations(movieId: number, page: number = 1): Promise<MovieResponse> {
        return this.fetchFromAPI<MovieResponse>(`/movie/${movieId}/recommendations`, {
            page,
            language: 'ru-RU',
        });
    }

    // Утилитарные методы
    getImageUrl(path: string | null, size: 'w200' | 'w300' | 'w400' | 'w500' | 'w780' | 'original' = 'w500'): string {
        if (!path) return '/placeholder-movie.jpg';
        return `https://image.tmdb.org/t/p/${size}${path}`;
    }

    getBackdropUrl(path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string {
        if (!path) return '/placeholder-backdrop.jpg';
        return `https://image.tmdb.org/t/p/${size}${path}`;
    }
}

export const tmdbService = new TMDBService();
export default tmdbService;