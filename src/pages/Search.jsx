import { useState } from "react";
import MovieCard from "../components/MovieCard";
import api from "../api";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Search() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);

  const handleSearch = () => {
    if (!query) return;

    api.get(`/movies/search/${query}`)
      .then(res => setMovies(res.data.results))
      .catch(err => console.error(err));
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Cerca Film</h1>

      <form 
        className="d-flex justify-content-center mb-5"
        onSubmit={e => { e.preventDefault(); handleSearch(); }}
      >
        <input 
          type="text"
          className="form-control me-2"
          placeholder="Cerca un titolo..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ maxWidth: "400px" }}
        />
        <button type="submit" className="btn btn-primary">Cerca</button>
      </form>

      {movies.length > 0 ? (
        <div className="container-MovieCard">
          {movies.map(m => (
            <div key={m.id}>
              <MovieCard movie={m} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">Nessun film trovato. Prova a cercare qualcosa!</p>
      )}
    </div>
  );
}
