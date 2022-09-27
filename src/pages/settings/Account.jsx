import React, { useState, useEffect, useRef, useCallback } from "react";
import BreadCrumb from "../../components/BreadCrumb";
import axios from "axios";

// Mantine library
import { X, Check, CloudDownload } from "tabler-icons-react";
import { useForm } from "@mantine/form";
import { showNotification, updateNotification } from "@mantine/notifications";

import {
  Space,
  Card,
  Button,
  NumberInput,
  Group,
  createStyles,
  Text,
  TextInput,
  Skeleton,
  Input,
  Grid,
  Switch,
  useMantineTheme,
} from "@mantine/core"; //for import mantine required functions and theme

import "jspdf-autotable";

// For export images

// For bulk upload convert excel file to json

// for image crop
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Dropzone,
  DropzoneStatus,
  MIME_TYPES,
  IMAGE_MIME_TYPE,
} from "@mantine/dropzone";
import { IconCloudUpload, IconX, IconDownload } from "@tabler/icons";

import { handleGetAccount, handleAddAccount } from "../../helpers/apis";
import notificationHelper from "../../helpers/notification";

//for   made mantine theme style change and write custome theme here
const useStyles = createStyles((theme) => ({
  control: {
    position: "absolute",
    width: 250,
    left: "calc(50% - 125px)",
    bottom: -20,
  },
  label: {
    position: "relative",
    zIndex: 1,
  },
  wrapper: {
    position: "relative",
    marginBottom: 30,
  },
  dropzone: {
    borderWidth: 1,
    paddingBottom: 50,
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },
}));

function getActiveColor(status, theme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][6]
    : status.rejected
    ? theme.colors.red[6]
    : theme.colorScheme === "dark"
    ? theme.colors.dark[0]
    : theme.black;
}

function Account() {
  const [token, setToken] = useState(localStorage.getItem("token")); //get saved local storage data
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [URL, setURL] = useState(process.env.REACT_APP_BACKEND_URL);
  const [URLFILE, setURLFILE] = useState(process.env.REACT_APP_FILE);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [id, setId] = useState("");
  const [checked, setChecked] = useState(false);
  const [pincode, setPincode] = useState("");
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const [city, setCity] = useState("");

  const theme = useMantineTheme();
  const { classes } = useStyles();
  const openRef = useRef();
  const [image, setImage] = useState("");
  const [upImg, setUpImg] = useState("");
  const [cropConfig, setCropConfig] = useState({
    unit: "%",
    width: 100,
    aspect: undefined,
  });
  const [crop, setCrop] = useState({
    unit: "%",
    width: 100,
    aspect: undefined,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const ref = useRef();

  const form = useForm({
    initialValues: {
      name: "",
      company_name: "",
      pincode: "",
      phone_number: "",
      state: "",
      city: "",
      locality: "",
      street: "",
      door: "",
      cin: "",
      gstin: "",
      stock_prefix: "",
    },
    validate: {
      stock_prefix: (value) =>
        value.length > 10 ? " sale prefix cannot be more than 10 letter" : null,
    },
  });

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (mounted) {
        const response = await handleGetAccount();

        if (response.status === 200) {
          var datas = response.data.data;
          if (datas != null) {
            form.setFieldValue("name", datas.name);
            form.setFieldValue("company_name", datas.company_name);
            form.setFieldValue("phone_number", Number(datas.phone_number));
            form.setFieldValue("gstin", datas.gstin);
            form.setFieldValue("cin", datas.cin);
            form.setFieldValue("door", datas.door);
            form.setFieldValue("street", datas.street);
            form.setFieldValue("locality", datas.locality);
            form.setFieldValue("state", datas.state);
            if (datas.stock_prefix !== "") {
              setChecked(true);
              form.setFieldValue("stock_prefix", datas.stock_prefix);
            }

            if (datas.city !== null) {
              form.setFieldValue("city", datas.city);
            }
            form.setFieldValue("pincode", Number(datas.pincode));

            setPincode(Number(datas.pincode));
            setId(datas.id);
          }
          setSkeletonLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const handleAdd = async (e) => {
    // Set notification of saving and loader effects
    setSubmitLoading(true);
    var req = {
      image: image,
    };
    e = { ...e, ...req };
    // Main axios part for sending data to backend adding user data

    const response = await handleAddAccount(e);

    // Check for response for actions
    if (response.status === 200) {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Account data updated successfully",
      });

      setSubmitLoading(false);
    } else {
      notificationHelper({
        color: "green",
        title: "Success",
        message: "Account data updated successfully",
      });
      setSubmitLoading(false);
    }
  };

  //   for image croper
  const ref45 = useRef();
  const changeHandler = (e) => {
    if (e[0]) {
      const reader = new FileReader();

      reader.addEventListener("load", () => setUpImg(reader.result));
      reader.readAsDataURL(e[0]);
      ref.current.value = "";
    }
  };

  function getCroppedImage(sourceImage, cropConfig, fileName) {
    // creating the cropped image from the source image
    const canvas = document.createElement("canvas");
    const scaleX = sourceImage.naturalWidth / sourceImage.width;
    const scaleY = sourceImage.naturalHeight / sourceImage.height;
    canvas.width = cropConfig.width;
    canvas.height = cropConfig.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      sourceImage,
      cropConfig.x * scaleX,
      cropConfig.y * scaleY,
      cropConfig.width * scaleX,
      cropConfig.height * scaleY,
      0,
      0,
      cropConfig.width,
      cropConfig.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        // returning an error
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }

        blob.name = fileName;
        // creating a Object URL representing the Blob object given
        const croppedImageUrl = window.URL.createObjectURL(blob);

        resolve(croppedImageUrl);
      }, "image/jpeg");
    });
  }

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
    const base64Image = canvas({
      fillColor: "#fff",
    }).toDataURL("image/jpeg");
    setImage(base64Image);
  }, [completedCrop]);

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);
  const multipleImage = (event) => {
    setImage(event.target.files[0]);
  };
  return (
    <div>
      <Skeleton
        height="100%"
        width="100%"
        radius="md"
        visible={skeletonLoading}
      >
        <BreadCrumb Text="Account" Title="Settings" titleLink="/manages" />
      </Skeleton>
      <Space h="md" />
      {/* Main page start from here */}
      <Skeleton
        height="100%"
        width="100%"
        radius="md"
        sx={(theme) => ({
          boxShadow:
            "0 1px 3px rgb(0 0 0 / 5%), rgb(0 0 0 / 5%) 0px 10px 15px -5px, rgb(0 0 0 / 4%) 0px 7px 7px -5px",
        })}
        visible={skeletonLoading}
      >
        <Card shadow="sm" p="lg">
          <form onSubmit={form.onSubmit((values) => handleAdd(values))}>
            <Grid mb={15}>
              <Grid.Col md={4} lg={4} mt={1}>
                <TextInput
                  variant="filled"
                  mt={2}
                  required
                  value={form.values.company_name}
                  label="Company Name"
                  placeholder="Enter Company Name"
                  {...form.getInputProps("company_name")}
                />
              </Grid.Col>
              <Grid.Col md={4} lg={4} mt={1}>
                <NumberInput
                  variant="filled"
                  mt={2}
                  required
                  value={form.values.phone_number}
                  label="Phone Number"
                  placeholder="Enter Phone Number"
                  {...form.getInputProps("phone_number")}
                />
              </Grid.Col>
              <Grid.Col md={4} lg={4} mt={1}>
                <TextInput
                  variant="filled"
                  mt={1}
                  value={form.values.gstin}
                  label="GSTIN"
                  placeholder="GSTIN"
                  {...form.getInputProps("gstin")}
                />
              </Grid.Col>
              <Grid.Col md={4} lg={4} mt={1}>
                <TextInput
                  variant="filled"
                  mt={1}
                  value={form.values.cin}
                  label="CIN"
                  placeholder="CIN"
                  {...form.getInputProps("cin")}
                />
              </Grid.Col>
              <Grid.Col md={4} lg={4} mt={1}>
                <TextInput
                  variant="filled"
                  mt={1}
                  value={form.values.door}
                  label="Door No"
                  placeholder="Door No."
                  {...form.getInputProps("door")}
                />
              </Grid.Col>
              <Grid.Col md={4} lg={4} mt={1}>
                <TextInput
                  variant="filled"
                  mt={1}
                  value={form.values.street}
                  label="Street Name"
                  placeholder="Enter Street Name"
                  {...form.getInputProps("street")}
                />
              </Grid.Col>
              <Grid.Col md={4} lg={4} mt={1}>
                <TextInput
                  variant="filled"
                  mt={1}
                  value={form.values.locality}
                  label="Locality"
                  placeholder="Enter Locality"
                  {...form.getInputProps("locality")}
                />
              </Grid.Col>
              <Grid.Col md={4} lg={4} mt={1}>
                <NumberInput
                  variant="filled"
                  mt={1}
                  required
                  value={pincode}
                  label="Pincode"
                  placeholder="Enter Pincode"
                  {...form.getInputProps("pincode")}
                />
              </Grid.Col>
              <Grid.Col md={4} lg={4} mt={1}>
                <TextInput
                  variant="filled"
                  mt={1}
                  value={form.values.city}
                  label="City"
                  placeholder="Enter city"
                  {...form.getInputProps("city")}
                />
              </Grid.Col>
              <Grid.Col md={4} lg={4} mt={1}>
                <TextInput
                  variant="filled"
                  mt={1}
                  value={form.values.state}
                  label="State"
                  placeholder="Enter state"
                  {...form.getInputProps("state")}
                />
              </Grid.Col>

              <Grid.Col md={4} lg={4} mt={1}>
                <TextInput
                  variant="filled"
                  mt={1}
                  value={form.values.stock_prefix}
                  label="Sale Name Prefix"
                  placeholder="Sale Name Prefix"
                  {...form.getInputProps("stock_prefix")}
                />
              </Grid.Col>
            </Grid>

            {/* For croper */}
            {upImg !== "" && upImg !== null ? (
              <>
                <ReactCrop
                  ruleOfThirds={true}
                  style={{ marginTop: 5 }}
                  src={upImg}
                  onImageLoaded={onLoad}
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                />
                <div>
                  {previewCanvasRef != null ? (
                    <canvas
                      ref={previewCanvasRef}
                      // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                      style={{
                        width: Math.round(completedCrop?.width ?? 0),
                        height: Math.round(completedCrop?.height ?? 0),
                        marginBottom: 50,
                      }}
                    />
                  ) : null}

                  <Group position="right" mt="md" mb={20}>
                    <Button
                      type="submit"
                      color="zevcore"
                      onClick={() => {
                        setUpImg("");
                        setImage("");
                      }}
                    >
                      Clear Image
                    </Button>
                  </Group>
                </div>
              </>
            ) : (
              // For selecting cropping image dropdown
              <div
                style={{
                  marginTop: 15,
                  position: "relative",
                  marginBottom: 30,
                }}
              >
                <Dropzone
                  openRef={openRef}
                  onDrop={changeHandler}
                  style={{
                    borderWidth: 1,
                    paddingBottom: 50,
                  }}
                  radius="md"
                  accept={[
                    "image/png",
                    "image/jpeg",
                    "image/sgv+xml",
                    "image/gif",
                  ]}
                  maxSize={30 * 1024 ** 2}
                >
                  <div style={{ pointerEvents: "none" }}>
                    <Group position="center">
                      <Dropzone.Accept>
                        <IconDownload
                          size={50}
                          color={theme.colors[theme.primaryColor][6]}
                          stroke={1.5}
                        />
                      </Dropzone.Accept>
                      <Dropzone.Reject>
                        <IconX
                          size={50}
                          color={theme.colors.red[6]}
                          stroke={1.5}
                        />
                      </Dropzone.Reject>
                      <Dropzone.Idle>
                        <IconCloudUpload
                          size={50}
                          color={
                            theme.colorScheme === "dark"
                              ? theme.colors.dark[0]
                              : theme.black
                          }
                          stroke={1.5}
                        />
                      </Dropzone.Idle>
                    </Group>
                    <Text align="center" weight={700} size="lg" mt="xl">
                      <Dropzone.Accept>Drop files here</Dropzone.Accept>
                      <Dropzone.Reject>Pdf file less than 30mb</Dropzone.Reject>
                      <Dropzone.Idle>Upload Logo</Dropzone.Idle>
                    </Text>
                    <Text align="center" size="sm" mt="xs" color="dimmed">
                      Drag&apos;n&apos;drop files here to upload product image.
                      We can accept only <i>.png</i> & <i>.jpg</i> files that
                      are less than 10mb in size. This product image will used
                      for show in product list
                    </Text>
                  </div>
                </Dropzone>
                <Button
                  style={{
                    position: "absolute",
                    width: 250,
                    left: "calc(50% - 125px)",
                    bottom: -20,
                  }}
                  size="md"
                  color="zevcore"
                  radius="xl"
                  onClick={() => openRef.current?.()}
                >
                  Select files
                </Button>
              </div>
            )}

            <Group position="right" mt="md">
              <Button
                type="submit"
                variant="outline"
                color="gold"
                loading={submitLoading}
              >
                Submit
              </Button>
            </Group>
          </form>
        </Card>
      </Skeleton>
    </div>
  );
}

export default Account;
