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
  Tabs,
  Paper,
  Grid,
} from "@mantine/core"; // Mantine all required compoennts imports list
import {
  BuildingBank,
  Check,
  CloudUpload,
  CurrencyRupee,
  Dots,
  Pencil,
  Search,
  Trash,
} from "tabler-icons-react"; // For import the icons
import { useForm } from "@mantine/form"; // Mantine form import
import { CSVLink } from "react-csv"; // For export the data to excel format
import {
  handleAddBankLedger,
  handleAddCash,
  handleBulkCash,
  handleDeleteBankLedger,
  handleDeleteCash,
  handleEditBank,
  handleEditBankLedger,
  handleEditCash,
  handleGetBank,
  handleGetBankLedger,
  handleGetCash,
} from "../../helpers/apis"; // Import for axios requests list for this pages
import notificationHelper from "../../helpers/notification"; // Import notification for this page
import { Th, dataSearch, setSorting, print } from "../../helpers/tableFunction"; // For table data functions
import { dataSlice, onDownload, selectFilter } from "../../helpers/common"; // Common fuctions uses for applications
import { useModals } from "@mantine/modals"; // Modal from mantine
import excel from "../../assets/images/excel.png"; // Image for excel export
import pdf from "../../assets/images/pdf.png"; // Image for pdf exports
import { useInterval } from "@mantine/hooks";
import readXlsxFile from "read-excel-file";
import { DatePicker } from "@mantine/dates";
import { useNavigate } from "react-router-dom";

function Cash() {
  // Mantine custome style use
  const { classes } = useStyles();
  const modals = useModals();
  let navigate = useNavigate();
  // Setting the variables data for table data
  const [filter, setFilter] = useState(null);
  const [sortedData, setSortedData] = useState([]); // For table data
  const [bank, setBank] = useState([]); // For table data
  const [activePage, setPage] = useState(1); // For set table active page
  const [total, setTotal] = useState(10); // For set total list show in page
  const [search, setSearch] = useState(""); // For set the search value name of table
  const [sortBy, setSortBy] = useState(null); // Seting the sortby table type
  const [reverseSortDirection, setReverseSortDirection] = useState(false); // For set the reverse sort direction
  const [refreshTable, setRefreshTable] = useState(Date.now()); // For refresh table

  // Setting the variables data list here
  const [variables, setVariables] = useState({
    skeletonLoading: true,
    submitLoading: false,
    data: [],
    bankList: [],
    addDrawer: false,
    bulkDrawer: false,
    openEdit: false,
    deleteIndex: 0,
  });

  // For form validation
  const form = useForm({
    initialValues: {
      label: "",
      bank_id: "",
      date: new Date(),
      transaction_type: "",
      amount: 0,
    },
  });

  //   For edit form data validation
  const formEdit = useForm({
    initialValues: {
      label: "",
      bank_id: "",
      date: new Date(),
      transaction_type: "",
      amount: 0,
    },
  });

  //   For intial setting data
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (mounted) {
        //   For get all the brand data list
        const response = await handleGetBankLedger();

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

        const response2 = await handleGetBank();

        // On Respose setting the data to variable
        if (response2.status === 200) {
          const listGroup = await selectFilter({
            data: response2.data.data,
          });
          setVariables((variables) => {
            return {
              ...variables,
              bankList: listGroup,
            };
          });
          setBank(response2.data.data);
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

      <td>{row.transaction_type == "Deposit" ? row.amount : ""}</td>
      <td>{row.transaction_type == "Withdrawer" ? row.amount : ""}</td>

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
      title: "Do you want to delete this cash value",
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleConfirmDelete(e),
    });
  };
  //   For delete db data from table and db
  const handleConfirmDelete = async (e) => {
    const response = await handleDeleteBankLedger(e);
    // Check the response for notification and actions

    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Cash deleted successfully",
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
    formEdit.setFieldValue("label", datas.label);
    formEdit.setFieldValue("amount", Number(datas.amount));
    formEdit.setFieldValue("date", new Date(datas.date));
    formEdit.setFieldValue("bank_id", datas.bank_id.toString());
    formEdit.setFieldValue("transaction_type", datas.transaction_type);
    setVariables({ ...variables, deleteIndex: e, openEdit: true });
  };

  // Edit brand data compoennt
  const EditCash = async (e) => {
    setVariables({ ...variables, submitLoading: true });
    const response = await handleEditBankLedger(e);
    // Check for respose data for actions
    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Bank updated successfully",
      });
      setVariables({
        ...variables,
        submitLoading: false,
        data: response.data.data[0],
      });
      const datas = dataSlice({
        data: response.data.data[0],
        page: activePage,
        total: total,
      });
      setBank(response.data.data[1]);
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

  // Add new brand data
  const AddCash = async (e) => {
    setVariables({ ...variables, submitLoading: true });
    const response = await handleAddBankLedger(e);
    // Check for response for actions
    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Cash added successfully",
      });
      console.log(response.data.data);
      form.reset();
      setVariables({
        ...variables,
        submitLoading: false,
        data: response.data.data,
      });
      const datas = dataSlice({
        data: response.data.data[0],
        page: activePage,
        total: total,
      });
      setBank(response.data.data[1]);
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

  const filterDate = (e) => {
    setFilter(e);
    var datas = variables.data;
    console.log(e);
    datas = datas.filter(function (item) {
      console.log(item["bank_id"]);

      if (Number(item["bank_id"]) == Number(e)) {
        return true;
      }
    });
    console.log(datas);
    const datas2 = dataSlice({
      data: datas,
      page: activePage,
      total: total,
    });
    setSortedData(datas2);
  };

  return (
    <div>
      {/* For breadcrumbs */}
      <Skeleton radius="md" visible={variables.skeletonLoading}>
        <BreadCrumb Text="Bank" />
      </Skeleton>

      {/* Main start here */}
      <Skeleton radius="md" visible={variables.skeletonLoading}>
        <Card className="border">
          <Tabs
            color="zevcore"
            variant="outline"
            defaultValue="banking"
            onTabChange={(value) => navigate(`/cash`)}
          >
            <Tabs.List>
              <Tabs.Tab value="cash">Cash</Tabs.Tab>
              <Tabs.Tab value="banking">Banking</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="banking" pt="xs">
              <Grid mb={15}>
                {bank.map((row, index) => (
                  <Grid.Col span={2} mt={5}>
                    <Card
                      shadow="sm"
                      p="lg"
                      radius="md"
                      withBorder
                      onClick={() => filterDate(row.value)}
                      className={
                        filter == row.value
                          ? classes.BankBoxActive
                          : classes.BankBox
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          marginTop: 5,
                        }}
                      >
                        <Check className={classes.bankIcon2} size={15} />
                        <BuildingBank size={30} strokeWidth="0.9" />
                        <Text style={{ fontSize: "18px", marginTop: 4 }}>
                          {row.label}
                        </Text>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          marginTop: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "25px",
                            marginTop: -4,
                            marginRight: 2,
                          }}
                        >
                          ₹{" "}
                        </Text>
                        <Text style={{ fontSize: "25px", marginTop: -4 }}>
                          {row.amount}
                        </Text>
                      </div>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
              <ScrollArea>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
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
                      {/* Drawer open for adding new brand data */}
                      <Button
                        variant="outline"
                        color="zevcore"
                        size="xs"
                        onClick={() =>
                          setVariables({ ...variables, addDrawer: true })
                        }
                      >
                        + Add Banking
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
                      <Th>Date</Th>
                      <Th>Name</Th>
                      <Th>Deposit</Th>
                      <Th>Withdrawer</Th>

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
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
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
            </Tabs.Panel>
          </Tabs>
        </Card>
      </Skeleton>

      {/* Cash Add drawer */}
      <Drawer
        opened={variables.addDrawer}
        onClose={() => setVariables({ ...variables, addDrawer: false })}
        title="Add Cash"
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
          {/* Cash adding form name */}
          <form onSubmit={form.onSubmit((values) => AddCash(values))}>
            <TextInput
              variant="filled"
              value={form.values.label}
              label="Name"
              placeholder="Enter Name"
              {...form.getInputProps("label")}
            />
            <DatePicker
              placeholder="Transaction Date"
              label="Transaction Date"
              required
              {...form.getInputProps("date")}
              defaultValue={new Date()}
            />
            <Select
              variant="filled"
              label="Transaction type"
              required
              placeholder="Transaction type"
              data={[
                { value: "Deposit", label: "Deposit" },
                { value: "Withdrawer", label: "Withdrawer" },
              ]}
              {...form.getInputProps("transaction_type")}
            />
            <Select
              required
              variant="filled"
              classNames={{ item: classes.selectItem }}
              label="Select Bank"
              searchable
              clearable
              mb="md"
              placeholder="Select Bank"
              {...form.getInputProps("bank_id")}
              data={variables.bankList}
            />
            <NumberInput
              variant="filled"
              required
              value={form.values.amount}
              label=" Amount"
              placeholder="Enter Amount"
              {...form.getInputProps("amount")}
            />
            <Button
              mt="xl"
              type="submit"
              fullWidth
              color="zevcore"
              loading={variables.submitLoading}
            >
              Submit
            </Button>
          </form>
        </div>
      </Drawer>
      {/* Cash add drawer end */}

      {/* Cash Edit drawer */}
      <Drawer
        opened={variables.openEdit}
        onClose={() => setVariables({ ...variables, openEdit: false })}
        title="Add Cash"
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
          {/* Cash adding form name */}
          <form onSubmit={formEdit.onSubmit((values) => EditCash(values))}>
            <TextInput
              variant="filled"
              value={formEdit.values.label}
              label="Name"
              placeholder="Enter Name"
              {...formEdit.getInputProps("label")}
            />
            <DatePicker
              placeholder="Transaction Date"
              label="Transaction Date"
              required
              {...formEdit.getInputProps("date")}
              defaultValue={new Date()}
            />
            <Select
              variant="filled"
              label="Transaction type"
              required
              placeholder="Transaction type"
              data={[
                { value: "Deposit", label: "Deposit" },
                { value: "Withdrawer", label: "Withdrawer" },
              ]}
              {...formEdit.getInputProps("transaction_type")}
            />
            <Select
              required
              variant="filled"
              classNames={{ item: classes.selectItem }}
              label="Select Bank"
              searchable
              clearable
              mb="md"
              placeholder="Select Bank"
              {...formEdit.getInputProps("bank_id")}
              data={variables.bankList}
            />
            <NumberInput
              variant="filled"
              required
              value={formEdit.values.amount}
              label=" Amount"
              placeholder="Enter Amount"
              {...formEdit.getInputProps("amount")}
            />
            <Button
              mt="xl"
              type="submit"
              fullWidth
              color="zevcore"
              loading={variables.submitLoading}
            >
              Submit
            </Button>
          </form>
        </div>
      </Drawer>
      {/* Cash edit drawer end */}
    </div>
  );
}
export default Cash;
