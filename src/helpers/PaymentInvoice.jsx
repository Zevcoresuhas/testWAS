import React, { useState, useEffect } from "react";
import {
  Grid,
  Table,
  Text,
  Paper,
  Tabs,
  Card,
  Avatar,
  Modal,
  ActionIcon,
  Button,
  NativeSelect,
  Pagination,
  Skeleton,
  Select,
  TextInput,
  Divider,
  NumberInput,
} from "@mantine/core";
import { openModal, closeAllModals } from "@mantine/modals";
import { DatePicker } from "@mantine/dates";
import { Link } from "react-router-dom";
import { dataSlice, nFormatter } from "./common";
import { Box, Receipt, X } from "tabler-icons-react";
import useStyles from "../components/Style";
import ReactApexChart from "react-apexcharts";
import {
  handelGetPayments,
  handleAddJournal,
  handleAddPayment,
  handleGetBank,
  handleGetOneInvoice,
  handleGetProductHistoryDate,
  handleGetSaleType,
} from "./apis";
import { useForm } from "@mantine/form";

function PaymentInvoice({ value, title, list, paymentModal, setPaymentModal }) {
  const [data, setData] = useState("");
  const { classes } = useStyles();
  const [listData, setListData] = useState([]);
  const [date1, setDate1] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [refreshChart, setRefreshChart] = useState(Date.now());
  // Setting the variables data for table data
  const [sortedData, setSortedData] = useState([]); // For table data
  const [activePage, setPage] = useState(1); // For set table active page
  const [total, setTotal] = useState(10); // For set total list show in page
  const [search, setSearch] = useState(""); // For set the search value name of table
  const [sortBy, setSortBy] = useState(null); // Seting the sortby table type
  const [reverseSortDirection, setReverseSortDirection] = useState(false); // For set the reverse sort direction
  const [refreshTable, setRefreshTable] = useState(Date.now()); // For refresh table
  const [saleType, setSaleType] = useState([]);
  const [banks, setBanks] = useState([]);
  const [payments, setPayments] = useState([]);
  const [journal, setJournal] = useState([]);
  const [confirmModal, setConfirmModal] = useState(false);

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
      invoice_id: "",
      payment_mode: "",
      amount_paid: 0,
      balance: 0,
      customer_id: "",
      date: new Date(),
    },
  });

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (list != "" && typeof list != "undefined") {
        console.log(list);
        setData(list);
        const datas = dataSlice({
          data: list.invoice_items,
          page: 1,
          total: 10,
        });
        form.setFieldValue("balance", Number(list.balance));
        form.setFieldValue("invoice_id", list.value);
        form.setFieldValue("customer_id", list.customer_id);
        setSortedData(list.invoice_items);
        const response2 = await handleGetSaleType();
        if (response2.status === 200) {
          const listGroup = await response2.data.data.map((data) => ({
            value: data.label.toString(),
            label: data.label.toString(),
          }));
          setSaleType(listGroup);
        }

        const response5 = await handleGetBank();

        // On Respose setting the data to variable
        if (response5.status === 200) {
          const listGroup = await response5.data.data.map((data) => ({
            value: data.label.toString(),
            label: data.label.toString(),
          }));
          setBanks(listGroup);
        }

        const response6 = await handelGetPayments(list.value);
        console.log(response6);
        // On Respose setting the data to variable
        if (response6.status === 200) {
          setPayments(response6.data.data[0]);
          setJournal(response6.data.data[1]);
        }
        setRefreshTable(new Date());
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, [list]);

  const AddPayment = async (e) => {
    const response = await handleAddPayment(e);

    if (response.status == 200) {
      form.reset();
      const reg = {
        id: title,
      };
      const response1 = await handleGetOneInvoice(reg);
      if (response1.status == 200) {
        const list2 = response1.data.data;

        setData(list2);
        const datas = dataSlice({
          data: list2.invoice_items,
          page: 1,
          total: 10,
        });
        form.setFieldValue("balance", Number(list2.balance));
        form.setFieldValue("invoice_id", list2.value);
        form.setFieldValue("customer_id", list2.customer_id);
        setSortedData(list2.invoice_items);
        const response2 = await handleGetSaleType();
        if (response2.status === 200) {
          const listGroup = await response2.data.data.map((data) => ({
            value: data.label.toString(),
            label: data.label.toString(),
          }));
          setSaleType(listGroup);
        }

        const response5 = await handleGetBank();

        // On Respose setting the data to variable
        if (response5.status === 200) {
          const listGroup = await response5.data.data.map((data) => ({
            value: data.label.toString(),
            label: data.label.toString(),
          }));
          setBanks(listGroup);
        }

        const response6 = await handelGetPayments(list.value);
        console.log(response6);
        // On Respose setting the data to variable
        if (response6.status === 200) {
          setPayments(response6.data.data[0]);
          setJournal(response6.data.data[1]);
        }
        setRefreshTable(new Date());
      }
    }
  };
  const offsetValue = async () => {
    const e = {
      invoice_id: form.values.invoice_id,
      payment_mode: form.values.payment_mode,
      amount_paid: form.values.amount_paid,
      balance: form.values.balance,
      customer_id: form.values.customer_id,
      date: form.values.date,
    };
    const response = await handleAddJournal(e);

    if (response.status == 200) {
      form.reset();
      const reg = {
        id: title,
      };
      const response1 = await handleGetOneInvoice(reg);
      if (response1.status == 200) {
        const list2 = response1.data.data;

        setData(list2);
        const datas = dataSlice({
          data: list2.invoice_items,
          page: 1,
          total: 10,
        });
        form.setFieldValue("balance", Number(list2.balance));
        form.setFieldValue("invoice_id", list2.value);
        form.setFieldValue("customer_id", list2.customer_id);
        setSortedData(list2.invoice_items);
        const response2 = await handleGetSaleType();
        if (response2.status === 200) {
          const listGroup = await response2.data.data.map((data) => ({
            value: data.label.toString(),
            label: data.label.toString(),
          }));
          setSaleType(listGroup);
        }

        const response5 = await handleGetBank();

        // On Respose setting the data to variable
        if (response5.status === 200) {
          const listGroup = await response5.data.data.map((data) => ({
            value: data.label.toString(),
            label: data.label.toString(),
          }));
          setBanks(listGroup);
        }

        const response6 = await handelGetPayments(list.value);
        console.log(response6);
        // On Respose setting the data to variable
        if (response6.status === 200) {
          setPayments(response6.data.data[0]);
          setJournal(response6.data.data[1]);
        }
        setRefreshTable(new Date());
        setConfirmModal(false);
        setPaymentModal(true);
      }
    }
  };

  return (
    <>
      <Modal
        withCloseButton={false}
        overlayOpacity={0.55}
        padding={0}
        overlayBlur={3}
        onClose={() => setPaymentModal(false)}
        size={"60%"}
        opened={paymentModal}
      >
        <div>
          <div
            style={{
              display: "flex",
              padding: 0,
              margin: 0,
              justifyContent: "space-between",
              background: "#043c64",
              borderTopRightRadius: 3,
              borderTopLeftRadius: 3,
            }}
          >
            <Text color="#ffffff" size={14} m={5} mt={8} ml={15}>
              {title}
            </Text>
            <ActionIcon
              onClick={() => setPaymentModal(false)}
              m={5}
              sx={{
                "&[data-disabled]": { opacity: 1 },
                "&[data-loading]": { backgroundColor: "#ffffff" },
              }}
            >
              <X size={18} />
            </ActionIcon>
          </div>
          <div
            style={{
              padding: 15,
            }}
          >
            {data != "" ? (
              <>
                <div className="zc-golden-height">
                  <Text>List of all the product invoices sales</Text>
                  <Table
                    horizontalSpacing="md"
                    verticalSpacing="xs"
                    className={classes.striped}
                  >
                    <thead>
                      <tr>
                        <th>Sl.No</th>
                        <th>Product Name</th>
                        <th>HSN</th>
                        <th>Rate</th>
                        <th>Amount</th>
                        <th>Tax Rate</th>

                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody key={refreshTable}>
                      {sortedData.map((row, index) => (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{row.product_name}</td>
                          <td>{row.hsn}</td>
                          <td>{row.rate}</td>
                          <td>{row.amount}</td>
                          <td>{row.tax_rate}</td>
                          <td>{+Number(row.amount) + +Number(row.tax_rate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: 15,
                    }}
                  >
                    {/* For number of rows display in table */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
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
                            data: data.invoice_items,
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
                          data: data.invoice_items,
                          page: Number(e),
                          total: total,
                        });
                        setSortedData(datas);
                        setRefreshTable(new Date());
                      }}
                      total={Math.ceil(data.invoice_items.length / total)}
                      color="zevcore"
                    />
                  </div>
                </div>
                {form.values.balance > 0 ? (
                  <div>
                    <Divider my="sm" />
                    <Text mt={10} weight={600}>
                      Payments Details
                    </Text>

                    <form
                      onSubmit={form.onSubmit((values) => AddPayment(values))}
                    >
                      <Grid>
                        <Grid.Col span={3}>
                          <Select
                            variant="filled"
                            size="xs"
                            label="Mode of payment"
                            placeholder="Payment Type"
                            data={saleType}
                            value={form.values.payment_mode}
                            {...form.getInputProps("payment_mode")}
                          />
                        </Grid.Col>
                        <Grid.Col span={3}>
                          <DatePicker
                            size="xs"
                            variant="filled"
                            label="Select date"
                            value={form.values.date}
                            placeholder="Pick date"
                            required
                            {...form.getInputProps("date")}
                          />
                        </Grid.Col>
                        <Grid.Col span={3}>
                          <NumberInput
                            required
                            size="xs"
                            variant="filled"
                            value={form.values.amount_paid}
                            label="Enter Amount"
                            placeholder="Amount"
                            {...form.getInputProps("amount_paid")}
                          />
                        </Grid.Col>
                        <Grid.Col span={3}>
                          <NumberInput
                            readOnly
                            size="xs"
                            variant="filled"
                            value={
                              form.values.balance - form.values.amount_paid
                            }
                            label="Balance"
                            placeholder="Balance"
                          />
                        </Grid.Col>
                      </Grid>
                      <Grid>
                        <Grid.Col span={6}>
                          <Button
                            mt="sm"
                            disabled={
                              form.values.amount_paid > 0 ? false : true
                            }
                            type="button"
                            fullWidth
                            color="yellow"
                            onClick={() => {
                              setConfirmModal(true);
                              setPaymentModal(false);
                            }}
                          >
                            Offset Balance
                          </Button>
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <Button
                            mt="sm"
                            type="submit"
                            fullWidth
                            color="zevcore"
                            loading={variables.submitLoading}
                          >
                            Submit
                          </Button>
                        </Grid.Col>
                      </Grid>
                    </form>
                  </div>
                ) : null}

                <div className="zc-golden-height">
                  <Divider my="sm" />
                  <Text mt={10} weight={600}>
                    Payments Details List
                  </Text>
                  <Table
                    horizontalSpacing="md"
                    verticalSpacing="xs"
                    className={classes.striped}
                  >
                    <thead>
                      <tr>
                        <th>Sl.No</th>
                        <th>Payment Mode</th>
                        <th>Date</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody key={refreshTable}>
                      {payments.length > 0 ? (
                        <>
                          {payments.map((row, index) => (
                            <tr>
                              <td>{index + 1}</td>
                              <td>{row.payment_mode}</td>
                              <td>
                                {new Date(row.date).toLocaleDateString("en-UK")}
                              </td>
                              <td>{row.amount_paid}</td>
                            </tr>
                          ))}
                        </>
                      ) : null}
                    </tbody>
                  </Table>
                </div>
                {journal.length > 0 ? (
                  <div className="zc-golden-height">
                    <Divider my="sm" />
                    <Text mt={10} weight={600}>
                      Journal Details
                    </Text>
                    <Text mt={10}>
                      {"Offset Amount: "}
                      {journal[0].amount}
                      <br />
                      {" Date: "}

                      {new Date(journal[0].date).toLocaleDateString("en-UK")}
                    </Text>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      </Modal>

      <Modal
        withCloseButton={false}
        overlayOpacity={0.55}
        padding={0}
        overlayBlur={3}
        onClose={() => setConfirmModal(false)}
        size={"60%"}
        opened={confirmModal}
      >
        <div>
          <div
            style={{
              display: "flex",
              padding: 0,
              margin: 0,
              justifyContent: "space-between",
              background: "#043c64",
              borderTopRightRadius: 3,
              borderTopLeftRadius: 3,
            }}
          >
            <Text color="#ffffff" size={14} m={5} mt={8} ml={15}>
              {title}
            </Text>
            <ActionIcon
              onClick={() => setConfirmModal(false)}
              m={5}
              sx={{
                "&[data-disabled]": { opacity: 1 },
                "&[data-loading]": { backgroundColor: "#ffffff" },
              }}
            >
              <X size={18} />
            </ActionIcon>
          </div>
          <div
            style={{
              padding: 15,
            }}
          >
            <Text size="lg" weight={500}>
              Are you sure you want to offset the balance
            </Text>
            <Text>
              <Text component="span" color="red">
                Please Note:
              </Text>{" "}
              The offset amount will be in journal account and cannot be
              modified
            </Text>

            <div
              style={{
                display: "flex",
                marginTop: 15,
              }}
            >
              <Button
                onClick={() => {
                  offsetValue();
                }}
                color="green"
                mr={20}
                fullWidth
              >
                Yes
              </Button>
              <Button
                onClick={() => {
                  setConfirmModal(false);
                  setPaymentModal(true);
                }}
                color="red"
                fullWidth
                ml={20}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default PaymentInvoice;
