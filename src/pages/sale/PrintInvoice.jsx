/* 
Project name: Zevgold APOS
Author: Zevcore Private Limited
Description: Zevcore Private Limited Zevgold APOS style css file
Created Date: 31/03/2022
Version: 1.0
Required: React and mantine
*/

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // for import react dom navigation components
import { Avatar, Button, Text } from "@mantine/core"; //for import mantine required functions and theme
import "./invoice.css";
import {
  handleGetOneInvoice,
  handleGetAccount,
  handleGetAddress,
  handleGetBank,
  handleGetCustomer,
} from "../../helpers/apis";
import { useLocalStorage } from "@mantine/hooks";

const converter = require("number-to-words");
function PrintInvoice() {
  const [token, setToken] = useState(localStorage.getItem("token")); //get saved local storage data
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [URL, setURL] = useState(process.env.REACT_APP_BACKEND_URL);
  const [URLFILE, setURLFILE] = useState(process.env.REACT_APP_FILE);
  const [PROFILE, setPROFILE] = useState(process.env.REACT_APP_PROFILE_URL);
  const [customer, setCustomer] = useState("");
  const [bank, setBank] = useState("");
  const [address, setAddress] = useState("");
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
      console.log(params.id);
      if (mounted) {
        const reg = {
          id: params.id,
        };
        //   For get all the group data list
        const response = await handleGetOneInvoice(reg);

        // On Respose setting the data to variable
        if (response.status === 200) {
          setData(response.data.data);
        }

        const response2 = await handleGetAccount();
        console.log(response2);
        if (response2.status === 200) {
          setCompany(response2.data.data);
        }

        const response4 = await handleGetAddress();

        // On Respose setting the data to variable
        if (response4.status === 200) {
          if (
            response.data.data.address != null &&
            response.data.data.address != "" &&
            typeof response.data.data.address != "undefined"
          ) {
            var datas = response4.data.data,
              datas = datas.find(
                (img) => img.label === response.data.data.address
              );
            setAddress(datas);
          }
        }

        const response5 = await handleGetBank();

        // On Respose setting the data to variable
        if (response5.status === 200) {
          if (
            response.data.data.bank_name != null &&
            response.data.data.bank_name != "" &&
            typeof response.data.data.bank_name != "undefined"
          ) {
            var datas = response5.data.data,
              datas = datas.find(
                (img) => img.label === response.data.data.bank_name
              );
            setBank(datas);
          }
        }

        const response6 = await handleGetCustomer();

        // On Respose setting the data to variable
        if (response6.status === 200) {
          if (
            response.data.data.customer_id != null &&
            response.data.data.customer_id != "" &&
            typeof response.data.data.customer_id != "undefined"
          ) {
            var datas = response6.data.data,
              datas = datas.find(
                (img) => img.label === response.data.data.customer_id
              );
            setCustomer(datas);
          }
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
          onClick={() => navigate("/sale")}
        >
          Back to sales
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
                {address != "" ? (
                  <p style={{ width: "75%", margin: "auto" }}>
                    Address : {address.door} {address.street} {address.locality}{" "}
                    {address.city} {address.state} {address.picode}
                  </p>
                ) : (
                  <p style={{ width: "75%", margin: "auto" }}>
                    Address : {company.door} {company.street} {company.locality}{" "}
                    {company.city} {company.state} {company.picode}
                  </p>
                )}
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
                      <Text weight={600} size="md">
                        Tax Invoice
                      </Text>
                    </td>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    {company == "" ? (
                      <td colspan="4" rowspan="4">
                        Company Name <br /> &nbsp;
                      </td>
                    ) : (
                      <>
                        {address == "" ? (
                          <td colspan="4" rowspan="4">
                            <Text weight={600}>{company.label}</Text>
                            {company.door} &nbsp; <br /> {company.street}&nbsp;
                            {company.locality}&nbsp; <br /> {company.city}
                            &nbsp; {company.state} - {company.pincode} &nbsp;{" "}
                            <br />{" "}
                            {company.gstin != "" && company.gstin != null ? (
                              <span>GSTIN :{company.gstin}</span>
                            ) : (
                              <span> &nbsp;</span>
                            )}
                            <br />
                            {company.phone_number != "" &&
                            company.phone_number != null ? (
                              <span>PH.No. :{company.phone_number}</span>
                            ) : (
                              <span> &nbsp;</span>
                            )}
                          </td>
                        ) : (
                          <td colspan="4" rowspan="4">
                            <Text weight={600}>{company.label}</Text>
                            <Text>{address.label}</Text>
                            {address.door} &nbsp; <br /> {address.street}&nbsp;
                            {address.locality}&nbsp; <br /> {address.city}
                            &nbsp; {address.state} - {address.pincode} &nbsp;{" "}
                            <br />{" "}
                            {company.gstin != "" && company.gstin != null ? (
                              <span>GSTIN :{company.gstin}</span>
                            ) : (
                              <span> &nbsp;</span>
                            )}
                            <br />
                            {company.phone_number != "" &&
                            company.phone_number != null ? (
                              <span>PH.No. :{company.phone_number}</span>
                            ) : (
                              <span> &nbsp;</span>
                            )}
                          </td>
                        )}
                      </>
                    )}
                  </tr>
                  <tr>
                    <td colspan="2">
                      Invoice No. <br />
                      <span className="tableSpan">
                        {data.invoice_number} &nbsp;
                      </span>
                    </td>
                    <td colspan="5">
                      Date <br />{" "}
                      <span className="tableSpan">
                        {new Date(data.invoice_date).toLocaleDateString(
                          "en-UK"
                        )}{" "}
                        &nbsp;
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      Delivery Note <br />{" "}
                      <span className="tableSpan">
                        {data.deliver_note} &nbsp;
                      </span>
                    </td>
                    <td colspan="5">
                      Mode/Terms of Payment <br />{" "}
                      <span className="tableSpan">{data.bill_type} &nbsp;</span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      Supplier's Ref <br />{" "}
                      <span className="tableSpan">
                        {data.suppliers_ref} &nbsp;
                      </span>
                    </td>
                    <td colspan="5">
                      Other reference (s) <br />{" "}
                      <span className="tableSpan">{data.other_ref} &nbsp;</span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="4" rowspan="4">
                      Billing Address: <br />
                      <Text weight={600}>{data.customer_id}&nbsp;</Text>
                      {customer != "" ? (
                        <>
                          {customer.door_no} {customer.street}{" "}
                          {customer.locality}
                          &nbsp;
                          <br />
                          {customer.city} {customer.state} &nbsp;
                          <br />
                          Ph.No {customer.phone_number} &nbsp;
                        </>
                      ) : (
                        <>
                          &nbsp;
                          <br />
                          &nbsp;
                          <br />
                          &nbsp;
                        </>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td colspan="2">
                      Buyer's Order No
                      <br />{" "}
                      <span className="tableSpan">
                        {data.buyer_order_no} &nbsp;
                      </span>
                    </td>
                    <td colspan="5">
                      Dated
                      <br />{" "}
                      <span className="tableSpan">{data.dated} &nbsp;</span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      Despatch Document No.
                      <br />{" "}
                      <span className="tableSpan">
                        {data.despatch_doc_no} &nbsp;
                      </span>
                    </td>
                    <td colspan="5">
                      Delivery Note Date
                      <br />{" "}
                      <span className="tableSpan">
                        {data.delivery_note_date} &nbsp;
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td colspan="2">
                      Despatched through
                      <br />{" "}
                      <span className="tableSpan">
                        {data.despatched_through} &nbsp;
                      </span>
                    </td>
                    <td colspan="5">
                      Destination
                      <br />{" "}
                      <span className="tableSpan">
                        {data.destination} &nbsp;
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="5" rowspan="2">
                      Delivery Address
                      <br />
                      {customer != "" ? (
                        <>
                          {customer.door_no} {customer.street}{" "}
                          {customer.locality}
                          &nbsp;
                          <br />
                          {customer.city} {customer.state} &nbsp;
                          <br />
                          Ph.No {customer.phone_number} &nbsp;
                        </>
                      ) : (
                        <>
                          &nbsp;
                          <br />
                          &nbsp;
                          <br />
                          &nbsp;
                        </>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="7">
                      Terms of Delivery
                      <br />{" "}
                      <span className="tableSpan">
                        {data.terms_of_delivery} &nbsp;
                        <br />
                        &nbsp;
                      </span>
                    </td>
                  </tr>
                </tbody>

                <tbody>
                  <tr>
                    <td className="tableHeader">Sl.No.</td>
                    <td className="tableHeader2" colspan="4">
                      Description of goods
                    </td>
                    <td className="tableHeader3">HSN/Sac</td>
                    <td className="tableHeader">Quantity</td>
                    <td className="tableHeader" colspan="2">
                      Rate
                    </td>
                    <td className="tableHeader">Per&nbsp;</td>

                    <td className="tableHeader4" colspan="2">
                      Amount
                    </td>
                  </tr>
                </tbody>
                <tbody className="invoiceProducts">
                  {data.invoice_items.map((row, index) => (
                    <tr className="tableBottomBorderNo">
                      <td>{index + 1}</td>
                      <td colspan="4">
                        <span className="tableSpan"> {row.product_name}</span>
                      </td>
                      <td>{row.hsn}</td>
                      <td>{row.count}</td>
                      <td colspan="2">{row.amount}</td>
                      <td>Unit</td>

                      <td colspan="2">
                        <span className="tableSpan">
                          {+Number(row.amount) + +Number(row.tax_rate)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tbody>
                  <tr className="tableBottomBorderNo">
                    <td></td>
                    <td colspan="4" className="tableTextRight">
                      CGST
                    </td>
                    <td></td>
                    <td></td>
                    <td colspan="2"></td>
                    <td></td>
                    <td colspan="2">{data.cgst}</td>
                  </tr>
                  <tr className="tableBottomBorderNo">
                    <td></td>
                    <td className="tableTextRight" colspan="4">
                      SCGST
                    </td>
                    <td></td>
                    <td></td>
                    <td colspan="2"></td>
                    <td></td>
                    <td colspan="2">{data.sgst}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td className="tableTextRight" colspan="4">
                      R-off/Discount
                    </td>
                    <td></td>
                    <td></td>
                    <td colspan="2"></td>
                    <td></td>
                    <td colspan="2">(-){data.discount}</td>
                  </tr>

                  <tr>
                    <td></td>
                    <td className="tableTextRight" colspan="4">
                      Grand Total
                    </td>
                    <td></td>
                    <td>
                      {" "}
                      <Text weight={600} size="sm">
                        {data.total_items} Nos
                      </Text>
                    </td>
                    <td colspan="2"></td>
                    <td></td>
                    <td colspan="2">
                      <Text weight={600} size="sm">
                        {data.total}
                      </Text>
                    </td>
                  </tr>
                </tbody>
                <tbody>
                  <tr>
                    <td colspan="12">
                      Amount (in words): <br />{" "}
                      <span className="tableSpan">
                        {price_in_words2(data.total)}
                      </span>
                    </td>
                  </tr>
                </tbody>

                <tbody>
                  <tr>
                    <td className="tableHeader" colSpan="3" rowspan="2">
                      HSN/Sac
                    </td>

                    <td className="tableHeader" rowspan="2">
                      Taxable Amt
                    </td>
                    <td className="tableHeader" colSpan="2">
                      Central Tax
                    </td>
                    <td className="tableHeader" colSpan="2">
                      State Tax
                    </td>

                    <td className="tableHeader" colSpan="3" rowspan="2">
                      Total Tax Amount
                    </td>
                  </tr>
                  <tr>
                    <td className="tableHeader">Rate</td>
                    <td className="tableHeader">Amount</td>
                    <td className="tableHeader">Rate</td>
                    <td className="tableHeader">Amount</td>
                  </tr>
                </tbody>

                <tbody>
                  {data.invoice_items.map((row, index) => (
                    <tr className="tableBottomBorderNo">
                      <td colSpan="3">{row.hsn}</td>
                      <td>{row.amount}</td>

                      <td>{Number(row.tax) / 2}</td>
                      <td>{Number(row.tax_rate) / 2}</td>
                      <td>{Number(row.tax) / 2}</td>
                      <td>{Number(row.tax_rate) / 2}</td>
                      <td colSpan="3">{row.tax_rate}</td>
                    </tr>
                  ))}
                </tbody>
                <tbody>
                  <tr className="tableTopBorder">
                    <td className="tableTextRight" colSpan="3">
                      Total
                    </td>

                    <td>{data.sub_total}</td>
                    <td></td>

                    <td>{data.cgst}</td>
                    <td></td>

                    <td>{data.sgst}</td>
                    <td colSpan="3">
                      {Number(+Number(data.cgst) + +Number(data.sgst)).toFixed(
                        2
                      )}
                    </td>
                  </tr>
                </tbody>
                <tbody>
                  <tr className="tableBottomBorderNo">
                    <td colspan="12">
                      Tax Amount (in words): <br />
                      <span className="tableSpan">
                        {price_in_words2(
                          Number(
                            +Number(data.cgst) + +Number(data.sgst)
                          ).toFixed(2)
                        )}
                      </span>
                      <br />
                    </td>
                  </tr>
                </tbody>
                {data.bill_type == "Bank" ? (
                  <tbody>
                    <tr>
                      <td colspan="12" className="tableTextRight ">
                        <span className="tableSpan"> Bank Details </span>
                        <br />
                        {bank != "" ? (
                          <>
                            {bank.label} <br />
                            &nbsp; Account No. - {bank.account_no} <br />
                            &nbsp; IFSC - {bank.ifsc} <br />
                            &nbsp; Name - {bank.name} <br />
                            &nbsp; Branch - {bank.branch} <br />
                          </>
                        ) : (
                          <>
                            <br /> &nbsp;
                          </>
                        )}
                      </td>
                    </tr>
                  </tbody>
                ) : null}

                <tbody>
                  <tr>
                    <td colspan="6">
                      <span className="tableSpan"> Declaration</span> <br /> We
                      declare that this invoice shows the actual price of the
                      goods described and that all particulars are true and
                      correct
                    </td>
                    <td colspan="6" className="tableTextRight">
                      &nbsp; <br /> &nbsp; <br />
                      <span className="tableSpan"> Authorized Signature</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style={{ textAlign: "center" }}>
                {" "}
                <p style={{ fontSize: 10 }}>
                  This is a Computer generated Invoice
                </p>{" "}
              </div>
              <div className="invoicePrint noprint">
                <p style={{ fontSize: 10 }}>Remark : {data.remark}</p>{" "}
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
                    <span className="tableSpan">Billing Address:</span>{" "}
                    {data.customer_id} <br /> {customer.door_no}{" "}
                    {customer.street} {customer.locality} {customer.city}{" "}
                    {customer.state}
                  </td>
                  <td colspan="6">
                    <span className="tableSpan">
                      Invoice: {data.invoice_number}
                    </span>
                    <br />{" "}
                    <span className="tableSpan">
                      Date:{" "}
                      {new Date(data.invoice_date).toLocaleDateString("en-UK")}
                    </span>
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
                  <td className="tableHeader">GST %</td>
                  <td className="tableHeader">CGST ₹</td>

                  <td className="tableHeader">SGST ₹</td>
                  <td className="tableHeader">Amount</td>
                </tr>
              </tbody>
              <tbody className="invoiceProducts">
                {data.invoice_items.map((row, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td colspan="2">{row.product_name}</td>
                    <td> {row.hsn}</td>
                    <td>{row.count}</td>
                    <td>Unit</td>
                    <td>{row.amount}</td>
                    <td>{Number(row.tax)}</td>
                    <td>{Number(row.tax_rate) / 2}</td>

                    <td>{Number(row.tax_rate) / 2}</td>

                    <td>{+Number(row.amount) + +Number(row.tax_rate)}</td>
                  </tr>
                ))}
              </tbody>

              <tbody>
                <tr>
                  <td colspan="9" className="tableTextRight">
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

export default PrintInvoice;
