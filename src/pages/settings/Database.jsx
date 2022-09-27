import { Grid, Text, Card, Radio, Button, FileInput } from "@mantine/core";
import React, { useState } from "react";
import BreadCrumb from "../../components/BreadCrumb";
import { useLocalStorage } from "@mantine/hooks";
import Invoice1 from "../../assets/images/invoice1.png";
import Invoice2 from "../../assets/images/invoice2.png";
import Invoice3 from "../../assets/images/invoice3.png";
import { imageModal } from "../../helpers/common";
import { handleBackupDataBase } from "../../helpers/apis";
import notificationHelper from "../../helpers/notification";

function Database() {
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

  const dataUpload = async (e) => {
    const req = {
      path: zipData.path,
    };
    const response = await handleBackupDataBase(req);

    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: response.data.message,
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
  const [zipData, setZipData] = useState(null);
  return (
    <div>
      <BreadCrumb Text="Data Base" Title="Setting" titleLink="/manages" />

      <Card className="border">
        <FileInput
          placeholder="Pick file"
          label="Upload the backup zip file here to restore the old data"
          value={zipData}
          onChange={setZipData}
        />
        <Button mt={15} onClick={() => dataUpload()}>
          Submit
        </Button>
      </Card>
    </div>
  );
}

export default Database;
