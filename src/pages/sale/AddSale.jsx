import {
  Grid,
  Card,
  Select,
  TextInput,
  Button,
  NumberInput,
  Text,
  ScrollArea,
  ActionIcon,
  Group,
  Drawer,
  Paper,
  Divider,
  Menu,
  Modal,
  NativeSelect,
  Pagination,
  Table,
  Avatar,
} from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import React, { useEffect, useState, useRef, forwardRef } from "react";
import {
  handleAddCustomer,
  handleAddInvoice2,
  handleDeleteSaveInvoice,
  handleGetBank,
  handleGetBrand,
  handleGetCustomer,
  handleGetGroup,
  handleGetInvoice,
  handleGetOneSaveInvoice,
  handleGetProduct,
  handleGetProductStock,
  handleGetSaleType,
  handleGetSaveInvoice,
  handleGetStock,
  handleGetSubGroup,
  handleSaveInvoice,
} from "../../helpers/apis";
import { dataSlice, selectFilter } from "../../helpers/common";
import { useForm } from "@mantine/form"; // Mantine form import
import { DatePicker } from "@mantine/dates";
import { Plus, Trash, X, Dots, Eye, Search } from "tabler-icons-react";
import useStyles from "../../components/Style";
import notificationHelper from "../../helpers/notification";
import { addAccount } from "../../electron-backend/routes/account.routes";
import { RichTextEditor } from "@mantine/rte";
import { useNavigate } from "react-router-dom";
import { dataSearch, Th } from "../../helpers/tableFunction";
import { useModals } from "@mantine/modals";

function AddSale() {
  const targetRef = useRef(null);
  const { classes } = useStyles();
  const [cart, setCart] = useState([]);
  const [saleTypeValue, setSaleTypeValue] = useState("Cash");
  const [saleTypeBank, setSaleTypeBank] = useState(null);
  const [detailsModal, setDetailModal] = useState(false);
  const [savedModal, setSavedModal] = useState(false);
  const [tableRefresh, setTableRefresh] = useState(new Date());
  const [validateBarcode, setValidateBarcode] = useState(0);
  const [customer, setCustomer] = useState("");
  let navigate = useNavigate();
  const [variables, setVariables] = useState({
    addDrawer: false,
    data: [],
    skeletonLoading: false,
    submitLoading: false,
    productBarcode: false,
    brandList: [],
    invoiceList: [],
    productList: [],
    groupList: [],
    subgroupList: [],
    taxList: [],
    customer: [],
    saleType: [],
    banksList: [],
    amountPaid: 0,
    stocks: [],
    invoiceDate: new Date(),
  });
  const modals = useModals();
  // Setting the variables data for table data
  const [sortedData, setSortedData] = useState([]); // For table data
  const [activePage, setPage] = useState(1); // For set table active page
  const [total, setTotal] = useState(10); // For set total list show in page
  const [search, setSearch] = useState(""); // For set the search value name of table
  const [sortBy, setSortBy] = useState(null); // Seting the sortby table type
  const [reverseSortDirection, setReverseSortDirection] = useState(false); // For set the reverse sort direction
  const [refreshTable, setRefreshTable] = useState(Date.now()); // For refresh table
  const [lastInvoice, setLastInvoice] = useState(Date.now());

  const form = useForm({
    initialValues: {
      customer: "",
      group: "",
      subgroup: "",
      brand: "",
      product: "",
      gst: "",
      qty: 1,
      discount: 0,
      barcode: "",
      price: "",
      discount_type: "number",
    },
  });

  const formBarcode = useForm({
    initialValues: {
      barcode: "",
      product_name: "",
      product: "",
      price: 0,
      quantity: 1,
      discountType: "number",
      discount: "",
    },
  });

  const formCustomer = useForm({
    initialValues: {
      name: "",
      phone_number: "",
      credit_limit: 5000,
      gstin: "",
      door_no: "",
      street: "",
      locality: "",
      pincode: "",
      city: "",
      state: "",
    },
    validate: {
      name: (value) => (value.length < 1 ? "Customer name is required" : null),
      phone_number: (value) =>
        value.length < 10 ? "Phone name is required" : null,
    },
  });

  const AddCustomer = async (e) => {
    setVariables({ ...variables, submitLoading: true });
    const response = await handleAddCustomer(e);
    // Check for response for actions
    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Customer added successfully",
      });
      formCustomer.reset();
      const listGroup = await selectFilter({
        data: response.data.data,
      });

      setVariables((variables) => {
        return {
          ...variables,
          customer: listGroup,
          submitLoading: false,
        };
      });
    } else {
      notificationHelper({
        color: "red",
        title: "Failed! Please enter correct details",
        message: response.data.message,
      });
      setVariables({ ...variables, submitLoading: false });
    }
  };

  const formDetails = useForm({
    initialValues: {
      deliver_note: "",
      suppliers_ref: "",
      other_ref: "",
      buyer_order_no: "",
      dated: "",
      despatch_doc_no: "",
      delivery_note_date: "",
      despatched_through: "",
      destination: "",
      terms_of_delivery: "",
      remark: "",
    },
  });

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      const response2 = await handleGetCustomer();
      // On Respose setting the data to variable
      if (response2.status === 200) {
        console.log(response2, "customer");
        const listGroup = await selectFilter({
          data: response2.data.data,
        });

        setVariables((variables) => {
          return {
            ...variables,
            customer: listGroup,
          };
        });
      }

      const response3 = await handleGetGroup();
      // On Respose setting the data to variable
      if (response3.status === 200) {
        const listGroup = await selectFilter({
          data: response3.data.data,
        });
        setVariables((variables) => {
          return {
            ...variables,
            groupList: listGroup,
          };
        });
      }

      const response4 = await handleGetSubGroup();
      // On Respose setting the data to variable
      if (response4.status === 200) {
        const listGroup = await response4.data.data.map((data) => ({
          value: data.value.toString(),
          group_id: data.group_id.toString(),
          label: data.label.toString(),
        }));
        setVariables((variables) => {
          return {
            ...variables,
            subgroupList: listGroup,
          };
        });
      }

      const response5 = await handleGetBrand();
      // On Respose setting the data to variable
      if (response5.status === 200) {
        const listGroup = await selectFilter({
          data: response5.data.data,
        });
        setVariables((variables) => {
          return {
            ...variables,
            brandList: listGroup,
          };
        });
      }

      const response6 = await handleGetProduct();
      // On Respose setting the data to variable
      if (response6.status === 200) {
        const response9 = await handleGetProductStock();
        if (response9.status === 200) {
          const productStock = response9.data.data;
          console.log(productStock);

          const listGroup = await response6.data.data.map((data) => ({
            ...data,
            value: data.value.toString(),

            stock: productStock.reduce(function (sum, img) {
              if (Number(img.value) == Number(data.value)) {
                return +Number(sum) + +Number(img.max_reaming);
              } else {
                return sum;
              }
            }, 0),
            label: data.label.toString(),
          }));
          listGroup.forEach(function (item) {
            delete item.createdAt;
            delete item.updatedAt;
            delete item.brand;
            delete item.group;
            delete item.subgroup;
          });
          console.log(listGroup);
          setVariables((variables) => {
            return {
              ...variables,
              productList: listGroup,
            };
          });
        } else {
          const listGroup = await response6.data.data.map((data) => ({
            ...data,
            value: data.value.toString(),

            label: data.label.toString(),
          }));
          listGroup.forEach(function (item) {
            delete item.createdAt;
            delete item.updatedAt;
            delete item.brand;
            delete item.group;
            delete item.subgroup;
          });
          console.log(listGroup);
          setVariables((variables) => {
            return {
              ...variables,
              productList: listGroup,
            };
          });
        }
      }

      const response7 = await handleGetSaleType();
      // On Respose setting the data to variable
      if (response7.status === 200) {
        const listGroup = await response7.data.data.map((data) => ({
          value: data.label.toString(),
          label: data.label.toString(),
        }));
        setVariables((variables) => {
          return {
            ...variables,
            saleType: listGroup,
          };
        });
      }

      const response8 = await handleGetBank();

      // On Respose setting the data to variable
      if (response8.status === 200) {
        const listGroup = await response8.data.data.map((data) => ({
          value: data.label.toString(),
          label: data.label.toString(),
        }));
        setVariables((variables) => {
          return {
            ...variables,
            banksList: listGroup,
          };
        });
      }

      const response9 = await handleGetStock();

      // On Respose setting the data to variable
      if (response9.status === 200) {
        setVariables((variables) => {
          return {
            ...variables,
            stocks: response9.data.data,
          };
        });
      }

      const response10 = await handleGetSaveInvoice();

      // On Respose setting the data to variable
      if (response10.status === 200) {
        setVariables((variables) => {
          return {
            ...variables,
            data: response10.data.data,
          };
        });
        const datas = dataSlice({
          data: response10.data.data,
          page: 1,
          total: 10,
        });
        setSortedData(datas);
      }
      // For get the all invoices
      const response11 = await handleGetInvoice();

      // On Respose setting the data to variable
      if (response11.status === 200) {
        setVariables((variables) => {
          return {
            ...variables,
            invoiceList: response11.data.data,
          };
        });

        var data77 = response11.data.data;
        var datao = data77[data77.length - 1];
        setLastInvoice(datao.invoice_date);
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
      <td>{row.invoice_number}</td>
      <td>{row.customer_id}</td>
      <td>{row.discount}</td>
      <td>{row.sub_total}</td>
      <td>{row.cgst}</td>
      <td>{row.sgst}</td>
      <td>{row.total}</td>

      <td>
        {new Date(row.invoice_date).toLocaleString("en-US", {
          hour12: true,
        })}
      </td>
      <td>
        <Button
          color="green"
          size="xs"
          onClick={async () => {
            console.log("hi");
            const reg = {
              id: row.invoice_number,
            };

            const response = await handleGetOneSaveInvoice(reg);

            if (response.status === 200) {
              console.log(response.data.data);
              var data_list = response.data.data.save_invoice_items;
              var list = [];
              for (let i = 0; i < data_list.length; i++) {
                var total = Number(
                  (Number(data_list[i].product.price) - Number(0)) *
                    Number(data_list[i].count)
                ).toFixed(2);
                var pick = {
                  group: data_list[i].product.group,
                  subgroup: data_list[i].product.subgroup,
                  brand: data_list[i].product.brand,
                  product: data_list[i].product,

                  price: data_list[i].product.price,
                  tax_per: data_list[i].product.tax,
                  tax: Number(
                    (data_list[i].product.tax / 2 / 100) * Number(total)
                  ).toFixed(2),
                  qty: Number(data_list[i].count),
                  discount: 0,
                  total: total,
                };
                list.push(pick);
              }
              setCart(list);
              setSavedModal(false);
            }
          }}
        >
          Load
        </Button>
      </td>
      {/* For action drop down edit and delete the data */}
      <td justifycontent="right" align="right">
        <Menu shadow="sm" size="xs">
          <Menu.Target>
            <ActionIcon
              color="zevcore"
              type="button"
              style={{ marginLeft: 5 }}
              size="xs"
            >
              <Dots />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              style={{ fontSize: 12 }}
              onClick={() => openConfirmModal(row.value)}
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
    setSavedModal(false);
    setVariables({ ...variables, deleteIndex: e });
    modals.openConfirmModal({
      title: "Do you want to delete this sale value",
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => setSavedModal(true),
      onConfirm: () => handleConfirmDelete(e),
    });
  };
  //   For delete db data from table and db
  const handleConfirmDelete = async (e) => {
    const response = await handleDeleteSaveInvoice(e);
    // Check the response for notification and actions

    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Saved Sale deleted successfully",
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

  const DeleteProduct = (e) => {
    console.log("hi");
    var check = cart.findIndex(
      (img) => Number(img.product.value) === Number(e)
    );
    var data = cart;
    data.splice(check, 1);
    setCart(data);
    setTableRefresh(new Date());
  };
  var mergeTwoLists = function (list1, list2) {
    var array = [];
    for (let i = 0; i < list1; i++) {
      console.log(list1[i], list2[i]);
      array[i].push(list1[i], list2[i]);
    }
    return array;
  };
  const AddProduct = (e) => {
    var check = cart.find(
      (img) => Number(img.product.value) === Number(e.product)
    );

    if (check == null && typeof check != "undefined") {
      var dataList = cart;
      var check = cart.findIndex(
        (img) => Number(img.product.value) === Number(e.product)
      );
      var discount = 0;

      if (e.discount_type == "number") {
        discount = e.discount;
      } else {
        discount = (Number(e.discount) / 100) * e.price;
      }
      var product = variables.productList.find(
        (img) => Number(img.value) === Number(e.product)
      );
      var total = Number(
        (Number(e.price) - Number(discount)) *
          (Number(e.qty) + Number(dataList[check].qty))
      ).toFixed(2);
      var list = {
        group: variables.groupList.find(
          (img) => Number(img.value) === Number(e.group)
        ),
        subgroup: variables.subgroupList.find(
          (img) => Number(img.value) === Number(e.subgroup)
        ),
        brand: variables.brandList.find(
          (img) => Number(img.value) === Number(e.brand)
        ),
        product: variables.productList.find(
          (img) => Number(img.value) === Number(e.product)
        ),
        price: e.price,
        tax_per: product.tax,
        tax: Number((product.tax / 2 / 100) * Number(total)).toFixed(2),
        qty: Number(e.qty) + Number(dataList[check].qty),
        discount: discount,
        total: total,
      };
      dataList[check] = list;
      setCart(dataList);
      setTableRefresh(new Date());
    } else {
      var discount = 0;

      if (e.discount_type == "number") {
        discount = e.discount;
      } else {
        discount = (Number(e.discount) / 100) * e.price;
      }

      var product = variables.productList.find(
        (img) => Number(img.value) === Number(e.product)
      );
      var total = Number(
        (Number(e.price) - Number(discount)) * Number(e.qty)
      ).toFixed(2);

      var list = {
        group: variables.groupList.find(
          (img) => Number(img.value) === Number(e.group)
        ),
        subgroup: variables.subgroupList.find(
          (img) => Number(img.value) === Number(e.subgroup)
        ),
        brand: variables.brandList.find(
          (img) => Number(img.value) === Number(e.brand)
        ),
        product: variables.productList.find(
          (img) => Number(img.value) === Number(e.product)
        ),
        tax_per: product.tax,
        tax: Number((product.tax / 2 / 100) * Number(total)).toFixed(2),
        price: e.price,
        qty: e.qty,
        discount: discount,
        total: total,
      };

      var data = cart;
      data.push(list);
      setCart(data);
      setTableRefresh(new Date());
    }
    // form.reset();
    console.log(cart.length);
    if (cart.length > 20) {
      targetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }

    setVariables({ ...variables, productBarcode: false });
  };

  const handelKeyPress = (e) => {
    if (e.key === "Enter") {
      input0.current.blur();
      input1.current.focus();
    }
  };

  const formRef = useRef();
  const input0 = useRef();
  const input1 = useRef();
  const input2 = useRef();
  const input3 = useRef();
  const input4 = useRef();
  const input5 = useRef();
  const input6 = useRef();
  const input7 = useRef();
  const input8 = useRef();

  const barcode = (e) => {
    var barcode = e.target.value;
    const stockList = variables.stocks;
    console.log(barcode);
    const finding = stockList.find((img) => img.barcode === barcode);
    console.log(finding);
    if (typeof finding != "undefined" && finding != "" && finding != null) {
      formBarcode.setFieldValue("barcode", "");
      form.setFieldValue("product", finding.product.value.toString());
      form.setFieldValue("brand", finding.product.brand.value.toString());
      form.setFieldValue("group", finding.product.group.value.toString());
      form.setFieldValue("subgroup", finding.product.subgroup.value.toString());
      form.setFieldValue("price", Number(finding.product.price));
    } else {
      setValidateBarcode(2);
    }
    setTimeout(() => {
      setValidateBarcode(0);
    }, 3000);
  };
  const selRef = useRef();

  const SelectItem = forwardRef(({ image, label, stock, ...others }) => (
    <div ref={selRef} {...others}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Text size="sm">{label}</Text>
        <Text size="xs" color="dimmed">
          {stock}
        </Text>
      </div>
    </div>
  ));

  const AddSaleData = async () => {
    var first = new Date(lastInvoice).setHours(0, 0, 0, 0);
    var second = new Date(formDetails.values.dated).setHours(0, 0, 0, 0);
    var third = new Date().setHours(0, 0, 0, 0);

    var check = 0;
    if (lastInvoice != "") {
      if (first <= second && second <= third) {
        check = 0;
      } else {
        check = 1;
      }
    }
    if (check == 0) {
      var customerId = "";
      if (form.values.customer !== null && form.values.customer !== "") {
        var data = variables.customer.find(
          (img) => Number(img.value) === Number(form.values.customer)
        );
        customerId = data.label;
      }
      const reg = {
        discountValue: cart
          .reduce(function (sum, current) {
            return +Number(sum) + Number(current.discount);
          }, 0)
          .toFixed(2),
        subTotal: cart.reduce(function (sum, current) {
          return +Number(sum) + Number(current.total);
        }, 0),
        totalTax: Number(
          cart.reduce(function (sum, current) {
            return +Number(sum) + Number(current.tax);
          }, 0)
        ).toFixed(2),
        sale_type: saleTypeValue,
        customer: customerId,
        address: "",
        terms_of_delivery: formDetails.values.terms_of_delivery,
        remark: formDetails.values.remark,
        destination: formDetails.values.destination,
        despatched_through: formDetails.values.despatched_through,
        delivery_note_date: formDetails.values.delivery_note_date,
        despatch_doc_no: formDetails.values.despatch_doc_no,
        dated: formDetails.values.dated,
        buyer_order_no: formDetails.values.buyer_order_no,
        other_ref: formDetails.values.other_ref,
        suppliers_ref: formDetails.values.suppliers_ref,
        deliver_note: formDetails.values.deliver_note,
        bank_name: saleTypeBank,
        grand_total:
          cart.reduce(function (sum, current) {
            return +Number(sum) + Number(current.total);
          }, 0) +
          cart.reduce(function (sum, current) {
            return +Number(sum) + Number(current.tax);
          }, 0),
        list: cart,
        balance:
          cart.reduce(function (sum, current) {
            return +Number(sum) + Number(current.total);
          }, 0) +
          cart.reduce(function (sum, current) {
            return +Number(sum) + Number(current.tax);
          }, 0) -
          Number(variables.amountPaid),
        paid: variables.amountPaid,
        date: variables.invoiceDate,
      };
      console.log(reg);
      const response = await handleAddInvoice2(reg);
      if (response.status === 200) {
        navigate(
          "/print_invoice/" + response.data.data[0].dataValues.invoice_number
        );

        notificationHelper({
          color: "green",
          title: "Success",
          message: "Invoice added successfully",
        });
      } else {
        notificationHelper({
          color: "red",
          title: "Failed! Please enter correct details",
          message: response.data.message,
        });
      }
    } else {
      alert("Please select invoice date correctly");
    }
  };

  const handleSaveSale = async () => {
    var customerId = "";
    if (form.values.customer !== null && form.values.customer !== "") {
      var data = variables.customer.find(
        (img) => Number(img.value) === Number(form.values.customer)
      );
      customerId = data.label;
    }
    const reg = {
      discountValue: cart
        .reduce(function (sum, current) {
          return +Number(sum) + Number(current.discount);
        }, 0)
        .toFixed(2),
      subTotal: cart.reduce(function (sum, current) {
        return +Number(sum) + Number(current.total);
      }, 0),
      totalTax: Number(
        cart.reduce(function (sum, current) {
          return +Number(sum) + Number(current.tax);
        }, 0)
      ).toFixed(2),
      sale_type: saleTypeValue,
      customer: customerId,
      address: "",
      terms_of_delivery: formDetails.values.terms_of_delivery,
      remark: formDetails.values.remark,
      destination: formDetails.values.destination,
      despatched_through: formDetails.values.despatched_through,
      delivery_note_date: formDetails.values.delivery_note_date,
      despatch_doc_no: formDetails.values.despatch_doc_no,
      dated: formDetails.values.dated,
      buyer_order_no: formDetails.values.buyer_order_no,
      other_ref: formDetails.values.other_ref,
      suppliers_ref: formDetails.values.suppliers_ref,
      deliver_note: formDetails.values.deliver_note,
      bank_name: saleTypeBank,
      grand_total:
        cart.reduce(function (sum, current) {
          return +Number(sum) + Number(current.total);
        }, 0) +
        cart.reduce(function (sum, current) {
          return +Number(sum) + Number(current.tax);
        }, 0),
      list: cart,
      balance:
        cart.reduce(function (sum, current) {
          return +Number(sum) + Number(current.total);
        }, 0) +
        cart.reduce(function (sum, current) {
          return +Number(sum) + Number(current.tax);
        }, 0) -
        Number(variables.amountPaid),
      paid: variables.amountPaid,
      date: variables.invoiceDate,
    };
    console.log(reg);
    const response = await handleSaveInvoice(reg);
    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Invoice saved successfully",
      });
      formDetails.reset();
      form.reset();
      setSaleTypeBank("");
      setCustomer(null);
      setVariables({ ...variables, amountPaid: 0, invoiceDate: new Date() });
      setCart([]);
      setTotal(0);

      setSaleTypeValue(null);
    } else {
      notificationHelper({
        color: "red",
        title: "Failed! Please enter correct details",
        message: response.data.message,
      });
    }
  };

  return (
    <div>
      {" "}
      <Grid pb={0} gutter="xs" classNames="zc-hide-scroll">
        <Grid.Col xs={4}>
          <Card p={0} className="border">
            <div
              style={{
                display: "flex",
                padding: 6,
                margin: 0,
                justifyContent: "space-between",
                background: "#043c64",
                borderTopRightRadius: 3,
                borderTopLeftRadius: 3,
              }}
            >
              <Text color="#ffffff" weight={500} style={{ paddingTop: -15 }}>
                Create Invoice
              </Text>
            </div>

            <div style={{ padding: 15 }}>
              {/* For add new customer or selct customer */}

              <Grid grow gutter="xs">
                <Grid.Col span={12}>
                  <div
                    style={{
                      display: "flex",
                      marginTop: 0,
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ fontSize: 14 }} weight={500}>
                      Select Customer
                    </Text>
                    <Button
                      color="zevcore"
                      onClick={() =>
                        setVariables({ ...variables, addDrawer: true })
                      }
                      style={{ fontSize: 10, padding: 2, height: 15 }}
                    >
                      Add <Plus size={10} />
                    </Button>
                  </div>

                  <Select
                    variant="filled"
                    fullWidth
                    dropdownPosition="bottom"
                    searchable
                    clearable
                    placeholder="Select Customer"
                    data={variables.customer}
                    value={customer}
                    {...form.getInputProps("customer")}
                    mr={2}
                  />
                  <DatePicker
                    variant="filled"
                    value={variables.invoiceDate}
                    onChange={(e) =>
                      setVariables({
                        ...variables,
                        invoiceDate: e,
                      })
                    }
                    label="Invoice Date"
                    placeholder="Pick date"
                    required
                  />
                </Grid.Col>
              </Grid>
              <Divider
                my="xs"
                label="Product Barcode Enter"
                labelPosition="center"
              />
              <Grid>
                <Grid.Col span={12}>
                  <TextInput
                    variant="filled"
                    size="xs"
                    label="Product Barcode"
                    placeholder="Product Barcode"
                    onKeyDown={barcode}
                    {...formBarcode.getInputProps("barcode")}
                  />
                  {validateBarcode == 1 ? (
                    <Text mt={2} color={"green"} size="xs">
                      Item added to cart success
                    </Text>
                  ) : validateBarcode == 2 ? (
                    <Text mt={2} color={"red"} size="xs">
                      No item found for this barcode
                    </Text>
                  ) : (
                    <Text mt={2} size="xs">
                      &nbsp;
                    </Text>
                  )}
                </Grid.Col>
              </Grid>
              <Divider my="xs" label="Product Select" labelPosition="center" />
              <form
                ref={formRef}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
                onSubmit={form.onSubmit((values) => AddProduct(values))}
              >
                <Grid grow gutter="xs">
                  <Grid.Col span={6}>
                    <Select
                      ref={input0}
                      variant="filled"
                      size="xs"
                      fullWidth
                      onKeyDown={(e) => {
                        if (form.values.group != "") {
                          if (e.key === "Enter") {
                            input0.current.blur();
                            input1.current.focus();
                          }
                        }
                      }}
                      onKeyUp={(e) => {
                        if (form.values.group != "") {
                          if (e.key === "Enter") {
                            input0.current.blur();
                            input1.current.focus();
                          }
                        }
                      }}
                      dropdownPosition="bottom"
                      label="Select Group"
                      searchable
                      clearable
                      placeholder="Select Group"
                      data={variables.groupList}
                      value={form.values.group}
                      {...form.getInputProps("group")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Select
                      variant="filled"
                      size="xs"
                      ref={input1}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          input1.current.blur();
                          input2.current.focus();
                        }
                      }}
                      onKeyUp={(e) => {
                        if (e.key === "Enter") {
                          input1.current.blur();
                          input2.current.focus();
                        }
                      }}
                      fullWidth
                      dropdownPosition="bottom"
                      label="Select Sub-Group"
                      searchable
                      clearable
                      placeholder="Select Group"
                      value={form.values.subgroup}
                      {...form.getInputProps("subgroup")}
                      data={variables.subgroupList.filter(
                        (raw) =>
                          Number(raw.group_id) === Number(form.values.group)
                      )}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Select
                      ref={input2}
                      size="xs"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          input2.current.blur();
                          input3.current.focus();
                        }
                      }}
                      onKeyUp={(e) => {
                        if (e.key === "Enter") {
                          input2.current.blur();
                          input3.current.focus();
                        }
                      }}
                      variant="filled"
                      fullWidth
                      dropdownPosition="bottom"
                      label="Select Brand"
                      searchable
                      clearable
                      placeholder="Select Brand"
                      data={variables.brandList}
                      value={form.values.brand}
                      {...form.getInputProps("brand")}
                    />
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Select
                      ref={input3}
                      size="xs"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          input3.current.blur();
                          input4.current.focus();
                        }
                      }}
                      onKeyUp={(e) => {
                        if (e.key === "Enter") {
                          input3.current.blur();
                          input4.current.focus();
                        }
                      }}
                      variant="filled"
                      fullWidth
                      label="Select Product"
                      placeholder="Select Product"
                      itemComponent={SelectItem}
                      data={variables.productList.filter((raw) => {
                        if (Number(form.values.brand) != "") {
                          if (
                            Number(form.values.group) != "" &&
                            Number(form.values.subgroup) != ""
                          ) {
                            return (
                              Number(raw.group_id) ===
                                Number(form.values.group) &&
                              Number(raw.subgroup_id) ===
                                Number(form.values.subgroup) &&
                              Number(raw.brand_id) === Number(form.values.brand)
                            );
                          } else {
                            return (
                              Number(raw.brand_id) === Number(form.values.brand)
                            );
                          }
                        } else {
                          if (
                            Number(form.values.group) != "" &&
                            Number(form.values.subgroup) != ""
                          ) {
                            return (
                              Number(raw.group_id) ===
                                Number(form.values.group) &&
                              Number(raw.subgroup_id) ===
                                Number(form.values.subgroup)
                            );
                          } else {
                            return raw;
                          }
                        }
                      })}
                      searchable
                      maxDropdownHeight={400}
                      nothingFound="Nobody here"
                      filter={(value, item) =>
                        item.label
                          .toLowerCase()
                          .includes(value.toLowerCase().trim())
                      }
                      onChange={(e) => {
                        var pp = variables.productList.find(
                          (img) => Number(img.value) === Number(e)
                        );

                        form.setFieldValue("price", Number(pp.price));
                        form.setFieldValue("product", e);
                      }}
                      value={form.values.product}
                    />

                    {/* <Select
                      ref={input3}
                      size="xs"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          input3.current.blur();
                          input4.current.focus();
                        }
                      }}
                      onKeyUp={(e) => {
                        if (e.key === "Enter") {
                          input3.current.blur();
                          input4.current.focus();
                        }
                      }}
                      variant="filled"
                      fullWidth
                      label="Select Product"
                      searchable
                      dropdownPosition="bottom"
                      clearable
                      placeholder="Select Product"
                      value={form.values.product}
                      data={variables.productList.filter((raw) => {
                        if (Number(form.values.brand) != "") {
                          if (
                            Number(form.values.group) != "" &&
                            Number(form.values.subgroup) != ""
                          ) {
                            return (
                              Number(raw.group_id) ===
                                Number(form.values.group) &&
                              Number(raw.subgroup_id) ===
                                Number(form.values.subgroup) &&
                              Number(raw.brand_id) === Number(form.values.brand)
                            );
                          } else {
                            return (
                              Number(raw.brand_id) === Number(form.values.brand)
                            );
                          }
                        } else {
                          if (
                            Number(form.values.group) != "" &&
                            Number(form.values.subgroup) != ""
                          ) {
                            return (
                              Number(raw.group_id) ===
                                Number(form.values.group) &&
                              Number(raw.subgroup_id) ===
                                Number(form.values.subgroup)
                            );
                          } else {
                            return raw;
                          }
                        }
                      })}
                      {...form.getInputProps("product")}
                      onChange={(e) => {
                        var pp = variables.productList.find(
                          (img) => Number(img.value) === Number(e)
                        );

                        form.setFieldValue("price", pp.price);
                        form.setFieldValue("product", e);
                      }}
                    /> */}
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput
                      ref={input5}
                      size="xs"
                      onKeyUp={(e) => {
                        if (e.key === "Enter") {
                          input5.current.blur();
                          input6.current.focus();
                        }
                      }}
                      variant="filled"
                      value={form.values.qty}
                      label="Product Quantity"
                      placeholder="Product Quantity"
                      {...form.getInputProps("qty")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput
                      ref={input4}
                      size="xs"
                      onKeyUp={(e) => {
                        if (e.key === "Enter") {
                          input4.current.blur();
                          input5.current.focus();
                        }
                      }}
                      variant="filled"
                      value={form.values.price}
                      label="Product Price"
                      placeholder="Product Price"
                      {...form.getInputProps("price")}
                    />
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <NumberInput
                      ref={input4}
                      size="xs"
                      variant="filled"
                      value={
                        (form.values.price - form.values.discount) *
                        form.values.qty
                      }
                      label="Price"
                      placeholder="Price"
                      onChange={(e) => {
                        var price =
                          Number(e - form.values.discount) /
                          Number(form.values.qty);
                        form.setFieldValue("price", Number(price));
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <NumberInput
                      ref={input7}
                      size="xs"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          input7.current.blur();
                          input8.current.focus();
                        }
                      }}
                      onKeyUp={(e) => {
                        if (e.key === "Enter") {
                          input7.current.blur();
                          input8.current.focus();
                        }
                      }}
                      variant="filled"
                      label="Enter Discount Value"
                      value={form.values.discount}
                      {...form.getInputProps("discount")}
                      placeholder="Enter whole number"
                    ></NumberInput>
                  </Grid.Col>
                </Grid>
                <div style={{ display: "flex", marginTop: 15 }}>
                  <Button
                    fullWidth
                    type="button"
                    color="zevcore"
                    onClick={() => setDetailModal(true)}
                  >
                    Additional Details
                  </Button>
                  <Button
                    ref={input8}
                    ml={5}
                    fullWidth
                    type="submit"
                    color="zevcore"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </Grid.Col>
        <Grid.Col xs={8}>
          <Card className="border" pt={2}>
            <div style={{ paddingBottom: 10 }}>
              <Paper className="invoiceItemHeight">
                <table className="tableBorder" ref={targetRef}>
                  <thead>
                    <tr>
                      <th>Sl.No</th>
                      <th>Description / Item</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Discount</th>
                      <th>Total</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody key={tableRefresh}>
                    {cart.length > 0 ? (
                      <>
                        {cart.map((row, index) => (
                          <tr className="products">
                            <td>{index + 1}</td>
                            <td>{row.product.label}</td>
                            <td>{row.qty}</td>
                            <td>{row.price}</td>
                            <td>{row.discount}</td>
                            <td>{row.total}</td>
                            <td
                              onClick={() => DeleteProduct(row.product.value)}
                            >
                              <Button
                                color="red"
                                size="xs"
                                style={{ fontSize: 8, padding: 2, height: 15 }}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </>
                    ) : null}
                  </tbody>
                </table>
              </Paper>
            </div>
            <Divider my="xs" />
            <Grid gutter="xs">
              <Grid.Col span={9}>
                <Grid>
                  <Grid.Col span={3} pb={0} pt={1}>
                    {" "}
                    <TextInput
                      size="xs"
                      variant="filled"
                      value={variables.amountPaid}
                      label="Amount Paid"
                      onChange={(e) =>
                        setVariables({
                          ...variables,
                          amountPaid: e.target.value,
                        })
                      }
                      placeholder="Amount Paid"
                    />
                  </Grid.Col>
                  <Grid.Col span={3} pb={0} pt={1}>
                    <TextInput
                      size="xs"
                      ml={5}
                      variant="filled"
                      readOnly
                      value={
                        cart.reduce(function (sum, current) {
                          return +Number(sum) + Number(current.total);
                        }, 0) +
                        cart.reduce(function (sum, current) {
                          return +Number(sum) + Number(current.tax);
                        }, 0) -
                        Number(variables.amountPaid)
                      }
                      label="Balance"
                      placeholder="Balance"
                    />
                  </Grid.Col>
                  <Grid.Col span={3} pt={1}>
                    <Select
                      required
                      size="xs"
                      variant="filled"
                      label="Mode of payment"
                      placeholder="Mode Type"
                      data={variables.saleType}
                      value={saleTypeValue}
                      onChange={(e) => {
                        console.log(e);
                        setSaleTypeValue(e);
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={3} pt={1}>
                    <Select
                      variant="filled"
                      size="xs"
                      disabled={saleTypeValue == "Cash" ? true : false}
                      label="Select Bank"
                      ml={5}
                      placeholder="Select Bank"
                      data={variables.banksList}
                      value={saleTypeBank}
                      onChange={(e) => {
                        setSaleTypeBank(e);
                      }}
                    />
                  </Grid.Col>
                </Grid>
                <div
                  style={{
                    marginTop: 32,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <Button
                      disabled={cart.length == 0 ? true : false}
                      color="zevcore"
                      size="xs"
                      onClick={() => handleSaveSale()}
                    >
                      Save Invoice
                    </Button>
                    <Button
                      ml={5}
                      color="zevcore"
                      size="xs"
                      onClick={() => setSavedModal(true)}
                    >
                      View Saved
                    </Button>
                  </div>

                  <Button
                    color="zevcore"
                    disabled={cart.length == 0 ? true : false}
                    size="xs"
                    onClick={() => AddSaleData()}
                  >
                    Add Invoice
                  </Button>
                </div>
              </Grid.Col>

              <Grid.Col span={3} mt={4}>
                <table className="tableBorder">
                  <tbody>
                    <tr>
                      <td>Sub-Total</td>
                      <td>
                        ₹
                        {cart.reduce(function (sum, current) {
                          return +Number(sum) + Number(current.total);
                        }, 0)}
                      </td>
                    </tr>
                    <tr>
                      <td>CGST</td>
                      <td>
                        ₹
                        {cart
                          .reduce(function (sum, current) {
                            return +Number(sum) + Number(current.tax);
                          }, 0)
                          .toFixed(2) / 2}
                      </td>
                    </tr>
                    <tr>
                      <td>SGST</td>
                      <td>
                        ₹
                        {cart
                          .reduce(function (sum, current) {
                            return +Number(sum) + Number(current.tax);
                          }, 0)
                          .toFixed(2) / 2}
                      </td>
                    </tr>
                    <tr
                      style={{
                        backgroundColor: "#043c64",
                        fontWeight: 500,
                        color: "#ffffff",
                      }}
                    >
                      <td>Grand Total</td>
                      <td>
                        {" "}
                        ₹
                        {Math.round(
                          cart.reduce(function (sum, current) {
                            return +Number(sum) + Number(current.total);
                          }, 0) +
                            cart.reduce(function (sum, current) {
                              return +Number(sum) + Number(current.tax);
                            }, 0)
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Grid.Col>
            </Grid>
          </Card>
        </Grid.Col>
      </Grid>
      <Drawer
        opened={variables.addDrawer}
        onClose={() => setVariables({ ...variables, addDrawer: false })}
        title="Add Customer"
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
            style={{ height: 620 }}
            type="scroll"
            offsetScrollbars
            scrollbarSize={5}
          >
            <div className="zc-pr-3 zc-pl-3">
              {/* Customer adding form name */}
              <form
                onSubmit={formCustomer.onSubmit((values) =>
                  AddCustomer(values)
                )}
              >
                <TextInput
                  variant="filled"
                  value={formCustomer.values.name}
                  label="Customer Name"
                  placeholder="Customer Name"
                  {...formCustomer.getInputProps("name")}
                />
                <TextInput
                  required
                  variant="filled"
                  value={formCustomer.values.phone_number}
                  label="Phone Number"
                  placeholder="Phone Number"
                  {...formCustomer.getInputProps("phone_number")}
                />
                <NumberInput
                  variant="filled"
                  value={formCustomer.values.credit_limit}
                  label="Credit Limit"
                  placeholder="Credit Limit"
                  {...formCustomer.getInputProps("credit_limit")}
                />
                <TextInput
                  variant="filled"
                  value={formCustomer.values.gstin}
                  label="Customer GSTIN"
                  placeholder="Customer GSTIN"
                  {...formCustomer.getInputProps("gstin")}
                />
                <TextInput
                  variant="filled"
                  value={formCustomer.values.door_no}
                  label=" Door No"
                  placeholder=" Door No"
                  {...formCustomer.getInputProps("door_no")}
                />

                <TextInput
                  variant="filled"
                  value={formCustomer.values.street}
                  label=" Street"
                  placeholder=" Street"
                  {...formCustomer.getInputProps("street")}
                />
                <NumberInput
                  variant="filled"
                  value={formCustomer.values.pincode}
                  label="Pincode"
                  placeholder="Pincode"
                  {...formCustomer.getInputProps("pincode")}
                />
                <TextInput
                  variant="filled"
                  value={formCustomer.values.locality}
                  label=" Locality"
                  placeholder=" Locality"
                  {...formCustomer.getInputProps("locality")}
                />
                <TextInput
                  variant="filled"
                  value={formCustomer.values.city}
                  label=" City"
                  placeholder=" City"
                  {...formCustomer.getInputProps("city")}
                />
                <TextInput
                  variant="filled"
                  value={formCustomer.values.state}
                  label=" State"
                  placeholder=" State"
                  {...formCustomer.getInputProps("state")}
                />
                <Button
                  mt="xl"
                  mb={60}
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
      <Modal
        withCloseButton={false}
        overlayOpacity={0.55}
        padding={0}
        overlayBlur={3}
        size={"60%"}
        opened={detailsModal}
        onClose={() => setDetailModal(false)}
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
              Additional details
            </Text>
            <ActionIcon
              onClick={() => setDetailModal(false)}
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
            <Grid>
              <Grid.Col span={4}>
                <TextInput
                  variant="filled"
                  value={formDetails.values.deliver_note}
                  label="Delivery Note"
                  placeholder="Delivery Note"
                  {...formDetails.getInputProps("deliver_note")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  variant="filled"
                  value={formDetails.values.deliver_note}
                  label="Delivery Note"
                  placeholder="Delivery Note"
                  {...formDetails.getInputProps("deliver_note")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                {" "}
                <TextInput
                  variant="filled"
                  value={formDetails.values.suppliers_ref}
                  label="Supplier's Ref"
                  placeholder="Supplier's Ref"
                  {...formDetails.getInputProps("suppliers_ref")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  variant="filled"
                  value={formDetails.values.other_ref}
                  label="Other Ref"
                  placeholder="Other Ref"
                  {...formDetails.getInputProps("other_ref")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                {" "}
                <TextInput
                  variant="filled"
                  value={formDetails.values.buyer_order_no}
                  label="Buyer's Order No."
                  placeholder="Buyer's Order No."
                  {...formDetails.getInputProps("buyer_order_no")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  variant="filled"
                  value={formDetails.values.dated}
                  label="Dated"
                  placeholder="dd/mm/yyyy"
                  {...formDetails.getInputProps("dated")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  variant="filled"
                  value={formDetails.values.despatch_doc_no}
                  label="Despatch Document No."
                  placeholder="Despatch Document No."
                  {...formDetails.getInputProps("despatch_doc_no")}
                />
              </Grid.Col>

              <Grid.Col span={4}>
                {" "}
                <TextInput
                  variant="filled"
                  value={formDetails.values.delivery_note_date}
                  label="Deliver Note Date"
                  placeholder="Deliver Note Date"
                  {...formDetails.getInputProps("delivery_note_date")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                {" "}
                <TextInput
                  variant="filled"
                  value={formDetails.values.despatched_through}
                  label="Despatched Through"
                  placeholder="Despatched Through"
                  {...formDetails.getInputProps("despatched_through")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                {" "}
                <TextInput
                  variant="filled"
                  value={formDetails.values.destination}
                  label="Destination"
                  placeholder="Destination"
                  {...formDetails.getInputProps("destination")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  variant="filled"
                  value={formDetails.values.terms_of_delivery}
                  label="Terms Of Delivery"
                  placeholder="Terms Of Delivery"
                  {...formDetails.getInputProps("terms_of_delivery")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  variant="filled"
                  value={formDetails.values.remark}
                  label="Remark"
                  placeholder="Remark"
                  {...formDetails.getInputProps("remark")}
                />
              </Grid.Col>
            </Grid>

            <Group position="right" mt="md" mb="lg">
              <Button
                type="submit"
                color="zevcore"
                onClick={() => setDetailModal(false)}
              >
                Submit
              </Button>
            </Group>
          </div>
        </div>
      </Modal>
      <Modal
        withCloseButton={false}
        overlayOpacity={0.55}
        padding={0}
        overlayBlur={3}
        size={"60%"}
        opened={variables.productBarcode}
        onClose={() => setVariables({ ...variables, productBarcode: false })}
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
              {formBarcode.values.product}
            </Text>
            <ActionIcon
              onClick={() =>
                setVariables({ ...variables, productBarcode: false })
              }
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
            <form
              onSubmit={formBarcode.onSubmit((values) => AddProduct(values))}
            >
              <Grid>
                <Grid.Col span={6}>
                  <NumberInput
                    size="xs"
                    variant="filled"
                    required
                    value={formBarcode.values.price}
                    label="Product Price"
                    placeholder="Product Price"
                    {...formBarcode.getInputProps("price")}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <NumberInput
                    size="xs"
                    required
                    variant="filled"
                    value={formBarcode.values.qty}
                    label="Product Quantity"
                    placeholder="Product Quantity"
                    {...formBarcode.getInputProps("qty")}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    size="xs"
                    variant="filled"
                    fullWidth
                    label="Select Discount Type"
                    searchable
                    dropdownPosition="bottom"
                    clearable
                    placeholder="Select Discount Type"
                    data={[
                      { value: "percentage", label: "Percentage (%)" },
                      { value: "number", label: "Whole Number" },
                    ]}
                    value={formBarcode.values.discount_type}
                    {...formBarcode.getInputProps("discount_type")}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  {formBarcode.values.discount_type == "percentage" ? (
                    <NumberInput
                      size="xs"
                      variant="filled"
                      label="Enter Value"
                      value={formBarcode.values.discount}
                      placeholder="Enter percentage value"
                      {...formBarcode.getInputProps("discount")}
                    ></NumberInput>
                  ) : (
                    <NumberInput
                      size="xs"
                      variant="filled"
                      label="Enter Value"
                      value={formBarcode.values.discount}
                      {...formBarcode.getInputProps("discount")}
                      placeholder="Enter whole number"
                    ></NumberInput>
                  )}
                </Grid.Col>
              </Grid>

              <Group position="right" mt="md" mb="lg">
                <Button
                  type="submit"
                  color="zevcore"
                  onClick={() => setDetailModal(false)}
                >
                  Submit
                </Button>
              </Group>
            </form>
          </div>
        </div>
      </Modal>
      <Modal
        withCloseButton={false}
        overlayOpacity={0.55}
        padding={0}
        overlayBlur={3}
        onClose={() => setSavedModal(false)}
        size={"90%"}
        opened={savedModal}
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
              Saved Invoices
            </Text>

            <ActionIcon
              onClick={() => setSavedModal(false)}
              m={5}
              sx={{
                "&[data-disabled]": { opacity: 1 },
                "&[data-loading]": { backgroundColor: "#ffffff" },
              }}
            >
              <X size={18} />
            </ActionIcon>
          </div>
          <div style={{ padding: 15 }}>
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
                <div></div>
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
                    <Th>Invoice</Th>
                    <Th>Customer</Th>
                    <Th>Discount</Th>
                    <Th>Subtotal</Th>
                    <Th>CGST</Th>
                    <Th>SGST</Th>
                    <Th>Total</Th>
                    <Th>Created At</Th>
                    <Th>Load</Th>
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
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AddSale;
