/* 
Project name: Zevcore APOS
Author: Zevcore Private Limited
Description: Zevcore Private Limited Zevcore APOS style css file
Created Date: 31/03/2022
Version: 1.0
Required: React and mantine
*/
import React, { useState, useEffect } from "react"; //main react import for use use state use effects
import { useNavigate } from "react-router-dom"; // for import react dom navigation components
import axios from "axios"; //import for axios server side connection
import {
  AugmentedReality,
  Database,
  Dimensions,
  Plus,
  Recycle,
  Scale,
  Search,
  Trash,
  X,
  Check,
} from "tabler-icons-react"; //Imports icons
import {
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Image,
  Skeleton,
  Group,
  Text,
  ActionIcon,
  Transition,
  Tabs,
  Modal,
  useMantineTheme,
  Select,
  TextInput,
  Drawer,
  NumberInput,
  ScrollArea,
} from "@mantine/core"; //for import mantine required functions and theme //mantine main core imports lists
import { showNotification, updateNotification } from "@mantine/notifications"; //For show bottom mantine notification
import BarcodeIcon from "../../assets/icons/BarcodeIcon"; //Import barcode icons image
import { useForm } from "@mantine/form"; //Import for mantine form validation

import jsPDF from "jspdf"; //Import for jason to pdf converter
import { DatePicker } from "@mantine/dates";
import useStyles from "../../components/Style";
import {
  handleAddInvoice,
  handleGetStock,
  handleSaveInvoice,
  handleGetCustomer,
  handleGetSaleType,
  handleGetAddress,
  handleGetBank,
} from "../../helpers/apis";
import { selectFilter } from "../../helpers/common";
import notificationHelper from "../../helpers/notification";
import { useWindowScroll } from "@mantine/hooks";
const converter = require("number-to-words");

//for   made mantine theme style change and write custome theme here
function AddSale() {
  const [token, setToken] = useState(localStorage.getItem("token")); //get saved local storage data
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [URL, setURL] = useState(process.env.REACT_APP_BACKEND_URL);
  const [URLFILE, setURLFILE] = useState(process.env.REACT_APP_FILE);
  const [URLPRODUCT, setURLPRODUCT] = useState(
    process.env.REACT_APP_PRODUCT_URL
  );

  const { classes } = useStyles();
  const [opened, setOpened] = useState(false);
  const [openedCustomer, setOpenCustomer] = useState(false);
  const [openeBarcode, setOpeneBarcode] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState("");
  const [cart, setCart] = useState([]);
  const [slideCart, setSlideCart] = useState(Date.now());

  const [submitLoading, setSubmitLoading] = useState(false);
  const [discountModal, setDiscountModal] = useState(false);
  const [detailsModal, setDetailModal] = useState(false);
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState(0);

  const [subTotal, setSubTotal] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [total, setTotal] = useState(0);

  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [extra, setExtra] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [address, setAddress] = useState([]);
  const [banks, setBanks] = useState([]);
  const [customer2, setCustomer2] = useState([]);
  const [group, setGroup] = useState([]);
  const [saleType, setSaleType] = useState([]);
  const [saleTypeValue, setSaleTypeValue] = useState(null);
  const [saleTypeBank, setSaleTypeBank] = useState(null);
  const [saleTypeTax, setSaleTypeTax] = useState(0);
  const [customerValue, setCustomerValue] = useState(null);
  const [addressValue, setAddressValue] = useState(null);
  const [amountPaid, setAmountPaid] = useState(0);
  const [balance, setBalanced] = useState(0);
  const [dateValue, setDateValue] = useState(new Date());
  const [exchangeModal, setExchangeModal] = useState(false);
  const [totalExchange, setTotalExchange] = useState(0);
  const [makingCharge, setMakingCharge] = useState(0);
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  let navigate = useNavigate();
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (mounted) {
        const response = await handleGetStock();

        // On Respose setting the data to variable
        if (response.status === 200) {
          var data_list = response.data.data;
          //   data_list = data_list.splice(0, 10);

          setData(response.data.data);
          setExtra(response.data.data);
          setData2(data_list);
        }

        const response2 = await handleGetCustomer();
        // On Respose setting the data to variable
        if (response2.status === 200) {
          const listGroup = await selectFilter({
            data: response2.data.data,
          });
          setCustomer(listGroup);
        }
        const response3 = await handleGetSaleType();
        if (response3.status === 200) {
          const listGroup = await response3.data.data.map((data) => ({
            value: data.label.toString(),
            label: data.label.toString(),
          }));
          setSaleType(listGroup);
        }

        const response4 = await handleGetAddress();

        // On Respose setting the data to variable
        if (response4.status === 200) {
          const listGroup = await selectFilter({
            data: response4.data.data,
          });
          setAddress(listGroup);
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

        setSkeletonLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // For adding data form                                                              Add data  Form
  const formCustomer = useForm({
    initialValues: {
      label: "",
      phone_number: "",
      gstin: "",
      credit_limit: 50000,
      door_no: "",
      street: "",
      locality: "",
      pincode: "",
      city: "",
      state: "",
    },
  });

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
    // Main axios part for sending data to backend adding customer data
    axios
      .post(URL + "customer", e, config)
      .then((response) => {
        // For set added data to table array
        var datas = response.data.data;
        var clean = datas.map((data) => ({
          value: data.value.toString(),
          label: data.label,
        }));
        setCustomer(clean);
        // Clear all fields
        formCustomer.reset();

        // Set loading effect animation
        setSubmitLoading(false);
        updateNotification({
          id: "load-data",
          color: "teal",
          title: "Data Save",
          message: "New Customer Field Added Successfully",
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

  // Submit data to backend nodejs
  const handleAddSale = async (e) => {
    // Set notification of saving and loader effects

    var saletypeId = saleTypeValue;

    var customerId = "";
    if (customerValue !== null && customerValue !== "") {
      var data = customer.find((img) => img.value === customerValue);
      customerId = data.label;
    }
    var addressID = null;
    if (addressValue !== null && addressValue !== "") {
      var data = address.find((img) => img.value === addressValue);
      addressID = data.label;
    }

    const reg = {
      discount_type: discountType,
      discountValue: discountValue,
      subTotal: subTotal,
      totalTax: totalTax,
      sale_type: saletypeId,
      customer: customerId,

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
      making_charge: makingCharge,
      list: cart,
      paid: amountPaid,
      date: dateValue,
      totalExchange: totalExchange,
    };
    const response = await handleAddInvoice(reg);

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
  };

  // Submit data to backend nodejs
  const handleSaveSale = async (e) => {
    // Set notification of saving and loader effects

    var saletypeId = saleTypeValue;

    var customerId = "";
    if (customerValue !== null && customerValue !== "") {
      var data = customer.find((img) => img.value === customerValue);
      customerId = data.label;
    }

    const reg = {
      discount_type: discountType,
      discountValue: discountValue,
      subTotal: subTotal,
      totalTax: totalTax,
      sale_type: saletypeId,
      customer: customerId,
      making_charge: makingCharge,
      list: cart,
      bank_name: saleTypeBank,
      paid: amountPaid,
      date: dateValue,
      totalExchange: totalExchange,
    };
    const response = await handleSaveInvoice(reg);

    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Invoice saved successfully",
      });

      setCustomerValue(null);
      setDiscountType("percentage");
      setDiscountValue(0);
      setCart([]);
      setTotalTax(0);
      setSubTotal(0);
      setAmountPaid(0);
      setDateValue(new Date());
      setSaleTypeValue(null);
    } else {
      notificationHelper({
        color: "red",
        title: "Failed! Please enter correct details",
        message: response.data.message,
      });
    }
  };

  const handlePdf = () => {
    const doc = new jsPDF("p", "pt", "a4");
    doc.html(document.querySelector("#content"), {
      callback: function (pdf) {
        pdf.save("myfile.pdf");
      },
    });
  };

  const getPincode = (e) => {
    // Set config of token
    const config = {
      headers: {
        "x-access-token": token,
      },
    };
    // Main axios part for sending data to backend adding customer data
    axios
      .get(URL + "pincode/" + formCustomer.values.pincode, config)
      .then((response) => {
        formCustomer.setFieldValue("state", response.data.State);
        formCustomer.setFieldValue("city", response.data.District);
        // Clear all fields

        // Set loading effect animation
      })
      .catch((error) => {});
  };
  useEffect(() => {}, [slideCart]);

  const [wGram, setWGram] = useState(0.01);
  const [NWeight, setNWeight] = useState(0.0);
  const [WWeast, setWWeast] = useState(0);
  const [wPrice, setWPrice] = useState(0);
  const [rGram, setRGram] = useState(0);

  const [WId, setWId] = useState(0);
  const [wModal, setWModal] = useState(false);

  const handleAddCartModal = (e) => {
    var one_Data = data.find((img) => img.value === e);

    if (typeof one_Data.product.type !== "") {
      handleAddCart(e);
    } else {
      setWId(e);
      setRGram(one_Data.gross_weight);
      setWPrice(one_Data.hall.rate);
      setWModal(true);
    }
  };

  // For adding product by click on plus icon and add to cart
  const handleAddCart = (e) => {
    var ttl = (wGram + WWeast).toFixed(2);

    setNWeight(ttl);
    setWModal(false);
    setSlideCart(Date.now());
    var datas = cart;
    const exist = datas.some((data) => data.value === e);
    // Check for same product is already added
    if (exist === true) {
      // If same product already added get the product price and increment count to plus one and change total value and tax data
      var one_Data = data.find((img) => img.value === e);
      if (typeof one_Data.product.type !== "") {
        var tax =
          (Number(one_Data.product.tax) / 100) *
          Number(one_Data.product.price).toFixed(2);
        var totalX = (Number(tax) + Number(totalTax)).toFixed(2);
        var subtotal = Number(one_Data.product.price).toFixed(2);
        var totalS = (Number(subtotal) + Number(subTotal)).toFixed(2);
        setSubTotal(totalS);
        setTotalTax(totalX);
        const index = datas.findIndex((img) => img.value === e);
        datas[index].count++;
        setCart(datas);
        // Check for discount date before add
      } else {
        Object.assign(one_Data, { count: ttl });
        Object.assign(one_Data, { gWeight: wGram });
        Object.assign(one_Data, { wWeight: WWeast });
        Object.assign(one_Data, { slider: false });
        Object.assign(one_Data, { gram_price: wPrice * ttl });
        datas = [...datas, one_Data];
        var totalValue = wPrice * ttl;
        var tax =
          (Number(one_Data.product.tax) / 100) * Number(totalValue).toFixed(2);
        var totalX = (Number(tax) + Number(totalTax)).toFixed(2);
        var totalS = (Number(totalValue) + Number(subTotal)).toFixed(2);
        setSubTotal(totalS);
        setTotalTax(totalX);
        setCart(datas);

        setWId(0);
        setRGram(0);
        setWPrice(0);
        setWGram(0.01);
        setNWeight(0);
        setWWeast(0);
      }
    } else {
      // Adding the product price and increment count to plus one and change total value and tax data
      var one_Data = data.find((img) => img.value === e);
      if (typeof one_Data.product.type !== "") {
        Object.assign(one_Data, { count: 1 });
        Object.assign(one_Data, { slider: false });
        datas = [...datas, one_Data];
        var tax =
          (Number(one_Data.product.tax) / 100) *
          Number(one_Data.product.price).toFixed(2);
        var totalX = (Number(tax) + Number(totalTax)).toFixed(2);
        var subtotal = Number(one_Data.product.price).toFixed(2);
        var totalS = (Number(subtotal) + Number(subTotal)).toFixed(2);
        setSubTotal(totalS);
        setTotalTax(totalX);
        setCart(datas);
        // Check for discount date before add
      } else {
        Object.assign(one_Data, { count: ttl });
        Object.assign(one_Data, { gWeight: wGram });
        Object.assign(one_Data, { wWeight: WWeast });
        Object.assign(one_Data, { slider: false });
        Object.assign(one_Data, { gram_price: wPrice * ttl });
        datas = [...datas, one_Data];
        var totalValue = wPrice * ttl;
        var tax =
          (Number(one_Data.product.tax) / 100) * Number(totalValue).toFixed(2);
        var totalX = (Number(tax) + Number(totalTax)).toFixed(2);
        var totalS = (Number(totalValue) + Number(subTotal)).toFixed(2);
        setSubTotal(totalS);
        setTotalTax(totalX);
        setCart(datas);

        setWId(0);
        setRGram(0);
        setWPrice(0);
        setWGram(0.01);
        setNWeight(0);
        setWWeast(0);
      }
    }
    // Set time out for 4ms and reload the cart data
    setTimeout(() => {
      const index = datas.findIndex((img) => img.value === e);
      datas[index].slider = true;
      setCart(datas);

      setSlideCart(Date.now());
    }, 400);
  };

  // For remove the cart data
  const handleRemoveCart = (e) => {
    setSlideCart(Date.now());
    var datas = cart;
    const exist = datas.some((data) => data.value === e);
    // Check if the data if present before remove
    if (exist === true) {
      var one_Data = data.find((img) => img.value === e);
      if (typeof one_Data.product.type !== "") {
        // Subtract the remove data tax and total
        var tax =
          (Number(one_Data.product.tax) / 100) *
          Number(one_Data.product.price).toFixed(2);
        var totalX = (Number(totalTax) - Number(tax)).toFixed(2);
        var subtotal = Number(one_Data.product.price).toFixed(2);
        var totalS = (Number(subTotal) - Number(subtotal)).toFixed(2);
        setSubTotal(totalS);
        setTotalTax(totalX);
        const index = datas.findIndex((img) => img.value === e);
        // Decrement the count by 1
        datas[index].count--;
        // Check the count is 0 if zero remove product from cart otherwise just Decrement the count
        if (datas[index].count == 0) {
          datas = datas.filter((img) => img.value !== e);
          setCart(datas);
        } else {
          setCart(datas);
        }
      } else {
        const index = datas.findIndex((img) => img.value === e);
        // Subtract the remove data tax and total
        var tax =
          (Number(one_Data.product.tax) / 100) *
          Number(datas[index].gram_price).toFixed(2);
        var totalX = (Number(tax) - Number(tax)).toFixed(2);

        var totalS = (
          Number(subTotal) - Number(datas[index].gram_price)
        ).toFixed(2);
        setSubTotal(totalS);
        setTotalTax(totalX);

        // Decrement the count by 1

        datas = datas.filter((img) => img.value !== e);
        setCart(datas);
      }
    }
    // Set time out for 4ms and reload the cart data
    setTimeout(() => {
      const index = datas.findIndex((img) => img.value === e);
      datas[index].slider = true;
      setCart(datas);

      setSlideCart(Date.now());
    }, 400);
  };

  const handleAddCart2 = () => {};
  // For filter the product data with barcode or product name
  const filter = (e) => {
    let namee = e.target.value.toUpperCase();
    let array = [];
    for (let i = 0; i < extra.length; i++) {
      let name = extra[i].product.label.toUpperCase();
      let barcode = extra[i].barcode.toUpperCase();

      if (name.toUpperCase().indexOf(namee) > -1) {
        array.push(extra[i]);
      }
      if (barcode.indexOf(namee) > -1) {
        array.push(extra[i]);
      }
    }
    if (e == "" && e == null) {
      setData2(array.slice(0, 10));
    } else {
      setData2(array.slice(0, 10));
    }
  };
  const [validateBarcode, setValidateBarcode] = useState(0);
  // For barcode enter add product to cart
  const barcode = (e) => {
    var barcode = e.target.value;
    setSlideCart(Date.now());

    const finding = data.find((img) => img.barcode === barcode);
    // Check for product with barcode enter
    if (typeof finding != "undefined" && finding != "" && finding != null) {
      var datas = cart;
      // Check for same product is already added
      const exist = datas.some((data) => data.barcode === barcode);
      if (exist === true) {
        // If same product already added get the product price and increment count to plus one and change total value and tax data
        var one_Data = data.find((img) => img.barcode === barcode);
        var tax =
          (Number(one_Data.product.tax) / 100) *
          Number(one_Data.product.price).toFixed(2);
        var totalX = (Number(tax) + Number(totalTax)).toFixed(2);
        var subtotal = Number(one_Data.product.price).toFixed(2);
        var totalS = (Number(subtotal) + Number(subTotal)).toFixed(2);
        setSubTotal(totalS);
        setTotalTax(totalX);
        const index = datas.findIndex((img) => img.barcode === barcode);
        datas[index].count++;
        setCart(datas);
        // If any discount present for the product add the discount
      } else {
        var one_Data = data.find((img) => img.barcode === barcode);
        // Adding the product data with new variables for count and slider false
        Object.assign(one_Data, { count: 1 });
        Object.assign(one_Data, { slider: false });
        datas = [...datas, one_Data];
        var tax =
          (Number(one_Data.product.tax) / 100) *
          Number(one_Data.product.price).toFixed(2);
        var totalX = (Number(tax) + Number(totalTax)).toFixed(2);
        var subtotal = Number(one_Data.product.price).toFixed(2);
        var totalS = (Number(subtotal) + Number(subTotal)).toFixed(2);
        setSubTotal(totalS);
        setTotalTax(totalX);
        setCart(datas);
        // If any discount present for the product add the discount
      }
      // Set time out for 4ms and reload the cart data
      setTimeout(() => {
        const index = datas.findIndex((img) => img.barcode === barcode);
        datas[index].slider = true;
        setCart(datas);
        setSlideCart(Date.now());
      }, 400);
      e.target.value = "";
      setValidateBarcode(1);
    } else {
      setValidateBarcode(2);
    }
    setTimeout(() => {
      setValidateBarcode(0);
    }, 3000);
  };
  const [scroll, setScroll] = useState(0);
  const onScrollPositionChange = (e) => {
    const bottom = e.target.scrollTop;

    var data_list = extra;
    // setData2([...data_list.splice(0, 30)]);
    // if (bottom == 0) {
    //   setData2([...data_list.splice(0, 30)]);
    // } else {
    //   setData2([...data_list.splice(0, bottom + 100 / 10)]);
    // }
  };
  return (
    <div>
      <Grid classNames="zc-hide-scroll">
        <Grid.Col xs={8}>
          <Skeleton
            height="100%"
            width="100%"
            radius="md"
            className="border"
            visible={skeletonLoading}
          >
            <Card>
              {/* For tab view component */}
              <Grid>
                <Grid.Col span={11}>
                  {/* For search the product name or barcode */}
                  <TextInput
                    variant="filled"
                    icon={<Search size={16} />}
                    placeholder="Search for an Design Name Or Barcode"
                    onChange={filter}
                    mt={2}
                    style={{ marginLeft: 2, marginRight: 2, marginBottom: 5 }}
                    styles={{ rightSection: { pointerEvents: "none" } }}
                  />
                </Grid.Col>
                {/* Enter the product barcode number for  */}
                <Grid.Col span={1} mt={5}>
                  <BarcodeIcon
                    style={{ width: 30 }}
                    onClick={() => setOpeneBarcode(true)}
                  ></BarcodeIcon>
                </Grid.Col>
              </Grid>

              {/* For All search */}

              <div className="zc-sale-height" onScroll={onScrollPositionChange}>
                {/* For view the product list data  */}
                <Grid>
                  {data2.map((row, index) => (
                    <>
                      {row.reaming_item !== 0 ? (
                        <Grid.Col sm={6} md={4} xl={3} p={0} m={0}>
                          <Card mt={5} withBorder radius="md">
                            <Card.Section
                              p={0}
                              className={classes.imageSection}
                            >
                              {/* For view iamge */}
                              <img
                                src={"images/product/" + row.product.image}
                                alt="Item Image"
                                width="100%"
                              />
                            </Card.Section>
                            <Group position="apart" mt="md">
                              <div>
                                <Text weight={500} style={{ fontSize: 12 }}>
                                  {row.product.label}
                                </Text>
                              </div>
                            </Group>
                            <Grid gutter="xs" px={3}>
                              <Grid.Col xs={6} p={2}>
                                {/* For view the product genders */}
                                <div className="zc-item_options">
                                  <BarcodeIcon style={{ width: 10 }} />
                                  {"  "}
                                  <Text
                                    style={{ fontSize: 10 }}
                                    ml={5}
                                    color="dimmed"
                                  >
                                    {row.barcode}
                                  </Text>
                                </div>
                              </Grid.Col>
                            </Grid>

                            {/* View the product price and add to stock button plus icon */}
                            <Card.Section className={classes.section}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text size="md" weight={700}>
                                  ₹{Number(row.product.price).toFixed(2)}
                                </Text>

                                <Button
                                  color="zevcore"
                                  onClick={() => handleAddCartModal(row.value)}
                                  size="xs"
                                  variant="outline"
                                >
                                  <Plus size={15} />
                                </Button>
                              </div>
                            </Card.Section>
                          </Card>
                        </Grid.Col>
                      ) : null}
                    </>
                  ))}
                </Grid>
              </div>
            </Card>
          </Skeleton>
        </Grid.Col>
        <Grid.Col xs={4}>
          <Skeleton
            height="100%"
            width="100%"
            className="border"
            visible={skeletonLoading}
          >
            <Card p={0}>
              <div className={classes.cartHeader}>
                {/* For view the cart item */}
                <Text color="white" size="sm">
                  Cart
                </Text>
                <Text color="white" size="sm">
                  {" "}
                  {cart.length}
                </Text>
              </div>
              <div style={{ padding: 14 }}>
                {/* For add new customer or selct customer */}
                <div
                  style={{
                    display: "flex",
                    marginTop: -5,
                  }}
                >
                  <div>
                    <Select
                      variant="filled"
                      fullWidth
                      size="xs"
                      label="Select Customer"
                      searchable
                      clearable
                      placeholder="Select Customer"
                      data={customer}
                      value={customerValue}
                      onChange={setCustomerValue}
                      mr={2}
                    />
                  </div>
                  <div>
                    <Select
                      variant="filled"
                      fullWidth
                      size="xs"
                      label="Select Address"
                      searchable
                      clearable
                      placeholder="Select Address"
                      data={address}
                      value={addressValue}
                      onChange={setAddressValue}
                      mr={2}
                    />
                  </div>
                </div>
                {/* View the cart item list and can be deleted */}
                {/* Deleting the cart item will reduce count once it reduce to 1 it will remove the data */}
                <div className="zc-sale-height-side" key={slideCart}>
                  {cart.map((row, index) => (
                    <Transition
                      transition="scale-x"
                      duration={1000}
                      mounted={row.slider}
                      timingFunction="ease"
                    >
                      {(styles) => (
                        <div style={styles}>
                          <div className="zvcr-row">
                            <div>
                              <Image
                                width={35}
                                height={35}
                                style={{ marginLeft: 7, marginTop: 7 }}
                                src={"images/product/" + row.product.image}
                                alt="img"
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                marginTop: 5,
                                marginLeft: 15,
                              }}
                            >
                              <Text style={{ fontSize: 10 }}>
                                {row.product.label}
                              </Text>
                            </div>
                            <div
                              style={{
                                marginTop: 15,
                                marginLeft: "auto",
                                flexDirection: "row",
                                display: "flex",
                              }}
                            >
                              <Badge
                                color="zevcore"
                                radius="xs"
                                style={{ marginRight: 25 }}
                              >
                                {row.count}
                              </Badge>
                              <Text size="xs" style={{ marginRight: 5 }}>
                                ₹
                                {(
                                  Number(row.product.price) * row.count
                                ).toFixed(2)}
                              </Text>
                              <ActionIcon
                                onClick={() => handleRemoveCart(row.value)}
                                color="red"
                                pt={0}
                                mt={-5}
                              >
                                <Trash size={16} />
                              </ActionIcon>
                            </div>
                          </div>
                        </div>
                      )}
                    </Transition>
                  ))}
                </div>
                {/* For adding the discount data that can be percetnage or whole number */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 15,
                  }}
                >
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => setDiscountModal(true)}
                    color="zevcore"
                  >
                    Add Discount
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => setDetailModal(true)}
                    color="zevcore"
                  >
                    Add Details
                  </Button>
                </div>
                {/* Show the total and total tax */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 15,
                  }}
                >
                  <Text size="xs">Subtotal</Text>
                  <Text size="xs">₹{subTotal}</Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 3,
                  }}
                >
                  <Text size="xs">Total Tax</Text>
                  <Text size="xs">
                    ₹
                    {(
                      +totalTax +
                      (Number(saleTypeTax) / 100) * subTotal
                    ).toFixed(2)}
                  </Text>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 3,
                  }}
                >
                  <Text size="xs">Total Discount</Text>
                  {isNaN(discountValue) === false ? (
                    <>
                      {discountType == "percentage" ? (
                        <Text size="xs">
                          ₹
                          {(
                            Number(discountValue / 100) *
                            (Number(subTotal) + Number(totalTax))
                          ).toFixed(2)}
                        </Text>
                      ) : (
                        <Text size="xs">₹{discountValue}</Text>
                      )}
                    </>
                  ) : null}
                </div>
                {/* For view the grand total data */}
                <div className={classes.total}>
                  <Text color="white" size="sm">
                    Grand Total
                  </Text>
                  {isNaN(discountValue) === false ? (
                    <>
                      {discountType == "percentage" ? (
                        <Text color="white" size="sm">
                          ₹
                          {(
                            (
                              Number(makingCharge) +
                              Number(subTotal) +
                              Number(
                                (
                                  +totalTax +
                                  (Number(saleTypeTax) / 100) * subTotal
                                ).toFixed(2)
                              ) -
                              Number(discountValue / 100) *
                                (Number(subTotal) + Number(totalTax))
                            ).toFixed(2) - totalExchange
                          ).toFixed(2)}
                        </Text>
                      ) : (
                        <Text color="white" size="sm">
                          ₹
                          {(
                            Number(makingCharge) +
                            Number(subTotal) +
                            Number(
                              (
                                +totalTax +
                                (Number(saleTypeTax) / 100) * subTotal
                              ).toFixed(2)
                            ) -
                            Number(discountValue) -
                            totalExchange
                          ).toFixed(2)}
                        </Text>
                      )}
                    </>
                  ) : (
                    <>
                      <Text color="white" size="sm">
                        ₹
                        {(
                          Number(makingCharge) +
                          Number(subTotal) +
                          Number(
                            (
                              +totalTax +
                              (Number(saleTypeTax) / 100) * subTotal
                            ).toFixed(2)
                          ) -
                          totalExchange
                        ).toFixed(2)}
                      </Text>
                    </>
                  )}
                </div>
                {/* For view the total data */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: 2,
                  }}
                >
                  <NumberInput
                    variant="filled"
                    mt={5}
                    mr={2}
                    size="xs"
                    step={0.1}
                    precision={2}
                    label="Amount Paid"
                    value={amountPaid}
                    onChange={(event) => setAmountPaid(event)}
                  ></NumberInput>

                  {isNaN(discountValue) === false ? (
                    <>
                      {discountType == "percentage" ? (
                        <TextInput
                          variant="filled"
                          readOnly
                          mt={5}
                          ml={2}
                          size="xs"
                          label="Balance Amount"
                          value={(
                            Number(makingCharge) +
                            Number(subTotal) +
                            Number(
                              (
                                +totalTax +
                                (Number(saleTypeTax) / 100) * subTotal
                              ).toFixed(2)
                            ) -
                            Number(discountValue / 100) *
                              (Number(subTotal) + Number(totalTax)) -
                            amountPaid -
                            totalExchange
                          ).toFixed(2)}
                        ></TextInput>
                      ) : (
                        <TextInput
                          variant="filled"
                          readOnly
                          mt={5}
                          ml={2}
                          size="xs"
                          label="Balance Amount"
                          value={(
                            Number(makingCharge) +
                            Number(subTotal) +
                            Number(
                              (
                                +totalTax +
                                (Number(saleTypeTax) / 100) * subTotal
                              ).toFixed(2)
                            ) -
                            Number(discountValue) -
                            amountPaid -
                            totalExchange
                          ).toFixed(2)}
                        ></TextInput>
                      )}
                    </>
                  ) : (
                    <>
                      <TextInput
                        variant="filled"
                        readOnly
                        mt={5}
                        ml={2}
                        size="xs"
                        label="Balance Amount"
                        value={(
                          Number(makingCharge) +
                          Number(subTotal) +
                          Number(
                            (
                              +totalTax +
                              (Number(saleTypeTax) / 100) * subTotal
                            ).toFixed(2)
                          ) -
                          amountPaid -
                          totalExchange
                        ).toFixed(2)}
                      ></TextInput>
                    </>
                  )}
                </div>
                {/* For adding the date of invoice data */}
                <DatePicker
                  mt={10}
                  size="xs"
                  value={dateValue}
                  onChange={(event) => setDateValue(event)}
                  placeholder="Pick date"
                  required
                />
                {/* For adding exchange data and create invoice button */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: 10,
                  }}
                >
                  <Select
                    variant="filled"
                    size="xs"
                    label="Mode of payment"
                    placeholder="Sale Type"
                    data={saleType}
                    value={saleTypeValue}
                    onChange={(e) => {
                      setSaleTypeValue(e);
                    }}
                  />
                  {saleTypeValue == "Bank" ? (
                    <Select
                      variant="filled"
                      size="xs"
                      label="Select Bank"
                      ml={5}
                      placeholder="Select Bank"
                      data={banks}
                      value={saleTypeBank}
                      onChange={(e) => {
                        setSaleTypeBank(e);
                      }}
                    />
                  ) : null}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: 10,
                  }}
                >
                  {cart.length != 0 ? (
                    <>
                      <Button
                        radius="md"
                        size="xs"
                        mr={6}
                        type="submit"
                        onClick={() => handleAddSale()}
                        color="zevcore"
                      >
                        Create Invoice & Print
                      </Button>
                      <Button
                        radius="md"
                        size="xs"
                        type="submit"
                        onClick={() => handleSaveSale()}
                        color="zevcore"
                      >
                        Save
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        mr={6}
                        radius="md"
                        size="xs"
                        disabled
                        color="zevcore"
                      >
                        Create Invoice & Print
                      </Button>
                      <Button
                        radius="md"
                        size="xs"
                        disabled
                        onClick={() => setExchangeModal(true)}
                        color="zevcore"
                      >
                        Save
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </Skeleton>
        </Grid.Col>
      </Grid>

      <Drawer
        opened={openedCustomer}
        onClose={() => setOpenCustomer(false)}
        title="Add Customer"
        padding="xl"
        size="xl"
        position="right"
      >
        <form onSubmit={formCustomer.onSubmit((values) => handleAdd(values))}>
          <Grid grow gutter="xs">
            <Grid.Col span={6}>
              <TextInput
                variant="filled"
                required
                value={formCustomer.values.label}
                label=" Name"
                placeholder="Enter Name"
                {...formCustomer.getInputProps("label")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                variant="filled"
                value={formCustomer.values.phone_number}
                label=" Phone No."
                placeholder="Phone No."
                {...formCustomer.getInputProps("phone_number")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                variant="filled"
                value={formCustomer.values.gstin}
                label="GSTIN"
                placeholder="Enter GSTIN"
                {...formCustomer.getInputProps("gstin")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                variant="filled"
                value={formCustomer.values.credit_limit}
                label="Credit Limit"
                placeholder="Enter Credit Limit"
                {...formCustomer.getInputProps("credit_limit")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                variant="filled"
                value={formCustomer.values.door_no}
                label="Dr.no"
                placeholder="Enter Dr.No"
                {...formCustomer.getInputProps("door_no")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                variant="filled"
                value={formCustomer.values.street}
                label="Street"
                placeholder="Enter Street"
                {...formCustomer.getInputProps("street")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                variant="filled"
                value={formCustomer.values.locality}
                label="Locality"
                placeholder="Enter Locality"
                {...formCustomer.getInputProps("locality")}
              />
            </Grid.Col>

            <Grid.Col span={6}>
              <NumberInput
                variant="filled"
                value={formCustomer.values.pincode}
                label="Pincode"
                onBlur={getPincode}
                placeholder="Enter Pincode"
                {...formCustomer.getInputProps("pincode")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                variant="filled"
                value={formCustomer.values.city}
                label="City"
                placeholder="Enter City"
                {...formCustomer.getInputProps("city")}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                variant="filled"
                value={formCustomer.values.state}
                label="State"
                placeholder="Enter State"
                {...formCustomer.getInputProps("state")}
              />
            </Grid.Col>
          </Grid>
          <Group position="right" mt="md">
            <Button type="submit" color="zevcore" loading={submitLoading}>
              Submit
            </Button>
          </Group>
        </form>
      </Drawer>

      <Modal
        opened={opened}
        transition="pop"
        centered
        transitionDuration={300}
        transitionTimingFunction="ease"
        onClose={() => setOpened(false)}
        title="Checkout!"
        overlayOpacity={1}
      >
        <div id="content">
          <div style={{ textAlign: "center" }}>
            <Image mt={10} sx={{ width: 300, margin: "auto" }} />
            <Text mt={10}>Company Details</Text>
          </div>
          <Divider my="sm" />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text size="md">Invoice no:</Text>
            <Text size="md">
              Date: {new Date().toLocaleDateString("en-GB")}
            </Text>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Text size="md">By:</Text>
            <Text size="md">
              Time: {new Date().toLocaleTimeString("en-GB")}
            </Text>
          </div>
          <Divider my="sm" color="dark" />
          <div
            style={{
              display: "flex",
              textAlign: "center",
              justifyContent: "space-between",
            }}
          >
            <Text size="md" sx={{ width: 70 }}>
              Sl.No
            </Text>
            <Text size="md" sx={{ width: 180, textAlign: "left" }}>
              Items
            </Text>
            <Text size="md" style={{ marginRight: "auto" }}>
              Quantity
            </Text>
            <Text size="md">Price</Text>
          </div>
          <Divider my="sm" color="dark" />

          <div key={slideCart}>
            {cart.map((row, index) => (
              <div>
                <div
                  style={{
                    display: "flex",
                    textAlign: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text size="xs" sx={{ width: 70 }}>
                    {index + 1}
                  </Text>
                  <Text size="xs" sx={{ width: 200, textAlign: "left" }}>
                    {row.product.label}
                  </Text>
                  <Text size="xs" sx={{ marginRight: "auto" }}>
                    {row.count}
                  </Text>
                  <Text size="xs">
                    ₹{(Number(row.product.price) * row.count).toFixed(2)}
                  </Text>
                </div>
                <Divider my="sm" />
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <Text size="sm">Subtotal</Text>
            <Text size="sm">₹{subTotal}</Text>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 5,
            }}
          >
            <Text size="sm">Total Tax</Text>
            <Text size="sm">₹{totalTax}</Text>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 5,
            }}
          >
            <Text size="sm">Total Discount</Text>
            {isNaN(discountValue) === false ? (
              <>
                {discountType == "percentage" ? (
                  <Text size="sm">
                    ₹
                    {(
                      Number(discountValue / 100) *
                      (Number(subTotal) + Number(totalTax))
                    ).toFixed(2)}
                  </Text>
                ) : (
                  <Text size="sm">₹{discountValue}</Text>
                )}
              </>
            ) : null}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",

              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <Text size="sm">Grand Total</Text>
            {isNaN(discountValue) === false ? (
              <>
                {discountType == "percentage" ? (
                  <Text
                    size="sm"
                    style={{
                      textTransform: "capitalize",
                    }}
                  >
                    ₹
                    {(
                      Number(subTotal) +
                      Number(totalTax) -
                      Number(discountValue / 100) *
                        (Number(subTotal) + Number(totalTax))
                    ).toFixed(2)}
                  </Text>
                ) : (
                  <Text size="sm" style={{ textTransform: "capitalize" }}>
                    ₹
                    {(Number(subTotal) + Number(totalTax)).toFixed(2) -
                      Number(discountValue)}
                  </Text>
                )}
              </>
            ) : (
              <>
                <Text size="sm" style={{ textTransform: "capitalize" }}>
                  ₹{(Number(subTotal) + Number(totalTax)).toFixed(2)}
                </Text>
              </>
            )}
          </div>

          <Text size="xs" color="dimmed" mt={10}>
            Amount in words:
          </Text>
          {isNaN(discountValue) === false ? (
            <>
              {discountType == "percentage" ? (
                <Text size="sm">
                  {converter.toWords(
                    (
                      Number(subTotal) +
                      Number(totalTax) -
                      Number(discountValue / 100) *
                        (Number(subTotal) + Number(totalTax))
                    ).toFixed(2)
                  )}
                </Text>
              ) : (
                <Text size="sm">
                  ₹
                  {converter.toWords(
                    (Number(subTotal) + Number(totalTax)).toFixed(2) -
                      Number(discountValue)
                  )}
                </Text>
              )}
            </>
          ) : (
            <>
              <Text size="sm">
                ₹
                {converter.toWords(
                  (Number(subTotal) + Number(totalTax)).toFixed(2)
                )}
              </Text>
            </>
          )}

          <Divider my="sm" />
          <Text size="xs" color="dimmed">
            Note:
          </Text>
          <Text size="xs" color="dimmed">
            Goods once sold are not returnable & non refundable
          </Text>
          <Divider my="sm" />
          <Text size="xl" sx={{ textAlign: "center" }}>
            ~ THANK YOU ~
          </Text>
        </div>

        <Button
          radius="md"
          mt={15}
          type="submit"
          size="md"
          fullWidth
          onClick={() => window.print()}
          variant="gradient"
          gradient={{ from: "orange", to: "zevcore" }}
        >
          Continue
        </Button>
      </Modal>

      <Modal
        opened={openeBarcode}
        transition="pop"
        centered
        transitionDuration={300}
        transitionTimingFunction="ease"
        onClose={() => setOpeneBarcode(false)}
        title="Enter Barcode"
      >
        <TextInput
          variant="filled"
          onKeyDown={barcode}
          placeholder="Enter Barcode Value or Scan"
        ></TextInput>
        {validateBarcode == 1 ? (
          <Text mt={5} color={"green"} size="xs">
            Item added to cart success
          </Text>
        ) : validateBarcode == 2 ? (
          <Text mt={5} color={"red"} size="xs">
            No item found for this barcode
          </Text>
        ) : (
          <Text mt={5} color={"red"} size="xs">
            &nbsp;
          </Text>
        )}
        <Button
          color={"red"}
          fullWidth
          mt={5}
          onClick={() => setOpeneBarcode(false)}
        >
          Close
        </Button>
      </Modal>

      <Drawer
        opened={discountModal}
        onClose={() => setDiscountModal(false)}
        title="Add Discount"
        padding="xl"
        size="xl"
        position="right"
      >
        <Select
          variant="filled"
          label="Discount Type"
          placeholder="Pick one"
          data={[
            { value: "percentage", label: "Percentage (%)" },
            { value: "number", label: "Whole Number" },
          ]}
          value={discountType}
          onChange={setDiscountType}
        />
        {discountType == "percentage" ? (
          <NumberInput
            variant="filled"
            mt={5}
            label="Enter Value"
            value={discountValue}
            onChange={(event) => setDiscountValue(event)}
            placeholder="Enter percentage value"
          ></NumberInput>
        ) : (
          <NumberInput
            variant="filled"
            label="Enter Value"
            mt={5}
            value={discountValue}
            onChange={(event) => setDiscountValue(event)}
            placeholder="Enter whole number"
          ></NumberInput>
        )}

        <Group position="right" mt="md">
          <Button
            type="submit"
            color="zevcore"
            onClick={() => setDiscountModal(false)}
          >
            Submit
          </Button>
        </Group>
      </Drawer>

      <Drawer
        opened={detailsModal}
        onClose={() => setDetailModal(false)}
        title="Add Printing Details"
        classNames={{
          header: classes.header,
          drawer: classes.drawer,
          closeButton: classes.closeButton,
        }}
        size="xl"
        position="right"
      >
        <div className="zc-p-3">
          <ScrollArea style={{ height: 650 }} scrollbarSize={6}>
            <TextInput
              variant="filled"
              value={formDetails.values.deliver_note}
              label="Delivery Note"
              placeholder="Delivery Note"
              {...formDetails.getInputProps("deliver_note")}
            />

            <TextInput
              variant="filled"
              value={formDetails.values.suppliers_ref}
              label="Supplier's Ref"
              placeholder="Supplier's Ref"
              {...formDetails.getInputProps("suppliers_ref")}
            />

            <TextInput
              variant="filled"
              value={formDetails.values.other_ref}
              label="Other Ref"
              placeholder="Other Ref"
              {...formDetails.getInputProps("other_ref")}
            />
            <TextInput
              variant="filled"
              value={formDetails.values.buyer_order_no}
              label="Buyer's Order No."
              placeholder="Buyer's Order No."
              {...formDetails.getInputProps("buyer_order_no")}
            />
            <TextInput
              variant="filled"
              value={formDetails.values.dated}
              label="Dated"
              placeholder="dd/mm/yyyy"
              {...formDetails.getInputProps("dated")}
            />
            <TextInput
              variant="filled"
              value={formDetails.values.despatch_doc_no}
              label="Despatch Document No."
              placeholder="Despatch Document No."
              {...formDetails.getInputProps("despatch_doc_no")}
            />
            <TextInput
              variant="filled"
              value={formDetails.values.delivery_note_date}
              label="Deliver Note Date"
              placeholder="Deliver Note Date"
              {...formDetails.getInputProps("delivery_note_date")}
            />
            <TextInput
              variant="filled"
              value={formDetails.values.despatched_through}
              label="Despatched Through"
              placeholder="Despatched Through"
              {...formDetails.getInputProps("despatched_through")}
            />
            <TextInput
              variant="filled"
              value={formDetails.values.destination}
              label="Destination"
              placeholder="Destination"
              {...formDetails.getInputProps("destination")}
            />
            <TextInput
              variant="filled"
              value={formDetails.values.terms_of_delivery}
              label="Terms Of Delivery"
              placeholder="Terms Of Delivery"
              {...formDetails.getInputProps("terms_of_delivery")}
            />
            <TextInput
              variant="filled"
              value={formDetails.values.remark}
              label="Remark"
              placeholder="Remark"
              {...formDetails.getInputProps("remark")}
            />
            <Group position="right" mt="md" mb="lg">
              <Button
                type="submit"
                color="zevcore"
                onClick={() => setDetailModal(false)}
              >
                Submit
              </Button>
            </Group>
          </ScrollArea>
        </div>
      </Drawer>
    </div>
  );
}

export default AddSale;
