
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Inventory from "./pages/Inventory";
import Analytics from "./pages/Analytics";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Header title="Dashboard" />
                  <Dashboard />
                </>
              }
            />

            <Route
              path="/products"
              element={
                <>
                  <Header title="Products" />
                  <Products />
                </>
              }
            />

            <Route
              path="/orders"
              element={
                <>
                  <Header title="Orders" />
                  <Orders />
                </>
              }
            />

            <Route
              path="/customers"
              element={
                <>
                  <Header title="Customers" />
                  <Customers />
                </>
              }
            />

            <Route
              path="/inventory"
              element={
                <>
                  <Header title="Inventory" />
                  <Inventory />
                </>
              }
            />

            <Route
              path="/analytics"
              element={
                <>
                  <Header title="Analytics" />
                  <Analytics />
                </>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
