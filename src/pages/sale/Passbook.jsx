import {
  Card,
  Grid,
  Table,
  ActionIcon,
  Text,
  Button,
  ScrollArea,
  Group,
  TextInput,
  Skeleton,
  NativeSelect,
  Pagination,
  Modal,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { ArrowNarrowRight, Search } from "tabler-icons-react";
import useStyles from "../../components/Style";
import { useModals } from "@mantine/modals";
import BreadCrumb from "../../components/BreadCrumb";
import { dataSearch, Th } from "../../helpers/tableFunction";
// Setting the variables data list here
import { CSVLink } from "react-csv";
import excel from "../../assets/images/excel.png"; // Image for excel export
import pdf from "../../assets/images/pdf.png";
import { handleAddPassbook, handleGetPassbook } from "../../helpers/apis";
import { DatePicker } from "@mantine/dates";
import { dataSlice } from "../../helpers/common";
import notificationHelper from "../../helpers/notification";

function Passbook() {
  const { classes } = useStyles();
  const modals = useModals();
  // Setting the variables data for table data
  const [opened, setOpened] = useState(false);
  const [date, setDate] = useState(null);
  const [sortedData, setSortedData] = useState([]); // For table data
  const [activePage, setPage] = useState(1); // For set table active page
  const [total, setTotal] = useState(10); // For set total list show in page
  const [search, setSearch] = useState(""); // For set the search value name of table
  const [sortBy, setSortBy] = useState(null); // Seting the sortby table type
  const [reverseSortDirection, setReverseSortDirection] = useState(false); // For set the reverse sort direction
  const [refreshTable, setRefreshTable] = useState(Date.now()); // For refresh table

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
      if (mounted) {
        const response = await handleGetPassbook();
        console.log(response);
        if (response.status == 200) {
          setVariables({
            ...variables,
            data: response.data.data,
            skeletonLoading: false,
          });
          const datas = dataSlice({
            data: response.data.data[6],
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

  const rows = sortedData.map((row, index) => (
    <tr key={row.label}>
      <td>{activePage * total - total + index + 1}</td>
      <td>{new Date(row.date).toLocaleDateString("en-GB")} </td>
      <td>{row.sale} </td>
      <td>{row.expense} </td>
      <td>{row.income} </td>
      <td>{row.balance} </td>
    </tr>
  ));
  const GeneratePassbook = async () => {
    setVariables({
      ...variables,
      submitLoading: true,
      skeletonLoading: true,
    });
    const req = {
      date: date,
    };
    const response = await handleAddPassbook(req);
    console.log(response);
    if (response.status == 200) {
      setOpened(false);
      setVariables({
        ...variables,
        data: response.data.data,
        submitLoading: false,
        skeletonLoading: false,
      });
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Passbook updated successfully",
      });
    }
  };

  return (
    <div>
      <Skeleton radius="md" visible={variables.skeletonLoading}>
        <BreadCrumb Text="Comprehensive" />
      </Skeleton>
      <Skeleton radius="md" visible={variables.skeletonLoading}>
        {variables.data.length != 0 ? (
          <Card className="border">
            <Grid gutter="xl">
              <Grid.Col span={4}>
                <Grid
                  style={{ border: "1px solid #043c64", borderRadius: 5 }}
                  onClick={() => {
                    modals.openModal({
                      title: "Today Sales",
                      overflow: "inside",
                      children: (
                        <>
                          <Table className={classes.striped}>
                            <thead>
                              <tr>
                                <th>Invoice Id</th>
                                <th>Design Name</th>
                                <th>Amount</th>
                                <th>View</th>
                              </tr>
                            </thead>
                          </Table>
                        </>
                      ),
                    });
                  }}
                >
                  <Grid.Col span={8}>
                    <Text size="xs">Sale</Text>
                    <Text size="xs">
                      {variables.data.length != 0 &&
                      variables.data[0][0].amount_total == null
                        ? 0
                        : variables.data[0][0].amount_total}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={4} align="right">
                    <ActionIcon mt={10}>
                      <ArrowNarrowRight />
                    </ActionIcon>
                  </Grid.Col>
                </Grid>
              </Grid.Col>
              <Grid.Col span={4}>
                <Grid
                  style={{ border: "1px solid #043c64", borderRadius: 5 }}
                  onClick={() => {
                    modals.openModal({
                      title: "Today Sales",
                      overflow: "inside",
                      children: (
                        <>
                          <Table className={classes.striped}>
                            <thead>
                              <tr>
                                <th>Invoice Id</th>
                                <th>Design Name</th>
                                <th>Amount</th>
                                <th>View</th>
                              </tr>
                            </thead>
                          </Table>
                        </>
                      ),
                    });
                  }}
                >
                  <Grid.Col span={8}>
                    <Text size="xs">Cash Income</Text>
                    <Text size="xs">
                      {variables.data.length != 0 &&
                      variables.data[2][0].amount_total == null
                        ? 0
                        : variables.data[2][0].amount_total}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={4} align="right">
                    <ActionIcon mt={10}>
                      <ArrowNarrowRight />
                    </ActionIcon>
                  </Grid.Col>
                </Grid>
              </Grid.Col>
              <Grid.Col span={4}>
                <Grid
                  style={{ border: "1px solid #043c64", borderRadius: 5 }}
                  onClick={() => {
                    modals.openModal({
                      title: "Today Sales",
                      overflow: "inside",
                      children: (
                        <>
                          <Table className={classes.striped}>
                            <thead>
                              <tr>
                                <th>Invoice Id</th>
                                <th>Design Name</th>
                                <th>Amount</th>
                                <th>View</th>
                              </tr>
                            </thead>
                          </Table>
                        </>
                      ),
                    });
                  }}
                >
                  <Grid.Col span={8}>
                    <Text size="xs">Cash Expensive</Text>
                    <Text size="xs">
                      {variables.data.length != 0 &&
                      variables.data[4][0].amount_total == null
                        ? 0
                        : variables.data[4][0].amount_total}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={4} align="right">
                    <ActionIcon mt={10}>
                      <ArrowNarrowRight />
                    </ActionIcon>
                  </Grid.Col>
                </Grid>
              </Grid.Col>
            </Grid>
          </Card>
        ) : null}
      </Skeleton>
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
                    headers={[{ label: " Brand Name", key: "label" }]}
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
                  <button className={classes.pdfExcel}>
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
                    onClick={() => setOpened(true)}
                  >
                    Generate
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
              <thead>
                <tr>
                  <Th>Sl.No</Th>
                  <Th>Sale</Th>
                  <Th>Cash Income</Th>
                  <Th>Cash Expense</Th>
                </tr>
              </thead>
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

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Generate Passbook Report"
      >
        <DatePicker
          label="Pic Date for change  or generate last generated"
          placeholder="Pic Date for change"
          value={date}
          onChange={(e) => setDate(e)}
        ></DatePicker>
        <Button
          mt={5}
          mb={5}
          color="gold"
          onClick={GeneratePassbook}
          loading={variables.submitLoading}
        >
          Generate
        </Button>
        <p style={{ fontSize: 10 }}>
          <span style={{ color: "red" }}>*</span>If date selected it will
          generate only for that date{" "}
        </p>
        <p style={{ fontSize: 10 }}>
          <span style={{ color: "red" }}>*</span>If date not selected it will
          generate last date to today date{" "}
        </p>
        <p style={{ fontSize: 10 }}>
          Last generated<span style={{ color: "green" }}></span>If date not
          selected it will generate last date to today date{" "}
        </p>
      </Modal>
    </div>
  );
}

export default Passbook;
