import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import "./Dashboard.css";

const categoryNames = ["Electronics", "Clothing", "Footwear", "Accessories"];

const initialStatusCounts = {
  Pending: 0,
  Processing: 0,
  Delivered: 0,
  Cancelled: 0,
};

export default function Dashboard() {
  const [stats, setStats] = useState([
    { title: "Total Revenue", value: "₹0", color: "blue" },
    { title: "Total Orders", value: "0", color: "green" },
    { title: "Total Products", value: "0", color: "purple" },
    { title: "Total Customers", value: "0", color: "orange" },
  ]);

  const [categorySales, setCategorySales] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [orderStatusCounts, setOrderStatusCounts] =
    useState(initialStatusCounts);

  useEffect(() => {
    const loadDashboardData = () => {
      try {
        const orders = JSON.parse(localStorage.getItem("orders") || "[]");
        const products = JSON.parse(localStorage.getItem("products") || "[]");
        const customers = JSON.parse(localStorage.getItem("customers") || "[]");

        const validOrders = Array.isArray(orders) ? orders : [];
        const validProducts = Array.isArray(products) ? products : [];
        const validCustomers = Array.isArray(customers) ? customers : [];

        // Calculate revenue from delivered orders
        const totalRevenue = validOrders.reduce((total, order) => {
          return order.status === "Delivered"
            ? total + (Number(order.amount) || 0)
            : total;
        }, 0);

        // Update summary cards
        setStats([
          {
            title: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString("en-IN")}`,
            color: "blue",
          },
          {
            title: "Total Orders",
            value: validOrders.length.toLocaleString("en-IN"),
            color: "green",
          },
          {
            title: "Total Products",
            value: validProducts.length.toLocaleString("en-IN"),
            color: "purple",
          },
          {
            title: "Total Customers",
            value: validCustomers.length.toLocaleString("en-IN"),
            color: "orange",
          },
        ]);

        // Get the five newest orders
        const latestOrders = [...validOrders]
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .slice(0, 5);

        setRecentOrders(latestOrders);

        // Count orders by status
        const statusCounts = { ...initialStatusCounts };

        validOrders.forEach((order) => {
          if (order.status in statusCounts) {
            statusCounts[order.status]++;
          }
        });

        setOrderStatusCounts(statusCounts);

        // Prepare category revenue totals
        const revenueByCategory = {};

        validProducts.forEach((product) => {
          if (product.category) {
            revenueByCategory[product.category] = 0;
          }
        });

        categoryNames.forEach((category) => {
          if (!(category in revenueByCategory)) {
            revenueByCategory[category] = 0;
          }
        });

        // Calculate category revenue from delivered orders
        validOrders.forEach((order) => {
          if (order.status !== "Delivered" || !Array.isArray(order.items)) {
            return;
          }

          order.items.forEach((item) => {
            const product = validProducts.find(
              (product) => product.id === item.productId,
            );

            const category = item.category || product?.category;

            if (!category) return;

            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 0;

            if (quantity <= 0 || price < 0) return;

            if (!(category in revenueByCategory)) {
              revenueByCategory[category] = 0;
            }

            revenueByCategory[category] += price * quantity;
          });
        });

        const salesData = Object.entries(revenueByCategory).map(
          ([category, revenue]) => ({
            category,
            revenue,
          }),
        );

        setCategorySales(salesData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    loadDashboardData();

    window.addEventListener("storage", loadDashboardData);
    window.addEventListener("focus", loadDashboardData);

    return () => {
      window.removeEventListener("storage", loadDashboardData);
      window.removeEventListener("focus", loadDashboardData);
    };
  }, []);

  const maxSales = Math.max(...categorySales.map((item) => item.revenue), 1);

  const orderStatusData = [
    { status: "Pending", count: orderStatusCounts.Pending },
    { status: "Processing", count: orderStatusCounts.Processing },
    { status: "Delivered", count: orderStatusCounts.Delivered },
    { status: "Cancelled", count: orderStatusCounts.Cancelled },
  ];

  return (
    <div className="dashboard">
      {/* Welcome Section */}
      <section className="dashboard-welcome">
        <h2>Welcome to Your Dashboard!</h2>
        <p>
          Here's an overview of your store's performance and business activity.
        </p>
      </section>

      {/* Summary Cards */}
      <section className="dashboard-stats">
        {stats.map((stat) => (
          <div className={`stat-card ${stat.color}`} key={stat.title}>
            <h3>{stat.title}</h3>
            <p>{stat.value}</p>
          </div>
        ))}
      </section>

      {/* Charts Side by Side */}
      <section className="dashboard-charts">
        {/* Sales by Category */}
        <div className="sales-section">
          <div className="sales-header">
            <div>
              <h2>Sales by Category</h2>
              <p>Revenue from delivered orders</p>
            </div>
          </div>

          {categorySales.length === 0 ? (
            <div className="sales-empty">
              <p>No category sales data available yet.</p>
            </div>
          ) : (
            <div className="category-sales-list">
              {categorySales.map((item) => (
                <div className="category-sales-item" key={item.category}>
                  <div className="category-sales-info">
                    <span className="category-sales-name">{item.category}</span>

                    <strong>₹{item.revenue.toLocaleString("en-IN")}</strong>
                  </div>

                  <div
                    className="category-sales-track"
                    role="img"
                    aria-label={`${item.category}: ₹${item.revenue.toLocaleString("en-IN")}`}
                  >
                    <div
                      className="category-sales-bar"
                      style={{
                        width: `${(item.revenue / maxSales) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Status Bar Chart */}
        <div className="order-status-section">
          <div className="order-status-header">
            <h2>Order Status Overview</h2>
            <p>Number of orders by status</p>
          </div>

          <div className="order-status-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={orderStatusData}
                margin={{
                  top: 12,
                  right: 8,
                  left: 0,
                  bottom: 8,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey="status"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  width={30}
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={42}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Recent Orders */}
      <section className="recent-orders-section">
        <div className="recent-orders-header">
          <div>
            <h2>Recent Orders</h2>
            <p>Latest orders placed in your store</p>
          </div>
        </div>

        {recentOrders.length === 0 ? (
          <div className="recent-orders-empty">
            <p>No orders available yet.</p>
          </div>
        ) : (
          <div className="recent-orders-table-wrapper">
            <table className="recent-orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="recent-order-id">#{order.id}</td>

                    <td>{order.customer}</td>

                    <td>
                      {order.date
                        ? new Date(`${order.date}T00:00:00`).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "—"}
                    </td>

                    <td className="recent-order-amount">
                      ₹{(Number(order.amount) || 0).toLocaleString("en-IN")}
                    </td>

                    <td>
                      <span
                        className={`recent-order-status status-${String(
                          order.status || "unknown",
                        )
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {order.status || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
