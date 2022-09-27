import {
  ActionIcon,
  AppShell,
  Burger,
  Header,
  MediaQuery,
  Navbar,
  ScrollArea,
  useMantineTheme,
  Menu,
  Text,
  Button,
  Group,
  Code,
  TextInput,
  Divider,
  SegmentedControl,
  Center,
  Box,
  HoverCard,
  Transition,
  Paper,
  Indicator,
} from "@mantine/core"; //for import mantine required functions and theme
import React, { useState, useEffect } from "react";
import {
  MoonStars,
  Sun,
  Search,
  Settings,
  UserExclamation,
  Logout,
  X,
  WindowMinimize,
  WindowMaximize,
  Refresh,
  Minus,
  Archive,
  ChartLine,
  User,
  Dashboard,
  RotateClockwise2,
  Cash,
  BoxMultiple,
  Download,
  Bell,
} from "tabler-icons-react";
import { IconSearch } from "@tabler/icons";
import { useLocalStorage, useClickOutside } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import { useNavigate, Outlet } from "react-router-dom"; // for import react dom navigation components
import {
  SpotlightProvider,
  useSpotlight,
  openSpotlight,
} from "@mantine/spotlight";

// For imports the logo images for navigation
import Icon from "../assets/images/task.png";

import LOGO from "../assets/images/logo.png";
import LOGOW from "../assets/images/logoW.png";
// Import thte linksgroup
import { LinksGroup } from "./NavLinks";
import useStyles from "./Style"; // Import the mantine custome styles from the compoents
//for   made mantine theme style change and write custome theme here

import {
  handleClose,
  handleGetStockDepletion,
  handleHide,
  handleMaximize,
  handleMinimize,
  handleReload,
  handleUnmaximize,
} from "../helpers/apis";

import Home from "../pages/Home";
import StockIn from "../pages/inventory/StockIn";
import Navigation from "./Navigation";
import JSZip from "jszip";
import JSZipUtils from "jszip-utils";
import { saveAs } from "file-saver";

// For control the search of naviagation list
function SpotlightControl(props) {
  const spotlight = useSpotlight();
  return (
    <Group position="center" color="dark">
      <TextInput
        variant="filled"
        placeholder="Search"
        onClick={spotlight.openSpotlight}
        size="xs"
        width={50}
        shortcut={["ctrl + k", "mod + K", "⌘ + K"]}
        icon={<IconSearch size={12} stroke={1.5} />}
        rightSectionWidth={70}
        rightSection={<Code>Ctrl + K</Code>}
        styles={{ rightSection: { pointerEvents: "none" } }}
        mb="sm"
      />
    </Group>
  );
}

const scaleY = {
  in: { opacity: 1, transform: "scaleY(1)" },
  out: { opacity: 0, transform: "scaleY(0)" },
  common: { transformOrigin: "top" },
  transitionProperty: "transform, opacity",
};

// Side bar navigation list by array
const mockdata = [
  { label: "Dashboard", icon: Dashboard, link: "/" },
  {
    label: "Sales",
    icon: ChartLine,
    initiallyOpened: true,
    links: [
      { label: "Add Sale", link: "/add_sale" },
      { label: "Sales", link: "/sale" },
      { label: "Add Estimate", link: "/add_estimate" },
      { label: "Estimates", link: "/estimate" },
      { label: "KPI", link: "/kpi" },
      // { label: "HSN Report", link: "/hsn" },
    ],
  },
  {
    label: "Inventory",
    icon: Archive,
    initiallyOpened: true,
    links: [
      { label: "Vendors", link: "/vendors" },
      { label: "Stock In", link: "/stock_in" },
      { label: "Stock View", link: "/stock" },
      { label: "Purchase Order", link: "/po" },
    ],
  },
  {
    label: "Cash Ledger",
    icon: Box,
    initiallyOpened: true,
    links: [
      { label: "Cash Ledger ", link: "/cash" },
      { label: "Search Cash Ledger", link: "/search_cash" },
    ],
  },
  {
    label: "Products",
    icon: Box,
    initiallyOpened: true,
    links: [
      { label: "Brands", link: "/brands" },
      { label: "Groups", link: "/groups" },
      { label: "SubGroups", link: "/subgroups" },
      { label: "Products", link: "/products" },
    ],
  },
  { label: "Customers", icon: User, link: "/customers" },

  { label: "Settings", icon: Settings, link: "/manages" },
];

// Sidebar start
function Sidebar({ children }) {
  const [opened, setOpened] = useState(false);
  const [customerDrawer, setCustomerDrawer] = useState(false);
  const [stockDrawer, setStockDrawer] = useState(false);
  const [minimize, setMinimize] = useState(false);
  const [name, setName] = useState("");
  const theme = useMantineTheme();
  const clickOutsideRef = useClickOutside(() => setName(""));

  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
  });
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  const dark = colorScheme === "dark";
  const { classes } = useStyles();
  const links = mockdata.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));
  const [note, setNote] = useState(false);
  const [pCount, setPCount] = useLocalStorage({
    key: "depletion",
    defaultValue: 0,
  });
  const [notificationDrawer, setNotificationDrawer] = useState(false);
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      const response = await handleGetStockDepletion();

      if (response.status === 200) {
        const stockCheck = response.data.data;
        var depletion = 0;
        var product = [];
        for (let a = 0; a < stockCheck.length; a++) {
          if (
            stockCheck[a].total_item < stockCheck[a].product.stock_depletion
          ) {
            depletion += 1;
            product.push(stockCheck[a].product);
          }
        }
        const product_depletion = {
          depletion: depletion,
          product: product,
        };

        if (product_depletion.depletion >= 1) {
          if (Number(pCount) != Number(product_depletion.depletion))
            setNote(true);
          localStorage.setItem("depletion", product_depletion.depletion);
        }
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  });

  const modals = useModals();
  let navigate = useNavigate();

  const actions = [
    {
      title: "Dashboard",
      onTrigger: () => navigate("/"),
    },
    {
      title: "Add Sale",
      onTrigger: () => navigate("/add_sale"),
    },
    { title: "Sales", onTrigger: () => navigate("/sale") },
    { title: "Add Estimate", onTrigger: () => navigate("/add_estimate") },
    { title: "Estimates", onTrigger: () => navigate("/estimate") },
    { title: "KPI", onTrigger: () => navigate("/kpi") },
    { title: "Vendors", onTrigger: () => navigate("/vendors") },
    { title: "Stock In", onTrigger: () => navigate("/stock_in") },
    { title: "Stock View", onTrigger: () => navigate("/stock") },
    { title: "Purchase Order", onTrigger: () => navigate("/po") },
    { title: "Cash Ledger ", onTrigger: () => navigate("/cash") },
    { title: "Search Cash Ledger", onTrigger: () => navigate("/search_cash") },
    { title: "Brands", onTrigger: () => navigate("/brands") },
    { title: "Groups", onTrigger: () => navigate("/groups") },
    { title: "SubGroups", onTrigger: () => navigate("/subgroups") },
    { title: "Products", onTrigger: () => navigate("/products") },
  ];
  function urlToPromise(url) {
    return new Promise(function (resolve, reject) {
      JSZipUtils.getBinaryContent(url, function (err, data) {
        if (err) {
          reject(err);
        } else {
          console.log(data);
          resolve(data);
        }
      });
    });
  }
  const [lDAni, setLDAni] = useState(false);
  const dbDownload = async () => {
    const url = "./src/assets/db/db.sqlite3";
    const zip = new JSZip();
    // zip.file("Hello.txt", "Hello World\n");
    console.log(urlToPromise(url));
    zip.file("db.sqlite3", urlToPromise(url), { binary: true });
    setTimeout(() => {
      setLDAni(!lDAni);

      zip.generateAsync({ type: "blob" }).then(function (content) {
        // see FileSaver.js
        saveAs(content, "dataBackup.zip");
      });
    }, 3000);
  };

  return (
    <div>
      <AppShell
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        })}
        // navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
        navbarOffsetBreakpoint="sm"
        // fixed prop on AppShell will be automatically added to Header and Navbar
        fixed
        header={
          <Header
            height={62}
            py={2}
            style={{
              borderBottom: "0px",
            }}
            className="border-bottom noprint"
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  {dark ? (
                    <>
                      <img
                        src={Icon}
                        alt=""
                        style={{ height: "15px", margin: 3 }}
                      />
                      <Text size="xs" color="white" mt={2} weight={600}>
                        Zevcore - WAS
                      </Text>
                    </>
                  ) : (
                    <>
                      <img
                        src={Icon}
                        alt=""
                        style={{ height: "15px", margin: 3 }}
                      />
                      <Text size="xs" mt={2} weight={600}>
                        Zevcore - WAS
                      </Text>
                    </>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <ActionIcon
                    className="no-drag"
                    color="dark"
                    onClick={() => {
                      handleMinimize();
                    }}
                    title="Minimize"
                  >
                    <Minus strokeWidth="0.8" size={15} />
                  </ActionIcon>
                  <ActionIcon
                    className="no-drag"
                    color="dark"
                    onClick={() => {
                      if (minimize === true) {
                        setMinimize(false);
                        handleUnmaximize();
                      } else {
                        setMinimize(true);
                        handleMaximize();
                      }
                    }}
                    title={minimize ? "Restore" : "Maximize"}
                  >
                    {minimize ? (
                      <WindowMinimize
                        className="no-drag"
                        strokeWidth="0.8"
                        size={15}
                      />
                    ) : (
                      <WindowMaximize
                        className="no-drag"
                        strokeWidth="0.8"
                        size={15}
                      />
                    )}
                  </ActionIcon>
                  <ActionIcon
                    className="no-drag"
                    color="red"
                    onClick={() => {
                      modals.openConfirmModal({
                        title: "Confirm Close ",
                        children: (
                          <Text size="sm">
                            If you close you wont receive any notification or
                            minimize the application
                          </Text>
                        ),

                        labels: {
                          confirm: "Close",
                          cancel: "Minimize to tray",
                        },
                        confirmProps: { color: "red" },
                        onCancel: () => handleHide(),
                        onConfirm: () => {
                          localStorage.clear();
                          handleClose();
                        },
                      });
                    }}
                    title="Close Window"
                  >
                    <X strokeWidth="0.8" size={15} />
                  </ActionIcon>
                </div>
              </div>

              <div
                style={{
                  backgroundColor:
                    theme.colorScheme === "dark" ? "#2d2d2d" : "#EEEEEE",
                  display: "flex",
                  justifyContent: "space-between",
                  padding: 5,
                }}
              >
                <div
                  className="no-drag"
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <Navigation />
                </div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <ActionIcon
                    className="zc-mt-1 no-drag"
                    color={dark ? "yellow" : "blue"}
                    onClick={() => toggleColorScheme()}
                    title="Toggle dark light"
                  >
                    {dark ? (
                      <Sun strokeWidth="0.8" size={20} />
                    ) : (
                      <MoonStars strokeWidth="0.8" size={20} />
                    )}
                  </ActionIcon>
                  <ActionIcon
                    className="zc-mt-1 no-drag"
                    color="dark"
                    onClick={() => handleReload()}
                    title="Page refresh"
                  >
                    <RotateClockwise2 strokeWidth="0.8" size={20} />
                  </ActionIcon>

                  <ActionIcon
                    className="zc-mt-1 no-drag"
                    color="dark"
                    onClick={() => setNotificationDrawer(!notificationDrawer)}
                    title="Page refresh"
                  >
                    <Indicator disabled={note} color="red">
                      <Bell strokeWidth="0.8" size={20} />
                    </Indicator>
                  </ActionIcon>

                  {/* For Profile Dropdown list */}
                  <Menu shadow="md" className="no-drag zc-mr-1" width={200}>
                    <Menu.Target>
                      <ActionIcon
                        className="zc-mt-1"
                        color="dark"
                        type="button"
                        title="Setting"
                      >
                        <Settings strokeWidth="0.8" size={20} />
                      </ActionIcon>
                    </Menu.Target>
                    {/* Profile setting page */}
                    <Menu.Dropdown>
                      {/* <Menu.Item
                        icon={<UserExclamation size={14} />}
                        onClick={() => navigate("/profile")}
                      >
                        Profile Settings
                      </Menu.Item> */}
                      <Menu.Item
                        icon={<Settings size={14} />}
                        onClick={() => navigate("/manages")}
                      >
                        Settings
                      </Menu.Item>
                      {/* For logout button */}
                      <Menu.Item
                        onClick={() => {
                          modals.openConfirmModal({
                            title: "Confirm Logout ",
                            children: (
                              <Text size="sm">
                                This action is so important that you are
                                required to confirm logout. Please click one of
                                these buttons to proceed.
                              </Text>
                            ),

                            labels: {
                              confirm: "Confirm",
                              cancel: "Cancel",
                            },
                            confirmProps: { color: "red" },
                            onCancel: () => console.log("Cancel"),
                            onConfirm: () => {
                              localStorage.clear();
                              navigate("/login");
                            },
                          });
                        }}
                        color="red"
                        icon={<Logout size={14} />}
                      >
                        Log Out
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                  <ActionIcon
                    className="zc-mt-1 no-drag"
                    color="dark"
                    onClick={() => dbDownload()}
                    title="Backup database"
                  >
                    <Download strokeWidth="0.8" size={20} />
                  </ActionIcon>
                  <SpotlightProvider
                    className="no-drag"
                    actions={actions}
                    searchPlaceholder="Search..."
                    shortcut={["ctrl + k", "mod + K", "⌘ + K"]}
                    nothingFoundMessage="Nothing found..."
                  >
                    <div
                      style={{ width: 150 }}
                      className="no-drag"
                      onClick={openSpotlight}
                    >
                      <TextInput
                        variant="filled"
                        placeholder="Search"
                        onClick={openSpotlight}
                        size="xs"
                        pt={2}
                        pb={1}
                        shortcut={["ctrl + k", "mod + K", "⌘ + K"]}
                        icon={<IconSearch size={12} stroke={1.5} />}
                        rightSectionWidth={70}
                        rightSection={<Code>Ctrl + K</Code>}
                      />
                    </div>
                  </SpotlightProvider>
                </div>
              </div>
            </div>
          </Header>
        }
      >
        <Outlet />
      </AppShell>
      <div style={{ display: "none" }}>
        <Home schemeDrawer={notificationDrawer} />
      </div>
    </div>
  );
}

export default Sidebar;
