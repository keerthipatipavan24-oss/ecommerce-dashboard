import { useEffect, useState } from "react";
import "./Customers.css";
import Toast from "../components/Toast";

const initialCustomers = [
  {
    id: 1001,
    name: "Anil",
    email: "anil@example.com",
    phone: "9876543210",
    address: "Hyderabad, Telangana",
    registeredDate: "2026-10-01",
    status: "Active",
  },
  {
    id: 1002,
    name: "Priya",
    email: "priya@example.com",
    phone: "9876543211",
    address: "Bengaluru, Karnataka",
    registeredDate: "2026-10-03",
    status: "Active",
  },
  {
    id: 1003,
    name: "Arjun",
    email: "arjun@example.com",
    phone: "9876543212",
    address: "Vijayawada, Andhra Pradesh",
    registeredDate: "2026-10-05",
    status: "Inactive",
  },
  {
    id: 1004,
    name: "Sneha",
    email: "sneha@example.com",
    phone: "9876543213",
    address: "Chennai, Tamil Nadu",
    registeredDate: "2026-10-07",
    status: "Active",
  },
  {
    id: 1005,
    name: "Kiran",
    email: "kiran@example.com",
    phone: "9876543214",
    address: "Pune, Maharashtra",
    registeredDate: "2026-10-09",
    status: "Active",
  },
  {
    id: 1006,
    name: "Anjali",
    email: "anjali@example.com",
    phone: "9876543215",
    address: "Mumbai, Maharashtra",
    registeredDate: "2026-10-11",
    status: "Inactive",
  },
  {
    id: 1007,
    name: "Vikram",
    email: "vikram@example.com",
    phone: "9876543216",
    address: "Delhi, India",
    registeredDate: "2026-10-13",
    status: "Active",
  },
  {
    id: 1008,
    name: "Neha",
    email: "neha@example.com",
    phone: "9876543217",
    address: "Tirupati, Andhra Pradesh",
    registeredDate: "2026-10-15",
    status: "Inactive",
  },
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  status: "Active",
};

export default function Customers() {
  // load customers from LocalStorage
  const [customers, setCustomers] = useState(() => {
    try {
      const savedCustomers = localStorage.getItem("customers");

      if (savedCustomers !== null) {
        const parsedCustomers = JSON.parse(savedCustomers);

        if (Array.isArray(parsedCustomers)) {
          return parsedCustomers;
        }
      }
    } catch (error) {
      console.error("Error loading customers:", error);
    }

    return initialCustomers;
  });

  // save customers whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("customers", JSON.stringify(customers));
    } catch (error) {
      console.error("Error saving customers:", error);
    }
  }, [customers]);

  // loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // toast notification
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  // search, filter and sort states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [sortBy, setSortBy] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;

  // modal states
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deleteCustomer, setDeleteCustomer] = useState(null);

  // form state
  const [formData, setFormData] = useState({ ...emptyForm });
  const [formErrors, setFormErrors] = useState({});

  // search, filter and sorting
  const filteredCustomers = customers
    .filter((customer) => {
      const search = searchTerm.trim().toLowerCase();

      const matchesSearch =
        String(customer.id).includes(search) ||
        customer.name.toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search) ||
        customer.phone.includes(search);

      const matchesStatus =
        statusFilter === "All Statuses" || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);

        case "name-desc":
          return b.name.localeCompare(a.name);

        case "date-desc":
          return b.registeredDate.localeCompare(a.registeredDate);

        case "date-asc":
        case "":
        default:
          return a.registeredDate.localeCompare(b.registeredDate);
      }
    });

  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  const startIndex = (currentPage - 1) * customersPerPage;

  const currentCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + customersPerPage,
  );

  const activeCount = customers.filter(
    (customer) => customer.status === "Active",
  ).length;

  const inactiveCount = customers.filter(
    (customer) => customer.status === "Inactive",
  ).length;

  // reset form
  const resetForm = () => {
    setFormData({ ...emptyForm });
    setFormErrors({});
  };

  // open add customer modal
  const openAddForm = () => {
    setEditingCustomer(null);
    resetForm();
    setShowForm(true);
  };

  // open edit customer modal
  const openEditForm = (customer) => {
    setEditingCustomer(customer);

    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      status: customer.status,
    });

    setFormErrors({});
    setShowForm(true);
    setSelectedCustomer(null);
  };

  // handle form input changes
  const handleFormChange = (event) => {
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

  // validate customer form
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Customer name is required.";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must contain at least 2 characters.";
    } else if (!/^[\p{L}\p{M} .'-]+$/u.test(formData.name.trim())) {
      errors.name = "Enter a valid name using letters only.";
    }

    if (!formData.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
    } else {
      const duplicateEmail = customers.some(
        (customer) =>
          customer.email.toLowerCase() ===
            formData.email.trim().toLowerCase() &&
          customer.id !== editingCustomer?.id,
      );

      if (duplicateEmail) {
        errors.email = "This email address is already registered.";
      }
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      errors.phone = "Enter a valid 10-digit Indian mobile number.";
    }

    if (formData.address.trim().length > 200) {
      errors.address = "Address cannot exceed 200 characters.";
    }

    if (!["Active", "Inactive"].includes(formData.status)) {
      errors.status = "Please select a valid status.";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // add or update customer
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const customerDetails = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      status: formData.status,
    };

    if (editingCustomer) {
      setCustomers((previousCustomers) =>
        previousCustomers.map((customer) =>
          customer.id === editingCustomer.id
            ? { ...customer, ...customerDetails }
            : customer,
        ),
      );

      setToast({
        message: "Customer updated successfully!",
        type: "success",
      });
    } else {
      const newCustomer = {
        id:
          customers.length > 0
            ? Math.max(...customers.map((customer) => customer.id)) + 1
            : 1001,
        ...customerDetails,
        registeredDate: new Date().toISOString().slice(0, 10),
      };

      setCustomers((previousCustomers) => [...previousCustomers, newCustomer]);

      setCurrentPage(1);

      setToast({
        message: "Customer added successfully!",
        type: "success",
      });
    }

    setShowForm(false);
    setEditingCustomer(null);
    resetForm();
  };

  // delete customer
  const handleDeleteCustomer = () => {
    if (!deleteCustomer) return;

    const deletedName = deleteCustomer.name;

    setCustomers((previousCustomers) =>
      previousCustomers.filter((customer) => customer.id !== deleteCustomer.id),
    );

    setDeleteCustomer(null);
    setSelectedCustomer(null);
    setCurrentPage(1);

    setToast({
      message: `${deletedName} deleted successfully!`,
      type: "success",
    });
  };

  // search and filter handlers
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All Statuses");
    setSortBy("");
    setCurrentPage(1);
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="customers-page">
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />

      {/* page header */}
      <section className="customers-header">
        <div className="customers-header-info">
          <h2>Customer Management</h2>
          <p>Manage customer information and account status.</p>
        </div>

        <button
          type="button"
          className="add-customer-button"
          onClick={openAddForm}
        >
          Add Customer
        </button>
      </section>

      {/* statistics */}
      <section className="customer-stats">
        <article className="customer-stat-card">
          <div className="customer-stat-icon total-icon">
            <span aria-hidden="true">👥</span>
          </div>
          <div>
            <p>Total Customers</p>
            <h3>{customers.length}</h3>
          </div>
        </article>

        <article className="customer-stat-card">
          <div className="customer-stat-icon active-icon">
            <span aria-hidden="true">✓</span>
          </div>
          <div>
            <p>Active Customers</p>
            <h3>{activeCount}</h3>
          </div>
        </article>

        <article className="customer-stat-card">
          <div className="customer-stat-icon inactive-icon">
            <span aria-hidden="true">○</span>
          </div>
          <div>
            <p>Inactive Customers</p>
            <h3>{inactiveCount}</h3>
          </div>
        </article>
      </section>

      {/* search, filter and sort */}
      <section className="customers-toolbar">
        <div className="customers-search">
          <input
            type="text"
            placeholder="Search by name, email, phone or ID..."
            aria-label="Search customers"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="customers-controls">
          <select
            aria-label="Filter customers by status"
            value={statusFilter}
            onChange={handleStatusChange}
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            aria-label="Sort customers"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="">SortBy</option>
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="name-asc">Name: A–Z</option>
            <option value="name-desc">Name: Z–A</option>
          </select>
        </div>
      </section>

      {/* Customer Table */}
      <section className="customers-list-section">
        <div className="customers-list-heading">
          <div>
            <h2>All Customers</h2>
            <p>Browse and manage registered customers.</p>
          </div>

          <span className="customers-count">
            {filteredCustomers.length} Customers
          </span>
        </div>

        {loading ? (
          <div className="customers-loading" role="status">
            <div className="customers-spinner"></div>
            <p>Loading customers...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="customers-empty">
            <div className="customers-empty-icon" aria-hidden="true">
              👥
            </div>
            <h3>No customers found</h3>
            <p>Try changing your search or filters.</p>
            <button
              type="button"
              className="clear-customers-button"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="customers-table-wrapper">
              <table className="customers-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Registered Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {currentCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td>
                        <div className="customer-info">
                          <div className="customer-avatar" aria-hidden="true">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="customer-identity">
                            <strong>{customer.name}</strong>
                            <span>{customer.email}</span>
                            <small>#{customer.id}</small>
                          </div>
                        </div>
                      </td>

                      <td>{customer.phone}</td>

                      <td>{formatDate(customer.registeredDate)}</td>

                      <td>
                        <span
                          className={`customer-status ${
                            customer.status === "Active"
                              ? "status-active"
                              : "status-inactive"
                          }`}
                        >
                          {customer.status}
                        </span>
                      </td>

                      <td>
                        <div className="customer-actions">
                          <button
                            type="button"
                            className="customer-view-btn"
                            onClick={() => setSelectedCustomer(customer)}
                            aria-label={`View ${customer.name}`}
                          >
                            View
                          </button>

                          <button
                            type="button"
                            className="customer-edit-btn"
                            onClick={() => openEditForm(customer)}
                            aria-label={`Edit ${customer.name}`}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="customer-delete-btn"
                            onClick={() => setDeleteCustomer(customer)}
                            aria-label={`Delete ${customer.name}`}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
              <div className="customers-pagination">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    type="button"
                    key={index + 1}
                    className={currentPage === index + 1 ? "active" : ""}
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
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Add / Edit Customer Modal */}
      {showForm && (
        <div
          className="customer-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
              setEditingCustomer(null);
              resetForm();
            }
          }}
        >
          <div
            className="customer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-form-title"
          >
            <div className="customer-modal-header">
              <div>
                <h2 id="customer-form-title">
                  {editingCustomer ? "Edit Customer" : "Add New Customer"}
                </h2>
                <p>
                  {editingCustomer
                    ? "Update the customer details."
                    : "Enter the details of your new customer."}
                </p>
              </div>

              <button
                type="button"
                className="customer-modal-close"
                aria-label="Close customer form"
                onClick={() => {
                  setShowForm(false);
                  setEditingCustomer(null);
                  resetForm();
                }}
              >
                &times;
              </button>
            </div>

            <form className="customer-form" onSubmit={handleSubmit} noValidate>
              <div className="customer-form-group">
                <label htmlFor="customer-name">Full Name</label>
                <input
                  id="customer-name"
                  name="name"
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleFormChange}
                  aria-invalid={Boolean(formErrors.name)}
                  aria-describedby={
                    formErrors.name ? "customer-name-error" : undefined
                  }
                />
                {formErrors.name && (
                  <p
                    className="customer-field-error"
                    id="customer-name-error"
                    role="alert"
                  >
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div className="customer-form-group">
                <label htmlFor="customer-email">Email Address</label>
                <input
                  id="customer-email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleFormChange}
                  aria-invalid={Boolean(formErrors.email)}
                  aria-describedby={
                    formErrors.email ? "customer-email-error" : undefined
                  }
                />
                {formErrors.email && (
                  <p
                    className="customer-field-error"
                    id="customer-email-error"
                    role="alert"
                  >
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div className="customer-form-group">
                <label htmlFor="customer-phone">Phone Number</label>
                <input
                  id="customer-phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="10-digit Indian mobile number"
                  value={formData.phone}
                  onChange={handleFormChange}
                  aria-invalid={Boolean(formErrors.phone)}
                  aria-describedby={
                    formErrors.phone ? "customer-phone-error" : undefined
                  }
                />
                {formErrors.phone && (
                  <p
                    className="customer-field-error"
                    id="customer-phone-error"
                    role="alert"
                  >
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div className="customer-form-group">
                <label htmlFor="customer-address">Address</label>
                <textarea
                  id="customer-address"
                  name="address"
                  rows={3}
                  maxLength={200}
                  placeholder="Enter address (optional)"
                  value={formData.address}
                  onChange={handleFormChange}
                  aria-invalid={Boolean(formErrors.address)}
                  aria-describedby={
                    formErrors.address ? "customer-address-error" : undefined
                  }
                />
                {formErrors.address && (
                  <p
                    className="customer-field-error"
                    id="customer-address-error"
                    role="alert"
                  >
                    {formErrors.address}
                  </p>
                )}
              </div>

              <div className="customer-form-group">
                <label htmlFor="customer-status">Status</label>
                <select
                  id="customer-status"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  aria-invalid={Boolean(formErrors.status)}
                  aria-describedby={
                    formErrors.status ? "customer-status-error" : undefined
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                {formErrors.status && (
                  <p
                    className="customer-field-error"
                    id="customer-status-error"
                    role="alert"
                  >
                    {formErrors.status}
                  </p>
                )}
              </div>

              <div className="customer-form-actions">
                <button
                  type="button"
                  className="customer-cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCustomer(null);
                    resetForm();
                  }}
                >
                  Cancel
                </button>

                <button type="submit" className="customer-save-btn">
                  {editingCustomer ? "Save Changes" : "Add Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Customer Modal */}
      {selectedCustomer && (
        <div
          className="customer-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedCustomer(null);
            }
          }}
        >
          <div
            className="customer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-details-title"
          >
            <div className="customer-modal-header">
              <div>
                <h2 id="customer-details-title">Customer Details</h2>
                <p>View complete customer information.</p>
              </div>

              <button
                type="button"
                className="customer-modal-close"
                aria-label="Close customer details"
                onClick={() => setSelectedCustomer(null)}
              >
                &times;
              </button>
            </div>

            <div className="customer-details">
              <div className="customer-details-avatar" aria-hidden="true">
                {selectedCustomer.name.charAt(0).toUpperCase()}
              </div>

              <h3>{selectedCustomer.name}</h3>
              <p className="customer-details-id">
                Customer ID: #{selectedCustomer.id}
              </p>

              <div className="customer-detail-row">
                <strong>Email</strong>
                <span>{selectedCustomer.email}</span>
              </div>

              <div className="customer-detail-row">
                <strong>Phone</strong>
                <span>{selectedCustomer.phone}</span>
              </div>

              <div className="customer-detail-row">
                <strong>Address</strong>
                <span>{selectedCustomer.address || "Not provided"}</span>
              </div>

              <div className="customer-detail-row">
                <strong>Registered</strong>
                <span>{formatDate(selectedCustomer.registeredDate)}</span>
              </div>

              <div className="customer-detail-row">
                <strong>Status</strong>
                <span
                  className={`customer-status ${
                    selectedCustomer.status === "Active"
                      ? "status-active"
                      : "status-inactive"
                  }`}
                >
                  {selectedCustomer.status}
                </span>
              </div>
            </div>

            <div className="customer-form-actions">
              <button
                type="button"
                className="customer-cancel-btn"
                onClick={() => setSelectedCustomer(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="customer-save-btn"
                onClick={() => openEditForm(selectedCustomer)}
              >
                Edit Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCustomer && (
        <div
          className="customer-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDeleteCustomer(null);
            }
          }}
        >
          <div
            className="customer-modal customer-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-customer-title"
          >
            <div className="customer-modal-header">
              <div>
                <h2 id="delete-customer-title">Delete Customer</h2>
                <p>Confirm customer deletion.</p>
              </div>

              <button
                type="button"
                className="customer-modal-close"
                aria-label="Close delete confirmation"
                onClick={() => setDeleteCustomer(null)}
              >
                &times;
              </button>
            </div>

            <p className="customer-delete-message">
              Are you sure you want to delete{" "}
              <strong>{deleteCustomer.name}</strong>? This action cannot be
              undone.
            </p>

            <div className="customer-form-actions">
              <button
                type="button"
                className="customer-cancel-btn"
                onClick={() => setDeleteCustomer(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="customer-confirm-delete-btn"
                onClick={handleDeleteCustomer}
              >
                Delete Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
