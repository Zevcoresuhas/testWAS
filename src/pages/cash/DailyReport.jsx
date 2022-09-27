/* 
Project name: Zevgold APOS
Author: Zevcore Private Limited
Description: Zevcore Private Limited Zevgold APOS style css file
Created Date: 12/04/2022
Version: 1.0
Required: React and mantine
*/

import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useCallback,
} from "react";
import BreadCrumb from "../../components/BreadCrumb";
import { useLocation, useNavigate, Navigate } from "react-router-dom"; // for import react dom navigation components
import axios from "axios";

// Mantine library
import {
  CloudUpload,
  Dots,
  Pencil,
  Trash,
  X,
  Check,
  check,
  FileSearch,
  ListSearch,
} from "tabler-icons-react";
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
  Grid,
  TextInput,
  Menu,
  NativeSelect,
  ActionIcon,
  Progress,
  Skeleton,
  Input,
  Tabs,
  Select,
  useMantineTheme,
  Avatar,
  Modal,
} from "@mantine/core"; //for import mantine required functions and theme
import { DatePicker } from "@mantine/dates";
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

// for image crop
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import {
  Dropzone,
  DropzoneStatus,
  MIME_TYPES,
  IMAGE_MIME_TYPE,
} from "@mantine/dropzone";

import Pdf from "react-to-pdf";
const ref2 = React.createRef();

// For custom mantine theme write here
//for   made mantine theme style change and write custome theme here
const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },
  control: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    "&:hover": {
      backgroundColor: theme.colors.orange[0],
    },
  },
  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },

  // table hover and stripped effect css right here
  striped: {
    "thead tr th button:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
    tbody: {
      border: "1px solid rgba(180, 180, 180,0.5)",
    },
    "thead tr th": {
      border: "1px solid rgba(180, 180, 180,0.5)",
      fontSize: 12,
    },
    "tbody tr td": {
      border: "1px solid rgba(180, 180, 180,0.5)",
      fontSize: 12,
    },
    "tbody tr:nth-of-type(odd)": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
    },
    "tbody tr:hover , table tr:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gold[0],
    },
    "tbody tr:last-child,tbody tr:nth-last-child(2)": {
      fontWeight: 600,
    },
  },
  button: {
    position: "relative",
    transition: "background-color 150ms ease",
  },

  progress: {
    position: "absolute",
    bottom: -1,
    right: -1,
    left: -1,
    top: -1,
    height: "auto",
    backgroundColor: "transparent",
    zIndex: 0,
  },

  label: {
    position: "relative",
    zIndex: 1,
  },
}));

// For table header sorting style write
function Th({ children, reversed, sorted, onSort }) {
  const { classes } = useStyles();
  const Icon = sorted ? (reversed ? ChevronUp : ChevronDown) : Selector;
  return (
    <th className={classes.th}>
      {typeof sorted !== "undefined" ? (
        <>
          <UnstyledButton onClick={onSort} className={classes.control}>
            <Group position="apart">
              <Text weight={500} size="sm">
                {children}
              </Text>
              <Center className={classes.icon}>
                <Icon size={14} />
              </Center>
            </Group>
          </UnstyledButton>
        </>
      ) : (
        <UnstyledButton className={classes.control}>
          <Text weight={500} size="sm">
            {children}
          </Text>
        </UnstyledButton>
      )}
    </th>
  );
}

// For Search table data
function filterData(data, search) {
  const keys = Object.keys(data[0]);
  const query = search.toString().toLowerCase().trim();
  return data.filter((item) =>
    keys.some((key) => {
      if (key !== "id") {
        if (item[key] !== null && item[key] !== "") {
          return item[key].toString().toLowerCase().includes(query);
        }
      }
    })
  );
}

// For sorting down data by its name
function sortData(data, payload) {
  if (!payload.sortBy) {
    return filterData(data, payload.search);
  }
  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[payload.sortBy].localeCompare(a[payload.sortBy]);
      }
      return a[payload.sortBy].localeCompare(b[payload.sortBy]);
    }),
    payload.search
  );
}

function SearchCash() {
  // Initial settings for token and backend urls datas
  const [token, setToken] = useState(localStorage.getItem("token")); //get saved local storage data
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [URL, setURL] = useState(process.env.REACT_APP_BACKEND_URL);
  const [URLFILE, setURLFILE] = useState(process.env.REACT_APP_FILE);
  let navigate = useNavigate();

  // Variables set for react
  const [opened, setOpened] = useState(false); //for open side add
  const [submitLoading, setSubmitLoading] = useState(false); //for set submit true or false for loding effects
  const [data, setData] = useState([]);

  const [openedEdit, setOpenedEdit] = useState(false); //for open side add
  const [editLoading, setEditLoading] = useState(false);

  // For bulk import
  const [openedBulk, setOpenedBulk] = useState(false);
  const [bulkData, setBulkData] = useState([]);
  const ref = useRef();
  const [income, setIncome] = useState("");
  const [expense, setExpense] = useState("");
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  //   For theme get variable functions
  const { classes, theme } = useStyles();
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [activePage, setPage] = useState(1);
  const [pagination, setPagination] = useState(1);
  const [total, setTotal] = useState(10);

  const modals = useModals();
  const [deleteIndex, setDeleteIndex] = useState(0);
  const [refreshTable, setRefreshTable] = useState(Date.now());
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  useEffect(() => {}, [refreshTable]);

  // For get all data                                                       Get data
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      await axios
        .get(URL + "cash_ledger_today", config)
        .then((response) => {
          if (mounted) {
            var data_check = response.data.data;
            var income = 0;
            var expense = 0;
            var new_array = [];
            for (let i = 0; i < data_check.length; i++) {
              if (data_check[i].transaction_type == "Income") {
                new_array[i] = {
                  label: data_check[i].label,
                  amount: data_check[i].amount,
                  amount2: "",
                };
                income += Number(data_check[i].amount);
              } else {
                expense += Number(data_check[i].amount);
                new_array[i] = {
                  label: data_check[i].label,
                  amount: "",
                  amount2: data_check[i].amount,
                };
              }
            }

            setExpense(expense);
            setIncome(income);

            var datas = new_array.concat([
              { label: "Total", amount: income, amount2: expense },
              { label: "Balance", amount: "", amount2: income - expense },
            ]);
            setData(datas);

            datas = datas.slice(
              (activePage - 1) * total,
              (activePage - 1) * total + total
            );

            setSortedData(datas);
            setSkeletonLoading(false);
          }
        })
        .catch((error) => {
          // Display the notification bar from backend response
          showNotification({
            id: "load-data",
            color: "red",
            title: "Data Fetch Error",
            message:
              "Server not responding, Please try again after some time..",
            icon: <X />,
            autoclose: 6000,
            style: { borderRadius: 10 },
          });
          setSkeletonLoading(false);
        });
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // For adding data form                                                     Add data
  const form = useForm({
    initialValues: {
      from: new Date(),
      to: new Date(),
      type: "Both",
    },
  });

  // Submit data to backend nodejs
  const handleAdd = (e) => {
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

    // Set config of token
    const config = {
      headers: {
        "x-access-token": token,
      },
    };
    var fromDate = new Date(e.from);
    var toDate = new Date(e.from);

    // Main axios part for sending data to backend adding cash data
    axios
      .post(
        URL + "cash_ledger_search",
        {
          from: new Date(fromDate.setDate(fromDate.getDate())),
          to: new Date(toDate.setDate(toDate.getDate())),
          type: e.type,
        },
        config
      )
      .then((response) => {
        // For set added data to table array

        var data_check = response.data.data;
        var income = 0;
        var expense = 0;
        var new_array = [];
        for (let i = 0; i < data_check.length; i++) {
          if (data_check[i].transaction_type == "Income") {
            new_array[i] = {
              label: data_check[i].label,
              amount: data_check[i].amount,
              amount2: "",
            };
            income += Number(data_check[i].amount);
          } else {
            expense += Number(data_check[i].amount);
            new_array[i] = {
              label: data_check[i].label,
              amount: "",
              amount2: data_check[i].amount,
            };
          }
        }
        setExpense(expense);
        setIncome(income);

        var datas = new_array.concat([
          { label: "Total", amount: income, amount2: expense },
          { label: "Balance", amount: "", amount2: income - expense },
        ]);
        setData(datas);

        setPage(1);
        setRefreshTable(new Date());

        // Clear all fields
        // form.reset();

        // Set loading effect animation
        setSubmitLoading(false);
        updateNotification({
          id: "load-data",
          color: "teal",
          title: "Data Save",
          message: "New Cash Field Added Successfully",
          icon: <Check />,
        });
      })
      .catch((error) => {
        // Set loading effect animation
        setSubmitLoading(false);
        updateNotification({
          id: "load-data",
          color: "red",
          title: "Data Save Error",
          message: error.response.data.message,
          icon: <X />,
        });
      });
  };

  //   Table functions list                                                               Table
  //for sorting thead data
  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    var datas = sortData(data, { sortBy: field, reversed, search });
    datas = datas.slice(
      (activePage - 1) * total,
      (activePage - 1) * total + total
    );
    setSortedData(datas);
    setRefreshTable(new Date());
  };

  //   For search particular data in table
  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setPage(1);

    var datas = sortData(data, {
      sortBy,
      reversed: reverseSortDirection,
      search: value,
    });

    datas = datas.slice(
      (activePage - 1) * total,
      (activePage - 1) * total + total
    );
    setSortedData(datas);
    setRefreshTable(new Date());
  };

  //   Set all row data actions and mapping
  const rows = data.map((row, index) => (
    <tr key={row.label}>
      <td>{index + 1} </td>
      <td>{row.label} </td>
      <td>{row.amount} </td>
      <td>{row.amount2} </td>
    </tr>
  ));

  //   Settings the cash excel key names for header                                                   Bulk Export
  const [headers, setHeaders] = useState([
    { label: "Label", key: "label" },
    { label: "Income", key: "amount" },
    { label: "Expense", key: "amount2" },
  ]);

  //   geenrating pdf file for downloading the data with header defines
  const print = () => {
    const doc = new jsPDF();
    var body = [...data.map((el) => [el.label, el.amount, el.amount2])];
    doc.autoTable({
      head: [["Label", "Income", "Expense"]],
      body: body,
    });
    doc.save("cash.pdf");
  };

  // Bulk import                                                                                 Bulk import
  const onDownload = () => {
    const link = document.createElement("a");
    link.href = URLFILE + "cash_leadger.xlsx";
    link.click();
  };

  const bulkFile789 = (event) => {
    let xlsxfile = event.target.files ? event.target.files[0] : null;
    var data = [];
    readXlsxFile(xlsxfile).then((rows) => {
      data = rows;
      setBulkData(data);
    });
    ref.current.value = "";
  };

  const BulkDataUpload = () => {
    const config = {
      headers: {
        "x-access-token": token,
      },
    };
    axios
      .post(
        URL + "cash_ledger_bulk",
        {
          data_list: bulkData,
        },
        config
      )
      .then((response) => {
        interval.stop();
        setLoaded(true);
        navigate("/save", { state: { from: "/add_cash" } });
      })
      .catch((error) => {
        interval.stop();
        setLoaded(true);
      });
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
  const options = {
    orientation: "landscape",
  };
  return (
    <div>
      {/* Bread crumbs */}
      <Skeleton
        height="100%"
        width="100%"
        radius="md"
        visible={skeletonLoading}
      >
        <BreadCrumb Text="Search Cash Ledger" />
      </Skeleton>
      <Space h="md" />

      {/* Search card */}
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
          <div>
            <h4>Search Cash Ledger</h4>

            <form onSubmit={form.onSubmit((values) => handleAdd(values))}>
              <Grid grow gutter="xs">
                <Grid.Col span={12}>
                  <DatePicker
                    placeholder="From Date"
                    label="From Date"
                    value={form.values.from}
                    required
                    {...form.getInputProps("from")}
                  />
                </Grid.Col>
              </Grid>
              <Group position="right" mt="md">
                <Button
                  type="submit"
                  leftIcon={<Search size={14} />}
                  color="gold"
                  loading={submitLoading}
                >
                  Search
                </Button>
              </Group>
            </form>
          </div>
        </Card>
      </Skeleton>

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
        {/* Main page start from here */}
        <Card shadow="sm" mt={10} p="lg">
          <div>
            {/* Table view start */}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4>Transactions List</h4>

              <div>
                <Group spacing="xs">
                  <Text>Exports :</Text>
                  <CSVLink
                    data={data}
                    headers={headers}
                    filename="cash.csv"
                    className={classes.pdfExcel}
                  >
                    <img
                      src={excel}
                      alt=""
                      width="25"
                      style={{ margin: "2px" }}
                    />
                  </CSVLink>
                  <button className={classes.pdfExcel} onClick={print}>
                    <img
                      src={pdf}
                      alt=""
                      width="19"
                      style={{ margin: "2px" }}
                    />
                  </button>
                </Group>
              </div>
            </div>

            <div ref={ref2}>
              <Table
                horizontalSpacing="md"
                verticalSpacing="xs"
                className={classes.striped}
              >
                <thead>
                  <tr>
                    <Th>Sl.No </Th>
                    <Th>Label </Th>
                    <Th>Income</Th>
                    <Th>Expense</Th>
                  </tr>
                </thead>
                <tbody key={refreshTable}>
                  {rows.length > 0 ? (
                    rows
                  ) : (
                    <tr>
                      <td>-</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </Card>
      </Skeleton>
      {/* Main data end here */}
    </div>
  );
}

export default SearchCash;
