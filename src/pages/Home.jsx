import { useEffect, useState } from "react";
import api from "../api";
import MovieCard from "../components/MovieCard";

export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    api.get("/movies/popular")
      .then(res => setMovies(res.data.results))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <h1 className="title">Film Popolari</h1>

      <div className="container-MovieCard">
        {movies.map(m => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </div>
  );
}
