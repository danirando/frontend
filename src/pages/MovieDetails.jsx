import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showFullCast, setShowFullCast] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  // Carica il film
  useEffect(() => {
    fetch(`http://localhost:8000/movie/${id}`)
      .then(res => res.json())
      .then(data => setMovie(data));
  }, [id]);

  // Controlla se il film è già in watchlist
  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("watchlist")) || [];
    setIsInWatchlist(list.some(m => m.id === Number(id)));
  }, [id]);

  if (!movie) return <p style={{ color: "white" }}>Caricamento...</p>;

  const trailer = movie.videos?.results?.filter(v => v.type === "Trailer");
  const cast = movie.credits?.cast || [];
  const director = movie.credits?.crew?.find(p => p.job === "Director");

  const imdb = movie.imdb_id ? `https://www.imdb.com/title/${movie.imdb_id}` : null;
  const tmdbRating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  // Aggiungi alla watchlist
  const addToWatchlist = () => {
    let list = JSON.parse(localStorage.getItem("watchlist")) || [];
    if (!list.find(m => m.id === movie.id)) {
      list.push(movie);
      localStorage.setItem("watchlist", JSON.stringify(list));
      setIsInWatchlist(true);
    
    }
  };

  // Rimuovi dalla watchlist
  const removeFromWatchlist = () => {
    let list = JSON.parse(localStorage.getItem("watchlist")) || [];
    list = list.filter(m => m.id !== movie.id);
    localStorage.setItem("watchlist", JSON.stringify(list));
    setIsInWatchlist(false);
   
  };

  return (
    <div style={{ color: "white", padding: "20px" }}>
      {/* HERO */}
      <div
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "80px 20px",
          borderRadius: "10px",
          marginBottom: "40px"
        }}
      >
        <div style={{ backdropFilter: "blur(4px)", padding: "20px" }}>
          <h1 style={{ fontSize: "48px" }}>{movie.title}</h1>
          {movie.tagline && <h3 style={{ opacity: 0.7, fontStyle: "italic" }}>{movie.tagline}</h3>}

          <p>
            {movie.release_date?.slice(0, 4)} • {movie.runtime} min •{" "}
            {movie.genres?.map(g => g.name).join(", ")}
          </p>

          {/* RATING + WATCHLIST */}
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <span style={{ fontSize: "20px" }}>⭐ TMDB: {tmdbRating}</span>

            {imdb && (
              <a
                href={imdb}
                target="_blank"
                style={{ color: "gold", textDecoration: "none" }}
              >
                🎬 IMDB
              </a>
            )}

            <button
              onClick={isInWatchlist ? removeFromWatchlist : addToWatchlist}
              style={{
                padding: "10px 20px",
                background: "gold",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              {isInWatchlist ? "Rimuovi dalla Watchlist" : "+ Aggiungi alla Watchlist"}
            </button>
          </div>

          <p style={{ maxWidth: "600px", marginTop: "20px" }}>{movie.overview}</p>

          {director && (
            <p style={{ opacity: 0.8 }}>🎬 Regista: <strong>{director.name}</strong></p>
          )}
        </div>
      </div>

      {/* TRAILER MULTIPLI */}
      {trailer?.length > 0 && (
        <div style={{ marginBottom: "40px" }}>
          <h2>Trailer</h2>
          <div style={{ display: "flex", gap: "20px", overflowX: "scroll" }}>
            {trailer.map(t => (
              <iframe
                key={t.id}
                width="400"
                height="250"
                src={`https://www.youtube.com/embed/${t.key}`}
                style={{ borderRadius: "10px" }}
                allowFullScreen
              ></iframe>
            ))}
          </div>
        </div>
      )}

      {/* GALLERY IMMAGINI */}
      <div style={{ marginBottom: "40px" }}>
        <h2>Galleria</h2>
        <div style={{ display: "flex", gap: "10px", overflowX: "scroll" }}>
          {(movie.images?.backdrops || []).slice(0, 15).map((img, i) => (
            <img
              key={i}
              src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
              style={{ width: "300px", borderRadius: "10px" }}
            />
          ))}
        </div>
      </div>

      {/* CAST */}
      <div style={{ marginBottom: "40px" }}>
        <h2>Cast</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" , justifyContent: "center"}}>
          {(showFullCast ? cast : cast.slice(0, 12)).map(actor => (
            <div key={actor.id} style={{ width: "120px", textAlign: "center" }}>
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                    : "https://via.placeholder.com/150?text=No+Image"
                }
                style={{ width: "100%", borderRadius: "10px" }}
              />
              <p>{actor.name}</p>
              <small style={{ opacity: 0.7 }}>{actor.character}</small>
            </div>
          ))}
        </div>

        {!showFullCast && cast.length > 12 && (
          <button
            onClick={() => setShowFullCast(true)}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              background: "#444",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Mostra tutto il cast
          </button>
        )}
      </div>

      {/* SIMILAR MOVIES */}
      <div style={{ marginBottom: "40px" }}>
        <h2>Film Simili</h2>
        <div style={{ display: "flex", overflowX: "scroll", gap: "20px" }}>
          {movie.similar?.results?.map(sim => (
            <a
              key={sim.id}
              href={`/movie/${sim.id}`}
              style={{ minWidth: "150px", color: "white", textDecoration: "none" }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w300${sim.poster_path}`}
                style={{ width: "100%", borderRadius: "10px" }}
              />
              <p style={{ textAlign: "center" }}>{sim.title}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
