import "./Header.css";

export default function Header({ title }) {
  return (
    <header className="header">
      <h1>{title}</h1>

      <div className="header-right">
        <input
          type="text"
          placeholder="Search..."
          aria-label="Search"
        />

        <div className="header-avatar">A</div>
      </div>
    </header>
  );
}
 