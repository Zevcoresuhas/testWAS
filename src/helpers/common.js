import React, { createContext } from "react";

import { openModal } from "@mantine/modals";

import { Button, Text } from "@mantine/core";

// For slice the data acording to the pagination and perpage drop down change
export const dataSlice = ({ data, page, total }) => {
  const datas = data.slice((page - 1) * total, (page - 1) * total + total);
  return datas;
};

// For filter the data for select only value and label
export const selectFilter = async ({ data }) => {
  var clean = await data.map((data) => ({
    value: data.value.toString(),
    label: data.label.toString(),
  }));
  return clean;
};

// For filter the data for select only value and label
export const getActiveColor = ({ status, theme }) => {
  return status.accepted
    ? theme.colors[theme.primaryColor][6]
    : status.rejected
    ? theme.colors.red[6]
    : theme.colorScheme === "dark"
    ? theme.colors.dark[0]
    : theme.black;
};

export const imageModal = async ({ data, title }) => {
  return openModal({
    title: title,
    children: (
      <>
        <img src={data} alt="" width="100%" />
      </>
    ),
  });
};

export const pageModal = async ({ data, title }) => {
  return openModal({
    children: (
      <>
        <Text>{title}</Text>
      </>
    ),
  });
};

export const onDownload = async ({ data }) => {
  const link = document.createElement("a");
  link.href = "./excel/" + data + ".xlsx";
  link.click();
};

export const barcodePrint = (e, label) => {
  var path = document.getElementById(e).children[0].outerHTML;
  var win = window.open("", "", "height=500", "width=500");
  win.document.write(
    `<html><head></head><body onload="window.print()">` +
      path +
      `<br/><p style="margin:0px">` +
      label +
      `</p></html>`
  );
  win.print();
  win.close();
};

export const terminologies = {
  brand: localStorage.getItem("brand"),
  brands: localStorage.getItem("brands"),
  brandCheck: localStorage.getItem("brandCheck"),
  group: localStorage.getItem("group"),
  groups: localStorage.getItem("groups"),
  groupCheck: localStorage.getItem("groupCheck"),
  subgroup: localStorage.getItem("subgroup"),
  subgroups: localStorage.getItem("subgroups"),
  subgroupCheck: localStorage.getItem("subgroupCheck"),
  product: localStorage.getItem("product"),
  products: localStorage.getItem("products"),
};

export const nFormatter = (num, digits) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";
};
