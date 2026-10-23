import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the menu when resizing to tablet or desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 767) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="mobile-logo">
          <span className="logo-icon">🛍️</span>
          <span>NexStore</span>
        </div>

        <button
          type="button"
          className="menu-button"
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="sidebar-navigation"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        id="sidebar-navigation"
        className={`sidebar ${menuOpen ? "show" : ""}`}
      >
        <div className="sidebar-logo">
          <span className="logo-icon">🛍️</span>
          <span>NexStore</span>
        </div>
        <p className="sidebar-heading">MAIN MENU</p>

        <nav className="sidebar-nav">
          <NavLink to="/" end className="sidebar-link" onClick={closeMenu}>
            Dashboard
          </NavLink>

          <NavLink to="/products" className="sidebar-link" onClick={closeMenu}>
            Products
          </NavLink>

          <NavLink to="/orders" className="sidebar-link" onClick={closeMenu}>
            Orders
          </NavLink>

          <NavLink to="/customers" className="sidebar-link" onClick={closeMenu}>
            Customers
          </NavLink>

          <NavLink to="/inventory" className="sidebar-link" onClick={closeMenu}>
            Inventory
          </NavLink>

          <NavLink to="/analytics" className="sidebar-link" onClick={closeMenu}>
            Analytics
          </NavLink>
        </nav>

        {/* Admin Details */}
        <div className="sidebar-footer">
          <div className="sidebar-avatar">A</div>

          <div>
            <p className="sidebar-user-name">Admin User</p>
            <p className="sidebar-user-role">Administrator</p>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {menuOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}
