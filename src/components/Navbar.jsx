import { useCollection } from "../context/CollectionContext.jsx";

export default function Navbar({ page, setPage }) {
  const { albums } = useCollection();
  const count = Object.keys(albums).length;
  const tab = (id, label) => (
    <button key={id} className={`nav-tab ${page === id ? "active" : ""}`} onClick={() => setPage(id)}>
      {label}
    </button>
  );

  return (
    <header className="navbar">
      <button className="logo" onClick={() => setPage("discover")} aria-label="Go to Discover">
        <span className="logo-mark">◉</span> Album Tracker
      </button>
      <nav aria-label="Main navigation">
        {tab("discover", "Discover")}
        {tab("collection", `My collection (${count})`)}
        {tab("ai", "Recommendations")}
      </nav>
    </header>
  );
}
