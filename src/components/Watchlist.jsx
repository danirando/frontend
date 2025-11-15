import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";


// Watchlist.jsx

// regola di validazione
const isValidMovie = (m) => {
  if (!m) return false;
  const hasId = (typeof m.id === "string" && m.id.trim() !== "") || typeof m.id === "number";
  const hasTitleOrPoster =
    !!m.title || !!m.name || !!m.original_title || !!m.poster_path || !!m.poster || !!m.posterUrl;
  return hasId && hasTitleOrPoster;
};


export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("watchlist");
      const parsed = raw ? JSON.parse(raw) : [];
      const valid = Array.isArray(parsed) ? parsed.filter(isValidMovie) : [];
      setWatchlist(valid);
      localStorage.setItem("watchlist", JSON.stringify(valid));
    } catch (err) {
      console.error("Errore parsing watchlist da localStorage:", err);
      setWatchlist([]);
      localStorage.setItem("watchlist", JSON.stringify([]));
    }
  }, []);

  // funzione da passare a MovieCard
  const handleRemove = (id) => {
    const next = watchlist.filter((m) => String(m.id) !== String(id));
    setWatchlist(next);
    localStorage.setItem("watchlist", JSON.stringify(next));
  };

  return (
    <div>
      <h1 className="title">La tua Watchlist</h1>

      {watchlist.length === 0 ? (
        <p>La tua watchlist è vuota.</p>
      ) : (
        <div className="container-MovieCard">
          {watchlist.map((movie) =>
            isValidMovie(movie) ? (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                onRemove={() => handleRemove(movie.id)} // <-- passiamo la funzione
              />
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
