export interface Genre {
    id: number;
    name: string;
}

export interface ProductionCompany {
    id: number;
    name: string;
    logo_path?: string;
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


export interface Movie {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    vote_count: number;
    popularity: number;
    adult: boolean;
    video: boolean;
    original_language: string;
    genre_ids?: number[]; // Для результатов поиска
    genres?: Genre[]; // Для детальной информации
    runtime?: number; // Только в детальной информации
    production_companies?: ProductionCompany[];
    production_countries?: ProductionCountry[];
    spoken_languages?: SpokenLanguage[];
    budget?: number;
    revenue?: number;
    homepage?: string;
    imdb_id?: string;
    status?: string;
    tagline?: string;
    name?: string;
    first_air_date?: string;
}

export interface Cast {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

export interface Video {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
}

export interface Review {
    id: string;
    author: string;
    content: string;
    url: string;
}

export interface MovieDetails extends Movie {
    // Расширенные поля для детальной информации о фильме
    budget?: number;
    revenue?: number;
    genres?: Genre[];
    production_companies?: ProductionCompany[];
    production_countries?: ProductionCountry[];
    spoken_languages?: SpokenLanguage[];
    homepage?: string;
    imdb_id?: string;
    status?: string;
    tagline?: string;
}

export interface SearchFilters {
    type?: 'movie' | 'tv' | 'all';
    year?: number;
    sortBy?: string;
    query?: string;
}

export interface MovieResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export interface MovieSearchParams {
    query: string;
    page?: number;
    year?: number;
    primary_release_year?: number;
    region?: string;
    include_adult?: boolean;
}

export interface MovieFilters {
    genre?: number;
    year?: number;
    rating?: {
        min: number;
        max: number;
    };
    sortBy?: 'popularity.desc' | 'popularity.asc' | 'release_date.desc' | 'release_date.asc' | 'vote_average.desc' | 'vote_average.asc' | 'title.asc' | 'title.desc';
}