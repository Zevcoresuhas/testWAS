/* 
Project name: Zevgold APOS
Author: Zevcore Private Limited
Description: Zevcore Private Limited Zevgold APOS style css file
Created Date: 31/03/2022
Version: 1.0
Required: React and mantine
*/

import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useCallback,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom"; // for import react dom navigation components
import axios from "axios";
import {
  ArrowsLeftRight,
  AugmentedReality,
  Clock,
  CurrencyCent,
  CurrencyRupee,
  Database,
  Dimensions,
  MessageCircle,
  Photo,
  Plus,
  Recycle,
  Scale,
  Search,
  Settings,
  Trash,
  X,
  Check,
} from "tabler-icons-react";
import {
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Image,
  Input,
  Menu,
  ScrollArea,
  createStyles,
  Center,
  Group,
  Text,
  ActionIcon,
  Transition,
  NativeSelect,
  Tabs,
  Modal,
  useMantineTheme,
  Select,
  TextInput,
  Drawer,
  NumberInput,
} from "@mantine/core"; //for import mantine required functions and theme
import { showNotification, updateNotification } from "@mantine/notifications";
import BarcodeIcon from "../../assets/icons/BarcodeIcon";
import { GasStation, Gauge, ManualGearbox, Users } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { useLocalStorage } from "@mantine/hooks";
import jsPDF from "jspdf";
import { handleGetOneEstimate } from "../../helpers/apis";
const converter = require("number-to-words");

function PrintEstimate() {
  const [token, setToken] = useState(localStorage.getItem("token")); //get saved local storage data
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [URL, setURL] = useState(process.env.REACT_APP_BACKEND_URL);
  const [URLFILE, setURLFILE] = useState(process.env.REACT_APP_FILE);
  const [PROFILE, setPROFILE] = useState(process.env.REACT_APP_PROFILE_URL);
  const [customer, setCustomer] = useState("");
  let navigate = useNavigate();
  const [type, setType] = useLocalStorage({
    key: "printer-type",
    defaultValue: "1",
  });
  const [data, setData] = useState("");
  const [company, setCompany] = useState("");
  const params = useParams();
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      const config = {
        headers: {
          "x-access-token": token,
        },
      };
      if (mounted) {
        const reg = {
          id: params.id,
        };
        //   For get all the group data list
        const response = await handleGetOneEstimate(reg);

        // On Respose setting the data to variable
        if (response.status === 200) {
          setData(response.data.data);
        }
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const price_in_words = (price) => {
    var sglDigit = [
        "Zero",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
      ],
      dblDigit = [
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
      ],
      tensPlace = [
        "",
        "Ten",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
      ],
      handle_tens = function (dgt, prevDgt) {
        return 0 == dgt
          ? ""
          : " " + (1 == dgt ? dblDigit[prevDgt] : tensPlace[dgt]);
      },
      handle_utlc = function (dgt, nxtDgt, denom) {
        return (
          (0 != dgt && 1 != nxtDgt ? " " + sglDigit[dgt] : "") +
          (0 != nxtDgt || dgt > 0 ? " " + denom : "")
        );
      };

    var str = "",
      digitIdx = 0,
      digit = 0,
      nxtDigit = 0,
      words = [];
    if (((price += ""), isNaN(parseInt(price)))) str = "";
    else if (parseInt(price) > 0 && price.length <= 10) {
      for (digitIdx = price.length - 1; digitIdx >= 0; digitIdx--)
        switch (
          ((digit = price[digitIdx] - 0),
          (nxtDigit = digitIdx > 0 ? price[digitIdx - 1] - 0 : 0),
          price.length - digitIdx - 1)
        ) {
          case 0:
            words.push(handle_utlc(digit, nxtDigit, ""));
            break;
          case 1:
            words.push(handle_tens(digit, price[digitIdx + 1]));
            break;
          case 2:
            words.push(
              0 != digit
                ? " " +
                    sglDigit[digit] +
                    " Hundred" +
                    (0 != price[digitIdx + 1] && 0 != price[digitIdx + 2]
                      ? " and"
                      : "")
                : ""
            );
            break;
          case 3:
            words.push(handle_utlc(digit, nxtDigit, "Thousand"));
            break;
          case 4:
            words.push(handle_tens(digit, price[digitIdx + 1]));
            break;
          case 5:
            words.push(handle_utlc(digit, nxtDigit, "Lakh"));
            break;
          case 6:
            words.push(handle_tens(digit, price[digitIdx + 1]));
            break;
          case 7:
            words.push(handle_utlc(digit, nxtDigit, "Crore"));
            break;
          case 8:
            words.push(handle_tens(digit, price[digitIdx + 1]));
            break;
          case 9:
            words.push(
              0 != digit
                ? " " +
                    sglDigit[digit] +
                    " Hundred" +
                    (0 != price[digitIdx + 1] || 0 != price[digitIdx + 2]
                      ? " and"
                      : " Crore")
                : ""
            );
        }
      str = words.reverse().join("");
    } else if (parseInt(price) == 0) {
      str = "Zero";
    } else str = "";
    return str;
  };
  const price_in_words2 = (price) => {
    var split = price.toString().split(".");
    var nonDecimal = split[0];
    var decimal = split[1];

    return (
      `INR` +
      price_in_words(Number(nonDecimal)) +
      ` & 
` +
      price_in_words(Number(decimal)) +
      ` paise`
    );
  };

  return (
    <div style={{ padding: 10 }}>
      <div
        style={{
          textAlign: "right",
        }}
        className="noprint"
      >
        <Button
          type="submit"
          color="zevcore"
          variant="outline"
          mt={15}
          onClick={() => navigate("/estimate")}
        >
          Back
        </Button>
      </div>
      {type == "1" ? (
        <>
          {data != "" ? (
            <div className="invoiceContainer2">
              <div
                style={{
                  textAlign: "center",
                }}
              >
                <img src={"images/logo/" + company.logo} alt="" width={150} />
                <h4> Tax Invoice</h4>
                <p style={{ width: "75%", margin: "auto" }}>
                  Address : {company.door} {company.street} {company.locality}{" "}
                  {company.city} {company.state} {company.picode}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p>Customer: {data.customer_id}</p>
                  <p>Bill Type: {data.bill_type}</p>
                </div>
                <div>
                  <p>Date: {new Date().toLocaleDateString("en-UK")}</p>
                </div>
              </div>

              <table className="invoiceTable2">
                <tbody>
                  <tr>
                    <td colspan="2" className="tableHeader">
                      Item
                    </td>
                    <td colspan="2" className="tableHeader">
                      Qty
                    </td>
                    <td colspan="2" className="tableHeader">
                      Price
                    </td>
                    <td colspan="2" className="tableHeader">
                      Amount
                    </td>
                  </tr>
                </tbody>
                <tbody>
                  {data.invoice_items.map((row, index) => (
                    <tr>
                      <td colspan="2"> {row.product_name}</td>
                      <td colspan="2"> {row.count}</td>
                      <td colspan="2"> {Number(row.rate).toFixed(2)}</td>
                      <td colspan="2"> {Number(row.amount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>

                <tbody>
                  <tr>
                    <td colspan="2" className="tableHeader">
                      Total
                    </td>
                    <td colspan="2" className="tableHeader">
                      {data.total_items}
                    </td>
                    <td colspan="2" className="tableHeader"></td>
                    <td colspan="2" className="tableHeader">
                      {data.total}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style={{ marginTop: 15 }}>
                <p>In Words: {price_in_words2(data.total)}</p>
              </div>

              <table className="invoiceTable3">
                <thead>
                  <tr>
                    <th>Tax</th>
                    <th>Taxable Amt</th>
                    <th>CGST</th>
                    <th>SGST</th>
                    <th>GST</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>&nbsp;</td>

                    <td>
                      {+Number(data.cgst).toFixed(2) +
                        +Number(data.sgst).toFixed(2)}
                    </td>
                    <td>{data.cgst}</td>
                    <td>{data.sgst}</td>
                    <td>0</td>
                  </tr>
                </tbody>
              </table>
              <div
                style={{
                  textAlign: "center",
                }}
              >
                <h5>Thank you visit again!</h5>
              </div>

              <div className="invoicePrint noprint">
                <button
                  type="submit"
                  color="orange"
                  variant="outline"
                  onClick={() => {
                    window.print();
                  }}
                >
                  Print
                </button>
              </div>
            </div>
          ) : null}
        </>
      ) : type == "2" ? (
        <>
          {data != "" ? (
            <div className="invoiceContainer">
              <table className="invoiceTable">
                <tbody>
                  <tr>
                    <td className="tableText tableHeader" colspan="12">
                      Tax Invoice
                    </td>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td colspan="6">
                      Billing Address: {data.customer_id} <br />{" "}
                      {customer.door_no} {customer.street} {customer.locality}{" "}
                      {customer.city} {customer.state}
                    </td>
                    <td colspan="6">
                      Invoice: {data.invoice_number}
                      <br /> Date:{" "}
                      {new Date(data.invoice_date).toLocaleDateString("en-UK")}
                    </td>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td className="tableHeader">Sl.No</td>
                    <td className="tableHeader" colspan="2">
                      Product
                    </td>
                    <td className="tableHeader">HSN/Sac</td>
                    <td className="tableHeader">Qty.</td>
                    <td className="tableHeader">Unit</td>
                    <td className="tableHeader">Price</td>
                    <td className="tableHeader">CGST %</td>
                    <td className="tableHeader">CGST</td>
                    <td className="tableHeader">SCGST %</td>
                    <td className="tableHeader">SCGST</td>
                    <td className="tableHeader">Amount</td>
                  </tr>
                </tbody>
                <tbody className="invoiceProducts">
                  {data.invoice_items.map((row, index) => (
                    <tr>
                      <td className="td2">{index + 1}</td>
                      <td colspan="2" className="td2">
                        {row.product_name}
                      </td>
                      <td className="td2"> {row.hsn}</td>
                      <td className="td2">{row.count}</td>
                      <td className="td2">Unit</td>
                      <td className="td2">{row.amount}</td>
                      <td className="td2">{Number(row.tax) / 2}</td>
                      <td className="td2">{Number(row.tax_rate) / 2}</td>
                      <td className="td2">{Number(row.tax) / 2}</td>
                      <td className="td2">{Number(row.tax_rate) / 2}</td>

                      <td className="td2">
                        {+Number(row.amount) + +Number(row.tax_rate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tbody>
                  <tr>
                    <td colspan="12"></td>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td colspan="10" className="tableTextRight">
                      Grand Total
                    </td>
                    <td>{data.total_items} Nos</td>
                    <td>{data.total}</td>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td className="tableHeader">HSN/Sac</td>
                    <td className="tableHeader">Tax Rate</td>
                    <td className="tableHeader">Taxable Amt</td>
                    <td className="tableHeader">CGST</td>
                    <td className="tableHeader">SCGST</td>
                    <td className="tableHeader">Total tax</td>
                  </tr>
                </tbody>
                <tbody>
                  {data.invoice_items.map((row, index) => (
                    <tr>
                      <td>{row.hsn}</td>
                      <td>{row.tax}</td>
                      <td>{row.tax_rate}</td>
                      <td>{Number(row.tax_rate) / 2}</td>
                      <td>{Number(row.tax_rate) / 2}</td>
                      <td>{row.tax_rate}</td>
                    </tr>
                  ))}
                </tbody>
                <tbody>
                  <tr>
                    <td colspan="12">
                      Amount (in words): {price_in_words2(data.total)}
                    </td>
                  </tr>
                </tbody>
                <tbody>
                  <tr className="last">
                    <td colspan="6">This is a computer generated invoice</td>
                    <td colspan="6" className="tableTextLeft">
                      Authorize Signature
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="invoicePrint noprint">
                <button
                  type="submit"
                  color="orange"
                  variant="outline"
                  onClick={() => {
                    window.print();
                  }}
                >
                  Print
                </button>
              </div>
            </div>
          ) : null}
        </>
      ) : type == "3" ? (
        <>
          <div className="invoiceContainer">
            <div
              style={{
                marginBottom: 5,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <img src={"images/logo/" + company.logo} alt="" width={150} />
              </div>
              <div
                style={{
                  justifySelf: "self-start",
                }}
              >
                <p style={{ textAlign: "right", fontSize: 12 }}>
                  Address : {company.door} {company.street} {company.locality}{" "}
                  {company.city} {company.state} {company.picode}
                </p>
              </div>
            </div>
            <table className="invoiceTable">
              <tbody>
                <tr>
                  <td className="tableText tableHeader" colspan="12">
                    Tax Invoice
                  </td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td colspan="6">
                    Billing Address: {data.customer_id} <br />{" "}
                    {customer.door_no} {customer.street} {customer.locality}{" "}
                    {customer.city} {customer.state}
                  </td>
                  <td colspan="6">
                    Invoice: {data.invoice_number}
                    <br /> Date:{" "}
                    {new Date(data.invoice_date).toLocaleDateString("en-UK")}
                  </td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td className="tableHeader">Sl.No</td>
                  <td className="tableHeader" colspan="2">
                    Product
                  </td>
                  <td className="tableHeader">HSN/Sac</td>
                  <td className="tableHeader">Qty.</td>
                  <td className="tableHeader">Unit</td>
                  <td className="tableHeader">Price</td>
                  <td className="tableHeader">CGST %</td>
                  <td className="tableHeader">CGST</td>
                  <td className="tableHeader">SCGST %</td>
                  <td className="tableHeader">SCGST</td>
                  <td className="tableHeader">Amount</td>
                </tr>
              </tbody>
              <tbody className="invoiceProducts">
                {data.invoice_items.map((row, index) => (
                  <tr>
                    <td className="td2">{index + 1}</td>
                    <td colspan="2" className="td2">
                      {row.product_name}
                    </td>
                    <td className="td2"> {row.hsn}</td>
                    <td className="td2">{row.count}</td>
                    <td className="td2">Unit</td>
                    <td className="td2">{row.amount}</td>
                    <td className="td2">{Number(row.tax) / 2}</td>
                    <td className="td2">{Number(row.tax_rate) / 2}</td>
                    <td className="td2">{Number(row.tax) / 2}</td>
                    <td className="td2">{Number(row.tax_rate) / 2}</td>

                    <td className="td2">
                      {+Number(row.amount) + +Number(row.tax_rate)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tbody>
                <tr>
                  <td colspan="12"></td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td colspan="10" className="tableTextRight">
                    Grand Total
                  </td>
                  <td>{data.total_items} Nos</td>
                  <td>{data.total}</td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td className="tableHeader">HSN/Sac</td>
                  <td className="tableHeader">Tax Rate</td>
                  <td className="tableHeader">Taxable Amt</td>
                  <td className="tableHeader">CGST</td>
                  <td className="tableHeader">SCGST</td>
                  <td className="tableHeader">Total tax</td>
                </tr>
              </tbody>
              <tbody>
                {data.invoice_items.map((row, index) => (
                  <tr>
                    <td>{row.hsn}</td>
                    <td>{row.tax}</td>
                    <td>{row.tax_rate}</td>
                    <td>{Number(row.tax_rate) / 2}</td>
                    <td>{Number(row.tax_rate) / 2}</td>
                    <td>{row.tax_rate}</td>
                  </tr>
                ))}
              </tbody>
              <tbody>
                <tr>
                  <td colspan="12">
                    Amount (in words): {price_in_words2(data.total)}
                  </td>
                </tr>
              </tbody>
              <tbody>
                <tr className="last">
                  <td colspan="6">This is a computer generated invoice</td>
                  <td colspan="6" className="tableTextLeft">
                    Authorize Signature
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="invoicePrint noprint">
              <button
                type="submit"
                color="orange"
                variant="outline"
                onClick={() => {
                  window.print();
                }}
              >
                Print
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default PrintEstimate;
