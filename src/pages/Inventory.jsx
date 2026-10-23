
import { useEffect, useState } from "react";
import "./Inventory.css";
import Toast from "../components/Toast";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("All");
  const [toast, setToast] = useState(null);

  // Load products from LocalStorage
  useEffect(() => {
    const loadProducts = () => {
      try {
        const savedProducts = JSON.parse(
          localStorage.getItem("products") || "[]"
        );

        setProducts(Array.isArray(savedProducts) ? savedProducts : []);
      } catch (error) {
        console.error("Error loading inventory:", error);
        setProducts([]);
      }
    };

    loadProducts();

    window.addEventListener("storage", loadProducts);
    window.addEventListener("focus", loadProducts);

    return () => {
      window.removeEventListener("storage", loadProducts);
      window.removeEventListener("focus", loadProducts);
    };
  }, []);

  // Automatically dismiss toast notifications
  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 2500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toast]);

  // Save stock changes
  const saveProducts = (updatedProducts) => {
    try {
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      setProducts(updatedProducts);

      setToast({
        message: "Stock updated successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error saving inventory:", error);

      setToast({
        message: "Unable to save stock changes.",
        type: "error",
      });
    }
  };

  // Calculate inventory statistics
  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) =>
      total + Math.max(0, Number(product.stock) || 0),
    0
  );

  const lowStockProducts = products.filter((product) => {
    const stock = Number(product.stock) || 0;
    return stock > 0 && stock <= 5;
  }).length;

  const outOfStockProducts = products.filter(
    (product) => (Number(product.stock) || 0) === 0
  ).length;

  // Determine stock status
  const getStockStatus = (stock) => {
    const quantity = Math.max(0, Number(stock) || 0);

    if (quantity === 0) return "Out of Stock";
    if (quantity <= 5) return "Low Stock";

    return "In Stock";
  };

  // Update product stock
  const updateStock = (productId, change) => {
    const currentProduct = products.find(
      (product) => product.id === productId
    );

    if (!currentProduct) return;

    const currentStock = Math.max(
      0,
      Number(currentProduct.stock) || 0
    );

    if (currentStock + change < 0) {
      setToast({
        message: "Stock cannot be less than zero.",
        type: "error",
      });
      return;
    }

    const updatedProducts = products.map((product) =>
      product.id === productId
        ? { ...product, stock: currentStock + change }
        : product
    );

    saveProducts(updatedProducts);
  };

  // Search and filter products
  const filteredProducts = products.filter((product) => {
    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      String(product.id).toLowerCase().includes(search) ||
      String(product.name || "").toLowerCase().includes(search) ||
      String(product.category || "").toLowerCase().includes(search);

    const status = getStockStatus(product.stock);

    const matchesFilter =
      stockFilter === "All" || status === stockFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="inventory-page">
      {/* Section 1: Header */}
      <section className="inventory-header">
        <div>
          <h2>Inventory Management</h2>
          <p>
            Monitor stock levels and manage your product inventory.
          </p>
        </div>
      </section>

      {/* Section 2: Summary Cards */}
      <section className="inventory-stats">
        <article className="inventory-stat-card">
          <div className="inventory-stat-icon inventory-total-icon">
            📦
          </div>
          <div>
            <p>Total Products</p>
            <h3>{totalProducts}</h3>
          </div>
        </article>

        <article className="inventory-stat-card">
          <div className="inventory-stat-icon inventory-stock-icon">
            ✓
          </div>
          <div>
            <p>Total Stock Units</p>
            <h3>{totalStock.toLocaleString("en-IN")}</h3>
          </div>
        </article>

        <article className="inventory-stat-card">
          <div className="inventory-stat-icon inventory-low-icon">
            !
          </div>
          <div>
            <p>Low Stock Products</p>
            <h3>{lowStockProducts}</h3>
          </div>
        </article>

        <article className="inventory-stat-card">
          <div className="inventory-stat-icon inventory-out-icon">
            ×
          </div>
          <div>
            <p>Out of Stock</p>
            <h3>{outOfStockProducts}</h3>
          </div>
        </article>
      </section>

      {/* Section 3: Inventory Table */}
      <section className="inventory-list-section">
        <div className="inventory-list-heading">
          <div>
            <h2>Stock Overview</h2>
            <p>View products and manage available quantities.</p>
          </div>

          <span className="inventory-count">
            {filteredProducts.length} Products
          </span>
        </div>

        {/* Search and Filter */}
        <div className="inventory-toolbar">
          <div className="inventory-search">
            <input
              type="text"
              placeholder="Search product name, ID or category..."
              aria-label="Search inventory"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <select
            value={stockFilter}
            onChange={(event) => setStockFilter(event.target.value)}
            aria-label="Filter by stock status"
          >
            <option value="All">All Stock Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        {/* Reusable Toast Component */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Products Table */}
        {filteredProducts.length === 0 ? (
          <div className="inventory-empty">
            <div className="inventory-empty-icon">📦</div>
            <h3>No products found</h3>

            <p>
              {products.length === 0
                ? "Add products on the Products page to manage inventory."
                : "Try changing your search or stock filter."}
            </p>

            {(searchTerm || stockFilter !== "All") && (
              <button
                type="button"
                className="inventory-clear-button"
                onClick={() => {
                  setSearchTerm("");
                  setStockFilter("All");
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="inventory-table-wrapper">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Unit Price</th>
                  <th>Available Stock</th>
                  <th>Stock Status</th>
                  <th>Update Stock</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => {
                  const stock = Math.max(
                    0,
                    Number(product.stock) || 0
                  );

                  const status = getStockStatus(stock);

                  return (
                    <tr key={product.id}>
                      <td>
                        <div className="inventory-product-info">
                          {product.image ? (
                            <img
                              className="inventory-product-image"
                              src={product.image}
                              alt={product.name}
                              loading="lazy"
                            />
                          ) : (
                            <div className="inventory-product-placeholder">
                              📦
                            </div>
                          )}

                          <div>
                            <strong>{product.name}</strong>
                            <span>#{product.id}</span>
                          </div>
                        </div>
                      </td>

                      <td>{product.category || "—"}</td>

                      <td>
                        ₹
                        {Number(product.price || 0).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td>
                        <strong className="inventory-stock-number">
                          {stock}
                        </strong>
                        <span className="inventory-unit-label">
                          units
                        </span>
                      </td>

                      <td>
                        <span
                          className={`inventory-status ${
                            status === "In Stock"
                              ? "inventory-status-in"
                              : status === "Low Stock"
                              ? "inventory-status-low"
                              : "inventory-status-out"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td>
                        <div className="inventory-stock-controls">
                          <button
                            type="button"
                            className="inventory-quantity-button"
                            onClick={() => updateStock(product.id, -1)}
                            disabled={stock === 0}
                            aria-label={`Decrease stock for ${product.name}`}
                          >
                            −
                          </button>

                          <span>{stock}</span>

                          <button
                            type="button"
                            className="inventory-quantity-button"
                            onClick={() => updateStock(product.id, 1)}
                            aria-label={`Increase stock for ${product.name}`}
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
 