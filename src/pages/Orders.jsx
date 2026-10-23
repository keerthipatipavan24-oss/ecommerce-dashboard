import { useState, useEffect } from "react";
import "./Orders.css";
import Toast from "../components/Toast";

export default function Orders() {
  const sampleOrders = [
    {
      id: 2001,
      customer: "Anil",
      date: "2026-10-20",
      items: [
        {
          productId: 1001,
          name: "Wireless Headphones",
          category: "Electronics",
          price: 24999,
          quantity: 2,
        },
      ],
      amount: 49998,
      payment: "UPI",
      status: "Delivered",
    },
    {
      id: 2002,
      customer: "Priya",
      date: "2026-10-20",
      items: [
        {
          productId: 1001,
          name: "Wireless Headphones",
          category: "Electronics",
          price: 24999,
          quantity: 1,
        },
      ],
      amount: 24999,
      payment: "Credit Card",
      status: "Delivered",
    },
    {
      id: 2003,
      customer: "Arjun",
      date: "2026-10-19",
      items: [
        {
          productId: 1002,
          name: "Smart Watch",
          category: "Electronics",
          price: 3999,
          quantity: 1,
        },
        {
          productId: 1003,
          name: "Cotton T-Shirt",
          category: "Clothing",
          price: 799,
          quantity: 1,
        },
        {
          productId: 1004,
          name: "Running Shoes",
          category: "Footwear",
          price: 1999,
          quantity: 1,
        },
      ],
      amount: 6797,
      payment: "Cash on Delivery",
      status: "Delivered",
    },
    {
      id: 2004,
      customer: "Sneha",
      date: "2026-10-18",
      items: [
        {
          productId: 1002,
          name: "Smart Watch",
          category: "Electronics",
          price: 3999,
          quantity: 1,
        },
        {
          productId: 1004,
          name: "Running Shoes",
          category: "Footwear",
          price: 1999,
          quantity: 1,
        },
      ],
      amount: 5998,
      payment: "Debit Card",
      status: "Delivered",
    },
    {
      id: 2005,
      customer: "Kiran",
      date: "2026-10-18",
      items: [
        {
          productId: 1003,
          name: "Cotton T-Shirt",
          category: "Clothing",
          price: 799,
          quantity: 1,
        },
      ],
      amount: 799,
      payment: "UPI",
      status: "Delivered",
    },
    {
      id: 2006,
      customer: "Anjali",
      date: "2026-10-17",
      items: [
        {
          productId: 1002,
          name: "Smart Watch",
          category: "Electronics",
          price: 3999,
          quantity: 1,
        },
        {
          productId: 1004,
          name: "Running Shoes",
          category: "Footwear",
          price: 1999,
          quantity: 1,
        },
        {
          productId: 1003,
          name: "Cotton T-Shirt",
          category: "Clothing",
          price: 799,
          quantity: 2,
        },
      ],
      amount: 7596,
      payment: "Credit Card",
      status: "Processing",
    },
    {
      id: 2007,
      customer: "Vikram",
      date: "2026-10-16",
      items: [
        {
          productId: 1005,
          name: "Travel Backpack",
          category: "Accessories",
          price: 1499,
          quantity: 2,
        },
      ],
      amount: 2998,
      payment: "UPI",
      status: "Delivered",
    },
    {
      id: 2008,
      customer: "Neha",
      date: "2026-10-15",
      items: [
        {
          productId: 1002,
          name: "Smart Watch",
          category: "Electronics",
          price: 3999,
          quantity: 1,
        },
      ],
      amount: 3999,
      payment: "Debit Card",
      status: "Delivered",
    },
  ];

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem("orders");
    return savedOrders ? JSON.parse(savedOrders) : sampleOrders;
  });

  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [paymentFilter, setPaymentFilter] = useState("All Payments");
  const [sortBy, setSortBy] = useState("date-desc");

  const [toast, setToast] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  const ordersPerPage = 5;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleUpdateStatus = () => {
    if (!selectedOrder || !newStatus) return;

    const updatedOrders = orders.map((order) =>
      order.id === selectedOrder.id ? { ...order, status: newStatus } : order,
    );

    setOrders(updatedOrders);

    setSelectedOrder({
      ...selectedOrder,
      status: newStatus,
    });
    setToast({
      message: "Order status updated successfully!",
      type: "success",
    });
  };

  const filteredOrders = orders
    .filter((order) => {
      const search = searchTerm.toLowerCase();

      return (
        order.id.toString().includes(search) ||
        order.customer.toLowerCase().includes(search)
      );
    })
    .filter((order) => {
      return statusFilter === "All Statuses" || order.status === statusFilter;
    })
    .filter((order) => {
      return (
        paymentFilter === "All Payments" || order.payment === paymentFilter
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return a.date.localeCompare(b.date);

        case "amount-asc":
          return a.amount - b.amount;

        case "amount-desc":
          return b.amount - a.amount;

        case "date-desc":
        default:
          return b.date.localeCompare(a.date);
      }
    });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const startIndex = (currentPage - 1) * ordersPerPage;

  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + ordersPerPage,
  );

  return (
    <div className="orders-page">
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />
      {/* Orders Header */}
      <section className="orders-header">
        <div className="orders-header-info">
          <h2>Order Management</h2>
          <p>Track, manage, and monitor all customer orders in one place.</p>
        </div>
      </section>

      {/* Order Summary Cards */}
      <section className="orders-summary">
        <div className="order-summary-card">
          <div className="order-summary-info">
            <p>Total Orders</p>
            <h3>{orders.length}</h3>
          </div>
          <div className="order-summary-icon total-orders-icon">
            <span>📦</span>
          </div>
        </div>

        <div className="order-summary-card">
          <div className="order-summary-info">
            <p>Pending</p>
            <h3>
              {orders.filter((order) => order.status === "Pending").length}
            </h3>
          </div>
          <div className="order-summary-icon pending-orders-icon">
            <span>⏳</span>
          </div>
        </div>

        <div className="order-summary-card">
          <div className="order-summary-info">
            <p>Processing</p>
            <h3>
              {orders.filter((order) => order.status === "Processing").length}
            </h3>
          </div>
          <div className="order-summary-icon processing-orders-icon">
            <span>⚙️</span>
          </div>
        </div>

        <div className="order-summary-card">
          <div className="order-summary-info">
            <p>Delivered</p>
            <h3>
              {orders.filter((order) => order.status === "Delivered").length}
            </h3>
          </div>
          <div className="order-summary-icon delivered-orders-icon">
            <span>✅</span>
          </div>
        </div>

        <div className="order-summary-card">
          <div className="order-summary-info">
            <p>Cancelled</p>
            <h3>
              {orders.filter((order) => order.status === "Cancelled").length}
            </h3>
          </div>
          <div className="order-summary-icon cancelled-orders-icon">
            <span>❌</span>
          </div>
        </div>
      </section>

      {/* search, flters, sorting */}

      <section className="orders-toolbar">
        <div className="orders-search">
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            aria-label="Search orders"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="orders-controls">
          <select
            aria-label="Filter by order status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            aria-label="Filter by payment method"
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All Payments">All Payments</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="UPI">UPI</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </select>

          <select
            aria-label="Sort orders"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="SortBy">SortBy</option>
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-asc">Amount: Low to High</option>
            <option value="amount-desc">Amount: High to Low</option>
          </select>
        </div>
      </section>

      {/* orders table */}
      {loading ? (
        <div className="orders-loading">
          <div className="orders-spinner"></div>
          <p>Loading orders...</p>
        </div>
      ) : (
        <section className="orders-table">
          <div className="orders-table-heading">
            <div>
              <h2>All Orders</h2>
              <p>View and manage customer orders.</p>
            </div>
            <span className="orders-table-count">
              {filteredOrders.length} Orders
            </span>
          </div>

          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Order Date</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="orders-empty-cell">
                      <div className="orders-empty-state">
                        <div className="orders-empty-icon">📦</div>
                        <h3>No orders found</h3>
                        <p>
                          We couldn't find any orders matching your search or
                          filters.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("All Statuses");
                            setPaymentFilter("All Payments");
                            setSortBy("date-desc");
                            setCurrentPage(1);
                          }}
                        >
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="order-id">#{order.id}</td>
                      <td>{order.customer}</td>
                      <td>
                        {new Date(`${order.date}T00:00:00`).toLocaleDateString(
                          "en-IN",
                        )}
                      </td>
                      <td>
                        {Array.isArray(order.items)
                          ? order.items.reduce(
                              (total, item) =>
                                total + Number(item.quantity || 0),
                              0,
                            )
                          : Number(order.items) || 0}
                      </td>
                      <td className="order-amount">
                        ₹{order.amount.toLocaleString("en-IN")}
                      </td>
                      <td>{order.payment}</td>
                      <td>
                        <span
                          className={`order-status status-${order.status.toLowerCase()}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="order-view-button"
                          onClick={() => {
                            setSelectedOrder(order);
                            setNewStatus(order.status);
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="orders-pagination">
            <p className="orders-pagination-info">
              Showing {filteredOrders.length === 0 ? 0 : startIndex + 1} to{" "}
              {Math.min(startIndex + ordersPerPage, filteredOrders.length)} of{" "}
              {filteredOrders.length} orders
            </p>

            <div className="orders-pagination-buttons">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  type="button"
                  key={index + 1}
                  className={currentPage === index + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(index + 1)}
                  aria-current={currentPage === index + 1 ? "page" : undefined}
                >
                  {index + 1}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((page) => page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </section>
      )}

      {/* view order details modal */}
      {selectedOrder && (
        <div className="order-modal-overlay">
          <div className="order-details-modal">
            <div className="order-modal-header">
              <div>
                <h2 id="order-details-title">Order Details</h2>
                <p>Order #{selectedOrder.id}</p>
              </div>

              <button
                type="button"
                className="order-modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                &times;
              </button>
            </div>
            <div className="order-details-content">
              <div className="order-details-row">
                <span>Customer Name</span>
                <strong>{selectedOrder.customer}</strong>
              </div>

              <div className="order-details-row">
                <span>Order Date</span>
                <strong>
                  {new Date(
                    `${selectedOrder.date}T00:00:00`,
                  ).toLocaleDateString("en-IN")}
                </strong>
              </div>

              <div className="order-details-row">
                <span>Order ID</span>
                <strong>#{selectedOrder.id}</strong>
              </div>

              <div className="order-details-row">
                <span>Total Items</span>
                <strong>
                  {Array.isArray(selectedOrder.items)
                    ? selectedOrder.items.reduce(
                        (total, item) => total + Number(item.quantity || 0),
                        0,
                      )
                    : Number(selectedOrder.items) || 0}
                </strong>
              </div>

              <div className="order-details-row">
                <span>Payment Method</span>
                <strong>{selectedOrder.payment}</strong>
              </div>

              <div className="order-details-row">
                <span>Order Status</span>

                <select
                  value={newStatus || selectedOrder.status}
                  onChange={(e) => setNewStatus(e.target.value)}
                  aria-label="Update order status"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <button
                type="button"
                className="order-view-button"
                onClick={handleUpdateStatus}
              >
                Update Status
              </button>

              <div className="order-detail-total">
                <span>Total Amount</span>
                <strong>₹{selectedOrder.amount.toLocaleString("en-IN")}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
