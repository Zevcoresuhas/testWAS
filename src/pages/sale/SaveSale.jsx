/* 
Project name: Zevcore APOS
Author: Zevcore Private Limited
Description: Zevcore Private Limited Zevcore APOS style css file
Created Date: 31/03/2022
Version: 1.0
Required: React and mantine
*/
import React, { useState, useEffect } from "react"; //main react import for use use state use effects
import { useNavigate, useParams } from "react-router-dom"; // for import react dom navigation components
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
} from "@mantine/core"; //for import mantine required functions and theme //mantine main core imports lists
import { showNotification, updateNotification } from "@mantine/notifications"; //For show bottom mantine notification
import BarcodeIcon from "../../assets/icons/BarcodeIcon"; //Import barcode icons image
import { useForm } from "@mantine/form"; //Import for mantine form validation

import jsPDF from "jspdf"; //Import for jason to pdf converter
import { DatePicker } from "@mantine/dates";
import useStyles from "../../components/Style";
import {
  handleAddInvoice,
  handleGetOneSaveInvoice,
  handleGetStock,
  handleGetCustomer,
  handleGetSaleType,
} from "../../helpers/apis";
import { selectFilter } from "../../helpers/common";
import notificationHelper from "../../helpers/notification";
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
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState(0);

  const [subTotal, setSubTotal] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [total, setTotal] = useState(0);

  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [extra, setExtra] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [customer2, setCustomer2] = useState([]);
  const [group, setGroup] = useState([]);
  const [saleType, setSaleType] = useState([]);
  const [saleTypeValue, setSaleTypeValue] = useState(null);
  const [saleTypeTax, setSaleTypeTax] = useState(0);
  const [customerValue, setCustomerValue] = useState(null);
  const [amountPaid, setAmountPaid] = useState(0);
  const [balance, setBalanced] = useState(0);
  const [dateValue, setDateValue] = useState(new Date());
  const [exchangeModal, setExchangeModal] = useState(false);
  const [totalExchange, setTotalExchange] = useState(0);
  const [makingCharge, setMakingCharge] = useState(0);
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  let navigate = useNavigate();
  const params = useParams();
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
          const listGroup = await selectFilter({
            data: response3.data.data,
          });
          setSaleType(listGroup);
        }

        const req = {
          id: params.id,
        };
        console.log(req);
        const response4 = await handleGetOneSaveInvoice(req);
        console.log(response4);
        if (response4.status == 200) {
          const details = response4.data.data;
          setAmountPaid(Number(details.paid));
          setTotalTax(Number(details.cgst * 2));
          setSubTotal(Number(details.sub_total));
          setCustomerValue(details.customer_id);
          setSaleTypeValue(details.bill_type);
          setDiscountValue(Number(details.discount));
          var list = details.save_invoice_items;
          var cart_list = [];
          for (let i = 0; i < list.length; i++) {
            cart_list[i] = list[i];
            cart_list[i].slider = true;
          }
          setCart(cart_list);
          setSlideCart(Date.now());
        }
        setSkeletonLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const [exchange, setExchange] = useState([
    {
      gross_weight: 0,
      wastage: 0,
      weight: 0,
      rate: 0,
      total: 0,
    },
    {
      gross_weight: 0,
      wastage: 0,
      weight: 0,
      rate: 0,
      total: 0,
    },
    {
      gross_weight: 0,
      wastage: 0,
      weight: 0,
      rate: 0,
      total: 0,
    },
    {
      gross_weight: 0,
      wastage: 0,
      weight: 0,
      rate: 0,
      total: 0,
    },
  ]);

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
  const exchangeForm = useForm({
    initialValues: {
      gold: [
        { gross_weight: 0, wastage: 0, weight: 0, rate: 0, total: 0 },
        { gross_weight: 0, wastage: 0, weight: 0, rate: 0, total: 0 },
        { gross_weight: 0, wastage: 0, weight: 0, rate: 0, total: 0 },
        { gross_weight: 0, wastage: 0, weight: 0, rate: 0, total: 0 },
        { gross_weight: 0, wastage: 0, weight: 0, rate: 0, total: 0 },
      ],
      silver: [
        { gross_weight: 0, wastage: 0, weight: 0, rate: 0, total: 0 },
        { gross_weight: 0, wastage: 0, weight: 0, rate: 0, total: 0 },
        { gross_weight: 0, wastage: 0, weight: 0, rate: 0, total: 0 },
        { gross_weight: 0, wastage: 0, weight: 0, rate: 0, total: 0 },
        { gross_weight: 0, wastage: 0, weight: 0, rate: 0, total: 0 },
      ],
    },
  });

  const goldFields = exchangeForm.values.gold.map((_, index) => (
    <tr>
      <td>{index + 1}</td>
      <td>
        <TextInput
          variant="filled"
          placeholder="Gross Wt"
          size="xs"
          {...exchangeForm.getInputProps(`gold.${index}.gross_weight`)}
        />
      </td>
      <td>
        <TextInput
          variant="filled"
          placeholder="Wastage"
          size="xs"
          {...exchangeForm.getInputProps(`gold.${index}.wastage`)}
        />
      </td>
      <td>
        <TextInput
          variant="filled"
          placeholder="Weight"
          readOnly
          size="xs"
          value={
            parseFloat(exchangeForm.values.gold[index].gross_weight).toFixed(
              2
            ) - parseFloat(exchangeForm.values.gold[index].wastage).toFixed(2)
          }
        />
      </td>
      <td>
        <TextInput
          variant="filled"
          placeholder="Rate"
          size="xs"
          {...exchangeForm.getInputProps(`gold.${index}.rate`)}
        />
      </td>
      <td>
        <TextInput
          variant="filled"
          placeholder="Total"
          readOnly
          value={
            (
              parseFloat(exchangeForm.values.gold[index].gross_weight).toFixed(
                2
              ) - parseFloat(exchangeForm.values.gold[index].wastage)
            ).toFixed(2) *
            parseFloat(exchangeForm.values.gold[index].rate).toFixed(2)
          }
          size="xs"
        />
      </td>
    </tr>
  ));

  const silverFields = exchangeForm.values.silver.map((_, index) => (
    <tr>
      <td>{index + 1}</td>
      <td>
        <TextInput
          variant="filled"
          placeholder="Gross Wt"
          size="xs"
          {...exchangeForm.getInputProps(`silver.${index}.gross_weight`)}
        />
      </td>

      <td>
        <TextInput
          variant="filled"
          placeholder="Wastage"
          size="xs"
          {...exchangeForm.getInputProps(`silver.${index}.rate`)}
        />
      </td>
      <td>
        <TextInput
          variant="filled"
          placeholder="Weight"
          readOnly
          size="xs"
          value={
            parseFloat(exchangeForm.values.silver[index].gross_weight).toFixed(
              2
            ) - parseFloat(exchangeForm.values.silver[index].wastage).toFixed(2)
          }
        />
      </td>
      <td>
        <TextInput
          variant="filled"
          placeholder="Rate"
          size="xs"
          {...exchangeForm.getInputProps(`silver.${index}.rate`)}
        />
      </td>
      <td>
        <TextInput
          variant="filled"
          placeholder="Total"
          readOnly
          value={
            (
              parseFloat(
                exchangeForm.values.silver[index].gross_weight
              ).toFixed(2) -
              parseFloat(exchangeForm.values.silver[index].wastage)
            ).toFixed(2) *
            parseFloat(exchangeForm.values.silver[index].rate).toFixed(2)
          }
          size="xs"
        />
      </td>
    </tr>
  ));

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

    var saletypeId = "";
    if (saleTypeValue !== null && saleTypeValue !== "") {
      var data = saleType.find((img) => img.value === saleTypeValue);
      saletypeId = data.label;
    }
    var customerId = "";
    if (customerValue !== null && customerValue !== "") {
      var data = customer.find((img) => img.value === customerValue);
      customerId = data.label;
    }

    const reg = {
      discount_type: discountType,
      discountValue: discountValue,
      subTotal: subTotal,
      totalTax: (+totalTax + (Number(saleTypeTax) / 100) * subTotal).toFixed(2),
      sale_type: saletypeId,
      customer: customerId,
      making_charge: makingCharge,
      list: cart,
      paid: amountPaid,
      date: dateValue,
      totalExchange: totalExchange,
      exchangeItem: exchangeForm.values,
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
    var one_Data = data.find((img) => img.barcode === e);

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
    const exist = datas.some((data) => data.barcode === e);
    // Check for same product is already added
    if (exist === true) {
      // If same product already added get the product price and increment count to plus one and change total value and tax data
      var one_Data = data.find((img) => img.barcode === e);
      if (typeof one_Data.product.type !== "") {
        var tax =
          (Number(one_Data.product.tax) / 100) *
          Number(one_Data.product.price).toFixed(2);
        var totalX = (Number(tax) + Number(totalTax)).toFixed(2);
        var subtotal = Number(one_Data.product.price).toFixed(2);
        var totalS = (Number(subtotal) + Number(subTotal)).toFixed(2);
        setSubTotal(totalS);
        setTotalTax(totalX);
        const index = datas.findIndex((img) => img.barcode === e);
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
      var one_Data = data.find((img) => img.barcode === e);
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
      const index = datas.findIndex((img) => img.barcode === e);
      datas[index].slider = true;
      setCart(datas);

      setSlideCart(Date.now());
    }, 400);
  };

  // For remove the cart data
  const handleRemoveCart = (e) => {
    setSlideCart(Date.now());
    var datas = cart;
    console.log(cart, e);
    const exist = datas.some((data) => data.barcode === e);
    // Check if the data if present before remove
    if (exist === true) {
      var one_Data = cart.find((img) => img.barcode === e);

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
        const index = datas.findIndex((img) => img.barcode === e);
        // Decrement the count by 1
        datas[index].count--;
        // Check the count is 0 if zero remove product from cart otherwise just Decrement the count
        if (datas[index].count == 0) {
          datas = datas.filter((img) => img.barcode !== e);
          setCart(datas);
        } else {
          setCart(datas);
        }
      } else {
        console.log(data);
        const index = datas.findIndex((img) => img.barcode === e);
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

        datas = datas.filter((img) => img.barcode !== e);
        setCart(datas);
      }
    }
    // Set time out for 4ms and reload the cart data
    setTimeout(() => {
      const index = datas.findIndex((img) => img.barcode === e);
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
                                  onClick={() =>
                                    handleAddCartModal(row.barcode)
                                  }
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
                                onClick={() => handleRemoveCart(row.barcode)}
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

                  <Select
                    variant="filled"
                    size="xs"
                    ml={5}
                    placeholder="Sale Type"
                    data={saleType}
                    value={saleTypeValue}
                    onChange={(e) => {
                      setSaleTypeValue(e);
                      //   var data = saleType.find((img) => img.value === e);
                      //   setSaleTypeTax(data.tax);
                    }}
                  />
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
                  {/* <Button
                    radius="md"
                    size="xs"
                    type="submit"
                    mr={6}
                    onClick={() => setExchangeModal(true)}
                    color="zevcore"
                  >
                    Exchange
                  </Button> */}
                  {cart.length != 0 ? (
                    <Button
                      radius="md"
                      size="xs"
                      type="submit"
                      onClick={() => handleAddSale()}
                      color="zevcore"
                    >
                      Create Invoice & Print
                    </Button>
                  ) : (
                    <Button
                      radius="md"
                      size="xs"
                      type="submit"
                      disabled
                      color="zevcore"
                    >
                      Create Invoice & Print
                    </Button>
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
        opened={exchangeModal}
        onClose={() => setExchangeModal(false)}
        title="Add Exchange"
        classNames={{
          header: classes.header,
          drawer: classes.drawer,
          closeButton: classes.closeButton,
        }}
        size={800}
        position="right"
      >
        <div
          className="drawer_scroll2"
          style={{ paddingRight: 24, paddingLeft: 24, paddingBottom: 24 }}
        >
          <Text weight={600}>Old Gold metal</Text>
          <table className="zc_table">
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>
                  Gross Wt<span style={{ color: "red" }}>&nbsp;*</span>
                </th>
                <th>
                  Wastage<span style={{ color: "red" }}>&nbsp;*</span>
                </th>
                <th>
                  Weight<span style={{ color: "red" }}>&nbsp;*</span>
                </th>
                <th>
                  Rate<span style={{ color: "red" }}>&nbsp;*</span>
                </th>
                <th>
                  Total<span style={{ color: "red" }}>&nbsp;*</span>
                </th>
              </tr>
            </thead>
            <tbody>{goldFields}</tbody>
          </table>

          <Text mt={15} weight={600}>
            Old Silver metal
          </Text>
          <table className="zc_table">
            <thead>
              <tr>
                <th>Sl.No</th>
                <th>
                  Gross Wt<span style={{ color: "red" }}>&nbsp;*</span>
                </th>
                <th>
                  Wastage<span style={{ color: "red" }}>&nbsp;*</span>
                </th>
                <th>
                  Weight<span style={{ color: "red" }}>&nbsp;*</span>
                </th>
                <th>
                  Rate<span style={{ color: "red" }}>&nbsp;*</span>
                </th>
                <th>
                  Total<span style={{ color: "red" }}>&nbsp;*</span>
                </th>
              </tr>
            </thead>
            <tbody>{silverFields}</tbody>
          </table>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 15,
            }}
          >
            <Text>
              Total:{" "}
              {exchangeForm.values.gold.reduce(function (sum, current) {
                return (
                  sum + (current.gross_weight - current.wastage) * current.rate
                );
              }, 0) +
                exchangeForm.values.silver.reduce(function (sum, current) {
                  return (
                    sum +
                    (current.gross_weight - current.wastage) * current.rate
                  );
                }, 0)}
            </Text>
            <Button
              type="submit"
              color="zevcore"
              mb={150}
              onClick={() => {
                setExchangeModal(false);
                setTotalExchange(
                  exchangeForm.values.gold.reduce(function (sum, current) {
                    return (
                      sum +
                      (current.gross_weight - current.wastage) * current.rate
                    );
                  }, 0) +
                    exchangeForm.values.silver.reduce(function (sum, current) {
                      return (
                        sum +
                        (current.gross_weight - current.wastage) * current.rate
                      );
                    }, 0)
                );
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </Drawer>
      <Modal
        opened={wModal}
        transition="pop"
        centered
        transitionDuration={300}
        transitionTimingFunction="ease"
        onClose={() => setWModal(false)}
        title="Enter Design weight and price"
      >
        <NumberInput
          variant="filled"
          required
          value={wGram}
          precision={2}
          step={0.01}
          label=" Enter Grams"
          placeholder="Enter Grams"
          onChange={(e) => {
            setWGram(e);
          }}
          max={rGram}
          min={0.01}
        />

        <Text size="xs">Remaining Grams {rGram}</Text>

        <NumberInput
          variant="filled"
          required
          value={WWeast}
          precision={2}
          step={0.01}
          label=" Enter Wastage"
          placeholder="Enter Wastage"
          onChange={(e) => {
            setWWeast(e);
          }}
        />

        <NumberInput
          variant="filled"
          required
          value={wGram + WWeast}
          precision={2}
          step={0.01}
          readOnly
          label=" Total Net Weight"
          placeholder="Total Net Weight"
        />

        <NumberInput
          variant="filled"
          required
          value={wPrice}
          label=" Enter Price / Gram"
          placeholder="Enter Price / Gram"
          onChange={(e) => {
            setWPrice(e);
          }}
        />
        <NumberInput
          variant="filled"
          required
          value={(wGram + WWeast) * wPrice}
          label=" Total Amount"
          placeholder="Total Amount"
        />
        {wGram <= rGram ? (
          <Button
            onClick={() => handleAddCart(WId)}
            type="submit"
            mt={10}
            color="zevcore"
          >
            Submit
          </Button>
        ) : (
          <Button disabled type="submit" mt={10} color="zevcore">
            Submit
          </Button>
        )}
      </Modal>
    </div>
  );
}

export default AddSale;
