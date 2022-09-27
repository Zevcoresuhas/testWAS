import {
  Button,
  Card,
  Container,
  createStyles,
  Grid,
  Group,
  Paper,
  Progress,
  Select,
  Table,
  Skeleton,
  Tabs,
  Text,
} from "@mantine/core"; //for import mantine required functions and theme
import { DateRangePicker } from "@mantine/dates";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { showNotification, updateNotification } from "@mantine/notifications";
import {
  ArrowDownRight,
  ArrowsUpDown,
  ArrowUpRight,
  Box,
  BoxModel,
  User,
  UserPlus,
  X,
} from "tabler-icons-react";
import BreadCrumb from "../../components/BreadCrumb";
import axios from "axios";
import { useForm } from "@mantine/form";
import {
  handleGetKPI,
  handleGetCustomerReport,
  handleGetProduct,
} from "../../helpers/apis";
import { selectFilter } from "../../helpers/common";

//for   made mantine theme style change and write custome theme here
const useStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing.xl * 1.5,
  },

  value: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1,
  },

  diff: {
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  title: {
    fontWeight: 700,
    textTransform: "uppercase",
  },
}));
function StyledTabs(props) {
  return (
    <Tabs
      variant="unstyled"
      position="right"
      styles={(theme) => ({
        tabControl: {
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[0]
              : theme.colors.gray[9],
          border: `1px solid ${
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[4]
          }`,
          fontSize: theme.fontSizes.xs,
          padding: `${theme.spacing.md}px ${theme.spacing.md}px`,

          "&:not(:first-of-type)": {
            borderLeft: 0,
          },

          "&:first-of-type": {
            borderTopLeftRadius: theme.radius.md,
            borderBottomLeftRadius: theme.radius.md,
          },

          "&:last-of-type": {
            borderTopRightRadius: theme.radius.md,
            borderBottomRightRadius: theme.radius.md,
          },
        },

        tabActive: {
          backgroundColor: theme.colors.zevcore[1],
          borderColor: theme.colors.zevcore[7],
          color: theme.white,
        },
      })}
      {...props}
    />
  );
}

export default function KPI() {
  // For Date range picker
  const [value, setValue] = useState([]);
  const [value1, setValue1] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [design, setDesign] = useState([]);
  const [compare, setCompare] = useState(false);
  const { classes } = useStyles();
  const [token, setToken] = useState(localStorage.getItem("token")); //get saved local storage data
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [URL, setURL] = useState(process.env.REACT_APP_BACKEND_URL);
  const [URLFILE, setURLFILE] = useState(process.env.REACT_APP_FILE);
  const [skeletonLoading, setSkeletonLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      const response = await handleGetProduct();
      if (response.status === 200) {
        const listGroup = await selectFilter({
          data: response.data.data,
        });

        setDesign(listGroup);
      }
      const response2 = await handleGetCustomerReport();
      if (response2.status === 200) {
        var data2 = response2.data.data;
        var datas = data2.sort(function (a, b) {
          return parseFloat(b.max_count) - parseFloat(a.max_count);
        });
        setCustomer(datas);

        var data = response2.data.data;
        var data1 = [];
        var data2 = [];
        var data3 = [];
        for (let i = 0; i < data.length; i++) {
          data1.push(data[i].customer_id);
          data2.push(Number(data[i].max_count));
          data3.push(Number(data[i].max_amount));
        }
        setLabels2(data1);
        setSeriesArray1(data2);
      }
      const response3 = await handleGetKPI();

      if (response3.status === 200) {
        var data = response3.data.data[0];
        var clean = data.map((data) => ({
          ...data,
          timeStamp: new Date(data.invoice_date).toLocaleString(),
        }));
        var result = clean.reduce(function (r, a) {
          r[a.product_name] = r[a.product_name] || [];
          r[a.product_name].push(a);
          return r;
        }, Object.create(null));

        var monthCountArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var MONTHS = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        var curent_month = MONTHS.findIndex(
          (img) =>
            img == new Date().toLocaleString("default", { month: "long" })
        );

        var array = [];
        var arrayHalf = [];
        var arrayMonth = [];
        var arrayQuarter = [];
        for (var key in result) {
          result[key].forEach(
            ({ timeStamp }) =>
              (monthCountArr[new Date(timeStamp).getMonth()] += Number(
                result[key][0].count
              ))
          );
          array.push({
            name: key,
            data: monthCountArr,
          });
          arrayQuarter.push({
            name: key,
            data: monthCountArr.slice(0, 3),
          });
          arrayHalf.push({
            name: key,
            data: monthCountArr.slice(0, 6),
          });
          arrayMonth.push({
            name: key,
            data: monthCountArr.slice(curent_month, curent_month + 1),
          });

          monthCountArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }

        var data2 = response3.data.data[1];
        var clean2 = data2.map((data) => ({
          ...data,
          timeStamp: new Date(data.invoice_date).toLocaleString(),
        }));
        var result2 = clean2.reduce(function (r, a) {
          r[a.product_name] = r[a.product_name] || [];
          r[a.product_name].push(a);
          return r;
        }, Object.create(null));
        var arrayToday = [];
        for (var key in result2) {
          arrayToday.push({
            name: key,
            data: [result2[key].length],
          });
        }

        setSeries(array);
        setSeriesQuarter(arrayQuarter);
        setSeriesHalf(arrayHalf);
        setSeriesMonth(arrayMonth);
        setSeriesToday(arrayToday);
        setSkeletonLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const seriesArray = [
    {
      name: "Apple",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      name: "Samsung",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  ];

  const [seriesArray1, setSeriesArray1] = useState([]);
  const [labels2, setLabels2] = useState([]);

  //For Apex Line Charts

  const [series, setSeries] = useState(seriesArray);
  const [options, setOptions] = useState({
    chart: {
      height: 350,

      type: "line",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: true,
        tools: {
          download: false, // <== line to add
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
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
      labels: {
        style: {
          colors: "#9e9e9e",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#9e9e9e",
        },
      },
    },
    grid: {
      show: false,
      borderColor: "#9e9e9e",
    },
  });

  //For Apex Line Charts half year
  const [seriesHalf, setSeriesHalf] = useState(seriesArray);
  const [optionsHalf, setOptionsHalf] = useState({
    chart: {
      height: 350,

      type: "line",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: true,
        tools: {
          download: false, // <== line to add
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      labels: {
        style: {
          colors: "#9e9e9e",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#9e9e9e",
        },
      },
    },
    grid: {
      show: false,
      borderColor: "#9e9e9e",
    },
  });

  //For Apex Line Charts Quarter year
  const [seriesQuarter, setSeriesQuarter] = useState(seriesArray);
  const [optionsQuarter, setOptionsQuarter] = useState({
    chart: {
      height: 350,

      type: "line",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: true,
        tools: {
          download: false, // <== line to add
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar"],
      labels: {
        style: {
          colors: "#9e9e9e",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#9e9e9e",
        },
      },
    },
    grid: {
      show: false,
      borderColor: "#9e9e9e",
    },
  });

  //For Apex Line Charts month year
  const [seriesMonth, setSeriesMonth] = useState(seriesArray);
  const [optionsMonth, setOptionsMonth] = useState({
    chart: {
      height: 350,

      type: "bar",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: true,
        tools: {
          download: false, // <== line to add
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    xaxis: {
      categories: [new Date().toLocaleString("default", { month: "long" })],
      labels: {
        style: {
          colors: "#9e9e9e",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#9e9e9e",
        },
      },
    },
    grid: {
      show: false,
      borderColor: "#9e9e9e",
    },
  });

  //For Apex Line Charts month Compare year
  const [seriesMonth2, setSeriesMonth2] = useState(seriesArray);
  const [optionsMonth2, setOptionsMonth2] = useState({
    chart: {
      height: 350,

      type: "bar",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: true,
        tools: {
          download: false, // <== line to add
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    xaxis: {
      labels: {
        style: {
          colors: "#9e9e9e",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#9e9e9e",
        },
      },
    },
    grid: {
      show: false,
      borderColor: "#9e9e9e",
    },
  });

  //For Apex Line Charts today year
  const [seriesToday, setSeriesToday] = useState(seriesArray);
  const [optionsToday, setOptionsToday] = useState({
    chart: {
      height: 350,

      type: "bar",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: true,
        tools: {
          download: false, // <== line to add
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    xaxis: {
      labels: {
        style: {
          colors: "#9e9e9e",
        },
      },
    },
    yaxis: {
      categories: [new Date().toLocaleString("default", { month: "long" })],
      labels: {
        style: {
          colors: "#9e9e9e",
        },
      },
    },
    grid: {
      show: false,
      borderColor: "#9e9e9e",
    },
  });

  //For Radialchart 2
  const [seriesPie, setSeriesPie] = useState(seriesArray);
  const config2 = {
    series: seriesArray1,

    options: {
      labels: labels2,
      theme: {
        monochrome: {
          enabled: false,
        },
      },
      plotOptions: {
        radialBar: {
          inverseOrder: true,
          hollow: {
            size: "85%",
            background: "transparent",
            image: undefined,
            imageWidth: 50,
            imageHeight: 50,
            imageOffsetX: 0,
            imageOffsetY: 0,
            imageClipped: true,

            dropShadow: {
              enabled: false,
              top: 0,
              left: 0,
              blur: 3,
              opacity: 0.5,
            },
          },
          dataLabels: {
            name: {
              fontSize: "1px",
            },
            value: {
              fontSize: "16px",
            },
            total: {
              show: true,
              label: "Total",
              color: "#9e9e9e",
              formatter: function () {
                // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                return "71.5 % ";
              },
            },
          },
        },
      },
    },
  };

  const form = useForm({
    initialValues: {
      design_one: "",
      design_two: "",
      date: [new Date(), new Date()],
      date2: [new Date(), new Date()],
    },
  });
  const handleCompare = (e) => {
    console.log("hi");
  };
  return (
    <div>
      <Skeleton
        height="100%"
        width="100%"
        radius="md"
        visible={skeletonLoading}
      >
        <BreadCrumb Text="KPIs" />
      </Skeleton>

      <div pt={10}>
        <Skeleton
          height="100%"
          width="100%"
          radius="md"
          visible={skeletonLoading}
        >
          {/* <Card shadow="sm" p="lg" radius='md' withBorder> */}
          <Tabs defaultValue="Products">
            <Tabs.List>
              <Tabs.Tab value="Products">Products</Tabs.Tab>
              <Tabs.Tab value="Customers">Customers</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="Products" pt="xs">
              <Card shadow="sm" p="lg" radius="md" withBorder>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                >
                  <Text sx={{ fontSize: "14px" }}>
                    Comparison Product Reports
                  </Text>
                  {/* <form
                    onSubmit={form.onSubmit((values) => handleCompare(values))}
                  >
                    <div style={{ display: "flex", flexDirection: "row" }}>
                     <Select
            variant="filled"
                        label="Design One"
                        size="xs"
                        placeholder="Select Product"
                        searchable
                        autoComplete="off"
                        clearable
                        data={design}
                        {...form.getInputProps("design_one")}
                      />
                     <Select
            variant="filled"
                        label="Design two"
                        placeholder="Select Product"
                        searchable
                        size="xs"
                        autoComplete="off"
                        clearable
                        ml={10}
                        mr={10}
                        data={design}
                        {...form.getInputProps("design_two")}
                      />

                      <DateRangePicker
                        label="From Date"
                        placeholder="Pick dates range"
                        value={value}
                        size="xs"
                        mr={10}
                        {...form.getInputProps("date")}
                      />
                      <DateRangePicker
                        label="From Date"
                        placeholder="Pick dates range"
                        value={value}
                        size="xs"
                        mr={10}
                        {...form.getInputProps("date2")}
                      />
                      {compare == false ? (
                        <Button
                          variant="gradient"
                          mt={30}
                          type="submit"
                          size="xs"
                          gradient={{ from: "indigo", to: "cyan" }}
                        >
                          Compare
                        </Button>
                      ) : (
                        <Button
                          variant="gradient"
                          mt={30}
                          type="submit"
                          size="xs"
                          gradient={{ from: "indigo", to: "cyan" }}
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </form> */}
                </div>

                <div>
                  {compare == false ? (
                    <>
                      <Tabs defaultValue="Year">
                        <Tabs.List>
                          <Tabs.Tab value="Year">Year</Tabs.Tab>
                          <Tabs.Tab value="Half Year">Half Year</Tabs.Tab>
                          <Tabs.Tab value="Quarter Year">Quarter Year</Tabs.Tab>
                          <Tabs.Tab value="Current Month">
                            Current Month
                          </Tabs.Tab>
                          <Tabs.Tab value="Today">Today</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="Year">
                          <div id="chart" style={{ width: "100%" }}>
                            <ReactApexChart
                              options={options}
                              series={series}
                              type="line"
                              height={300}
                            />
                          </div>
                        </Tabs.Panel>
                        <Tabs.Panel value="Half Year">
                          <div id="chart" style={{ width: "100%" }}>
                            <ReactApexChart
                              options={optionsHalf}
                              series={seriesHalf}
                              type="line"
                              height={300}
                              width="95%"
                            />
                          </div>
                        </Tabs.Panel>
                        <Tabs.Panel value="Quarter Year">
                          <div id="chart" style={{ width: "100%" }}>
                            <ReactApexChart
                              options={optionsQuarter}
                              series={seriesQuarter}
                              type="line"
                              height={310}
                            />
                          </div>
                        </Tabs.Panel>
                        <Tabs.Panel value="Current Month">
                          <div id="chart" style={{ width: "100%" }}>
                            <ReactApexChart
                              options={optionsMonth}
                              series={seriesMonth}
                              type="bar"
                              height={310}
                            />
                          </div>
                        </Tabs.Panel>
                        <Tabs.Panel value="Today">
                          <div id="chart" style={{ width: "100%" }}>
                            <ReactApexChart
                              options={optionsToday}
                              series={seriesToday}
                              type="bar"
                              height={310}
                            />
                          </div>
                        </Tabs.Panel>
                      </Tabs>
                    </>
                  ) : (
                    <div id="chart" style={{ width: "100%" }}>
                      <ReactApexChart
                        options={optionsMonth2}
                        series={seriesMonth2}
                        type="bar"
                        height={310}
                      />
                    </div>
                  )}
                </div>
                {/* {compare == true ? (
                  <>
                    <Grid mt={20}>
                      <Grid.Col xs={3}>
                        <Paper withBorder p="md" radius="md">
                          <Group position="apart">
                            <Text
                              size="xs"
                              color="dimmed"
                              className={classes.title}
                            >
                              Design one sale
                            </Text>
                            <BoxModel size={22} />
                          </Group>

                          <Group align="flex-end" spacing="xs" mt={25}>
                            <Text className={classes.value}>
                              {eval(seriesMonth2[0].data.join("+"))}
                            </Text>
                            <Text
                              color={"green"}
                              size="sm"
                              weight={500}
                              className={classes.diff}
                            >
                              <span>21%</span>
                              <ArrowUpRight size={16} />
                            </Text>
                          </Group>

                          <Text size="xs" color="dimmed" mt={7}>
                            Compared to previous month
                          </Text>
                        </Paper>
                      </Grid.Col>
                      <Grid.Col xs={3}>
                        <Paper withBorder p="md" radius="md">
                          <Group position="apart">
                            <Text
                              size="xs"
                              color="dimmed"
                              className={classes.title}
                            >
                              Design two Sale
                            </Text>
                            <BoxModel size={22} />
                          </Group>

                          <Group align="flex-end" spacing="xs" mt={25}>
                            <Text className={classes.value}>
                              {eval(seriesMonth2[1].data.join("+"))}
                            </Text>
                            <Text
                              color={"red"}
                              size="sm"
                              weight={500}
                              className={classes.diff}
                            >
                              <span>21%</span>
                              <ArrowDownRight size={16} />
                            </Text>
                          </Group>

                          <Text size="xs" color="dimmed" mt={7}>
                            Compared to previous month
                          </Text>
                        </Paper>
                      </Grid.Col>
                      <Grid.Col xs={3}>
                        <Paper withBorder p="md" radius="md">
                          <Group position="apart">
                            <Text
                              size="xs"
                              color="dimmed"
                              className={classes.title}
                            >
                              Profit
                            </Text>
                            <BoxModel size={22} />
                          </Group>

                          <Group align="flex-end" spacing="xs" mt={25}>
                            <Text className={classes.value}>21</Text>
                            <Text
                              color={"green"}
                              size="sm"
                              weight={500}
                              className={classes.diff}
                            >
                              <span>21%</span>
                              <ArrowUpRight size={16} />
                            </Text>
                          </Group>

                          <Text size="xs" color="dimmed" mt={7}>
                            Compared to previous month
                          </Text>
                        </Paper>
                      </Grid.Col>
                      <Grid.Col xs={3}>
                        <Paper withBorder p="md" radius="md">
                          <Group position="apart">
                            <Text
                              size="xs"
                              color="dimmed"
                              className={classes.title}
                            >
                              Loss
                            </Text>
                            <BoxModel size={22} />
                          </Group>

                          <Group align="flex-end" spacing="xs" mt={25}>
                            <Text className={classes.value}>21</Text>
                            <Text
                              color={"red"}
                              size="sm"
                              weight={500}
                              className={classes.diff}
                            >
                              <span>21%</span>
                              <ArrowDownRight size={16} />
                            </Text>
                          </Group>

                          <Text size="xs" color="dimmed" mt={7}>
                            Compared to previous month
                          </Text>
                        </Paper>
                      </Grid.Col>
                    </Grid>
                  </>
                ) : null} */}
              </Card>
            </Tabs.Panel>

            <Tabs.Panel value="Customers" pt="xs">
              {customer.length != 0 ? (
                <Grid>
                  <Grid.Col xs={12}>
                    <Card shadow="sm" p="lg" radius="md" withBorder>
                      <div>
                        <Text sx={{ fontSize: "20px" }}>
                          Top customer of {new Date().getFullYear()}
                        </Text>
                        <Text sx={{ fontSize: "20px" }}>
                          {customer[0].customer_id}
                        </Text>
                        <Text sx={{ fontSize: "12px" }}>
                          Total Purchases: {customer[0].max_count}
                        </Text>
                        <Text sx={{ fontSize: "12px" }}>
                          Total Amount: {customer[0].max_amount}
                        </Text>
                      </div>
                    </Card>
                  </Grid.Col>
                  <Grid.Col xs={6}>
                    <Card shadow="sm" p="lg" radius="md" withBorder>
                      <div>
                        <Text sx={{ fontSize: "20px" }}>
                          Top 10 customers of {new Date().getFullYear()}
                        </Text>
                        <Table>
                          <thead>
                            <tr>
                              <th>Sl.No</th>
                              <th>Customer</th>
                              <th>Total Purchase</th>
                              <th>Total Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {customer.map((row, index) => (
                              <tr>
                                <td>{index + 1}</td>
                                <td>{row.customer_id}</td>
                                <td>{row.max_count}</td>
                                <td>{row.max_amount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </Card>
                  </Grid.Col>
                </Grid>
              ) : null}
            </Tabs.Panel>
          </Tabs>
        </Skeleton>
      </div>
    </div>
  );
}
