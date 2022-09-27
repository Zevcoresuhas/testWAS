import React, { useState, useEffect } from "react";
import BreadCrumb from "../../components/BreadCrumb"; // For breadcrumbs data import
import useStyles from "../../components/Style"; // Import the mantine custome styles from the compoents
import {
  Skeleton,
  Card,
  TextInput,
  Group,
  Text,
  Button,
  ActionIcon,
  Select,
  Table,
  ScrollArea,
  Menu,
  NativeSelect,
  Drawer,
  Pagination,
  NumberInput,
} from "@mantine/core"; // Mantine all required compoennts imports list
import { Search, Trash, Dots, Pencil } from "tabler-icons-react"; // For import the icons
import { useForm } from "@mantine/form"; // Mantine form import
import { CSVLink } from "react-csv"; // For export the data to excel format
import { Th, dataSearch, setSorting, print } from "../../helpers/tableFunction"; // For table data functions
import { dataSlice, selectFilter } from "../../helpers/common"; // Common fuctions uses for applications
import { useModals } from "@mantine/modals"; // Modal from mantine
import excel from "../../assets/images/excel.png"; // Image for excel export
import pdf from "../../assets/images/pdf.png"; // Image for pdf exports

import { DatePicker } from "@mantine/dates";
import {
  handleGetProduct,
  handleGetVendor,
  handleGetGroup,
  handleGetBrand,
  handleGetSubGroup,
  handleGetTax,
  handleAddPO,
  handleGetPO,
  handleDeletePO,
  handleDeletePOList,
  handleEditPO,
  handleAddStock,
} from "../../helpers/apis";
import notificationHelper from "../../helpers/notification";

function StockIn(props) {
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
  //   For intial setting data
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (mounted) {
        //   For get all the product data list
        const response = await handleGetPO();

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
        // On Respose setting the data to variable

        const response2 = await handleGetGroup();

        if (response2.status === 200) {
          const listGroup = await selectFilter({
            data: response2.data.data,
          });

          setVariables((variables) => {
            return {
              ...variables,
              groupList: listGroup,
              skeletonLoading: false,
            };
          });
        }
        const response3 = await handleGetBrand();
        if (response3.status === 200) {
          const listBrand = await selectFilter({
            data: response3.data.data,
          });

          setVariables((variables) => {
            return {
              ...variables,
              brandList: listBrand,
              skeletonLoading: false,
            };
          });
        }
        const response4 = await handleGetSubGroup();
        if (response4.status === 200) {
          const listSubgroup = await response4.data.data.map((data) => ({
            value: data.value.toString(),
            label: data.label.toString(),
            group_id: data.group_id,
          }));

          setVariables((variables) => {
            return {
              ...variables,
              subGroupList: listSubgroup,
              skeletonLoading: false,
            };
          });
        }

        const response5 = await handleGetProduct();
        if (response5.status === 200) {
          const listProduct = await response5.data.data.map((data) => ({
            ...data,
            value: data.value.toString(),
            label: data.label.toString(),
          }));

          listProduct.forEach(function (item) {
            delete item.createdAt;
            delete item.updatedAt;
            delete item.brand;
            delete item.group;
            delete item.subgroup;
          });

          setVariables((variables) => {
            return {
              ...variables,
              product: listProduct,
              skeletonLoading: false,
            };
          });
        }

        const response6 = await handleGetTax();
        if (response6.status === 200) {
          const listTax = await response6.data.data.map((data) => ({
            value: data.value.toString(),
            label: data.label.toString(),
          }));

          setVariables((variables) => {
            return {
              ...variables,
              taxList: listTax,
              skeletonLoading: false,
            };
          });
        }

        const response7 = await handleGetVendor();
        if (response7.status === 200) {
          const listVendor = await response7.data.data.map((data) => ({
            value: data.value.toString(),
            label: data.label.toString(),
          }));

          setVariables((variables) => {
            return {
              ...variables,
              vendor: listVendor,
              skeletonLoading: false,
            };
          });
        }
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // Setting the variables data list here
  const [variables, setVariables] = useState({
    skeletonLoading: false,
    submitLoading: false,
    data: [],
    groupList: [],
    brandList: [],
    editPOList: [],
    vendor: [],
    subGroupList: [],
    product: [],
    taxList: [],
    addDrawer: false,
    bulkDrawer: false,
    openEdit: false,
    deleteIndex: 0,
    deleteIndex2: 0,
  });

  useEffect(() => {
    if (opened1 == 1) {
      setVariables({ ...variables, addDrawer: false });
      setOpened1(2);
    } else {
      setVariables({ ...variables, addDrawer: true });
    }
  }, [props.stockDrawer]);

  // For adding data form                                                              Add data  Form
  const form = useForm({
    initialValues: {
      details: [
        {
          brand_id: "",
          group_id: "",
          subgroup_id: "",
          product_id: "",
          barcode: "",
          cost_per_item: 0,
          invoice_no: "",
          total_item: 0,
          date: new Date(),
        },
      ],
      editDetails: [],
      vendor: "",
      editVendor: "",
    },
  });

  // For po add more adding extra row data for po
  const fields = form.values.details.map((_, index) => (
    <tr key={index}>
      <td>
        <Text>{index + 1}</Text>
      </td>
      <td>
        <Select
          variant="filled"
          classNames={{ item: classes.selectItem }}
          searchable
          required
          size="xs"
          placeholder="Select Brand"
          data={variables.brandList}
          {...form.getInputProps(`details.${index}.brand_id`)}
        />
      </td>
      <td>
        <Select
          variant="filled"
          classNames={{ item: classes.selectItem }}
          searchable
          required
          size="xs"
          placeholder="Select Group"
          data={variables.groupList}
          {...form.getInputProps(`details.${index}.group_id`)}
        />
      </td>
      <td>
        <Select
          variant="filled"
          classNames={{ item: classes.selectItem }}
          searchable
          required
          size="xs"
          placeholder="Select Subgroup"
          data={variables.subGroupList.filter(
            (raw) =>
              Number(raw.group_id) ===
              Number(form.values.details[index].group_id)
          )}
          {...form.getInputProps(`details.${index}.subgroup_id`)}
        />
      </td>
      <td>
        <Select
          variant="filled"
          classNames={{ item: classes.selectItem }}
          searchable
          required
          size="xs"
          placeholder="Select Product"
          data={variables.product.filter(
            (raw) =>
              Number(raw.group_id) ===
                Number(form.values.details[index].group_id) &&
              Number(raw.subgroup_id) ===
                Number(form.values.details[index].subgroup_id) &&
              Number(raw.brand_id) ===
                Number(form.values.details[index].brand_id)
          )}
          {...form.getInputProps(`details.${index}.product_id`)}
        />
      </td>

      <td>
        <TextInput
          variant="filled"
          mr={20}
          required
          size="xs"
          placeholder="Total Item"
          {...form.getInputProps(`details.${index}.total_item`)}
        />
      </td>

      <td>
        <TextInput
          variant="filled"
          mr={20}
          required
          size="xs"
          placeholder="Price/ Unit"
          {...form.getInputProps(`details.${index}.cost_per_item`)}
        />
      </td>

      <td>
        <TextInput
          variant="filled"
          mr={20}
          readOnly
          size="xs"
          placeholder="Total"
          value={(
            parseFloat(form.values.details[index].total_item) *
            parseFloat(form.values.details[index].cost_per_item)
          ).toFixed(2)}
        />
      </td>
      <td>
        <TextInput
          variant="filled"
          mr={20}
          required
          size="xs"
          placeholder="Invoice No"
          {...form.getInputProps(`details.${index}.invoice_no`)}
        />
      </td>
      <td>
        <TextInput
          variant="filled"
          mr={20}
          required
          size="xs"
          placeholder="Barcode"
          {...form.getInputProps(`details.${index}.barcode`)}
        />
      </td>
      <td>
        <DatePicker
          mr={20}
          size="xs"
          required
          placeholder="Pick date"
          {...form.getInputProps(`details.${index}.date`)}
        />
      </td>
      <td>
        <ActionIcon
          color="red"
          mr={20}
          variant="hover"
          onClick={() => form.removeListItem("details", index)}
        >
          <Trash size={16} />
        </ActionIcon>
      </td>
    </tr>
  ));

  // For po add more adding extra row data for po
  const fieldEdits = form.values.editDetails.map((_, index) => (
    <tr key={index}>
      <td>
        <Text>{index + 1}</Text>
      </td>
      <td>
        <Select
          variant="filled"
          classNames={{ item: classes.selectItem }}
          searchable
          required
          size="xs"
          value={form.values.editDetails[index].brand_id}
          placeholder="Select Brand"
          data={variables.brandList}
          {...form.getInputProps(`editDetails.${index}.brand_id`)}
        />
      </td>
      <td>
        <Select
          variant="filled"
          classNames={{ item: classes.selectItem }}
          searchable
          required
          size="xs"
          value={form.values.editDetails[index].group_id}
          placeholder="Select Group"
          data={variables.groupList}
          {...form.getInputProps(`editDetails.${index}.group_id`)}
        />
      </td>
      <td>
        <Select
          variant="filled"
          classNames={{ item: classes.selectItem }}
          searchable
          required
          size="xs"
          value={form.values.editDetails[index].subgroup_id}
          placeholder="Select Subgroup"
          data={variables.subGroupList.filter(
            (raw) =>
              Number(raw.group_id) ===
              Number(form.values.editDetails[index].group_id)
          )}
          {...form.getInputProps(`editDetails.${index}.subgroup_id`)}
        />
      </td>
      <td>
        <Select
          variant="filled"
          classNames={{ item: classes.selectItem }}
          searchable
          required
          size="xs"
          placeholder="Select Product"
          value={form.values.editDetails[index].product_id}
          data={variables.product.filter(
            (raw) =>
              Number(raw.group_id) ===
                Number(form.values.editDetails[index].group_id) &&
              Number(raw.subgroup_id) ===
                Number(form.values.editDetails[index].subgroup_id) &&
              Number(raw.brand_id) ===
                Number(form.values.editDetails[index].brand_id)
          )}
          {...form.getInputProps(`editDetails.${index}.product_id`)}
        />
      </td>

      <td>
        <TextInput
          variant="filled"
          mr={20}
          required
          size="xs"
          placeholder="Total Item"
          {...form.getInputProps(`editDetails.${index}.total_item`)}
        />
      </td>

      <td>
        <TextInput
          variant="filled"
          mr={20}
          required
          size="xs"
          placeholder="Price/ Unit"
          {...form.getInputProps(`editDetails.${index}.cost_per_item`)}
        />
      </td>

      <td>
        <TextInput
          variant="filled"
          mr={20}
          readOnly
          size="xs"
          placeholder="Total"
          value={(
            parseFloat(form.values.editDetails[index].total_item) *
            parseFloat(form.values.editDetails[index].cost_per_item)
          ).toFixed(2)}
        />
      </td>
      <td>
        <TextInput
          variant="filled"
          mr={20}
          required
          size="xs"
          placeholder="Invoice No"
          {...form.getInputProps(`editDetails.${index}.invoice_no`)}
        />
      </td>
      <td>
        <TextInput
          variant="filled"
          mr={20}
          required
          size="xs"
          placeholder="Barcode"
          {...form.getInputProps(`editDetails.${index}.barcode`)}
        />
      </td>
      <td>
        <DatePicker
          mr={20}
          size="xs"
          required
          placeholder="Pick date"
          {...form.getInputProps(`editDetails.${index}.date`)}
        />
      </td>
    </tr>
  ));

  // Table data arrabnge by using function and loop throw each data rrange to table body
  const rows = sortedData.map((row, index) => (
    <tr key={row.label}>
      <td>{activePage * total - total + index + 1}</td>
      <td>{row.po_number}</td>
      <td>
        {row.vendor != "" &&
        row.vendor != null &&
        typeof row.vendor != "undefined"
          ? row.vendor.label
          : "-"}
      </td>
      <td>{row.po_lists.length}</td>
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
              Add
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

  const handleAdd = async (e) => {
    setVariables({ ...variables, submitLoading: false });
    var req = {
      po_id: "",
      editDetails: e.details,
      editVendor: e.vendor,
    };

    const response = await handleAddStock(req);

    // Check for response for actions
    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Stock added successfully",
      });
      setVariables({
        ...variables,
        submitLoading: false,
        openEdit: false,
        data: response.data.data,
      });
      form.reset();
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
  //For delete confirm modal show                                               Delete
  const openConfirmModal2 = (e) => {
    setVariables({ ...variables, deleteIndex2: e, openEdit: false });
    modals.openConfirmModal({
      title: "Do you want to delete this po item value",
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () =>
        setVariables({ ...variables, deleteIndex2: 0, openEdit: true }),
      onConfirm: () => handleConfirmDelete2(e),
    });
  };

  //For delete confirm modal show                                               Delete
  const openConfirmModal = (e) => {
    setVariables({ ...variables, deleteIndex: e });
    modals.openConfirmModal({
      title: "Do you want to delete this po value",
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleConfirmDelete(e),
    });
  };
  //   For delete db data from table and db
  const handleConfirmDelete = async (e) => {
    const response = await handleDeletePO(e);
    // Check the response for notification and actions

    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Brand deleted successfully",
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

  const handleConfirmDelete2 = async (e) => {
    const response = await handleDeletePOList(e);
    // Check the response for notification and actions

    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "PO List deleted successfully",
      });

      setVariables({
        ...variables,
        submitLoading: false,
        openEdit: false,
        data: response.data.data,
      });
      form.reset();
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

  const handleEdit = (e) => {
    var datas = variables.data.find((img) => img.value === e);

    datas.po_lists = datas.po_lists.map((data) => ({
      ...data,
      brand_id: data.brand_id.toString(),
      group_id: data.group_id.toString(),
      product_id: data.product_id.toString(),
      subgroup_id: data.subgroup_id.toString(),
    }));

    form.setFieldValue("editDetails", datas.po_lists);

    if (
      datas.vendor_id != null &&
      typeof datas.vendor_id != "undefined" &&
      datas.vendor_id != ""
    ) {
      form.setFieldValue("editVendor", datas.vendor_id.toString());
    } else {
      form.setFieldValue("editVendor", "");
    }
    setVariables({
      ...variables,
      deleteIndex: e,
      editPOList: datas.po_lists,
      openEdit: true,
    });
    setRefreshTable(new Date());
  };
  const handleEdits = async (e) => {
    setVariables({ ...variables, submitLoading: false });
    var req = {
      po_id: variables.deleteIndex,
    };
    e = { ...e, ...req };

    const response = await handleAddStock(e);

    // Check for response for actions
    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Stock added successfully",
      });
      setVariables({
        ...variables,
        submitLoading: false,
        openEdit: false,
        data: response.data.data,
      });
      form.reset();
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
  return (
    <div>
      {/* For breadcrumbs */}
      <Skeleton radius="md" visible={variables.skeletonLoading}>
        <BreadCrumb Text="Purchase" />
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
                    headers={[{ label: " PO Name", key: "label" }]}
                    filename="purchaseOrder.csv"
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
                        header: ["PO Name", "Id"],
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
                  {/* Drawer open for adding new purchaseOrder data */}
                  <Button
                    variant="outline"
                    color="zevcore"
                    size="xs"
                    onClick={() =>
                      setVariables({ ...variables, addDrawer: true })
                    }
                  >
                    + Manual Stock
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
                  <Th>Po Number</Th>
                  <Th>Vendor</Th>
                  <Th>Total</Th>
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

      {/* Data adding form*/}
      <Drawer
        opened={variables.addDrawer}
        onClose={() => setVariables({ ...variables, addDrawer: false })}
        title="Add Purchase Order"
        classNames={{
          header: classes.header,
          drawer: classes.drawer,
          closeButton: classes.closeButton,
        }}
        size="100%"
        position="right"
      >
        <div style={{ padding: 24 }}>
          {/* For adding new po data list */}
          <form onSubmit={form.onSubmit((values) => handleAdd(values))}>
            <Select
              variant="filled"
              classNames={{ item: classes.selectItem }}
              mr={20}
              sx={{ width: 200 }}
              searchable
              label="Select Vendor"
              placeholder="Select Vendor"
              {...form.getInputProps("vendor")}
              data={variables.vendor}
            />
            <Group position="right" mt={10}>
              {/* On click more adding extra row here */}
              <Button
                color="zevcore"
                size="xs"
                mb="sm"
                onClick={() =>
                  form.insertListItem("details", {
                    brand_id: "",
                    group_id: "",
                    subgroup_id: "",
                    product_id: "",
                    barcode: "",
                    cost_per_item: "",
                    invoice_no: "",
                    total_item: 0,
                    date: new Date(),
                  })
                }
              >
                Add Item
              </Button>
            </Group>
            <ScrollArea
              className="add_more_scroll"
              scrollbarSize={10}
              color="gold"
              style={{ height: 280 }}
            >
              {fields.length > 0 ? (
                <>
                  <Table
                    horizontalSpacing="md"
                    verticalSpacing="xs"
                    className={classes.striped}
                  >
                    <thead>
                      <tr>
                        <Th>Sl.No</Th>
                        <Th>Brand</Th>
                        <Th>Group</Th>
                        <Th>Subgroup</Th>
                        <Th>Product</Th>

                        <Th>Quantity</Th>
                        <Th>Price/Unit</Th>
                        <Th>Total</Th>
                        <Th>Invoice No</Th>
                        <Th>Barcode</Th>
                        <Th>Date</Th>
                        <Th>Action</Th>
                      </tr>
                    </thead>

                    <tbody key={refreshTable}>{fields}</tbody>
                  </Table>
                </>
              ) : null}
            </ScrollArea>
            <Group position="right" mt="md">
              <Button type="submit" color="zevcore">
                Submit
              </Button>
            </Group>
          </form>
        </div>
      </Drawer>
      {/* Data adding form */}

      {/* Data Edit adding form*/}
      <Drawer
        opened={variables.openEdit}
        onClose={() => setVariables({ ...variables, openEdit: false })}
        title="Add Stock"
        classNames={{
          header: classes.header,
          drawer: classes.drawer,
          closeButton: classes.closeButton,
        }}
        size="100%"
        position="right"
      >
        <div style={{ padding: 24 }}>
          {/* For adding new po data list */}
          <form onSubmit={form.onSubmit((values) => handleEdits(values))}>
            <Select
              variant="filled"
              mr={20}
              sx={{ width: 200 }}
              searchable
              size="xs"
              classNames={{ item: classes.selectItem }}
              label="Select Vendor"
              placeholder="Select Vendor"
              {...form.getInputProps("editVendor")}
              data={variables.vendor}
            />

            <ScrollArea
              className="add_more_scroll"
              scrollbarSize={10}
              color="gold"
              mt="md"
              style={{ height: 280 }}
            >
              {fields.length > 0 ? (
                <>
                  <Table
                    horizontalSpacing="md"
                    verticalSpacing="xs"
                    className={classes.striped}
                  >
                    <thead>
                      <tr>
                        <Th>Sl.No</Th>
                        <Th>Brand</Th>
                        <Th>Group</Th>
                        <Th>Subgroup</Th>
                        <Th>Product</Th>
                        <Th>Quantity</Th>
                        <Th>Price / Unit</Th>
                        <Th>Total</Th>
                        <Th>Invoice No</Th>
                        <Th>Barcode</Th>
                        <Th>Date</Th>
                      </tr>
                    </thead>

                    <tbody key={refreshTable}>{fieldEdits}</tbody>
                  </Table>
                </>
              ) : null}
            </ScrollArea>
            <Group position="right" mt="md">
              <Button type="submit" color="zevcore">
                Submit
              </Button>
            </Group>
          </form>
        </div>
      </Drawer>
      {/* Data Edit adding form */}
    </div>
  );
}

export default StockIn;
