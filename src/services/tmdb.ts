const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;

class TMDBService {
    private async fetchFromAPI(endpoint: string, params: Record<string, any> = {}) {
        const url = new URL(`${BASE_URL}${endpoint}`);
        url.searchParams.append('api_key', API_KEY!);

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, value.toString());
            }
        });

        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`TMDB API Error: ${response.status}`);
        }

        return response.json();
    }

    async searchMulti(query: string, page: number = 1) {
        return this.fetchFromAPI('/search/multi', { query, page });
    }

    async searchMovies(query: string, page: number = 1, year?: number) {
        const params: any = { query, page };
        if (year) params.year = year;
        return this.fetchFromAPI('/search/movie', params);
    }

    async searchTV(query: string, page: number = 1, year?: number) {
        const params: any = { query, page };
        if (year) params.first_air_date_year = year;
        return this.fetchFromAPI('/search/tv', params);
    }

    async getMovieDetails(id: number) {
        return this.fetchFromAPI(`/movie/${id}`);
    }

    async getTVDetails(id: number) {
        return this.fetchFromAPI(`/tv/${id}`);
    }

    async getMovieCredits(id: number) {
        return this.fetchFromAPI(`/movie/${id}/credits`);
    }

    async getTVCredits(id: number) {
        return this.fetchFromAPI(`/tv/${id}/credits`);
    }

    async getMovieVideos(id: number) {
        return this.fetchFromAPI(`/movie/${id}/videos`);
    }

    async getTVVideos(id: number) {
        return this.fetchFromAPI(`/tv/${id}/videos`);
    }

    async getMovieReviews(id: number, page: number = 1) {
        return this.fetchFromAPI(`/movie/${id}/reviews`, { page });
    }

    async getTVReviews(id: number, page: number = 1) {
        return this.fetchFromAPI(`/tv/${id}/reviews`, { page });
    }

    async getSimilarMovies(id: number, page: number = 1) {
        return this.fetchFromAPI(`/movie/${id}/similar`, { page });
    }

    async getSimilarTV(id: number, page: number = 1) {
        return this.fetchFromAPI(`/tv/${id}/similar`, { page });
    }

    async getGenres() {
        const [movieGenres, tvGenres] = await Promise.all([
            this.fetchFromAPI('/genre/movie/list'),
            this.fetchFromAPI('/genre/tv/list')
        ]);

        return {
            movie: movieGenres.genres,
            tv: tvGenres.genres
        };
    }

    getImageUrl(path: string | null, size: string = 'w500') {
        if (!path) return '/placeholder-image.jpg';
        return `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL?.replace('w500', size)}${path}`;
    }

    getYouTubeUrl(key: string) {
        return `https://www.youtube.com/watch?v=${key}`;
    }
}

export const tmdbService = new TMDBService();