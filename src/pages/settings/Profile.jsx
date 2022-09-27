import React, { useState, useEffect, useRef, useCallback } from "react";
import BreadCrumb from "../../components/BreadCrumb";
import { useLocation, useNavigate } from "react-router-dom"; // for import react dom navigation components
import axios from "axios";

// Mantine library
import { CloudUpload, Dots, Pencil, Trash, X, Check } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";

import { Selector, ChevronDown, ChevronUp, Search } from "tabler-icons-react";
import {
  Space,
  Card,
  Button,
  Drawer,
  NumberInput,
  Group,
  Text,
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Pagination,
  Center,
  TextInput,
  Menu,
  NativeSelect,
  Skeleton,
  ActionIcon,
  Progress,
  Input,
  Avatar,
  PasswordInput,
  Grid,
} from "@mantine/core"; //for import mantine required functions and theme
import { useInterval } from "@mantine/hooks";
import { useModals } from "@mantine/modals";

import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";

// For export images
import excel from "../../assets/images/excel.png";
import pdf from "../../assets/images/pdf.png";

// For bulk upload convert excel file to json
import readXlsxFile from "read-excel-file";

// For image Crop
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { handleEditUser, handleOneUser } from "../../helpers/apis";
import { async } from "@firebase/util";
function Profile() {
  const [token, setToken] = useState(localStorage.getItem("token")); //get saved local storage data
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [URL, setURL] = useState(process.env.REACT_APP_BACKEND_URL);
  const [URLFILE, setURLFILE] = useState(process.env.REACT_APP_FILE);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const [id, setId] = useState("");
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      value: 1,
      phone_number: 0,
      password: "",
      confirmPassword: "",
    },
    validate: {
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
    },
  });

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      const response = await handleOneUser();
      if (response.status == 200) {
        var datas = response.data.data;
        form.setFieldValue("name", datas.label);
        form.setFieldValue("email", datas.email);
        form.setFieldValue("phone_number", Number(datas.phone_number));
        setId(datas.value);
        setSkeletonLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAdd = async (e) => {
    // Set notification of saving and loader effects
    setSubmitLoading(true);
    showNotification({
      loading: true,
      id: "load-data",
      title: `Saving...`,
      message: "Waiting for response",
      autoclose: 5000,
      style: { borderRadius: 10 },
    });

    // Main axios part for sending data to backend adding user data
    const response = await handleEditUser(e);

    if (response.status == 200) {
      setSubmitLoading(false);
      updateNotification({
        id: "load-data",
        color: "teal",
        title: "Data Save",
        message: "User Field Updated Successfully",
        icon: <Check />,
      });
    } else {
      setSubmitLoading(false);
      updateNotification({
        id: "load-data",
        color: "red",
        title: "Data Save Error",
        message: "Some error accur",
        icon: <X />,
      });
    }
  };

  return (
    <div>
      <Skeleton
        height="100%"
        width="100%"
        radius="md"
        visible={skeletonLoading}
      >
        <BreadCrumb Text="Profile" Title="Settings" titleLink="/manages" />
      </Skeleton>
      <Space h="md" />
      {/* Main page start from here */}
      <Skeleton
        height="100%"
        width="100%"
        radius="md"
        sx={(theme) => ({
          boxShadow:
            "0 1px 3px rgb(0 0 0 / 5%), rgb(0 0 0 / 5%) 0px 10px 15px -5px, rgb(0 0 0 / 4%) 0px 7px 7px -5px",
        })}
        visible={skeletonLoading}
      >
        <Card shadow="sm" p="lg">
          <form onSubmit={form.onSubmit((values) => handleAdd(values))}>
            <Grid>
              <Grid.Col md={4} lg={4} mt={5}>
                <TextInput
                  variant="filled"
                  mt={2}
                  required
                  value={form.values.name}
                  label=" Name"
                  placeholder="Enter  Name"
                  {...form.getInputProps("name")}
                />
              </Grid.Col>
              <Grid.Col md={4} lg={4} mt={5}>
                <TextInput
                  variant="filled"
                  mt={5}
                  required
                  value={form.values.email}
                  label=" Email"
                  placeholder="Enter  Email"
                  {...form.getInputProps("email")}
                />
              </Grid.Col>
              <Grid.Col md={4} lg={4} mt={5}>
                <NumberInput
                  variant="filled"
                  mt={5}
                  required
                  value={form.values.phone_number}
                  label=" Phone Number"
                  placeholder="Enter  Phone Number"
                  {...form.getInputProps("phone_number")}
                />
              </Grid.Col>
              <Grid.Col md={4} lg={4} mt={5}>
                <PasswordInput
                  mt={5}
                  value={form.values.password}
                  label=" Password"
                  placeholder="Enter  Password"
                  {...form.getInputProps("password")}
                />
              </Grid.Col>
              <Grid.Col md={4} lg={4} mt={5}>
                <PasswordInput
                  mt={5}
                  value={form.values.confirmPassword}
                  label="Confirm Password"
                  placeholder=" Confirm Password"
                  {...form.getInputProps("confirmPassword")}
                />
              </Grid.Col>
            </Grid>
            <Group position="right" mt="md">
              <Button type="submit" color="gold" loading={submitLoading}>
                Submit
              </Button>
            </Group>
          </form>
        </Card>
      </Skeleton>
    </div>
  );
}

export default Profile;
