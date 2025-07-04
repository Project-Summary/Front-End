import { ContentStatus, StoriesCategories } from "../story/interface.story";

export interface Credits {
    director?: string;
    writer?: string;
    cast?: string[];
    producer?: string;
    studio?: string;
}

// app/redux/film/interface.film.ts (thêm vào file hiện tại)

export interface Episode {
  _id: string;
  movieId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  videoUrl?: string;
  duration?: number;
  episodeNumber: number;
  seasonNumber?: number;
  status: ContentStatus;
  isAIGenerated: boolean;
  statistics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  transcript?: string;
  subtitles?: {
    language: string;
    url: string;
  }[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateMovieData {
  title?: string;
  description?: string;
  script?: string;
  poster?: string;
  backdrop?: string;
  trailer?: string;
  releaseDate?: Date;
  duration?: number;
  categories?: string[];
  ageRating?: string;
  status?: ContentStatus;
  tags?: string[];
  language?: string;
  country?: string;
  directors?: string[];
  actors?: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  isAIGenerated?: boolean;
}


export interface CreateMovie {
    title: string;
    description?: string;
    poster?: string;
    backdrop?: string;
    trailer?: string;
    releaseDate?: Date;
    duration?: number;
    categories: string[];
    ageRating?: string;
    status?: ContentStatus;
    isAIGenerated?: boolean;
    script?: string;
    tags?: string[];
    language?: string;
    country?: string;
    credits?: Credits;
}

export interface Subtitle {
    language: string;
    url: string;
}

export interface CreateEpisode {
    title: string;
    description?: string;
    thumbnail?: string;
    videoUrl?: string;
    duration?: number;
    episodeNumber: number;
    seasonNumber?: number;
    status?: ContentStatus;
    isAIGenerated?: boolean;
    transcript?: string;
    subtitles?: Subtitle[];
}

export interface IDataGenerateEp {
    script: string,
    episodeCount?: number,
}

// Cập nhật IFilmState
export interface IFilmState {
    loading: boolean,
    error: string | null,
    response: any | null,
    films: IMappingMovie[],
    selectedFilm: IMappingMovie | null,
    episodes: Episode[], // Cập nhật type này
    selectedEpisode: Episode | null, // Cập nhật type này
    popular: any[],
    recent: any[],
    topRated: IMappingMovie[],
    maxRated: IMappingMovie | null,
}

export interface IMappingMovie {
    _id: string,
    title: string,
    poster: string,
    totalEpisodes: number,
    statistics: IStatistics,
    categories: StoriesCategories[];
    status: string;
    isAIGenerated: boolean;
    createdAt: string;
    updatedAt: string;
    releaseDate: string;
    description: string;
    script: string;
    averageRating: number;
    backdrop: string;
    duration: number;
    language: string;
    country: string;
    tags: string[];
    totalRatings: number;
}

export interface IStatistics {
    views: number;
    likes: number;
    comments: number;
    shares: number;
}