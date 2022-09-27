import React, { useState, useEffect, useRef } from "react";
import BreadCrumb from "../components/BreadCrumb"; // For breadcrumbs data import
import useStyles from "../components/Style"; // Import the mantine custome styles from the compoents
import {
  Skeleton,
  Card,
  TextInput,
  Group,
  Text,
  Transition,
  Button,
  Drawer,
  Table,
  ScrollArea,
  NativeSelect,
  Pagination,
  Menu,
  ActionIcon,
  Progress,
  NumberInput,
} from "@mantine/core"; // Mantine all required compoennts imports list
import {
  CloudUpload,
  Dots,
  DotsCircleHorizontal,
  Pencil,
  Search,
  Trash,
} from "tabler-icons-react"; // For import the icons
import { useForm } from "@mantine/form"; // Mantine form import
import { CSVLink } from "react-csv"; // For export the data to excel format
import {
  handleAddCustomer,
  handleBulkCustomer,
  handleDeleteCustomer,
  handleEditCustomer,
  handleGetCustomer,
  handleGetCustomerHistory,
} from "../helpers/apis"; // Import for axios requests list for this pages
import notificationHelper from "../helpers/notification"; // Import notification for this page
import { Th, dataSearch, setSorting, print } from "../helpers/tableFunction"; // For table data functions
import { dataSlice, onDownload } from "../helpers/common"; // Common fuctions uses for applications
import { useModals } from "@mantine/modals"; // Modal from mantine
import excel from "../assets/images/excel.png"; // Image for excel export
import pdf from "../assets/images/pdf.png"; // Image for pdf exports
import { useInterval } from "@mantine/hooks";
import readXlsxFile from "read-excel-file";
import GoldCustomer from "../helpers/GoldCustomer";

function Customer(props) {
  // Mantine custome style use
  const { classes } = useStyles();
  const modals = useModals();

  // Setting the variables data for table data
  const [sortedData, setSortedData] = useState([]); // For table data
  const [activePage, setPage] = useState(1); // For set table active page
  const [total, setTotal] = useState(10); // For set total list show in page
  const [search, setSearch] = useState(""); // For set the search value name of table
  const [sortBy, setSortBy] = useState(null); // Seting the sortby table type
  const [reverseSortDirection, setReverseSortDirection] = useState(false); // For set the reverse sort direction
  const [refreshTable, setRefreshTable] = useState(Date.now()); // For refresh table
  const [opened1, setOpened1] = useState(1);

  const [customerModal, setCustomerModal] = useState(false);
  const [goldTitle, setGoldTitle] = useState("");
  const [goldValue, setGoldValue] = useState("");
  const [goldData, setGoldData] = useState("");

  // Setting the variables data list here
  const [variables, setVariables] = useState({
    skeletonLoading: true,
    submitLoading: false,
    data: [],
    addDrawer: false,
    bulkDrawer: false,
    openEdit: false,
    deleteIndex: 0,
  });
  useEffect(() => {
    if (opened1 == 1) {
      setVariables({ ...variables, addDrawer: false });
      setOpened1(2);
    } else {
      setVariables({ ...variables, addDrawer: true });
    }
  }, [props.customerDrawer]);

  // For form validation
  const form = useForm({
    initialValues: {
      name: "",
      phone_number: "",
      credit_limit: 5000,
      gstin: "",
      door_no: "",
      street: "",
      locality: "",
      pincode: "",
      city: "",
      state: "",
    },
    validate: {
      name: (value) => (value.length < 1 ? "Customer name is required" : null),
      phone_number: (value) =>
        value.length < 10 ? "Phone name is required" : null,
    },
  });

  //   For edit form data validation
  const formEdit = useForm({
    initialValues: {
      value: "",
      name: "",
      phone_number: "",
      credit_limit: 0,
      gstin: "",
      door_no: "",
      street: "",
      locality: "",
      pincode: "",
      city: "",
      state: "",
    },
    validate: {
      name: (value) => (value.length < 1 ? "Customer name is required" : null),
      phone_number: (value) =>
        value.length < 10 ? "Phone name is required" : null,
    },
  });

  //   For intial setting data
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (mounted) {
        //   For get all the customer data list
        const response = await handleGetCustomer();

        // On Respose setting the data to variable
        if (response.status === 200) {
          setVariables({
            ...variables,
            data: response.data.data,
            skeletonLoading: false,
          });
          const datas = dataSlice({
            data: response.data.data,
            page: 1,
            total: 10,
          });
          setSortedData(datas);
        }
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // Table data arrabnge by using function and loop throw each data rrange to table body
  const rows = sortedData.map((row, index) => (
    <tr key={row.label}>
      <td>{activePage * total - total + index + 1}</td>
      <td>
        <Group>
          {row.label}
          <ActionIcon
            onClick={async () => {
              const data = await handleGetCustomerHistory(row.value);
              const list = data.data.data;

              setCustomerModal(true);
              setGoldData(list);
              setGoldTitle(row.label);
              setGoldValue(row.value);
            }}
            ml={-10}
            color="zevcore"
            variant="transparent"
          >
            <DotsCircleHorizontal size={20} />
          </ActionIcon>{" "}
        </Group>
      </td>
      <td>{row.phone_number}</td>
      <td>{row.pincode}</td>
      <td>{row.credit_limit}</td>
      <td>{new Date(row.createdAt).toLocaleDateString()}</td>
      {/* For action drop down edit and delete the data */}
      <td justifycontent="right" align="right">
        <Menu shadow="sm" size="xs">
          <Menu.Target>
            <ActionIcon
              color="zevcore"
              type="button"
              style={{ marginLeft: 10 }}
              size="xs"
            >
              <Dots />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              onClick={() => handleEdit(row.value)}
              icon={<Pencil size={14} />}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              onClick={() => openConfirmModal(row.value)}
              icon={<Trash size={14} />}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </td>
    </tr>
  ));

  //For delete confirm modal show                                               Delete
  const openConfirmModal = (e) => {
    setVariables({ ...variables, deleteIndex: e });
    modals.openConfirmModal({
      title: "Do you want to delete this customer value",
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleConfirmDelete(e),
    });
  };
  //   For delete db data from table and db
  const handleConfirmDelete = async (e) => {
    const response = await handleDeleteCustomer(e);
    // Check the response for notification and actions

    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Customer deleted successfully",
      });
      var filter = variables.data;
      filter = filter.filter((img) => img.value !== e);
      setVariables({
        ...variables,
        submitLoading: false,
        data: filter,
      });
      const datas = dataSlice({
        data: filter,
        page: activePage,
        total: total,
      });
      setSortedData(datas);
    } else {
      notificationHelper({
        color: "red",
        title: "Failed! Please enter correct details",
        message: response.data.message,
      });
      setVariables({ ...variables, submitLoading: false });
    }
  };

  //   set editable data to form                                                        Edit form
  const handleEdit = (e) => {
    var datas = variables.data.find((img) => img.value === e);
    formEdit.setFieldValue("value", datas.value);
    formEdit.setFieldValue("name", datas.label);
    formEdit.setFieldValue("phone_number", datas.phone_number);
    formEdit.setFieldValue("credit_limit", Number(datas.credit_limit));
    formEdit.setFieldValue("gstin", datas.gstin);
    formEdit.setFieldValue("door_no", datas.door_no);
    formEdit.setFieldValue("street", datas.street);
    formEdit.setFieldValue("locality", datas.locality);
    formEdit.setFieldValue("pincode", Number(datas.pincode));
    formEdit.setFieldValue("city", datas.city);
    formEdit.setFieldValue("state", datas.state);
    setVariables({ ...variables, deleteIndex: e, openEdit: true });
  };

  // Edit customer data compoennt
  const EditCustomer = async (e) => {
    setVariables({ ...variables, submitLoading: true });
    const response = await handleEditCustomer(e);
    // Check for respose data for actions
    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Customer updated successfully",
      });
      setVariables({
        ...variables,
        submitLoading: false,
        data: response.data.data,
      });
      const datas = dataSlice({
        data: response.data.data,
        page: activePage,
        total: total,
      });
      setSortedData(datas);
    } else {
      notificationHelper({
        color: "red",
        title: "Failed! Please enter correct details",
        message: response.data.message,
      });
      setVariables({ ...variables, submitLoading: false });
    }
  };

  // Add new customer data
  const AddCustomer = async (e) => {
    setVariables({ ...variables, submitLoading: true });
    const response = await handleAddCustomer(e);
    // Check for response for actions
    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Customer added successfully",
      });
      form.reset();
      setVariables({
        ...variables,
        submitLoading: false,
        data: response.data.data,
      });
      const datas = dataSlice({
        data: response.data.data,
        page: activePage,
        total: total,
      });
      setSortedData(datas);
    } else {
      notificationHelper({
        color: "red",
        title: "Failed! Please enter correct details",
        message: response.data.message,
      });
      setVariables({ ...variables, submitLoading: false });
    }
  };
  // For bulk upload
  const [bulkData, setBulkData] = useState([]);
  const ref = useRef();
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const bulkFile789 = async (event) => {
    let xlsxfile = event.target.files ? event.target.files[0] : null;

    var data = [];
    readXlsxFile(xlsxfile).then((rows) => {
      data = rows;
      setBulkData(data);
    });

    ref.current.value = "";
  };
  const interval = useInterval(
    () =>
      setProgress((current) => {
        if (current < 100) {
          return current + 1;
        }
        return 0;
      }),
    20
  );
  // Upload bulk json data customer
  const BulkDataUpload = async () => {
    setVariables({ ...variables, submitLoading: true });

    const response = await handleBulkCustomer(bulkData);
    // Check for response for actions
    if (response.status === 200) {
      interval.stop();
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Bulk customer added successfully",
      });
      form.reset();
      setVariables({
        ...variables,
        submitLoading: false,
        data: response.data.data,
      });
      const datas = dataSlice({
        data: response.data.data,
        page: activePage,
        total: total,
      });
      setSortedData(datas);
    } else {
      interval.stop();
      notificationHelper({
        color: "red",
        title: "Failed! Please enter correct details",
        message: response.data.message,
      });
      setVariables({ ...variables, submitLoading: false });
    }
  };

  return (
    <div>
      {/* For breadcrumbs */}
      <Skeleton radius="md" visible={variables.skeletonLoading}>
        <BreadCrumb Text="All Customer" />
      </Skeleton>

      {/* Main start here */}
      <Skeleton radius="md" visible={variables.skeletonLoading}>
        <Card className="border">
          <ScrollArea>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {/* For search the table data input forms */}
              <TextInput
                variant="filled"
                placeholder="Search by any field"
                mb="md"
                size="xs"
                value={search}
                icon={<Search size={14} />}
                onChange={async (e) => {
                  // On change search ofr the data that is enter
                  setSearch(e.currentTarget.value);
                  setPage(1);
                  const datas = await dataSearch({
                    data: variables.data,
                    value: e.currentTarget.value,
                    activePage: activePage,
                    total: total,
                  });
                  setSortedData(datas);
                  setRefreshTable(new Date());
                }}
                sx={{ width: 250 }}
              />
              <div>
                <Group spacing="xs">
                  {/* For export the the table data to pdf and excels */}
                  <Text size="xs">Exports :</Text>
                  <CSVLink
                    data={variables.data}
                    headers={[{ label: " Customer Name", key: "label" }]}
                    filename="customer.csv"
                    className={classes.pdfExcel}
                  >
                    <img
                      src={excel}
                      alt="excel"
                      width="25"
                      style={{ margin: "2px" }}
                    />
                  </CSVLink>
                  <button
                    className={classes.pdfExcel}
                    onClick={() =>
                      print({
                        data: variables.data,
                        list: ["label", "value"],
                        header: ["Customer Name", "Id"],
                      })
                    }
                  >
                    <img
                      src={pdf}
                      alt="pdf"
                      width="19"
                      style={{ margin: "2px" }}
                    />
                  </button>
                  {/* Drawer open for adding new customer data */}
                  <Button
                    variant="outline"
                    color="zevcore"
                    size="xs"
                    onClick={() =>
                      setVariables({ ...variables, addDrawer: true })
                    }
                  >
                    + Add Customer
                  </Button>
                </Group>
              </div>
            </div>
            {/* Table data view */}
            <Table
              horizontalSpacing="md"
              verticalSpacing="xs"
              className={classes.striped}
            >
              {/* Table header defines */}
              <thead>
                <tr>
                  <Th>Sl.No</Th>
                  <Th
                    sorted={sortBy === "label"}
                    reversed={reverseSortDirection}
                    onSort={async () => {
                      const reversed =
                        "label" === sortBy ? !reverseSortDirection : false;
                      setReverseSortDirection(reversed);
                      setSortBy("label");
                      const datas = await setSorting({
                        data: variables.data,
                        sortby: "label",
                        reversed: reversed,
                        search: search,
                        activePage: activePage,
                        total: total,
                      });
                      setSortedData(datas);
                      setRefreshTable(new Date());
                    }}
                  >
                    Customer
                  </Th>
                  <Th>Phone Number</Th>
                  <Th>Pincode</Th>
                  <Th>Credit Limit</Th>
                  <Th>Created At</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              {/* Table body defines from rows function */}
              <tbody key={refreshTable}>
                {rows.length > 0 ? (
                  rows
                ) : (
                  <tr>
                    <td>
                      <Text weight={500} align="center">
                        Nothing found
                      </Text>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </ScrollArea>
          {/* For display the pagination and no of per pages list */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 15,
            }}
          >
            {/* For number of rows display in table */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text size="xs" className="zc-pr-3 zc-pt-1">
                Per Page
              </Text>
              <NativeSelect
                size="xs"
                onChange={async (e) => {
                  setTotal(Number(e.currentTarget.value));
                  setPage(1);
                  const datas = await dataSlice({
                    data: variables.data,
                    page: 1,
                    total: Number(e.currentTarget.value),
                  });
                  setSortedData(datas);
                  setRefreshTable(new Date());
                }}
                data={["10", "20", "50", "100"]}
                rightSectionWidth={20}
                sx={{ width: 70 }}
              />
            </div>
            {/* For pagination */}
            <Pagination
              size="xs"
              page={activePage}
              onChange={async (e) => {
                setPage(Number(e));
                const datas = await dataSlice({
                  data: variables.data,
                  page: Number(e),
                  total: total,
                });
                setSortedData(datas);
                setRefreshTable(new Date());
              }}
              total={Math.ceil(variables.data.length / total)}
              color="zevcore"
            />
          </div>
          {variables.data.length > 0 ? (
            <>
              <Text mt={5} align="right" size="sm" color="green">
                Last updated on:&nbsp;
                {new Date(
                  variables.data.reduce(function (r, a) {
                    return r.updatedAt > a.updatedAt ? r : a;
                  }).updatedAt
                ).toLocaleString("en-UK")}
              </Text>
            </>
          ) : null}
        </Card>
      </Skeleton>

      {/* Customer Add drawer */}
      <Drawer
        opened={variables.addDrawer}
        onClose={() => setVariables({ ...variables, addDrawer: false })}
        title="Add Customer"
        classNames={{
          header: classes.header,
          drawer: classes.drawer,
          closeButton: classes.closeButton,
        }}
        size="xl"
        position="right"
      >
        {/* Drawer content */}
        <div className="zc-p-3">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div></div>
            <Button
              variant="outline"
              color="zevcore"
              size="xs"
              onClick={() =>
                setVariables({
                  ...variables,
                  bulkDrawer: true,
                  addDrawer: false,
                })
              }
            >
              Bulk Import
            </Button>
          </div>
          <ScrollArea
            style={{ height: 520 }}
            type="scroll"
            offsetScrollbars
            scrollbarSize={5}
          >
            <div className="zc-pr-3 zc-pl-3">
              {/* Customer adding form name */}
              <form onSubmit={form.onSubmit((values) => AddCustomer(values))}>
                <TextInput
                  variant="filled"
                  value={form.values.name}
                  label="Customer Name"
                  placeholder="Customer Name"
                  {...form.getInputProps("name")}
                />
                <TextInput
                  required
                  variant="filled"
                  value={form.values.phone_number}
                  label="Phone Number"
                  placeholder="Phone Number"
                  {...form.getInputProps("phone_number")}
                />
                <NumberInput
                  variant="filled"
                  value={form.values.credit_limit}
                  label="Credit Limit"
                  placeholder="Credit Limit"
                  {...form.getInputProps("credit_limit")}
                />
                <TextInput
                  variant="filled"
                  value={form.values.gstin}
                  label="Customer GSTIN"
                  placeholder="Customer GSTIN"
                  {...form.getInputProps("gstin")}
                />
                <TextInput
                  variant="filled"
                  value={form.values.door_no}
                  label=" Door No"
                  placeholder=" Door No"
                  {...form.getInputProps("door_no")}
                />

                <TextInput
                  variant="filled"
                  value={form.values.street}
                  label=" Street"
                  placeholder=" Street"
                  {...form.getInputProps("street")}
                />
                <NumberInput
                  variant="filled"
                  value={form.values.pincode}
                  label="Pincode"
                  placeholder="Pincode"
                  {...form.getInputProps("pincode")}
                />
                <TextInput
                  variant="filled"
                  value={form.values.locality}
                  label=" Locality"
                  placeholder=" Locality"
                  {...form.getInputProps("locality")}
                />
                <TextInput
                  variant="filled"
                  value={form.values.city}
                  label=" City"
                  placeholder=" City"
                  {...form.getInputProps("city")}
                />
                <TextInput
                  variant="filled"
                  value={form.values.state}
                  label=" State"
                  placeholder=" State"
                  {...form.getInputProps("state")}
                />
                <Button
                  mt="xl"
                  mb={60}
                  type="submit"
                  fullWidth
                  color="zevcore"
                  loading={variables.submitLoading}
                >
                  Submit
                </Button>
              </form>
            </div>
          </ScrollArea>
        </div>
      </Drawer>
      {/* Customer add drawer end */}

      {/* Customer Edit drawer */}
      <Drawer
        opened={variables.openEdit}
        onClose={() => setVariables({ ...variables, openEdit: false })}
        title="Add Customer"
        classNames={{
          header: classes.header,
          drawer: classes.drawer,
          closeButton: classes.closeButton,
        }}
        size="xl"
        position="right"
      >
        {/* Drawer content */}
        <div className="zc-p-3">
          <ScrollArea
            style={{ height: 520 }}
            type="scroll"
            offsetScrollbars
            scrollbarSize={5}
          >
            <div className="zc-pr-3 zc-pl-3">
              {/* Customer adding form name */}
              <form
                onSubmit={formEdit.onSubmit((values) => EditCustomer(values))}
              >
                <TextInput
                  variant="filled"
                  value={formEdit.values.name}
                  label="Customer Name"
                  placeholder="Customer Name"
                  {...formEdit.getInputProps("name")}
                />
                <TextInput
                  required
                  variant="filled"
                  value={formEdit.values.phone_number}
                  label="Phone Number"
                  placeholder="Phone Number"
                  {...formEdit.getInputProps("phone_number")}
                />
                <NumberInput
                  variant="filled"
                  value={formEdit.values.credit_limit}
                  label="Credit Limit"
                  placeholder="Credit Limit"
                  {...formEdit.getInputProps("credit_limit")}
                />
                <TextInput
                  variant="filled"
                  value={formEdit.values.gstin}
                  label="Customer GSTIN"
                  placeholder="Customer GSTIN"
                  {...formEdit.getInputProps("gstin")}
                />
                <TextInput
                  variant="filled"
                  value={formEdit.values.door_no}
                  label=" Door No"
                  placeholder=" Door No"
                  {...formEdit.getInputProps("door_no")}
                />

                <TextInput
                  variant="filled"
                  value={formEdit.values.street}
                  label=" Street"
                  placeholder=" Street"
                  {...formEdit.getInputProps("street")}
                />
                <NumberInput
                  variant="filled"
                  value={formEdit.values.pincode}
                  label="Pincode"
                  placeholder="Pincode"
                  {...formEdit.getInputProps("pincode")}
                />
                <TextInput
                  variant="filled"
                  value={formEdit.values.locality}
                  label=" Locality"
                  placeholder=" Locality"
                  {...formEdit.getInputProps("locality")}
                />
                <TextInput
                  variant="filled"
                  value={formEdit.values.city}
                  label=" City"
                  placeholder=" City"
                  {...formEdit.getInputProps("city")}
                />
                <TextInput
                  variant="filled"
                  value={formEdit.values.state}
                  label=" State"
                  placeholder=" State"
                  {...formEdit.getInputProps("state")}
                />
                <Button
                  mt="xl"
                  mb={60}
                  type="submit"
                  fullWidth
                  color="zevcore"
                  loading={variables.submitLoading}
                >
                  Update
                </Button>
              </form>
            </div>
          </ScrollArea>
        </div>
      </Drawer>
      {/* Customer edit drawer end */}

      {/* Customer Bulk drawer */}
      <Drawer
        opened={variables.bulkDrawer}
        onClose={() => setVariables({ ...variables, bulkDrawer: false })}
        title="Customer Bulk"
        classNames={{
          header: classes.header,
          drawer: classes.drawer,
          closeButton: classes.closeButton,
        }}
        size="xl"
        position="right"
      >
        {/* Drawer content */}
        <div className="zc-p-3">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div></div>

            <div
              onClick={() => onDownload({ data: "customer" })}
              style={{
                backgroundColor: "rgba(0,0,0,0)",
                cursor: "pointer",
                paddingTop: 5,
              }}
            >
              <img
                src={excel}
                alt="excel"
                width="25"
                style={{ margin: "2px" }}
              />
            </div>
          </div>
          {/* Customer Bulk add file */}
          <label className="zc-custom-file-upload">
            <input type="file" ref={ref} onChange={bulkFile789} />
            <CloudUpload size={15}></CloudUpload> Upload Bulk Excel File
          </label>
          <Group position="right" mt="md">
            <Button
              color="zevcore"
              fullWidth
              style={{
                position: "relative",
                transition: "background-color 150ms ease",
              }}
              onClick={() => {
                loaded
                  ? setLoaded(false)
                  : !interval.active && interval.start();
                BulkDataUpload();
              }}
            >
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {progress !== 0
                  ? "Uploading Each Data...."
                  : loaded
                  ? "Bulk Upload Completed"
                  : "Upload files"}
              </div>
              {progress !== 0 && (
                <Progress
                  value={progress}
                  className={classes.progress}
                  color="zevcore"
                  radius="sm"
                />
              )}
            </Button>
          </Group>
        </div>
      </Drawer>
      <GoldCustomer
        value={goldValue}
        title={goldTitle}
        list={goldData}
        customerModal={customerModal}
        setCustomerModal={setCustomerModal}
      />
      {/* Customer Bulk drawer end */}
    </div>
  );
}
export default Customer;
