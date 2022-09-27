// for import the dependecies data
import { HoverCard, Text } from "@mantine/core";
import React from "react";
import Helper from "../assets/images/helper.gif";

const HelperFloat = (props) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 50,
        right: 60,
        cursor: "pointer",
      }}
    >
      <HoverCard shadow="md" width={500} openDelay={800}>
        <HoverCard.Target>
          <div>
            <img class="loader" width={50} src={Helper} />;
          </div>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Text size="xs">{props.Text}</Text>
        </HoverCard.Dropdown>
      </HoverCard>
    </div>
  );
};

export default HelperFloat;
