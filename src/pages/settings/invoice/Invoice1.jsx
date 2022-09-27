import React from "react";
import "./invoice.css";

function Invoice() {
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
    <div className="invoiceContainer2">
      <div
        style={{
          textAlign: "center",
        }}
      >
        <h1>Company Logo</h1>
        <h4> Tax Invoice</h4>
        <p>Address details</p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p>Customer: Zevcore</p>
          <p>Payment Type: Cash</p>
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
          <tr>
            <td colspan="2" className="td3">
              Product Name
            </td>
            <td colspan="2" className="td3">
              2
            </td>
            <td colspan="2" className="td3">
              20
            </td>
            <td colspan="2" className="td3">
              40
            </td>
          </tr>
          <tr>
            <td colspan="2" className="td3">
              Product Name
            </td>
            <td colspan="2" className="td3">
              2
            </td>
            <td colspan="2" className="td3">
              20
            </td>
            <td colspan="2" className="td3">
              40
            </td>
          </tr>
        </tbody>

        <tbody>
          <tr>
            <td colspan="2" className="tableHeader">
              Total
            </td>
            <td colspan="2" className="tableHeader">
              2
            </td>
            <td colspan="2" className="tableHeader">
              20
            </td>
            <td colspan="2" className="tableHeader">
              40
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: 15 }}>
        <p>In Words: {price_in_words2(895.36)}</p>
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
            <td>8%</td>
            <td>12</td>
            <td>6</td>
            <td>6</td>
            <td>0</td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th>Total Tax</th>
            <th></th>
            <th>6</th>
            <th>6</th>
            <th>0</th>
          </tr>
        </thead>
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
  );
}

export default Invoice;
