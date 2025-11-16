import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Watchlist from "./components/Watchlist";
import DefaultLayout from "./layouts/DefaultLayout";
import MovieDetails from "./pages/MovieDetails";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout principale */}
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/movie/:id" element={<MovieDetails />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
