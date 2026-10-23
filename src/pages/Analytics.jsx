import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import "./Analytics.css";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const readArray = (key) => {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const getOrderDate = (order) =>
  order?.date ? String(order.date).slice(0, 10) : "";

export default function Analytics() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Load data from localStorage.
  useEffect(() => {
    const loadData = () => {
      setOrders(readArray("orders"));
      setProducts(readArray("products"));
      setCustomers(readArray("customers"));
    };

    loadData();

    window.addEventListener("storage", loadData);
    window.addEventListener("focus", loadData);

    return () => {
      window.removeEventListener("storage", loadData);
      window.removeEventListener("focus", loadData);
    };
  }, []);

  // Use delivered orders for revenue and product sales.
  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  );

  const totalRevenue = deliveredOrders.reduce(
    (total, order) => total + (Number(order.amount) || 0),
    0
  );

  const totalUnitsSold = deliveredOrders.reduce((total, order) => {
    if (!Array.isArray(order.items)) return total;

    const units = order.items.reduce(
      (sum, item) => sum + (Number(item.quantity) || 0),
      0
    );

    return total + units;
  }, 0);

  const averageOrderValue = deliveredOrders.length
    ? totalRevenue / deliveredOrders.length
    : 0;

  // Prepare daily revenue for the Sales Overview graph.
  const dailySales = {};

  deliveredOrders.forEach((order) => {
    const date = getOrderDate(order);

    if (!date) return;

    dailySales[date] =
      (dailySales[date] || 0) + (Number(order.amount) || 0);
  });

  const salesTrend = Object.entries(dailySales)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, revenue]) => ({
      date: date.slice(5),
      revenue,
    }));

  // Find the top five products by units sold.
  const productSales = {};

  deliveredOrders.forEach((order) => {
    if (!Array.isArray(order.items)) return;

    order.items.forEach((item) => {
      const name = item.name || "Unknown Product";

      productSales[name] =
        (productSales[name] || 0) + (Number(item.quantity) || 0);
    });
  });

  const topProducts = Object.entries(productSales)
    .map(([name, units]) => ({ name, units }))
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);

  // Calculate current inventory statistics.
  const totalStock = products.reduce(
    (total, product) => total + (Number(product.stock) || 0),
    0
  );

  const lowStock = products.filter((product) => {
    const stock = Number(product.stock) || 0;
    return stock > 0 && stock <= 5;
  }).length;

  const outOfStock = products.filter(
    (product) => (Number(product.stock) || 0) === 0
  ).length;

  return (
    <div className="analytics-page">
      {/* Page heading */}
      <div className="analytics-heading">
        <div>
          <h2>Analytics Overview</h2>
          <p>Understand your sales performance and store activity.</p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="analytics-stats-grid">
        <div className="analytics-stat-card">
          <div className="analytics-stat-icon revenue-icon">₹</div>
          <div className="analytics-stat-info">
            <p>Delivered Revenue</p>
            <h3>{formatCurrency(totalRevenue)}</h3>
            <span>Revenue from delivered orders</span>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon orders-icon">▤</div>
          <div className="analytics-stat-info">
            <p>Delivered Orders</p>
            <h3>{deliveredOrders.length}</h3>
            <span>Successfully completed</span>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon average-icon">↗</div>
          <div className="analytics-stat-info">
            <p>Average Order Value</p>
            <h3>{formatCurrency(averageOrderValue)}</h3>
            <span>Per delivered order</span>
          </div>
        </div>

        <div className="analytics-stat-card">
          <div className="analytics-stat-icon units-icon">▦</div>
          <div className="analytics-stat-info">
            <p>Units Sold</p>
            <h3>{totalUnitsSold}</h3>
            <span>Units in delivered orders</span>
          </div>
        </div>
      </div>

      {/* Sales graph and Top Selling Products table */}
      <div className="analytics-charts-grid">
        {/* Sales Overview */}
        <section className="analytics-card">
          <div className="analytics-card-heading">
            <div>
              <h3>Sales Overview</h3>
              <p>Revenue from delivered orders over time</p>
            </div>
          </div>

          {salesTrend.length > 0 ? (
            <div className="analytics-chart analytics-sales-chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={salesTrend}
                  margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />

                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={65}
                    tickFormatter={(value) =>
                      value >= 1000 ? `₹${value / 1000}k` : `₹${value}`
                    }
                  />

                  <Tooltip
                    formatter={(value) => [
                      formatCurrency(value),
                      "Revenue",
                    ]}
                  />

                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 3, fill: "#3b82f6" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="analytics-empty">
              No delivered sales data available.
            </div>
          )}
        </section>

        {/* Top Selling Products table */}
        <section className="analytics-card">
          <div className="analytics-card-heading">
            <div>
              <h3>Top Selling Products</h3>
              <p>Top five products ranked by units sold</p>
            </div>
          </div>

          {topProducts.length > 0 ? (
            <div className="analytics-table-wrapper">
              <table className="analytics-products-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product Name</th>
                    <th>Units Sold</th>
                  </tr>
                </thead>

                <tbody>
                  {topProducts.map((product, index) => (
                    <tr key={product.name}>
                      <td>{index + 1}</td>
                      <td>{product.name}</td>
                      <td>{product.units}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="analytics-empty">
              No product sales data available.
            </div>
          )}
        </section>
      </div>

      {/* Store Overview */}
      <section className="analytics-card analytics-store-section">
        <div className="analytics-card-heading">
          <div>
            <h3>Store Overview</h3>
            <p>Current inventory and customer summary</p>
          </div>
        </div>

        <div className="analytics-store-grid">
          <div className="analytics-store-item">
            <span className="analytics-store-icon products-icon">▣</span>
            <div>
              <p>Total Products</p>
              <h3>{products.length}</h3>
            </div>
          </div>

          <div className="analytics-store-item">
            <span className="analytics-store-icon stock-icon">▦</span>
            <div>
              <p>Total Stock Units</p>
              <h3>{totalStock}</h3>
            </div>
          </div>

          <div className="analytics-store-item">
            <span className="analytics-store-icon low-stock-icon">!</span>
            <div>
              <p>Low Stock Products</p>
              <h3>{lowStock}</h3>
            </div>
          </div>

          <div className="analytics-store-item">
            <span className="analytics-store-icon out-stock-icon">×</span>
            <div>
              <p>Out of Stock</p>
              <h3>{outOfStock}</h3>
            </div>
          </div>

          <div className="analytics-store-item">
            <span className="analytics-store-icon customers-icon">♙</span>
            <div>
              <p>Registered Customers</p>
              <h3>{customers.length}</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
