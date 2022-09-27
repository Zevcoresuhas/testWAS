import React from "react";
import { openModal, closeAllModals } from "@mantine/modals";
import {
  Grid,
  Table,
  Text,
  Paper,
  Tabs,
  Card,
  Avatar,
  ActionIcon,
  Button,
  NativeSelect,
  Pagination,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { Link } from "react-router-dom";
import { dataSlice, nFormatter } from "./common";
import { Box, Receipt, X } from "tabler-icons-react";

export const stockView = async ({ data, title }) => {
  return openModal({
    title: title,
    children: (
      <>
        <img src={data} alt="" width="100%" />
      </>
    ),
  });
};
