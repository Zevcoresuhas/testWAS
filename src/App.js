import React from "react";
import { Route, Routes } from "react-router-dom";
import { NotificationsProvider } from "@mantine/notifications"; // For show the notification import
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import ProtectedRoute from "./components/ProtectRoute";
import ErrorBoundary from "./components/Error";
import Sidebar from "./components/Sidebar";

import TopBar from "./pages/auth/Top";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
// Import pages
import Home from "./pages/Home";
import Internet from "./pages/Internet";

import Manages from "./pages/settings/Manage";
import Profile from "./pages/settings/Profile";
import Database from "./pages/settings/Database";
import Setting from "./pages/settings/Setting";
import Invoice from "./pages/settings/Invoice";
import Banking from "./pages/settings/Banking";
import Address from "./pages/settings/Address";

// Cash Ledger
import AddCash from "./pages/cash/AddCash";
import Bank from "./pages/cash/Bank";
import SearchCash from "./pages/cash/SearchCash";
import SearchBank from "./pages/cash/SearchBank";

// Products sections
import Brand from "./pages/product/Brand";
import Group from "./pages/product/Group";
import SubGroup from "./pages/product/SubGroup";
import Product from "./pages/product/Product";

// Inventory Section
import Vendor from "./pages/inventory/Vendor";
import StockIn from "./pages/inventory/StockIn";
import PurchaseOrder from "./pages/inventory/PurchaseOrder";
import Stock from "./pages/inventory/Stock";
import Tax from "./pages/settings/Tax";
import SaleType from "./pages/settings/SaleType";
import Account from "./pages/settings/Account";
import Customer from "./pages/Customer";
import ProductStock from "./pages/inventory/ProductStock";

// Inventory Section
import AddSale from "./pages/sale/AddSale";
import AddEstimate from "./pages/sale/AddEstimate";
import Sale from "./pages/sale/Sale";
import SaveSale from "./pages/sale/SaveSale";
import ViewSave from "./pages/sale/ViewSave";
import Estimate from "./pages/sale/Estimate";
import PrintInvoice from "./pages/sale/PrintInvoice";
import PrintEstimate from "./pages/sale/PrintEstimate";
import HsnReport from "./pages/sale/HsnReport";
import KPI from "./pages/sale/KPI";
import Passbook from "./pages/sale/Passbook";

function App() {
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
  });
  const [color] = useLocalStorage({
    key: "color",
    defaultValue: "#043c64",
  });

  const LightenDarkenColor = (col, amt) => {
    var usePound = false;
    if (col[0] === "#") {
      col = col.slice(1);
      usePound = true;
    }
    var num = parseInt(col, 16);
    var r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;
    var b = ((num >> 8) & 0x00ff) + amt;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;
    var g = (num & 0x0000ff) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
  };
  return (
    // Colorscheme provider is used for toggling between light and dark modes
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      {/* Mantine provider is used for customizing our own theme */}
      <MantineProvider
        theme={{
          "::-webkit-scrollbar": {
            backgroundColor: LightenDarkenColor(color, 120),
            width: "5px",
            height: "10px",
            borderRadius: 5,
          },
          "::-webkit-scrollbar-thumb": {
            backgroundColor: LightenDarkenColor(color, 120),
            borderRadius: 5,
            // "#D50000"
          },
          fontFamily: "Inter",
          fontWeight: 300,
          colorScheme,
          colors: {
            zevcore: [
              LightenDarkenColor(color, 140),
              LightenDarkenColor(color, 130),
              LightenDarkenColor(color, 120),
              LightenDarkenColor(color, 110),
              LightenDarkenColor(color, 100),
              LightenDarkenColor(color, 90),
              LightenDarkenColor(color, 50),
              LightenDarkenColor(color, 80),
              LightenDarkenColor(color, 50),
              LightenDarkenColor(color, 20),
            ],
          },
        }}
      >
        <NotificationsProvider autoClose={3000}>
          <ErrorBoundary>
            <Routes>
              <Route element={<TopBar />}>
                <Route path="/login" element={<Login />} />
                <Route exact path="/internet" element={<Internet />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot_password" element={<ForgotPassword />} />
              </Route>

              <Route element={<Sidebar />}>
                <Route
                  exact
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/home/:id"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/cash"
                  element={
                    <ProtectedRoute>
                      <AddCash />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/bank_cash"
                  element={
                    <ProtectedRoute>
                      <Bank />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/search_cash"
                  element={
                    <ProtectedRoute>
                      <SearchCash />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/search_bank"
                  element={
                    <ProtectedRoute>
                      <SearchBank />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/brands"
                  element={
                    <ProtectedRoute>
                      <Brand />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/groups"
                  element={
                    <ProtectedRoute>
                      <Group />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/subgroups"
                  element={
                    <ProtectedRoute>
                      <SubGroup />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/products"
                  element={
                    <ProtectedRoute>
                      <Product />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/vendors"
                  element={
                    <ProtectedRoute>
                      <Vendor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/stock_in"
                  element={
                    <ProtectedRoute>
                      <StockIn />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/product_stock"
                  element={
                    <ProtectedRoute>
                      <ProductStock />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/po"
                  element={
                    <ProtectedRoute>
                      <PurchaseOrder />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/stock"
                  element={
                    <ProtectedRoute>
                      <Stock />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/manages"
                  element={
                    <ProtectedRoute>
                      <Manages />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/database"
                  element={
                    <ProtectedRoute>
                      <Database />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Setting />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/tax"
                  element={
                    <ProtectedRoute>
                      <Tax />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/sale_type"
                  element={
                    <ProtectedRoute>
                      <SaleType />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/account"
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/customers"
                  element={
                    <ProtectedRoute>
                      <Customer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/add_sale"
                  element={
                    <ProtectedRoute>
                      <AddSale />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/passbook"
                  element={
                    <ProtectedRoute>
                      <Passbook />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/sale"
                  element={
                    <ProtectedRoute>
                      <Sale />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/view_save"
                  element={
                    <ProtectedRoute>
                      <ViewSave />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/add_save/:id"
                  element={
                    <ProtectedRoute>
                      <SaveSale />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/estimate"
                  element={
                    <ProtectedRoute>
                      <Estimate />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/add_estimate"
                  element={
                    <ProtectedRoute>
                      <AddEstimate />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/kpi"
                  element={
                    <ProtectedRoute>
                      <KPI />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/hsn"
                  element={
                    <ProtectedRoute>
                      <HsnReport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/address"
                  element={
                    <ProtectedRoute>
                      <Address />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/banking"
                  element={
                    <ProtectedRoute>
                      <Banking />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/invoice"
                  element={
                    <ProtectedRoute>
                      <Invoice />
                    </ProtectedRoute>
                  }
                />
              </Route>
              <Route
                exact
                path="/print_invoice/:id"
                element={
                  <ProtectedRoute>
                    <PrintInvoice />
                  </ProtectedRoute>
                }
              />
              <Route
                exact
                path="/print_estimate/:id"
                element={
                  <ProtectedRoute>
                    <PrintEstimate />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </ErrorBoundary>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
