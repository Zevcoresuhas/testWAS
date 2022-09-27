// for import the dependecies data
import React from "react";
import { useNavigate } from "react-router-dom"; // for import react dom navigation components
import { Paper, Text } from "@mantine/core"; //for import mantine required functions and theme
import { Home } from "tabler-icons-react";

const BreadCrumb = (props) => {
  let navigate = useNavigate();
  const handleClick = (event) => {
    navigate(event);
  };

  return (
    <Paper
      style={{
        display: "flex",
        backgroundColor: "transparent",
        justifyContent: "space-between",

        marginRight: 10,
        marginLeft: 10,
        marginBottom: 0,
      }}
    >
      <Text>
        {props.Text} {props.Name ? <span>( {props.Name} )</span> : null}{" "}
      </Text>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <p
          style={{
            cursor: "pointer",
          }}
          onClick={() => handleClick("/")}
        >
          {" "}
          <Home style={{ paddingTop: 0 }} size={12} />{" "}
        </p>
        {props.Title ? (
          <>
            <p style={{ paddingTop: 0 }}> &nbsp; / &nbsp;</p>
            <p
              style={{
                cursor: "pointer",
                fontSize: 12,
                paddingTop: 4,
              }}
              onClick={() => handleClick(props.titleLink)}
            >
              {" "}
              {props.Title}
            </p>
          </>
        ) : null}
        {props.Text ? (
          <>
            <p style={{ paddingTop: 0 }}> &nbsp; / &nbsp;</p>
            <p
              style={{
                cursor: "pointer",
                fontSize: 12,
                paddingTop: 4,
              }}
              className="zc-breadcrumb-text"
            >
              {" "}
              {props.Text}
            </p>
          </>
        ) : null}
      </div>
    </Paper>
  );
};

export default BreadCrumb;
