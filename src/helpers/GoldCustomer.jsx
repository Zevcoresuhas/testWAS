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
} from "@mantine/core";
import { openModal, closeAllModals } from "@mantine/modals";
import { DatePicker } from "@mantine/dates";
import { Link } from "react-router-dom";
import { dataSlice, nFormatter } from "./common";
import { Box, PremiumRights, Receipt, X } from "tabler-icons-react";
import useStyles from "../components/Style";
import ReactApexChart from "react-apexcharts";
import {
  handleGetCustomerHistoryDate,
  handleGetProductHistoryDate,
} from "./apis";

function GoldCustomer({ value, title, list, customerModal, setCustomerModal }) {
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
  const [journal, setJournal] = useState("");
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
      console.log(list);
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

        var months = list[2];
        var MData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var BData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        for (let i = 1; i < 12; i++) {
          for (let j = 0; j < months.length; j++) {
            if (Number(months[j].month) == i) {
              MData[i] = +Number(MData[i]) + +Number(months[j].total_paid);
              BData[i] = +Number(MData[i]) + +Number(months[j].total_balance);
            }
          }
        }
        console.log(MData, BData);
        var dataT = series;
        dataT[0] = {
          name: "Billed",
          data: BData,
        };
        dataT[1] = {
          name: "Paid",
          data: MData,
        };
        setSeries(dataT);
        setJournal(list[3][0].total_amount);
        setRefreshTable(new Date());
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
      name: "Billed",
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
    },
    {
      name: "Paid",
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
    },
  ]);
  const [options, setOptions] = useState({
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        dataLabels: {
          position: "top", // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return nFormatter(val, 2);
      },
      offsetY: -20,
      style: {
        fontSize: "8px",
        colors: ["#304758"],
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
      ],
    },
    yaxis: {
      title: {
        text: "Amounts in ₹",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "₹" + val;
        },
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
    const list23 = await handleGetCustomerHistoryDate(req);
    if (list23.status == 200) {
      const list2 = list23.data.data;
      console.log(list2);
      setData(list2);
      setVariables({
        ...variables,
        skeletonLoading: false,
      });
      const datas = dataSlice({
        data: list2[0],
        page: 1,
        total: 10,
      });
      setSortedData(datas);
      setRefreshTable(new Date());
    }
  };
  return (
    <>
      <Modal
        withCloseButton={false}
        overlayOpacity={0.55}
        padding={0}
        overlayBlur={3}
        onClose={() => setCustomerModal(false)}
        size={"60%"}
        opened={customerModal}
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
            <Text color="#ffffff" m={5} mt={7} ml={15}>
              {title}
            </Text>
            <ActionIcon
              onClick={() => setCustomerModal(false)}
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
                  <Grid.Col span={4}>
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
                              Items Purchased
                            </Text>

                            <Text size={12} mt={-2}>
                              {nFormatter(data[1][0].total_item, 2)}
                            </Text>
                          </div>
                          <Avatar color="violet" radius="xl" size={60}>
                            <Box size={36} />
                          </Avatar>
                        </div>
                      </Card>
                    </Skeleton>
                  </Grid.Col>
                  <Grid.Col span={4}>
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
                              Amount
                            </Text>

                            <Text size={12} mt={-2}>
                              {data[1][0].total_amount}
                            </Text>
                            <Text size={12} mt={-2}>
                              Journal: {journal}
                            </Text>
                          </div>
                          <Avatar color="orange" radius="xl" size={60}>
                            <Receipt size={36} />
                          </Avatar>
                        </div>
                      </Card>
                    </Skeleton>
                  </Grid.Col>
                  <Grid.Col span={4}>
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
                              Balance
                            </Text>

                            <Text size={12} mt={-2}>
                              {data[1][0].total_balance}
                            </Text>
                          </div>
                          <Avatar color="teal" radius="xl" size={60}>
                            <PremiumRights size={36} />
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
                              <th>Items</th>
                              <th>Tax</th>
                              <th>Sub-Total</th>
                              <th>Total</th>
                              <th>Paid</th>
                              <th>View</th>
                            </tr>
                          </thead>
                          <tbody key={refreshTable}>
                            {sortedData.map((row, index) => (
                              <tr>
                                <td>{index + 1}</td>
                                <td>{row.invoice_number}</td>
                                <td>
                                  {new Date(
                                    row.invoice_date
                                  ).toLocaleDateString("en-UK")}
                                </td>
                                <td>{row.total_items}</td>
                                <td>{Number(row.sgst) * 2}</td>
                                <td>{row.sub_total}</td>
                                <td>{row.total}</td>
                                <td>{row.paid}</td>
                                <td>
                                  <Link
                                    className="link-button"
                                    onClick={closeAllModals}
                                    to={{
                                      pathname:
                                        "/print_invoice/" + row.invoice_number,
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
    </>
  );
}

export default GoldCustomer;
