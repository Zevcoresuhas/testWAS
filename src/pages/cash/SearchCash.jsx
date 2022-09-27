import React, { useState, useEffect, useRef } from "react";
import BreadCrumb from "../../components/BreadCrumb"; // For breadcrumbs data import
import useStyles from "../../components/Style"; // Import the mantine custome styles from the compoents
import {
  Skeleton,
  Card,
  TextInput,
  Group,
  Text,
  Button,
  Drawer,
  Table,
  ScrollArea,
  NativeSelect,
  Pagination,
  Menu,
  ActionIcon,
  Progress,
  Select,
  NumberInput,
  Grid,
} from "@mantine/core"; // Mantine all required compoennts imports list
import { CloudUpload, Dots, Pencil, Search, Trash } from "tabler-icons-react"; // For import the icons
import { useForm } from "@mantine/form"; // Mantine form import
import { CSVLink } from "react-csv"; // For export the data to excel format
import {
  handleSearch,
  handleAddCash,
  handleBulkCash,
  handleDeleteCash,
  handleEditCash,
  handleGetCash,
} from "../../helpers/apis"; // Import for axios requests list for this pages
import notificationHelper from "../../helpers/notification"; // Import notification for this page
import { Th, dataSearch, setSorting, print } from "../../helpers/tableFunction"; // For table data functions
import { dataSlice, onDownload } from "../../helpers/common"; // Common fuctions uses for applications
import { useModals } from "@mantine/modals"; // Modal from mantine
import excel from "../../assets/images/excel.png"; // Image for excel export
import pdf from "../../assets/images/pdf.png"; // Image for pdf exports
import { useInterval } from "@mantine/hooks";
import readXlsxFile from "read-excel-file";
import { DatePicker } from "@mantine/dates";

function Cash() {
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
  const [income, setIncome] = useState("");
  const [expense, setExpense] = useState("");

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

  // For form validation
  const form = useForm({
    initialValues: {
      transaction_type: "Both",
      from: new Date(),
      to: new Date(),
    },
  });

  //   For intial setting data
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (mounted) {
        //   For get all the brand data list
        const response = await handleGetCash();

        // On Respose setting the data to variable
        if (response.status === 200) {
          setVariables({
            ...variables,
            data: response.data.data,
            skeletonLoading: false,
          });

          var data_check = response.data.data;
          var income = 0;
          var expense = 0;
          for (let i = 0; i < data_check.length; i++) {
            if (data_check[i].transaction_type == "Income") {
              income += Number(data_check[i].amount);
            } else {
              expense += Number(data_check[i].amount);
            }
          }
          setExpense(expense);
          setIncome(income);
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

      <td>{new Date(row.date).toLocaleDateString("en-UK")}</td>
      <td>{row.label}</td>
      <td>{row.transaction_type}</td>
      <td>{row.amount}</td>
      <td>{new Date(row.createdAt).toLocaleDateString("en-UK")}</td>
    </tr>
  ));

  // Add new brand data
  const handleAdd = async (e) => {
    setVariables({ ...variables, submitLoading: true });
    const response = await handleSearch(e);
    // Check for response for actions

    // On Respose setting the data to variable
    if (response.status === 200) {
      setVariables({
        ...variables,
        data: response.data.data,
        skeletonLoading: false,
      });

      var data_check = response.data.data;
      var income = 0;
      var expense = 0;
      for (let i = 0; i < data_check.length; i++) {
        if (data_check[i].transaction_type == "Income") {
          income += Number(data_check[i].amount);
        } else {
          expense += Number(data_check[i].amount);
        }
      }
      setExpense(expense);
      setIncome(income);
      const datas = dataSlice({
        data: response.data.data,
        page: 1,
        total: 10,
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

  return (
    <div>
      {/* For breadcrumbs */}
      <Skeleton radius="md" visible={variables.skeletonLoading}>
        <BreadCrumb Text="Cash" />
      </Skeleton>

      {/* Search card */}
      <Skeleton radius="md" visible={variables.skeletonLoading}>
        <Card className="border">
          <div>
            <h4>Search Cash Ledger</h4>

            <form onSubmit={form.onSubmit((values) => handleAdd(values))}>
              <Grid grow gutter="xs">
                <Grid.Col span={4}>
                  <DatePicker
                    placeholder="From Date"
                    label="From Date"
                    value={form.values.from}
                    required
                    {...form.getInputProps("from")}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <DatePicker
                    placeholder="To Date"
                    label="To Date"
                    value={form.values.to}
                    required
                    {...form.getInputProps("to")}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Select
                    variant="filled"
                    label="Transaction type"
                    zIndex={9999}
                    required
                    value={form.values.transaction_type}
                    placeholder="Transaction type"
                    data={[
                      { value: "Income", label: "Income" },
                      { value: "Expense", label: "Expense" },
                      { value: "Both", label: "Both" },
                    ]}
                    {...form.getInputProps("transaction_type")}
                  />
                </Grid.Col>
              </Grid>
              <Group position="right" mt="md">
                <Button
                  type="submit"
                  leftIcon={<Search size={14} />}
                  color="gold"
                  loading={variables.submitLoading}
                >
                  Search
                </Button>
              </Group>
            </form>
          </div>
        </Card>
      </Skeleton>

      <Skeleton radius="md" visible={variables.skeletonLoading}>
        <Grid grow gutter="xs" mt={10} mb={10}>
          <Grid.Col span={4}>
            <Card className="border">
              <div>
                <h4>TOTAL INCOME</h4>
                <h1>{income}</h1>
              </div>
            </Card>
          </Grid.Col>
          <Grid.Col span={4}>
            <Card className="border">
              <div>
                <h4>TOTAL EXPENSE</h4>
                <h1>{expense}</h1>
              </div>
            </Card>
          </Grid.Col>
          <Grid.Col span={4}>
            <Card className="border">
              <div>
                <h4>BALANCE</h4>
                <h1>{income - expense}</h1>
              </div>
            </Card>
          </Grid.Col>
        </Grid>
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
                  <Text>Exports :</Text>
                  <CSVLink
                    data={variables.data}
                    headers={[{ label: " Cash Name", key: "label" }]}
                    filename="brand.csv"
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
                        header: ["Cash Name", "Id"],
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
                  <Th>Date</Th>
                  <Th>Name</Th>
                  <Th>Transaction Type</Th>
                  <Th>Amount</Th>
                  <Th>Created At</Th>
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
              <Text size="sm" className="zc-pr-3 zc-pt-1">
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
    </div>
  );
}
export default Cash;
