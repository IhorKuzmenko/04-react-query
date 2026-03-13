import axios from "axios";
import type { Movie } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3";

const token = import.meta.env.VITE_TMDB_TOKEN;

export interface MoviesHttpResponse {
  results: Movie[];
  total_pages: number;
  page: number;
  total_results: number;
}

export const fetchMovies = async (query: string, page = 1): Promise<MoviesHttpResponse> => {
  const response = await axios.get<MoviesHttpResponse>(
    `${BASE_URL}/search/movie`,
    {
      params: {
        query: query,
        page: page
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};