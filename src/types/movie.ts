export interface Movie {
    id: number;
    title?: string;
    name?: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date?: string;
    first_air_date?: string;
    vote_average: number;
    vote_count: number;
    genre_ids: number[];
    media_type?: 'movie' | 'tv';
    adult?: boolean;
    original_language: string;
    popularity: number;
}

export interface MovieDetails extends Movie {
    genres: Genre[];
    runtime?: number;
    number_of_seasons?: number;
    number_of_episodes?: number;
    status: string;
    tagline: string;
    homepage: string;
    production_companies: ProductionCompany[];
    production_countries: ProductionCountry[];
    spoken_languages: SpokenLanguage[];
}

export interface Genre {
    id: number;
    name: string;
}

export interface ProductionCompany {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
}

export interface ProductionCountry {
    iso_3166_1: string;
    name: string;
}

export interface SpokenLanguage {
    english_name: string;
    iso_639_1: string;
    name: string;
}

export interface Cast {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
    order: number;
}

export interface Video {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
    official: boolean;
}

export interface Review {
    id: string;
    author: string;
    author_details: {
        name: string;
        username: string;
        avatar_path: string | null;
        rating: number | null;
    };
    content: string;
    created_at: string;
    updated_at: string;
}

export interface SearchFilters {
    type: 'all' | 'movie' | 'tv';
    sortBy: string;
    year?: number;
    query?: string;
}

export interface SearchHistory {
    id: string;
    query: string;
    timestamp: number;
    resultsCount: number;
}