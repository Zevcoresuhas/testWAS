import { Grid, Text, Card, Radio, Button, FileInput } from "@mantine/core";
import React, { useState } from "react";
import BreadCrumb from "../../components/BreadCrumb";
import { useLocalStorage } from "@mantine/hooks";
import Invoice1 from "../../assets/images/invoice1.png";
import Invoice2 from "../../assets/images/invoice2.png";
import Invoice3 from "../../assets/images/invoice3.png";
import { imageModal } from "../../helpers/common";

function Invoice() {
  const [type, setType] = useLocalStorage({
    key: "printer-type",
    defaultValue: "1",
  });
  // Setting the variables data list here
  const [variables, setVariables] = useState({
    skeletonLoading: true,
    submitLoading: false,
    data: [],
    addDrawer: false,
    bulkDrawer: false,
    openEdit: false,
    deleteIndex: 0,
  });

  const selectType = () => {
    localStorage.setItem("printer-type", type);
  };

  const [zipData, setZipData] = useState(null);
  return (
    <div>
      <BreadCrumb Text="Invoice type" Title="Setting" titleLink="/manages" />
      <Card className="border">
        <Grid mt={15}>
          <Grid.Col span={4}>
            <Text>Invoice Type 1</Text>
            <img
              onClick={() =>
                imageModal({
                  data: Invoice1,
                  title: "Invoice Type 1",
                })
              }
              src={Invoice1}
              alt=""
              width="50%"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Text>Invoice Type 2</Text>
            <img
              onClick={() =>
                imageModal({
                  data: Invoice2,
                  title: "Invoice Type 2",
                })
              }
              src={Invoice2}
              alt=""
              width="50%"
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Text>Invoice Type 3</Text>
            <img
              onClick={() =>
                imageModal({
                  data: Invoice3,
                  title: "Invoice Type 3",
                })
              }
              src={Invoice3}
              alt=""
              width="50%"
            />
          </Grid.Col>
        </Grid>
        <Radio.Group
          value={type}
          onChange={setType}
          label="Select your invoice type for print "
          withAsterisk
        >
          <Radio value="1" label="Invoice Type 1" />
          <Radio value="2" label="Invoice Type 2" />
          <Radio value="3" label="Invoice Type 3" />
        </Radio.Group>
        <Button mt={15} onClick={() => selectType()}>
          Submit
        </Button>
      </Card>
    </div>
  );
}

export default Invoice;
