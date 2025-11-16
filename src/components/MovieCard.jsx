import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MovieCard({ movie, onRemove }) {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);

  // Controlla se il film è già in watchlist
  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("watchlist")) || [];
    setIsInWatchlist(list.some(m => m.id === movie.id));
  }, [movie.id]);

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
    setShowModal(false);
    if (onRemove) onRemove();
  };

  // Gestione click sulla stellina
  const handleStarClick = (e) => {
    e.stopPropagation();
    if (isInWatchlist) setShowModal(true);
    else addToWatchlist();
  };

  // Toggle overlay solo su mobile
  const toggleOverlay = () => {
    if (window.innerWidth <= 768) setOverlayVisible(!overlayVisible);
  };

  // Hover overlay solo desktop
  const handleMouseEnter = () => {
    if (window.innerWidth > 768) setOverlayVisible(true);
  };
  const handleMouseLeave = () => {
    if (window.innerWidth > 768) setOverlayVisible(false);
  };

  return (
    <>
      <div
        className="movie-card"
        style={{ width: "180px", position: "relative", cursor: "pointer" }}
        onClick={toggleOverlay} // solo mobile
        onMouseEnter={handleMouseEnter} // solo desktop
        onMouseLeave={handleMouseLeave} // solo desktop
      >
        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          style={{ width: "100%", height: "250px", borderRadius: "10px" }}
        />

        {overlayVisible && (
          <div
            className="overlay"
            style={{
              position: "absolute",
              bottom: "10px",
              left: "0",
              right: "0",
              textAlign: "center",
              background: "rgba(0,0,0,0.5)",
              padding: "8px",
              borderRadius: "0 0 10px 10px"
            }}
          >
            <span
              onClick={handleStarClick}
              style={{
                fontSize: "42px",
                color: isInWatchlist ? "gold" : "lightgray",
                cursor: "pointer",
                display: "block"
              }}
            >
              {isInWatchlist ? "⭐" : "☆"}
            </span>

            <Link
              to={`/movie/${movie.id}`}
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "block",
                marginTop: "4px",
                textDecoration: "none",
                color: "#fff",
                fontWeight: "bold"
              }}
            >
              Dettagli →
            </Link>
          </div>
        )}

        <h3 className="movietitle" style={{ marginTop: "8px", textAlign: "center" }}>
          {movie.title}
        </h3>
      </div>

      {/* Modal rimozione */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Rimuovere questo film dalla Watchlist?</h2>
            <p>{movie.title}</p>

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                gap: "15px",
                justifyContent: "center"
              }}
            >
              <button className="btn btn-danger" onClick={removeFromWatchlist}>
                Rimuovi
              </button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
