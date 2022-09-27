import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Select,
  NumberInput,
  Tabs,
  Avatar,
  Box,
  Progress,
  FileInput,
} from "@mantine/core"; // Mantine all required compoennts imports list
import {
  Dots,
  Pencil,
  Search,
  Trash,
  CloudUpload,
  DotsCircleHorizontal,
} from "tabler-icons-react"; // For import the icons
import { useForm } from "@mantine/form"; // Mantine form import
import { CSVLink } from "react-csv"; // For export the data to excel format
import {
  handleGetGroup,
  handleAddProduct,
  handleDeleteProduct,
  handleEditProduct,
  handleGetProduct,
  handleGetBrand,
  handleGetSubGroup,
  handleBackupUpload,
  handleBulkProduct,
  handleGetTax,
  handleGetProductHistory,
} from "../../helpers/apis"; // Import for axios requests list for this pages
import notificationHelper from "../../helpers/notification"; // Import notification for this page
import { Th, dataSearch, setSorting, print } from "../../helpers/tableFunction"; // For table data functions
import {
  dataSlice,
  getActiveColor,
  imageModal,
  selectFilter,
  onDownload,
  pageModal,
} from "../../helpers/common"; // Common fuctions uses for applications
import { useModals } from "@mantine/modals"; // Modal from mantine
import excel from "../../assets/images/excel.png"; // Image for excel export
import pdf from "../../assets/images/pdf.png"; // Image for pdf exports

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
import { IconCloudUpload, IconX, IconDownload } from "@tabler/icons";
import { useInterval } from "@mantine/hooks";
import readXlsxFile from "read-excel-file";
import GoldProduct from "../../helpers/GoldProduct";

// For unzip the file data

function Product() {
  // Mantine custome style use
  const { classes, theme } = useStyles();
  const modals = useModals();

  // Setting the variables data for table data
  const [sortedData, setSortedData] = useState([]); // For table data
  const [activePage, setPage] = useState(1); // For set table active page
  const [total, setTotal] = useState(10); // For set total list show in page
  const [search, setSearch] = useState(""); // For set the search value name of table
  const [sortBy, setSortBy] = useState(null); // Seting the sortby table type
  const [reverseSortDirection, setReverseSortDirection] = useState(false); // For set the reverse sort direction
  const [refreshTable, setRefreshTable] = useState(Date.now()); // For refresh table

  // Product golden
  const [productModal, setProductModal] = useState(false);
  const [goldTitle, setGoldTitle] = useState("");
  const [goldValue, setGoldValue] = useState("");
  const [goldData, setGoldData] = useState("");

  // Crop Image

  const openRef = useRef();
  const [image, setImage] = useState("");
  const [upImg, setUpImg] = useState("");
  const [cropConfig, setCropConfig] = useState({
    unit: "%",
    width: 50,
    aspect: 16 / 16,
  });
  const [crop, setCrop] = useState({
    unit: "%",
    width: 50,
    aspect: 16 / 16,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const ref = useRef();

  // Setting the variables data list here
  const [variables, setVariables] = useState({
    skeletonLoading: false,
    submitLoading: false,
    brandList: [],
    groupList: [],
    subgroupList: [],
    taxList: [],
    data: [],
    addDrawer: false,
    openEdit: false,
    deleteIndex: 0,
  });

  // For form validation
  const form = useForm({
    initialValues: {
      name: "",
      group_id: "1",
      subgroup_id: "1",
      brand_id: "1",
      type: "PCS",
      sku: "",
      stock_depletion: 0,
      hsn: "",
      price: 0,
      tax: "",
      stock: 0,
      barcode: "",
    },
    validate: {
      name: (value) => (value.length < 1 ? "Product name is required" : null),
      sku: (value) => (value === "" ? "Product sku is required" : null),
    },
  });

  //   For edit form data validation
  const formEdit = useForm({
    initialValues: {
      name: "",
      group_id: "",
      subgroup_id: "",
      brand_id: "",
      sku: "",
      type: "",
      hsn: "",
      price: 0,
      stock_depletion: 0,
      tax: "",
    },
    validate: {
      name: (value) => (value.length < 1 ? "Product name is required" : null),
      sku: (value) => (value === "" ? "Product sku is required" : null),
    },
  });

  //   For intial setting data
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (mounted) {
        //   For get all the product data list
        const response = await handleGetProduct();
        // On Respose setting the data to variable
        if (response.status === 200) {
          setVariables((variables) => {
            return {
              ...variables,
              data: response.data.data,
              skeletonLoading: false,
            };
          });
          const datas = dataSlice({
            data: response.data.data,
            page: 1,
            total: 10,
          });
          setSortedData(datas);
        }
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
              subgroupList: listSubgroup,
              skeletonLoading: false,
            };
          });
        }

        const response5 = await handleGetTax();
        if (response5.status === 200) {
          if (response5.data.data.length == 0) {
            pageModal({
              data: "./tax",
              title: "Add tax percentage before proceed to product",
            });
          }
          const listTax = await response5.data.data.map((data) => ({
            value: data.label.toString(),
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
      <td style={{ cursor: "pointer" }}>
        <Group spacing="sm">
          <Avatar
            onClick={() =>
              imageModal({
                data: "images/product/" + row.image,
                title: row.label,
              })
            }
            size={20}
            src={"images/product/" + row.image}
          />
          <Group>
            {row.label}
            <ActionIcon
              onClick={async () => {
                const data = await handleGetProductHistory(row.value);
                const list = data.data.data;
                setProductModal(true);
                setGoldData(list);
                setGoldTitle(row.label);
                setGoldValue(row.value);
              }}
              ml={-10}
              color="zevcore"
              variant="transparent"
            >
              <DotsCircleHorizontal size={20} />
            </ActionIcon>
          </Group>
        </Group>
      </td>

      <td>
        {row.brand != "" && typeof row.brand != "undefined"
          ? row.brand.label
          : "-"}
      </td>
      <td>
        {row.group != "" && typeof row.group != "undefined"
          ? row.group.label
          : "-"}
      </td>
      <td>
        {row.subgroup != "" && typeof row.subgroup != "undefined"
          ? row.subgroup.label
          : "-"}
      </td>
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
      title: "Do you want to delete this product value",
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleConfirmDelete(e),
    });
  };
  //   For delete db data from table and db
  const handleConfirmDelete = async (e) => {
    const response = await handleDeleteProduct(e);

    // Check the response for notification and actions
    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Product deleted successfully",
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
    formEdit.setFieldValue(
      "group_id",
      datas.group_id != null ? datas.group_id.toString() : ""
    );
    formEdit.setFieldValue(
      "subgroup_id",
      datas.subgroup_id != null ? datas.subgroup_id.toString() : ""
    );

    formEdit.setFieldValue(
      "brand_id",
      datas.brand_id != null ? datas.brand_id.toString() : ""
    );
    formEdit.setFieldValue("sku", datas.sku);
    formEdit.setFieldValue("stock_depletion", datas.stock_depletion);
    formEdit.setFieldValue("hsn", datas.hsn);
    formEdit.setFieldValue("price", datas.price);
    formEdit.setFieldValue("type", datas.type);
    formEdit.setFieldValue("tax", datas.tax.toString());
    setVariables({ ...variables, deleteIndex: e, openEdit: true });
  };

  // Edit product data compoennt
  const EditProduct = async (e) => {
    console.log(image);
    var req = {
      image: image,
    };
    e = { ...e, ...req };
    setVariables({ ...variables, submitLoading: true });
    const response = await handleEditProduct(e);
    // Check for respose data for actions
    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Product updated successfully",
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

  // Add new product data
  const AddProduct = async (e) => {
    setVariables({ ...variables, submitLoading: true });
    var req = {
      image: image,
    };
    e = { ...e, ...req };

    const response = await handleAddProduct(e);
    // Check for response for actions
    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Product added successfully",
      });
      form.reset();
      setUpImg("");
      setImage("");
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

  // For image cropper
  const ref45 = useRef();
  const changeHandler = (e) => {
    if (e[0]) {
      const reader = new FileReader();

      reader.addEventListener("load", () => setUpImg(reader.result));
      reader.readAsDataURL(e[0]);
      ref.current.value = "";
    }
  };

  // On image change get image details and crop
  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
    const base64Image = canvas.toDataURL("image/jpeg");
    setImage(base64Image);
  }, [completedCrop]);
  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  // For bulk upload
  const [bulkData, setBulkData] = useState([]);

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
  // Upload bulk json data brand
  const BulkDataUpload = async () => {
    setVariables({ ...variables, submitLoading: true });

    const response = await handleBulkProduct(bulkData);
    // Check for response for actions
    if (response.status === 200) {
      interval.stop();
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Bulk product added successfully",
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
        <BreadCrumb Text="Product" />
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
                    headers={[{ label: " Product Name", key: "label" }]}
                    filename="product.csv"
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
                  {/* Drawer open for adding new product data */}
                  <Button
                    variant="outline"
                    color="zevcore"
                    size="xs"
                    onClick={() =>
                      setVariables({ ...variables, addDrawer: true })
                    }
                  >
                    + Add Product
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
                    Product
                  </Th>
                  <Th>Brand</Th>
                  <Th>Group</Th>
                  <Th>Subgroup</Th>
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

      {/* Product Add drawer */}
      <Drawer
        opened={variables.addDrawer}
        onClose={() => {
          setVariables({ ...variables, addDrawer: false });
          setUpImg("");
          setImage("");
        }}
        title="Add Product"
        classNames={{
          header: classes.header,
          drawer: classes.drawer,
          closeButton: classes.closeButton,
        }}
        size="xl"
        position="right"
      >
        {/* Drawer content */}
        <div className="zc-p-1">
          <ScrollArea
            style={{ height: 620 }}
            type="scroll"
            offsetScrollbars
            scrollbarSize={5}
          >
            {/* Product adding form name */}
            <div className="zc-pr-3 zc-pl-3">
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
              <form onSubmit={form.onSubmit((values) => AddProduct(values))}>
                <Select
                  variant="filled"
                  classNames={{ item: classes.selectItem }}
                  label="Select Brand Value"
                  searchable
                  required
                  clearable
                  mb="md"
                  placeholder="Select Brand"
                  {...form.getInputProps("brand_id")}
                  data={variables.brandList}
                />
                <Select
                  variant="filled"
                  classNames={{ item: classes.selectItem }}
                  label="Select Group Value"
                  searchable
                  required
                  clearable
                  mb="md"
                  placeholder="Select Group"
                  {...form.getInputProps("group_id")}
                  data={variables.groupList}
                />
                <Select
                  variant="filled"
                  classNames={{ item: classes.selectItem }}
                  label="Select SubGroup Value"
                  searchable
                  clearable
                  required
                  mb="md"
                  placeholder="Select SubGroup"
                  {...form.getInputProps("subgroup_id")}
                  data={variables.subgroupList.filter(
                    (raw) =>
                      Number(raw.group_id) === Number(form.values.group_id)
                  )}
                />

                <TextInput
                  required
                  variant="filled"
                  value={form.values.name}
                  label="Product Name"
                  placeholder="Product Name"
                  {...form.getInputProps("name")}
                />
                <TextInput
                  required
                  variant="filled"
                  value={form.values.sku}
                  label="Product Sku"
                  placeholder="Product Sku"
                  {...form.getInputProps("sku")}
                />
                <TextInput
                  required
                  variant="filled"
                  value={form.values.hsn}
                  label="Product Hsn"
                  placeholder="Product Hsn"
                  {...form.getInputProps("hsn")}
                />
                <NumberInput
                  required
                  variant="filled"
                  value={form.values.price}
                  label="Product Price"
                  placeholder="Product Price"
                  {...form.getInputProps("price")}
                />
                <NumberInput
                  variant="filled"
                  value={form.values.stock_depletion}
                  label="Product Stock Depletion"
                  placeholder="Product Stock Depletion"
                  {...form.getInputProps("stock_depletion")}
                />
                <NumberInput
                  variant="filled"
                  value={form.values.stock}
                  label="Product initial stock"
                  placeholder="Product initial stock"
                  {...form.getInputProps("stock")}
                />
                <TextInput
                  variant="filled"
                  value={form.values.barcode}
                  label="Product initial stock barcode"
                  placeholder="Product initial stock barcode"
                  {...form.getInputProps("barcode")}
                />
                <Select
                  required
                  variant="filled"
                  classNames={{ item: classes.selectItem }}
                  label="Select Tax %"
                  searchable
                  clearable
                  mb="md"
                  placeholder="Select Tax"
                  {...form.getInputProps("tax")}
                  data={variables.taxList}
                />

                <Select
                  required
                  variant="filled"
                  classNames={{ item: classes.selectItem }}
                  label="Select Type"
                  searchable
                  clearable
                  mb="md"
                  placeholder="Select Type"
                  {...form.getInputProps("type")}
                  data={[
                    { value: "PCS", label: "Pieces" },
                    { value: "KG", label: "Kg" },
                  ]}
                />

                {/* For image croper */}
                {/* For croper */}
                {upImg !== "" && upImg !== null ? (
                  <>
                    <ReactCrop
                      ruleOfThirds={true}
                      style={{ marginTop: 5 }}
                      src={upImg}
                      onImageLoaded={onLoad}
                      crop={crop}
                      onChange={(c) => setCrop(c)}
                      onComplete={(c) => setCompletedCrop(c)}
                    />
                    <div>
                      {previewCanvasRef != null ? (
                        <canvas
                          ref={previewCanvasRef}
                          // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                          style={{
                            width: Math.round(completedCrop?.width ?? 0),
                            height: Math.round(completedCrop?.height ?? 0),
                            marginBottom: 50,
                          }}
                        />
                      ) : null}

                      <Group position="right" mt="md" mb={20}>
                        <Button
                          type="submit"
                          color="zevcore"
                          onClick={() => {
                            setUpImg("");
                            setImage("");
                          }}
                        >
                          Clear Image
                        </Button>
                      </Group>
                    </div>
                  </>
                ) : (
                  // For selecting cropping image dropdown
                  <div
                    style={{
                      marginTop: 15,
                      position: "relative",
                      marginBottom: 30,
                    }}
                  >
                    <Dropzone
                      openRef={openRef}
                      onDrop={changeHandler}
                      style={{
                        borderWidth: 1,
                        paddingBottom: 50,
                      }}
                      radius="md"
                      accept={[
                        "image/png",
                        "image/jpeg",
                        "image/sgv+xml",
                        "image/gif",
                      ]}
                      maxSize={30 * 1024 ** 2}
                    >
                      <div style={{ pointerEvents: "none" }}>
                        <Group position="center">
                          <Dropzone.Accept>
                            <IconDownload
                              size={50}
                              color={theme.colors[theme.primaryColor][6]}
                              stroke={1.5}
                            />
                          </Dropzone.Accept>
                          <Dropzone.Reject>
                            <IconX
                              size={50}
                              color={theme.colors.red[6]}
                              stroke={1.5}
                            />
                          </Dropzone.Reject>
                          <Dropzone.Idle>
                            <IconCloudUpload
                              size={50}
                              color={
                                theme.colorScheme === "dark"
                                  ? theme.colors.dark[0]
                                  : theme.black
                              }
                              stroke={1.5}
                            />
                          </Dropzone.Idle>
                        </Group>
                        <Text align="center" weight={700} size="lg" mt="xl">
                          <Dropzone.Accept>Drop files here</Dropzone.Accept>
                          <Dropzone.Reject>
                            Pdf file less than 30mb
                          </Dropzone.Reject>
                          <Dropzone.Idle>Upload image</Dropzone.Idle>
                        </Text>
                        <Text align="center" size="sm" mt="xs" color="dimmed">
                          Drag&apos;n&apos;drop files here to upload product
                          image. We can accept only <i>.png</i> & <i>.jpg</i>{" "}
                          files that are less than 10mb in size. This product
                          image will used for show in product list
                        </Text>
                      </div>
                    </Dropzone>
                    <Button
                      style={{
                        position: "absolute",
                        width: 250,
                        left: "calc(50% - 125px)",
                        bottom: -20,
                      }}
                      size="md"
                      color="zevcore"
                      radius="xl"
                      onClick={() => openRef.current?.()}
                    >
                      Select files
                    </Button>
                  </div>
                )}

                <Button
                  mt="xl"
                  mb="xl"
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
      {/* Product add drawer end */}

      {/* Product Edit drawer */}
      <Drawer
        opened={variables.openEdit}
        onClose={() => {
          setVariables({ ...variables, openEdit: false });
          setUpImg("");
          setImage("");
        }}
        title="Edit Product"
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
            {/* Product edit form name */}
            <div className="zc-pr-3 zc-pl-3">
              <form
                onSubmit={formEdit.onSubmit((values) => EditProduct(values))}
              >
                <Select
                  variant="filled"
                  classNames={{ item: classes.selectItem }}
                  label="Select Brand Value"
                  searchable
                  clearable
                  mb="md"
                  placeholder="Select Brand"
                  {...formEdit.getInputProps("brand_id")}
                  data={variables.brandList}
                />
                <Select
                  variant="filled"
                  classNames={{ item: classes.selectItem }}
                  label="Select Group Value"
                  searchable
                  clearable
                  mb="md"
                  placeholder="Select Group"
                  {...formEdit.getInputProps("group_id")}
                  data={variables.groupList}
                />
                <Select
                  variant="filled"
                  classNames={{ item: classes.selectItem }}
                  label="Select SubGroup Value"
                  searchable
                  clearable
                  mb="md"
                  placeholder="Select SubGroup"
                  {...formEdit.getInputProps("subgroup_id")}
                  data={variables.subgroupList.filter(
                    (raw) =>
                      Number(raw.group_id) === Number(formEdit.values.group_id)
                  )}
                />
                <TextInput
                  variant="filled"
                  value={formEdit.values.name}
                  label="Product Name"
                  placeholder="Product Name"
                  {...formEdit.getInputProps("name")}
                />
                <TextInput
                  variant="filled"
                  value={formEdit.values.sku}
                  label="Product Sku"
                  placeholder="Product Sku"
                  {...formEdit.getInputProps("sku")}
                />
                <TextInput
                  variant="filled"
                  value={formEdit.values.hsn}
                  label="Product Hsn"
                  placeholder="Product Hsn"
                  {...formEdit.getInputProps("hsn")}
                />
                <NumberInput
                  variant="filled"
                  value={formEdit.values.price}
                  label="Product Price"
                  placeholder="Product Price"
                  {...formEdit.getInputProps("price")}
                />
                <NumberInput
                  variant="filled"
                  value={formEdit.values.stock_depletion}
                  label="Product Stock Depletion"
                  placeholder="Product Stock Depletion"
                  {...formEdit.getInputProps("stock_depletion")}
                />

                <Select
                  variant="filled"
                  classNames={{ item: classes.selectItem }}
                  label="Select Tax %"
                  searchable
                  clearable
                  mb="md"
                  placeholder="Select Tax"
                  {...formEdit.getInputProps("tax")}
                  data={variables.taxList}
                />

                <Select
                  variant="filled"
                  classNames={{ item: classes.selectItem }}
                  label="Select Type"
                  searchable
                  clearable
                  mb="md"
                  placeholder="Select Type"
                  {...formEdit.getInputProps("type")}
                  data={[
                    { value: "PCS", label: "Pieces" },
                    { value: "KG", label: "Kg" },
                  ]}
                />

                {/* For image croper */}
                {/* For croper */}
                {upImg !== "" && upImg !== null ? (
                  <>
                    <ReactCrop
                      ruleOfThirds={true}
                      style={{ marginTop: 5 }}
                      src={upImg}
                      onImageLoaded={onLoad}
                      crop={crop}
                      onChange={(c) => setCrop(c)}
                      onComplete={(c) => setCompletedCrop(c)}
                    />
                    <div>
                      {previewCanvasRef != null ? (
                        <canvas
                          ref={previewCanvasRef}
                          // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                          style={{
                            width: Math.round(completedCrop?.width ?? 0),
                            height: Math.round(completedCrop?.height ?? 0),
                            marginBottom: 50,
                          }}
                        />
                      ) : null}

                      <Group position="right" mt="md" mb={20}>
                        <Button
                          type="submit"
                          color="zevcore"
                          onClick={() => {
                            setUpImg("");
                            setImage("");
                          }}
                        >
                          Clear Image
                        </Button>
                      </Group>
                    </div>
                  </>
                ) : (
                  // For selecting cropping image dropdown
                  <div
                    style={{
                      marginTop: 15,
                      position: "relative",
                      marginBottom: 30,
                    }}
                  >
                    <Dropzone
                      openRef={openRef}
                      onDrop={changeHandler}
                      style={{
                        borderWidth: 1,
                        paddingBottom: 50,
                      }}
                      radius="md"
                      accept={[
                        "image/png",
                        "image/jpeg",
                        "image/sgv+xml",
                        "image/gif",
                      ]}
                      maxSize={30 * 1024 ** 2}
                    >
                      <div style={{ pointerEvents: "none" }}>
                        <Group position="center">
                          <Dropzone.Accept>
                            <IconDownload
                              size={50}
                              color={theme.colors[theme.primaryColor][6]}
                              stroke={1.5}
                            />
                          </Dropzone.Accept>
                          <Dropzone.Reject>
                            <IconX
                              size={50}
                              color={theme.colors.red[6]}
                              stroke={1.5}
                            />
                          </Dropzone.Reject>
                          <Dropzone.Idle>
                            <IconCloudUpload
                              size={50}
                              color={
                                theme.colorScheme === "dark"
                                  ? theme.colors.dark[0]
                                  : theme.black
                              }
                              stroke={1.5}
                            />
                          </Dropzone.Idle>
                        </Group>
                        <Text align="center" weight={700} size="lg" mt="xl">
                          <Dropzone.Accept>Drop files here</Dropzone.Accept>
                          <Dropzone.Reject>
                            Pdf file less than 30mb
                          </Dropzone.Reject>
                          <Dropzone.Idle>Upload image</Dropzone.Idle>
                        </Text>
                        <Text align="center" size="sm" mt="xs" color="dimmed">
                          Drag&apos;n&apos;drop files here to upload product
                          image. We can accept only <i>.png</i> & <i>.jpg</i>{" "}
                          files that are less than 10mb in size. This product
                          image will used for show in product list
                        </Text>
                      </div>
                    </Dropzone>
                    <Button
                      style={{
                        position: "absolute",
                        width: 250,
                        left: "calc(50% - 125px)",
                        bottom: -20,
                      }}
                      size="md"
                      color="zevcore"
                      radius="xl"
                      onClick={() => openRef.current?.()}
                    >
                      Select files
                    </Button>
                  </div>
                )}

                <Button
                  mt="xl"
                  mb="xl"
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
      {/* Product edit drawer end */}

      {/* Group Bulk drawer */}
      <Drawer
        opened={variables.bulkDrawer}
        onClose={() => setVariables({ ...variables, bulkDrawer: false })}
        title="Product Bulk"
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
              onClick={() => onDownload({ data: "product" })}
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
          <Tabs defaultValue="group" mb={20}>
            <Tabs.List>
              <Tabs.Tab value="brand" icon={<Box size={14} />}>
                Brand
              </Tabs.Tab>
              <Tabs.Tab value="group" icon={<Box size={14} />}>
                Group
              </Tabs.Tab>
              <Tabs.Tab value="subgroup" icon={<Box size={14} />}>
                SubGroup
              </Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="group" pt="xs">
              <ScrollArea style={{ height: 150 }}>
                <Table>
                  <thead>
                    <tr>
                      <th>Value</th>
                      <th>Label</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variables.groupList.map((row) => (
                      <tr key={row.label}>
                        <td>{row.value}</td>
                        <td>{row.label}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </ScrollArea>
            </Tabs.Panel>
            <Tabs.Panel value="brand" pt="xs">
              <ScrollArea style={{ height: 150 }}>
                <Table>
                  <thead>
                    <tr>
                      <th>Value</th>
                      <th>Label</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variables.brandList.map((row) => (
                      <tr key={row.label}>
                        <td>{row.value}</td>
                        <td>{row.label}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </ScrollArea>
            </Tabs.Panel>
            <Tabs.Panel value="subgroup" pt="xs">
              <ScrollArea style={{ height: 150 }}>
                <Table>
                  <thead>
                    <tr>
                      <th>Value</th>
                      <th>Label</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variables.subgroupList.map((row) => (
                      <tr key={row.label}>
                        <td>{row.value}</td>
                        <td>{row.label}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </ScrollArea>
            </Tabs.Panel>
          </Tabs>

          {/* Group Bulk add file */}
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
      {/* Group Bulk drawer end */}
      <GoldProduct
        value={goldValue}
        title={goldTitle}
        list={goldData}
        productModal={productModal}
        setProductModal={setProductModal}
      />
    </div>
  );
}
export default Product;
