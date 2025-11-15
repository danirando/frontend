import { useEffect, useState } from "react";


export default function MovieCard({ movie, onRemove }) { // riceve onRemove
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("watchlist")) || [];
    setIsInWatchlist(list.some(m => m.id === movie.id));
  }, [movie.id]);

  const addToWatchlist = () => {
    let list = JSON.parse(localStorage.getItem("watchlist")) || [];
    if (!list.find(m => m.id === movie.id)) {
      list.push(movie);
      localStorage.setItem("watchlist", JSON.stringify(list));
      setIsInWatchlist(true);
    }
  };

  const removeFromWatchlist = () => {
    let list = JSON.parse(localStorage.getItem("watchlist")) || [];
    list = list.filter(m => m.id !== movie.id);
    localStorage.setItem("watchlist", JSON.stringify(list));
    setIsInWatchlist(false);
    setShowModal(false);

    if (onRemove) onRemove(); // <-- notifica il genitore
  };

  const handleStarClick = () => {
    if (isInWatchlist) setShowModal(true);
    else addToWatchlist();
  };

  return (
    <>
      <div 
        className="movie-card" 
        style={{ width: "180px", position: "relative", cursor: "pointer" }}
      >
        <img 
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} 
          style={{ width: "100%", height: "250px", borderRadius: "10px" }}
        />
        <div className="overlay" onClick={handleStarClick}>
          <span 
            style={{ fontSize: "42px", color: isInWatchlist ? "gold" : "lightgray", transition: "0.3s ease" }}
          >
            {isInWatchlist ? "⭐" : "☆"}
          </span>
        </div>
        <h3 className="movietitle">{movie.title}</h3>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Rimuovere questo film dalla Watchlist?</h2>
            <p>{movie.title}</p>

            <div style={{ marginTop: "20px", display: "flex", gap: "15px", justifyContent: "center" }}>
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
