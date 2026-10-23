
import { useState, useEffect } from "react";
import "./Products.css";
import Toast from "../components/Toast";

const initialProducts = [
  {
    id: 1001,
    name: "Wireless Headphones",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=1000&auto=format&fit=crop&q=60",
    category: "Electronics",
    price: 24999,
    stock: 25,
  },
  {
    id: 1002,
    name: "Smart Watch",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1000&auto=format&fit=crop&q=60",
    category: "Electronics",
    price: 3999,
    stock: 8,
  },
  {
    id: 1003,
    name: "Cotton T-Shirt",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1000&auto=format&fit=crop&q=60",
    category: "Clothing",
    price: 799,
    stock: 0,
  },
  {
    id: 1004,
    name: "Running Shoes",
    image: "https://media.istockphoto.com/id/184283573/photo/sport-shoes.webp?a=1&b=1&s=612x612&w=0&k=20&c=S78gYb5qLEmIBUmS_3q2d-mRqyN-ODlFeGiRVxRxGpg=",
    category: "Footwear",
    price: 1999,
    stock: 12,
  },
  {
    id: 1005,
    name: "Travel Backpack",
    image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=988&auto=format&fit=crop",
    category: "Accessories",
    price: 1499,
    stock: 4,
  },
  {
    id: 1006,
    name: "Bluetooth Speaker",
    image: "https://images.unsplash.com/photo-1772442363740-5e746c05b43d?q=80&w=987&auto=format&fit=crop",
    category: "Electronics",
    price: 1799,
    stock: 18,
  },
];

const emptyForm = {
  name: "",
  image: "",
  category: "",
  price: "",
  stock: "",
};

export default function Products() {
  // Load products from localStorage
  const [products, setProducts] = useState(() => {
    try {
      const savedProducts = localStorage.getItem("products");

      if (savedProducts !== null) {
        const parsedProducts = JSON.parse(savedProducts);

        if (Array.isArray(parsedProducts)) {
          return parsedProducts;
        }
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }

    return initialProducts;
  });

  // Loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  // Save products whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("products", JSON.stringify(products));
    } catch (error) {
      console.error("Error saving products:", error);
    }
  }, [products]);

  // Reusable toast state
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  // Search, filter and sorting states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");
  const [selectedStock, setSelectedStock] = useState("All Stock");
  const [sortBy, setSortBy] = useState("default");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);

  // Form states
  const [formData, setFormData] = useState({ ...emptyForm });
  const [formErrors, setFormErrors] = useState({});

  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setFormErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  // Close and reset Add/Edit modal
  const handleCloseForm = () => {
    setShowAddModal(false);
    setEditingProduct(null);
    setFormData({ ...emptyForm });
    setFormErrors({});
  };

  // Open Add Product modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({ ...emptyForm });
    setFormErrors({});
    setShowAddModal(true);
  };

  // Open Edit Product modal
  const handleEditProduct = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name,
      image: product.image,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
    });

    setFormErrors({});
    setShowAddModal(true);
  };

  // Validate and save Add/Edit form
  const handleAddProduct = (event) => {
    event.preventDefault();

    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Product name is required.";
    }

    if (!formData.image.trim()) {
      errors.image = "Product image URL is required.";
    } else {
      try {
        const imageUrl = new URL(formData.image.trim());

        if (!["http:", "https:"].includes(imageUrl.protocol)) {
          errors.image = "Enter a valid HTTP or HTTPS image URL.";
        }
      } catch {
        errors.image = "Please enter a valid image URL.";
      }
    }

    if (!formData.category) {
      errors.category = "Please select a category.";
    }

    if (formData.price.trim() === "") {
      errors.price = "Price is required.";
    } else if (
      !Number.isFinite(Number(formData.price)) ||
      Number(formData.price) <= 0
    ) {
      errors.price = "Price must be greater than zero.";
    }

    if (formData.stock.trim() === "") {
      errors.stock = "Stock quantity is required.";
    } else if (
      !Number.isInteger(Number(formData.stock)) ||
      Number(formData.stock) < 0
    ) {
      errors.stock = "Stock must be a whole number of zero or more.";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const productDetails = {
      name: formData.name.trim(),
      image: formData.image.trim(),
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };

    if (editingProduct) {
      setProducts((previousProducts) =>
        previousProducts.map((product) =>
          product.id === editingProduct.id
            ? { ...product, ...productDetails }
            : product
        )
      );

      setToast({
        message: "Product updated successfully!",
        type: "success",
      });
    } else {
      const newProduct = {
        id:
          products.length > 0
            ? Math.max(...products.map((product) => product.id)) + 1
            : 1001,
        ...productDetails,
      };

      setProducts((previousProducts) => [
        ...previousProducts,
        newProduct,
      ]);

      setCurrentPage(1);

      setToast({
        message: "Product added successfully!",
        type: "success",
      });
    }

    handleCloseForm();
  };

  // Delete product
  const handleDeleteProduct = () => {
    if (!deleteProduct) return;

    const deletedName = deleteProduct.name;

    setProducts((previousProducts) =>
      previousProducts.filter(
        (product) => product.id !== deleteProduct.id
      )
    );

    if (selectedProduct?.id === deleteProduct.id) {
      setSelectedProduct(null);
    }

    setDeleteProduct(null);
    setCurrentPage(1);

    setToast({
      message: `${deletedName} deleted successfully!`,
      type: "success",
    });
  };

  // Search, filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const search = searchTerm.trim().toLowerCase();

      const matchesSearch =
        product.name.toLowerCase().includes(search) ||
        String(product.id).includes(search);

      const matchesCategory =
        selectedCategory === "All Categories" ||
        product.category === selectedCategory;

      const matchesStock =
        selectedStock === "All Stock" ||
        (selectedStock === "In Stock" && product.stock > 0) ||
        (selectedStock === "Out of Stock" && product.stock === 0);

      return matchesSearch && matchesCategory && matchesStock;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "stock-asc":
          return a.stock - b.stock;
        case "stock-desc":
          return b.stock - a.stock;
        default:
          return a.id - b.id;
      }
    });

  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const startIndex = (currentPage - 1) * productsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // Reset to page one when search or filters change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  const handleStockChange = (event) => {
    setSelectedStock(event.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setCurrentPage(1);
  };

  // Clear search and filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setSelectedStock("All Stock");
    setSortBy("default");
    setCurrentPage(1);
  };

  return (
    <div className="products-page">
      {/* Reusable Toast */}
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />

      {/* Products Header */}
      <section className="products-header">
        <div className="products-header-info">
          <h2>Product Management</h2>
          <p>Manage and organize all your store products in one place.</p>
        </div>

        <button
          type="button"
          className="add-product-button"
          onClick={handleOpenAddModal}
        >
          Add Product
        </button>
      </section>

      {/* Search, Filters and Sorting */}
      <section className="products-toolbar">
        <div className="products-search">
          <input
            type="text"
            placeholder="Search by product name or ID..."
            aria-label="Search products"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="products-controls">
          <select
            aria-label="Filter by category"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="All Categories">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Footwear">Footwear</option>
            <option value="Accessories">Accessories</option>
          </select>

          <select
            aria-label="Filter by stock"
            value={selectedStock}
            onChange={handleStockChange}
          >
            <option value="All Stock">All Stock</option>
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          <select
            aria-label="Sort products"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="default">Default Order</option>
            <option value="name-asc">Name: A–Z</option>
            <option value="name-desc">Name: Z–A</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="stock-asc">Stock: Low to High</option>
            <option value="stock-desc">Stock: High to Low</option>
          </select>
        </div>
      </section>

      {/* Products List */}
      <section className="products-list-section">
        <div className="products-list-heading">
          <div>
            <h2>All Products</h2>
            <p>Browse and manage your store products.</p>
          </div>

          <span className="products-count">
            {filteredProducts.length} Products
          </span>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="products-loading" role="status">
            <div className="products-spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <>
            {/* Product Cards and Empty State */}
            <div className="products-grid">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <article className="product-card" key={product.id}>
                    <div className="product-card-image">
                      <img src={product.image} alt={product.name} />
                    </div>

                    <div className="product-card-content">
                      <p className="product-category">
                        {product.category}
                      </p>

                      <h3>{product.name}</h3>

                      <p className="product-id">
                        Product ID: #{product.id}
                      </p>

                      <div className="product-card-details">
                        <span className="product-price">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>

                        <span className="product-stock">
                          Stock: {product.stock}
                        </span>
                      </div>

                      <div className="product-actions">
                        <button
                          type="button"
                          className="product-view-button"
                          onClick={() => setSelectedProduct(product)}
                        >
                          View
                        </button>

                        <button
                          type="button"
                          className="product-edit-button"
                          onClick={() => handleEditProduct(product)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="product-delete-button"
                          onClick={() => setDeleteProduct(product)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="no-products-message">
                  <div className="products-empty-icon">📦</div>
                  <h3>No products found</h3>
                  <p>
                    We couldn't find products matching your search or filters.
                  </p>
                  <button
                    type="button"
                    className="clear-products-button"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages >= 1 && (
              <div className="products-pagination">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) => page - 1)
                  }
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    type="button"
                    key={index + 1}
                    className={
                      currentPage === index + 1 ? "active" : ""
                    }
                    aria-current={
                      currentPage === index + 1 ? "page" : undefined
                    }
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) => page + 1)
                  }
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* View Product Modal */}
      {selectedProduct && (
        <div className="product-modal-overlay">
          <div
            className="product-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="view-product-title"
          >
            <div className="product-modal-header">
              <div>
                <h2 id="view-product-title">Product Details</h2>
                <p>View complete product information.</p>
              </div>

              <button
                type="button"
                className="product-modal-close"
                aria-label="Close product details"
                onClick={() => setSelectedProduct(null)}
              >
                &times;
              </button>
            </div>

            <div className="view-product-content">
              <img
                className="view-product-image"
                src={selectedProduct.image}
                alt={selectedProduct.name}
              />

              <div className="view-product-details">
                <p><strong>Product ID:</strong> #{selectedProduct.id}</p>
                <p><strong>Name:</strong> {selectedProduct.name}</p>
                <p><strong>Category:</strong> {selectedProduct.category}</p>
                <p>
                  <strong>Price:</strong> ₹
                  {selectedProduct.price.toLocaleString("en-IN")}
                </p>
                <p><strong>Stock:</strong> {selectedProduct.stock} units</p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedProduct.stock > 0 ? "In Stock" : "Out of Stock"}
                </p>
              </div>
            </div>

            <div className="product-form-actions">
              <button
                type="button"
                className="product-close-button"
                onClick={() => setSelectedProduct(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showAddModal && (
        <div className="product-modal-overlay">
          <div
            className="product-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-product-title"
          >
            <div className="product-modal-header">
              <div>
                <h2 id="add-product-title">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <p>
                  {editingProduct
                    ? "Update the product details."
                    : "Enter the details of your new product."}
                </p>
              </div>

              <button
                type="button"
                className="product-modal-close"
                aria-label="Close modal"
                onClick={handleCloseForm}
              >
                &times;
              </button>
            </div>

            <form
              className="product-form"
              onSubmit={handleAddProduct}
              noValidate
            >
              <div className="product-form-group">
                <label htmlFor="product-name">Product Name</label>
                <input
                  id="product-name"
                  name="name"
                  type="text"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleInputChange}
                  aria-invalid={Boolean(formErrors.name)}
                  aria-describedby={
                    formErrors.name ? "product-name-error" : undefined
                  }
                />
                {formErrors.name && (
                  <p className="product-field-error" id="product-name-error" role="alert">
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div className="product-form-group">
                <label htmlFor="product-image">Image URL</label>
                <input
                  id="product-image"
                  name="image"
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={handleInputChange}
                  aria-invalid={Boolean(formErrors.image)}
                  aria-describedby={
                    formErrors.image ? "product-image-error" : undefined
                  }
                />
                {formErrors.image && (
                  <p className="product-field-error" id="product-image-error" role="alert">
                    {formErrors.image}
                  </p>
                )}
              </div>

              <div className="product-form-group">
                <label htmlFor="product-category">Category</label>
                <select
                  id="product-category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  aria-invalid={Boolean(formErrors.category)}
                  aria-describedby={
                    formErrors.category ? "product-category-error" : undefined
                  }
                >
                  <option value="">Select category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Accessories">Accessories</option>
                </select>
                {formErrors.category && (
                  <p className="product-field-error" id="product-category-error" role="alert">
                    {formErrors.category}
                  </p>
                )}
              </div>

              <div className="product-form-row">
                <div className="product-form-group">
                  <label htmlFor="product-price">Price (₹)</label>
                  <input
                    id="product-price"
                    name="price"
                    type="number"
                    min="0.01"
                    step="any"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={handleInputChange}
                    aria-invalid={Boolean(formErrors.price)}
                    aria-describedby={
                      formErrors.price ? "product-price-error" : undefined
                    }
                  />
                  {formErrors.price && (
                    <p className="product-field-error" id="product-price-error" role="alert">
                      {formErrors.price}
                    </p>
                  )}
                </div>

                <div className="product-form-group">
                  <label htmlFor="product-stock">Stock Quantity</label>
                  <input
                    id="product-stock"
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Enter stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    aria-invalid={Boolean(formErrors.stock)}
                    aria-describedby={
                      formErrors.stock ? "product-stock-error" : undefined
                    }
                  />
                  {formErrors.stock && (
                    <p className="product-field-error" id="product-stock-error" role="alert">
                      {formErrors.stock}
                    </p>
                  )}
                </div>
              </div>

              <div className="product-form-actions">
                <button
                  type="button"
                  className="product-cancel-button"
                  onClick={handleCloseForm}
                >
                  Cancel
                </button>

                <button type="submit" className="product-save-button">
                  {editingProduct ? "Save Changes" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteProduct && (
        <div className="product-modal-overlay">
          <div
            className="product-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-product-title"
          >
            <div className="product-modal-header">
              <div>
                <h2 id="delete-product-title">Delete Product</h2>
                <p>Confirm product deletion.</p>
              </div>

              <button
                type="button"
                className="product-modal-close"
                aria-label="Close delete confirmation"
                onClick={() => setDeleteProduct(null)}
              >
                &times;
              </button>
            </div>

            <p className="product-form">
              Are you sure you want to delete{" "}
              <strong>{deleteProduct.name}</strong>?
            </p>

            <div className="product-form-actions">
              <button
                type="button"
                className="product-cancel-button"
                onClick={() => setDeleteProduct(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="product-delete-button"
                onClick={handleDeleteProduct}
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 