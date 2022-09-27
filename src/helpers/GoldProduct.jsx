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
  Group,
} from "@mantine/core";
import { openModal, closeAllModals } from "@mantine/modals";
import { DatePicker } from "@mantine/dates";
import { Link } from "react-router-dom";
import { dataSlice, nFormatter } from "./common";
import { Box, DotsCircleHorizontal, Receipt, X } from "tabler-icons-react";
import useStyles from "../components/Style";
import ReactApexChart from "react-apexcharts";
import { handleGetCustomerHistory2, handleGetProductHistoryDate } from "./apis";
import GoldCustomer from "./GoldCustomer";

function GoldProduct({ value, title, list, productModal, setProductModal }) {
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

  const [sortedData2, setSortedData2] = useState([]);
  const [activePage2, setPage2] = useState(1); // For set table active page
  const [total2, setTotal2] = useState(10); // For set total list show in page
  const [search2, setSearch2] = useState(""); // For set the search value name of table
  const [sortBy2, setSortBy2] = useState(null); // Seting the sortby table type
  const [reverseSortDirection2, setReverseSortDirection2] = useState(false); // For set the reverse sort direction
  const [refreshTable2, setRefreshTable2] = useState(Date.now()); // For refresh table

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
    let mounted = true;
    const fetchData = async () => {
      if (list != "" && typeof list != "undefined") {
        console.log(list);
        setData(list);
        setVariables({
          ...variables,
          skeletonLoading: false,
        });
        const datas = dataSlice({
          data: list[0],
          page: 1,
          total: 10,
        });
        setSortedData(datas);
        const datas2 = dataSlice({
          data: list[2],
          page: 1,
          total: 10,
        });
        setSortedData2(datas2);
        console.log(data);

        var months = list[4];
        var MData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        for (let i = 1; i < 12; i++) {
          for (let j = 0; j < months.length; j++) {
            if (Number(months[j].month) == i) {
              MData[i] = +Number(MData[i]) + +Number(months[j].total_amount);
            }
          }
        }
        console.log(MData);
        var dataT = series;
        dataT[0] = {
          name: "Product",
          data: MData,
        };
        setSeries(dataT);
        setRefreshChart(new Date());
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, [list]);
  const [series, setSeries] = useState([
    {
      name: "Products",
      data: [2, 3, 4, 6, 4, 3, 3, 2, 1, 0, 0, 0],
    },
  ]);
  const [options, setOptions] = useState({
    chart: {
      height: 350,
      type: "bar",
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: "top", // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val;
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
    },

    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      position: "top",
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        fill: {
          type: "gradient",
          gradient: {
            colorFrom: "#D8E3F0",
            colorTo: "#BED1E6",
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        formatter: function (val) {
          return val;
        },
      },
    },
    title: {
      text: "Product monthly sales this year",
      floating: true,
      offsetY: 330,
      align: "center",
      style: {
        color: "#444",
      },
    },
  });

  const filter = async () => {
    console.log(date1, date2);
    const req = {
      value: value,
      from: date1,
      to: date2,
    };
    const list2 = await handleGetProductHistoryDate(req);
    console.log(list2);
    if (list2.status == 200) {
      const list23 = list2.data.data;
      console.log(list23);

      setData(list23);
      setVariables({
        ...variables,
        skeletonLoading: false,
      });

      const datas = dataSlice({
        data: list23[0],
        page: 1,
        total: 10,
      });
      setSortedData(datas);
      const datas2 = dataSlice({
        data: list23[2],
        page: 1,
        total: 10,
      });
      setSortedData2(datas2);
    }
  };

  return (
    <>
      <Modal
        withCloseButton={false}
        overlayOpacity={0.55}
        padding={0}
        overlayBlur={3}
        onClose={() => setProductModal(false)}
        size={"60%"}
        opened={productModal}
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
              onClick={() => setProductModal(false)}
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
            {typeof data[0] != "undefined" ? (
              <>
                <Grid>
                  <Grid.Col span={6}>
                    <Skeleton visible={variables.skeletonLoading}>
                      <Card shadow="sm" p="sm" radius="md" withBorder>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{ flexDirection: "column" }}>
                            <Text weight={600} size="md">
                              Stocks
                            </Text>

                            <Text size={12} mt={-2}>
                              Quantity Available- {data[3][0].total_reaming}
                            </Text>
                            <Text size={12} mt={-2}>
                              Value- ₹{data[3][0].total_amount}
                            </Text>
                          </div>
                          <Avatar color="violet" radius="xl" size={60}>
                            <Box size={36} />
                          </Avatar>
                        </div>
                      </Card>
                    </Skeleton>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Skeleton visible={variables.skeletonLoading}>
                      <Card shadow="sm" p="sm" radius="md" withBorder>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{ flexDirection: "column" }}>
                            <Text weight={600} size="lg">
                              Sales
                            </Text>

                            <Text size={12} mt={-2}>
                              Quantity Sold- {data[1][0].total_item}
                            </Text>
                            <Text size={12} mt={-2}>
                              Value- ₹{data[1][0].total_amount}
                            </Text>
                          </div>
                          <Avatar color="orange" radius="xl" size={60}>
                            <Receipt size={36} />
                          </Avatar>
                        </div>
                      </Card>
                    </Skeleton>
                  </Grid.Col>
                </Grid>

                <Grid pt={10}>
                  <Grid.Col span={5}>
                    <Skeleton visible={variables.skeletonLoading}>
                      <DatePicker
                        value={date1}
                        onChange={setDate1}
                        placeholder="Pick date"
                        label="From date"
                      />
                    </Skeleton>
                  </Grid.Col>
                  <Grid.Col span={5}>
                    <Skeleton visible={variables.skeletonLoading}>
                      <DatePicker
                        value={date2}
                        onChange={setDate2}
                        placeholder="Pick date"
                        label="To date"
                      />
                    </Skeleton>
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <Skeleton visible={variables.skeletonLoading}>
                      <Button
                        onClick={() => {
                          filter();
                        }}
                        mt={24}
                        fullWidth
                        color="zevcore"
                      >
                        Submit
                      </Button>
                    </Skeleton>
                  </Grid.Col>
                </Grid>
                <Skeleton visible={variables.skeletonLoading}>
                  <Tabs defaultValue="sale" pt={10}>
                    <Tabs.List>
                      <Tabs.Tab value="sale">Sales</Tabs.Tab>
                      <Tabs.Tab value="stock">Stock</Tabs.Tab>
                      <Tabs.Tab value="graph">Graph</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="sale" pt="xs">
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
                              <th>Invoice Id</th>

                              <th>Date</th>
                              <th>Customer</th>
                              <th>Rate</th>
                              <th>Tax Rate</th>
                              <th>Amount</th>
                              <th>View</th>
                            </tr>
                          </thead>
                          <tbody key={refreshTable}>
                            {sortedData.map((row, index) => (
                              <tr>
                                <td>{index + 1}</td>
                                <td>{row.invoice.invoice_number}</td>
                                <td>
                                  {new Date(
                                    row.invoice_date
                                  ).toLocaleDateString("en-UK")}
                                </td>
                                <td>
                                  <Group>
                                    {row.invoice.customer_id}
                                    {row.invoice.customer_id != "" &&
                                    row.invoice.customer_id != null &&
                                    typeof row.invoice.customer_id !=
                                      "undefined" ? (
                                      <ActionIcon
                                        onClick={async () => {
                                          const data =
                                            await handleGetCustomerHistory2(
                                              row.invoice.customer_id
                                            );
                                          console.log(data.data.data);
                                          const list = data.data.data;
                                          setProductModal(false);
                                          setCustomerModal(true);
                                          setGoldData(list);
                                          setGoldTitle(row.invoice.customer_id);
                                          setGoldValue(row.value);
                                        }}
                                        ml={-10}
                                        color="zevcore"
                                        variant="transparent"
                                      >
                                        <DotsCircleHorizontal size={20} />
                                      </ActionIcon>
                                    ) : null}
                                  </Group>
                                </td>
                                <td>{row.rate}</td>
                                <td>{row.tax_rate}</td>
                                <td>{row.amount}</td>
                                <td>
                                  <Link
                                    className="link-button"
                                    onClick={closeAllModals}
                                    to={{
                                      pathname:
                                        "/print_invoice/" +
                                        row.invoice.invoice_number,
                                    }}
                                  >
                                    View
                                  </Link>
                                </td>
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
                                  data: data[0],
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
                                data: data[0],
                                page: Number(e),
                                total: total,
                              });
                              setSortedData(datas);
                              setRefreshTable(new Date());
                            }}
                            total={Math.ceil(data[0].length / total)}
                            color="zevcore"
                          />
                        </div>
                      </div>
                    </Tabs.Panel>
                    <Tabs.Panel value="stock" pt="xs">
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
                              <th>Invoice Id</th>
                              <th>Date</th>
                              <th>Total Item</th>
                              <th>Reaming Item</th>
                              <th>Cost Per Item</th>
                              <th>Amount</th>
                            </tr>
                          </thead>
                          <tbody key={refreshTable}>
                            {sortedData2.map((row, index) => (
                              <tr>
                                <td>{index + 1}</td>
                                <td>{row.invoice_id}</td>
                                <td>
                                  {new Date(row.date).toLocaleDateString(
                                    "en-UK"
                                  )}
                                </td>
                                <td>{row.total_item}</td>
                                <td>{row.reaming_item}</td>
                                <td>{row.cost_per_item}</td>
                                <td>{row.total}</td>
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
                                setTotal2(Number(e.currentTarget.value));
                                setPage2(1);
                                const datas = await dataSlice({
                                  data: data[2],
                                  page: 1,
                                  total: Number(e.currentTarget.value),
                                });
                                setSortedData2(datas);
                                setRefreshTable2(new Date());
                              }}
                              data={["10", "20", "50", "100"]}
                              rightSectionWidth={20}
                              sx={{ width: 70 }}
                            />
                          </div>
                          {/* For pagination */}
                          <Pagination
                            size="xs"
                            page={activePage2}
                            onChange={async (e) => {
                              setPage2(Number(e));
                              const datas = await dataSlice({
                                data: data[2],
                                page: Number(e),
                                total: total2,
                              });
                              setSortedData2(datas);
                              setRefreshTable2(new Date());
                            }}
                            total={Math.ceil(data[2].length / total)}
                            color="zevcore"
                          />
                        </div>
                      </div>
                    </Tabs.Panel>
                    <Tabs.Panel value="graph" pt="xs">
                      <div key={refreshChart}>
                        <ReactApexChart
                          options={options}
                          series={series}
                          type="bar"
                          height={350}
                        />
                      </div>
                    </Tabs.Panel>
                  </Tabs>
                </Skeleton>
              </>
            ) : null}
          </div>
        </div>
      </Modal>
      <GoldCustomer
        value={goldValue}
        title={goldTitle}
        list={goldData}
        customerModal={customerModal}
        setCustomerModal={setCustomerModal}
      />
    </>
  );
}

export default GoldProduct;
