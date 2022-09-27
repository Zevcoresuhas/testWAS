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
              Billing Address: <br /> Zevcore
            </td>
            <td colspan="6">
              Invoice: 798465 <br /> Date:{" "}
              {new Date().toLocaleDateString("en-UK")}
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
          <tr>
            <td className="td2">1</td>
            <td colspan="2" className="td2">
              Product Name
            </td>
            <td className="td2"> 465</td>
            <td className="td2">1</td>
            <td className="td2">Nos</td>
            <td className="td2">850</td>
            <td className="td2">9</td>
            <td className="td2">76</td>
            <td className="td2">9</td>
            <td className="td2">76</td>
            <td className="td2">1000</td>
          </tr>
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
            <td>1 Nos</td>
            <td>1000</td>
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
          <tr>
            <td>HSN/Sac</td>
            <td>Tax Rate</td>
            <td>Taxable Amt</td>
            <td>CGST</td>
            <td>SCGST</td>
            <td>Total tax</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td colspan="12">Amount (in words): {price_in_words2(895.36)}</td>
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
  );
}

export default Invoice;
