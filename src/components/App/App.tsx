import css from './App.module.css';
import { toast, Toaster } from "react-hot-toast";

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import { fetchMovies } from '../../services/movieService'; 
import type { Movie } from "../../types/movie";
import type { MoviesHttpResponse } from '../../services/movieService';

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { keepPreviousData } from "@tanstack/react-query";

function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (query && (data as MoviesHttpResponse)?.results.length === 0 && !isLoading) {
      toast.error("No movies found for your request.");
    }
  }, [data, query, isLoading]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
    setSelectedMovie(null);
  };

  const handleSelect = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  return (
    <div className={css.api}>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />
  {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading && !isError && (
        <MovieGrid movies={(data as MoviesHttpResponse)?.results ?? []} onSelect={handleSelect} />
      )}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
    </div>
  );
}

export default App;