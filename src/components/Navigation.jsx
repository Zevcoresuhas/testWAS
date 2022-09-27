import { Button, Menu, Transition } from "@mantine/core";
import React, { useState } from "react";
import {
  Dashboard,
  ChartLine,
  Archive,
  Box,
  Cash,
  User,
  Settings,
} from "tabler-icons-react";
import { useNavigate } from "react-router-dom";
import useStyles from "./Style";
import { useLocalStorage } from "@mantine/hooks";
import { terminologies } from "../helpers/common";

function Navigation() {
  const [terminology, setTerminology] = useState(terminologies);
  const [colorScheme, setGroupCheck] = useLocalStorage({
    key: "groupCheck",
    defaultValue: "1",
  });
  const isAuthenticated = localStorage.getItem("groupCheck");

  let navigate = useNavigate();
  const { classes } = useStyles();
  const [active, setActive] = useState("");
  const handlePage = (e) => {
    if (typeof e != "undefined") {
      navigate(e);
      setActive(e);
    }
  };

  return (
    <div>
      {" "}
      <Button
        color="zevcore"
        variant="subtle"
        className={active === "/" ? classes.navButtonActive : classes.navButton}
        size="xs"
        onClick={() => handlePage("/")}
        leftIcon={<Dashboard size={14} />}
      >
        Dashboard
      </Button>
      <Menu width={200} shadow="md" position="bottom-start" withArrow>
        <Menu.Target>
          <Button
            color="zevcore"
            className={
              active === "/add_sale" ||
              active === "/sale" ||
              active === "/add_estimate" ||
              active === "/kpi"
                ? classes.navButtonActive
                : classes.navButton
            }
            variant="subtle"
            size="xs"
            leftIcon={<ChartLine size={14} />}
          >
            Sales
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item color="zevcore" onClick={() => handlePage("/add_sale")}>
            Add Sale
          </Menu.Item>
          <Menu.Item color="zevcore" onClick={() => handlePage("/sale")}>
            Sales
          </Menu.Item>

          <Menu.Item
            color="zevcore"
            onClick={() => handlePage("/add_estimate")}
          >
            Add Estimate
          </Menu.Item>
          <Menu.Item color="zevcore" onClick={() => handlePage("/estimate")}>
            Estimate
          </Menu.Item>
          <Menu.Item color="zevcore" onClick={() => handlePage("/passbook")}>
            Comprehensive Report
          </Menu.Item>
          <Menu.Item color="zevcore" onClick={() => handlePage("/kpi")}>
            KPI
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Menu width={200} shadow="md" position="bottom-start" withArrow>
        <Menu.Target>
          <Button
            color="zevcore"
            className={
              active === "/stock_in" ||
              active === "/stock" ||
              active === "/po" ||
              active === "/vendors"
                ? classes.navButtonActive
                : classes.navButton
            }
            variant="subtle"
            size="xs"
            leftIcon={<Archive size={14} />}
          >
            Inventory
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item color="zevcore" onClick={() => handlePage("/stock_in")}>
            Purchase
          </Menu.Item>
          <Menu.Item color="zevcore" onClick={() => handlePage("/stock")}>
            Stocks
          </Menu.Item>
          <Menu.Item
            color="zevcore"
            onClick={() => handlePage("/product_stock")}
          >
            Product Stocks
          </Menu.Item>
          <Menu.Item color="zevcore" onClick={() => handlePage("/po")}>
            Purchase Order
          </Menu.Item>
          <Menu.Item color="zevcore" onClick={() => handlePage("/vendors")}>
            Vendors
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Menu width={200} shadow="md" position="bottom-start" withArrow>
        <Menu.Target>
          <Button
            color="zevcore"
            className={
              active === "/cash" || active === "/search_cash"
                ? classes.navButtonActive
                : classes.navButton
            }
            variant="subtle"
            size="xs"
            leftIcon={<Cash size={14} />}
          >
            Ledger
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item color="zevcore" onClick={() => handlePage("/cash")}>
            Ledger
          </Menu.Item>
          <Menu.Item color="zevcore" onClick={() => handlePage("/search_cash")}>
            Search Cash Ledger
          </Menu.Item>
          <Menu.Item color="zevcore" onClick={() => handlePage("/search_bank")}>
            Search Bank Ledger
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Menu width={200} shadow="md" position="bottom-start" withArrow>
        <Menu.Target>
          <Button
            color="zevcore"
            className={
              active === "/brands" ||
              active === "/groups" ||
              active === "/subgroups" ||
              active === "/products"
                ? classes.navButtonActive
                : classes.navButton
            }
            variant="subtle"
            size="xs"
            leftIcon={<Box size={14} />}
          >
            Products
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          {terminology.brandCheck == "1" ? (
            <Menu.Item color="zevcore" onClick={() => handlePage("/brands")}>
              {terminology.brands}
            </Menu.Item>
          ) : null}

          {terminology.groupCheck == "1" ? (
            <Menu.Item color="zevcore" onClick={() => handlePage("/groups")}>
              {terminology.groups}
            </Menu.Item>
          ) : null}

          {terminology.subgroupCheck == "1" ? (
            <Menu.Item color="zevcore" onClick={() => handlePage("/subgroups")}>
              {terminology.subgroup}
            </Menu.Item>
          ) : null}

          <Menu.Item color="zevcore" onClick={() => handlePage("/products")}>
            Products
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Button
        color="zevcore"
        variant="subtle"
        className={
          active === "/customers" ? classes.navButtonActive : classes.navButton
        }
        size="xs"
        onClick={() => handlePage("/customers")}
        leftIcon={<User size={14} />}
      >
        Customers
      </Button>
      <Button
        color="zevcore"
        variant="subtle"
        className={
          active === "/manages" ? classes.navButtonActive : classes.navButton
        }
        size="xs"
        onClick={() => handlePage("/manages")}
        leftIcon={<Settings size={14} />}
      >
        Settings
      </Button>
    </div>
  );
}

export default Navigation;
