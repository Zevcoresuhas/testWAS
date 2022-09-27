import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stepper,
  Button,
  Group,
  Paper,
  Text,
  TextInput,
  NumberInput,
  PasswordInput,
  Grid,
  Checkbox,
  ScrollArea,
} from "@mantine/core";
import useStyles from "../../components/Style"; // Import the mantine custome styles from the compoents
import { useForm } from "@mantine/form"; // Mantine form import
import axios from "axios";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { authentication } from "./firebase-config";
import { Book, Briefcase, Key, Mail, PhoneCheck } from "tabler-icons-react";
import {
  handleMailOtp,
  handleAddAccount,
  handleRegister,
} from "../../helpers/apis";
import notificationHelper from "../../helpers/notification";
import { async } from "@firebase/util";
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
import { useLocalStorage } from "@mantine/hooks";
import Logo from "../../assets/images/logo.png";
import HelperFloat from "../../components/HelperFlaot";

function Register() {
  const [active, setActive] = useLocalStorage({
    key: "active",
    defaultValue: 0,
  });
  let navigate = useNavigate();

  // Setting the variables data list here
  const [variables, setVariables] = useState({
    submitLoading: false,
  });
  const [sendOtp, setSendOtp] = useState("");
  const [country, setCountry] = useState("");
  const [otpSetup, setOtpSetup] = useState(false);
  const [time, setTime] = useState(59);
  const [otpSend, setOtpSend] = useState(false);

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
    width: 90,
    aspect: undefined,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const ref = useRef();

  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const { classes } = useStyles();
  let isConnected = false;
  // For only electron use only
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        if (mounted) {
          const response = await axios.get(
            "https://api.ipdata.co/?api-key=7b1d5252071c09f49cef9605728cdc3ab32b8ffb44c08136f7eb8163"
          );
        }
      } catch (error) {
        navigate("/internet");
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // For form validation
  const form1 = useForm({
    initialValues: {
      added_by: "",
      email: "",
      otp: "",
      phone_number: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      phone_number: (value) =>
        value.length < 10 ? "Not a valid phone number" : null,
    },
  });

  const form4 = useForm({
    initialValues: {
      name: "",
      company_name: "",
      pincode: "",
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
      gstin: (value) =>
        value.length > 1
          ? /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[0-9A-Z]{1}[0-9A-Z]{1}$/.test(
              value
            )
            ? null
            : "Invalid GSTIN "
          : null,
    },
  });

  // For form validation
  const form2 = useForm({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // For form validation
  const form3 = useForm({
    initialValues: {
      key1: "",
      key2: "",
      key3: "",
      key4: "",
      key5: "",
      brand: "Brand",
      brands: "Brands",
      brandCheck: true,
      group: "Group",
      groups: "Groups",
      groupCheck: true,
      subgroup: "Subgroup",
      subgroups: "Subgroups",
      subgroupCheck: true,
      product: "Product",
      products: "Products",
      cash: 0,
      label: "",
      account_no: "",
      ifsc: "",
      name: "",
      branch: "",
      amount: 0,
    },
  });

  const PhoneOTP = async (e) => {
    try {
      const check = await axios.post(
        process.env.REACT_APP_URL + "api/client_email",
        e
      );

      if (check.status == 200) {
        var otpData = Math.floor(100000 + Math.random() * 900000);
        setSendOtp(otpData);
        setVariables({
          ...variables,

          submitLoading: true,
        });

        const req = {
          otp: otpData.toString(),
          email: e.email,
        };
        const response = await handleMailOtp(req);

        if (response.status === 200) {
          notificationHelper({
            color: "green",
            title: "Success",
            message: "OTP send to mail successfully",
          });
          setOtpSend(true);
          setVariables({ ...variables, submitLoading: false });
        }
      } else {
        notificationHelper({
          color: "red",
          title: "Failed!",
          message: check.data.data.message,
        });

        setVariables({ ...variables, submitLoading: false });
      }
    } catch (error) {
      notificationHelper({
        color: "red",
        title: "Failed!",
        message: error.response.data.data.message,
      });
    }
  };

  const checkOTP = () => {
    if (Number(form1.values.otp) == Number(sendOtp)) {
      form1.clearErrors();
      if (form2.values.password.length > 1) {
        form2.clearErrors();
        if (form2.values.password == form2.values.confirmPassword) {
          form2.clearErrors();
          setActive(1);
        } else {
          form2.setFieldError("confirmPassword", "Password does't match ");
        }
      } else {
        form2.setFieldError("password", "Password Required ");
      }
    } else {
      form1.setFieldError("otp", "Wrong OTP ");
    }
  };
  const Details = async (e) => {
    try {
      const request = {
        phone_number: form1.values.phone_number,
        email: form1.values.email,
        key:
          form3.values.key1 +
          "-" +
          form3.values.key2 +
          "-" +
          form3.values.key3 +
          "-" +
          form3.values.key4 +
          "-" +
          form3.values.key5,
      };
      const check = await axios.post(
        process.env.REACT_APP_URL + "api/key_check",
        request
      );

      if (check.status == 200) {
        setActive(3);
      } else {
        notificationHelper({
          color: "red",
          title: "Failed!",
          message: check.data.data.message,
        });
      }
    } catch (error) {
      notificationHelper({
        color: "red",
        title: "Failed!",
        message: error.response.data.data.message,
      });
    }
  };

  const submitRegister = async (e) => {
    console.log("hi");
    const req = {
      phone_number: form1.values.phone_number,
      email: form1.values.email,
      key:
        form3.values.key1 +
        "-" +
        form3.values.key2 +
        "-" +
        form3.values.key3 +
        "-" +
        form3.values.key4 +
        "-" +
        form3.values.key5,
      password: form2.values.password,
      amount: form3.values.cash,
      banklabel: form3.values.label,
      account_no: form3.values.account_no,
      ifsc: form3.values.ifsc,
      name: form3.values.name,
      branch: form3.values.branch,
      bankamount: form3.values.amount,
      // group: form3.values.group,
      // subgroup: form3.values.subgroup,
      // product: form3.values.product,
      // brands: form3.values.brands,
      // groups: form3.values.groups,
      // subgroups: form3.values.subgroups,
      // products: form3.values.products,
      // brandCheck: form3.values.brandCheck,
      // groupCheck: form3.values.groupCheck,
      // subgroupCheck: form3.values.subgroupCheck,
    };
    const response = await handleRegister(req);

    if (response.status === 200) {
      try {
        const req2 = {
          phone_number: form1.values.phone_number,
          email: form1.values.email,
          key:
            form3.values.key1 +
            "-" +
            form3.values.key2 +
            "-" +
            form3.values.key3 +
            "-" +
            form3.values.key4 +
            "-" +
            form3.values.key5,
          amount: form3.values.cash,
          brands: form3.values.brands,
          group: form3.values.group,
          groups: form3.values.groups,
          subgroup: form3.values.subgroup,
          subgroups: form3.values.subgroups,

          products: form3.values.products,
          product: form3.values.product,
          brandCheck: form3.values.brandCheck,
          groupCheck: form3.values.groupCheck,
          subgroupCheck: form3.values.subgroupCheck,
          type: "offline",
          activate: true,
          deviceId: response.data.data.dataValues.deviceId,
        };
        const check = await axios.patch(
          process.env.REACT_APP_URL + "api/client_update",
          req2
        );
        if (check.status == 200) {
          var data = response.data.dataValues;
          setTimeout(() => {
            localStorage.setItem("notification", "yes");

            localStorage.setItem("brand", form3.values.brand);
            localStorage.setItem("brands", form3.values.brands);
            if (form3.values.brandCheck == true) {
              localStorage.setItem("brandCheck", "1");
            } else {
              localStorage.setItem("brandCheck", "0");
            }
            if (form3.values.groupCheck == true) {
              localStorage.setItem("groupCheck", "1");
            } else {
              localStorage.setItem("groupCheck", "0");
            }
            if (form3.values.subgroupCheck == true) {
              localStorage.setItem("subgroupCheck", "1");
            } else {
              localStorage.setItem("subgroupCheck", "0");
            }

            localStorage.setItem("group", form3.values.group);
            localStorage.setItem("groups", form3.values.groups);

            localStorage.setItem("subgroup", form3.values.subgroup);
            localStorage.setItem("subgroups", form3.values.subgroups);
            localStorage.setItem("product", form3.values.product);
            localStorage.setItem("products", form3.values.products);
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("role", "Admin");
            localStorage.setItem("depletion", 0);
            navigate("/");
          }, 300);
          notificationHelper({
            color: "green",
            title: "Success",
            message: "You have logged in successfully",
          });
        } else {
          notificationHelper({
            color: "red",
            title: "Failed!",
            message: check.data.data.message,
          });
        }
      } catch (error) {
        notificationHelper({
          color: "red",
          title: "Failed!",
          message: error.response.data.data.message,
        });
      }

      setVariables({ ...variables, submitLoading: false });
    } else {
      notificationHelper({
        color: "red",
        title: "Failed!",
        message: response.data.message,
      });
      setVariables({ ...variables, submitLoading: false });
    }
  };

  const handleAdd = async (e) => {
    // Set notification of saving and loader effects
    setVariables({ ...variables, submitLoading: true });
    var req = {
      image: image,
      phone_number: form1.values.phone_number,
      password: form2.values.password,
      email: form1.values.email,
      added_by: form1.values.added_by,
    };
    e = { ...e, ...req };
    // Main axios part for sending data to backend adding user data

    const response = await handleAddAccount(e);

    if (response.status == 200) {
      setActive(2);
      setVariables({ ...variables, submitLoading: false });
      try {
        const check = await axios.post(
          process.env.REACT_APP_URL + "api/client",
          e
        );
        if (check.status == 200) {
          localStorage.setItem("active", 3);
        } else {
          notificationHelper({
            color: "red",
            title: "Failed!",
            message: check.data.data.message,
          });
        }
      } catch (error) {
        notificationHelper({
          color: "red",
          title: "Failed!",
          message: error.response.data.data.message,
        });
      }
    } else {
      notificationHelper({
        color: "red",
        title: "Failed! Please enter correct details",
        message: response.data.message,
      });
      setVariables({ ...variables, submitLoading: false });
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
    const base64Image = canvas.toDataURL("image/jpeg");
    setImage(base64Image);
  }, [completedCrop]);

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);
  const multipleImage = (event) => {
    setImage(event.target.files[0]);
  };
  return (
    <>
      <div>
        <div
          style={{
            textAlign: "right",
          }}
        >
          <Button
            variant="outline"
            color="zevcore"
            onClick={() => navigate("/login")}
          >
            Back to login
          </Button>
        </div>
        {/* For adding left side form style */}
        <div
          style={{
            paddingBottom: "4%",
          }}
        >
          <Paper
            className="no-drag"
            style={{
              margin: "auto",
              width: "90%",
            }}
            radius={0}
            p={30}
          >
            <div justify="center" align="center" style={{ marginBottom: 25 }}>
              <img src={Logo} alt="" style={{ height: "80px" }} />
            </div>
            <Text align="center" size="lg" mb="lg">
              Registration
            </Text>
            <Stepper active={active} onStepClick={setActive} breakpoint="sm">
              <Stepper.Step
                allowStepSelect={false}
                icon={<Mail size={18} />}
                description="Email Verify"
              >
                <form onSubmit={form1.onSubmit((values) => PhoneOTP(values))}>
                  <div style={{ width: "100%" }}>
                    <Grid>
                      <Grid.Col span={4}>
                        <TextInput
                          required
                          variant="filled"
                          label="Distributor ID"
                          value={form1.values.added_by}
                          placeholder="Enter Distributor ID"
                          size="md"
                          {...form1.getInputProps("added_by")}
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        {" "}
                        <TextInput
                          required
                          label="Enter Email"
                          variant="filled"
                          value={form1.values.email}
                          placeholder="Enter Email"
                          size="md"
                          {...form1.getInputProps("email")}
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <TextInput
                          required
                          variant="filled"
                          value={form1.values.phone_number}
                          label="Phone No"
                          placeholder="Enter Phone No"
                          size="md"
                          {...form1.getInputProps("phone_number")}
                        />
                      </Grid.Col>
                    </Grid>

                    {otpSend == true ? (
                      <>
                        <Grid>
                          <Grid.Col span={4}>
                            <NumberInput
                              mt={15}
                              required
                              variant="filled"
                              label="Enter OTP send to register email"
                              value={form1.values.otp}
                              placeholder="Enter OTP"
                              size="md"
                              {...form1.getInputProps("otp")}
                            />
                          </Grid.Col>
                          <Grid.Col span={4}>
                            <PasswordInput
                              mt={15}
                              required
                              label="Password"
                              variant="filled"
                              placeholder="Your password"
                              size="md"
                              value={form2.values.password}
                              {...form2.getInputProps("password")}
                            />
                          </Grid.Col>
                          <Grid.Col span={4}>
                            <PasswordInput
                              mt={15}
                              required
                              variant="filled"
                              value={form2.values.confirmPassword}
                              label="Confirm Password"
                              size="md"
                              placeholder=" Confirm Password"
                              {...form2.getInputProps("confirmPassword")}
                            />
                          </Grid.Col>
                        </Grid>

                        <Button
                          mt="xl"
                          type="button"
                          onClick={() => checkOTP()}
                          fullWidth
                          color="zevcore"
                          loading={variables.submitLoading}
                        >
                          Submit
                        </Button>
                      </>
                    ) : null}
                  </div>

                  {otpSend == false ? (
                    <>
                      <Button
                        mt="xl"
                        disabled={otpSetup}
                        type="submit"
                        fullWidth
                        color="zevcore"
                        loading={variables.submitLoading}
                      >
                        Request OTP
                      </Button>
                      <Text color="red" size="xs">
                        * This data cannot be modified or change
                      </Text>
                    </>
                  ) : (
                    <></>
                  )}
                </form>
              </Stepper.Step>

              <Stepper.Step
                allowStepSelect={false}
                icon={<Briefcase size={18} />}
                description="Account Detail"
              >
                <form onSubmit={form4.onSubmit((values) => handleAdd(values))}>
                  <Grid mb={15}>
                    <Grid.Col span={3}>
                      <TextInput
                        variant="filled"
                        mt={2}
                        required
                        value={form4.values.company_name}
                        label="Company Name"
                        placeholder="Enter Company Name"
                        {...form4.getInputProps("company_name")}
                      />
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <TextInput
                        variant="filled"
                        mt={1}
                        value={form4.values.gstin}
                        label="GSTIN"
                        placeholder="GSTIN"
                        {...form4.getInputProps("gstin")}
                      />
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <TextInput
                        variant="filled"
                        mt={1}
                        value={form4.values.cin}
                        label="CIN"
                        placeholder="CIN"
                        {...form4.getInputProps("cin")}
                      />
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <TextInput
                        variant="filled"
                        mt={1}
                        value={form4.values.door}
                        label="Door No"
                        placeholder="Door No."
                        {...form4.getInputProps("door")}
                      />
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <TextInput
                        variant="filled"
                        mt={1}
                        value={form4.values.street}
                        label="Street Name"
                        placeholder="Enter Street Name"
                        {...form4.getInputProps("street")}
                      />
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <TextInput
                        variant="filled"
                        mt={1}
                        value={form4.values.locality}
                        label="Locality"
                        placeholder="Enter Locality"
                        {...form4.getInputProps("locality")}
                      />
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <NumberInput
                        variant="filled"
                        mt={1}
                        required
                        value={form4.values.pincode}
                        label="Pincode"
                        placeholder="Enter Pincode"
                        {...form4.getInputProps("pincode")}
                      />
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <TextInput
                        variant="filled"
                        mt={1}
                        value={form4.values.city}
                        label="City"
                        placeholder="Enter city"
                        {...form4.getInputProps("city")}
                      />
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <TextInput
                        variant="filled"
                        mt={1}
                        value={form4.values.state}
                        label="State"
                        placeholder="Enter state"
                        {...form4.getInputProps("state")}
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
                                color="zevcore"
                                stroke={1.5}
                              />
                            </Dropzone.Accept>
                            <Dropzone.Reject>
                              <IconX size={50} color="zevcore" stroke={1.5} />
                            </Dropzone.Reject>
                            <Dropzone.Idle>
                              <IconCloudUpload
                                size={50}
                                color="zevcore"
                                stroke={1.5}
                              />
                            </Dropzone.Idle>
                          </Group>
                          <Text align="center" weight={700} size="lg" mt="xl">
                            <Dropzone.Accept>Drop files here</Dropzone.Accept>
                            <Dropzone.Reject>
                              Pdf file less than 30mb
                            </Dropzone.Reject>
                            <Dropzone.Idle>Upload Logo</Dropzone.Idle>
                          </Text>
                          <Text align="center" size="sm" mt="xs" color="dimmed">
                            Drag&apos;n&apos;drop files here to upload product
                            image. We can accept only <i>.png</i> & <i>.jpg</i>{" "}
                            files that are less than 10mb in size. This product
                            image will used for show in product list
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

                  <Button
                    mt="xl"
                    mb="xl"
                    type="submit"
                    fullWidth
                    color="zevcore"
                    loading={variables.submitLoading}
                  >
                    Submit
                  </Button>
                </form>
              </Stepper.Step>
              <Stepper.Step
                allowStepSelect={true}
                icon={<Key size={18} />}
                description="Get full access"
              >
                <form onSubmit={form3.onSubmit((values) => Details(values))}>
                  <Text>Enter your 20 digits key</Text>
                  <Group style={{ width: "100%" }}>
                    <TextInput
                      variant="filled"
                      value={form3.values.key1}
                      size="md"
                      sx={{ width: "17%" }}
                      {...form3.getInputProps("key1")}
                      min={4}
                      maxLength={4}
                    />
                    <Text>-</Text>

                    <TextInput
                      variant="filled"
                      value={form3.values.key2}
                      size="md"
                      sx={{ width: "17%" }}
                      {...form3.getInputProps("key2")}
                      min={4}
                      maxLength={4}
                    />
                    <Text>-</Text>
                    <TextInput
                      variant="filled"
                      value={form3.values.key3}
                      size="md"
                      sx={{ width: "17%" }}
                      {...form3.getInputProps("key3")}
                      min={4}
                      maxLength={4}
                    />
                    <Text>-</Text>
                    <TextInput
                      variant="filled"
                      value={form3.values.key4}
                      size="md"
                      sx={{ width: "17%" }}
                      {...form3.getInputProps("key4")}
                      min={4}
                      maxLength={4}
                    />
                    <Text>-</Text>
                    <TextInput
                      variant="filled"
                      sx={{ width: "17%" }}
                      value={form3.values.key5}
                      size="md"
                      {...form3.getInputProps("key5")}
                      min={4}
                      maxLength={4}
                    />
                  </Group>

                  <Button
                    mt="xl"
                    type="submit"
                    fullWidth
                    color="zevcore"
                    loading={variables.submitLoading}
                  >
                    Submit
                  </Button>
                </form>
              </Stepper.Step>

              <Stepper.Step
                allowStepSelect={false}
                icon={<Book size={18} />}
                description="Terminologies"
              >
                <form
                  onSubmit={form3.onSubmit((values) => submitRegister(values))}
                >
                  <Text>Cash Leadger and Banking details</Text>
                  <div
                    style={{
                      margin: "auto",
                      width: "100%",
                      marginTop: 15,
                    }}
                  >
                    <Grid>
                      <Grid.Col span={3}>
                        <TextInput
                          variant="filled"
                          value={form3.values.label}
                          label="Bank Name"
                          placeholder="Bank Name"
                          {...form3.getInputProps("label")}
                        />
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <TextInput
                          variant="filled"
                          value={form3.values.branch}
                          label="Bank Branch Name"
                          placeholder="Bank Branch Name"
                          {...form3.getInputProps("branch")}
                        />
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <TextInput
                          variant="filled"
                          value={form3.values.account_no}
                          label="Account Number"
                          placeholder="Account Number"
                          {...form3.getInputProps("account_no")}
                        />
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <TextInput
                          variant="filled"
                          value={form3.values.ifsc}
                          label="IFSC Code"
                          placeholder="IFSC Code"
                          {...form3.getInputProps("ifsc")}
                        />
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <TextInput
                          variant="filled"
                          value={form3.values.name}
                          label="Recipient Name"
                          placeholder="Recipient Name"
                          {...form3.getInputProps("name")}
                        />
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <NumberInput
                          variant="filled"
                          value={form3.values.amount}
                          label="Starting Amount"
                          placeholder="Starting Amount"
                          {...form3.getInputProps("amount")}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <Text size="xs" mt={18} color="red">
                          Note: Adding bank details for payment options and show
                          this bank details in invoice. You can add bank details
                          in settings if you skip know
                        </Text>
                      </Grid.Col>

                      <Grid.Col span={3}>
                        <NumberInput
                          label="Cash Leadger Starting amount"
                          variant="filled"
                          value={form3.values.cash}
                          placeholder="Enter Cash Leadger Starting amount"
                          {...form3.getInputProps("cash")}
                        />
                      </Grid.Col>
                    </Grid>
                  </div>

                  <Button
                    mt="xl"
                    type="submit"
                    color="zevcore"
                    loading={variables.submitLoading}
                  >
                    Submit
                  </Button>
                </form>
              </Stepper.Step>
            </Stepper>
          </Paper>
        </div>
        <div id="recaptcha-container"></div>
      </div>
    </>
  );
}

export default Register;
