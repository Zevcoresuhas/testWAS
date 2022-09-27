import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Paper,
  Text,
  TextInput,
  NumberInput,
  PasswordInput,
  Grid,
} from "@mantine/core";
import useStyles from "../../components/Style"; // Import the mantine custome styles from the compoents
import { useForm } from "@mantine/form"; // Mantine form import
import "react-phone-number-input/style.css";

import { Check, X } from "tabler-icons-react";
import {
  handleEditUser,
  handleMailOtp,
  handleOneUser,
} from "../../helpers/apis";
import notificationHelper from "../../helpers/notification";
// for image crop
import "react-image-crop/dist/ReactCrop.css";
import Logo from "../../assets/images/logo.png";
import { showNotification, updateNotification } from "@mantine/notifications";

function ForgotPassword() {
  const [active, setActive] = useState(0);
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

  const { classes } = useStyles();

  // For form validation
  const form1 = useForm({
    initialValues: {
      name: "",
      email: "",
      value: 1,
      phone_number: 0,
      password: "",
      confirmPassword: "",
    },
  });
  // For only electron use only
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        if (mounted) {
          const response = await handleOneUser();
          if (response.status == 200) {
            var datas = response.data.data;
            form1.setFieldValue("name", datas.label);
            form1.setFieldValue("email", datas.email);
            form1.setFieldValue("phone_number", Number(datas.phone_number));
          }
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

  // For form validation

  const PhoneOTP = async (e) => {
    try {
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
    } catch (error) {
      notificationHelper({
        color: "red",
        title: "Failed!",
        message: error.response.data.data.message,
      });
    }
  };

  const checkOTP = async () => {
    if (Number(form1.values.otp) == Number(sendOtp)) {
      form1.clearErrors();
      if (form1.values.password.length > 1) {
        form1.clearErrors();
        if (form1.values.password == form1.values.confirmPassword) {
          showNotification({
            loading: true,
            id: "load-data",
            title: `Saving...`,
            message: "Waiting for response",
            autoclose: 5000,
            style: { borderRadius: 10 },
          });
          form1.clearErrors();
          const req = {
            name: form1.values.name,
            email: form1.values.email,
            value: 1,
            phone_number: form1.values.phone_number,
            password: form1.values.password,
          };

          const response = await handleEditUser(req);

          if (response.status == 200) {
            updateNotification({
              id: "load-data",
              color: "teal",
              title: "Data Save",
              message: "Password Updated Successfully",
              icon: <Check />,
            });
            navigate("/login");
          } else {
            updateNotification({
              id: "load-data",
              color: "red",
              title: "Data Save Error",
              message: "Some error accur",
              icon: <X />,
            });
          }
        } else {
          form1.setFieldError("confirmPassword", "Password does't match ");
        }
      } else {
        form1.setFieldError("password", "Password Required ");
      }
    } else {
      form1.setFieldError("otp", "Wrong OTP ");
    }
  };

  //   for image croper

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

  return (
    <>
      <div>
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
              Forgot Password
            </Text>

            <form onSubmit={form1.onSubmit((values) => PhoneOTP(values))}>
              <div style={{ width: "100%" }}>
                <TextInput
                  readOnly
                  label="Your register email"
                  variant="filled"
                  value={form1.values.email}
                  placeholder="Enter Email"
                  size="md"
                  {...form1.getInputProps("email")}
                />

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
                          value={form1.values.password}
                          {...form1.getInputProps("password")}
                        />
                      </Grid.Col>
                      <Grid.Col span={4}>
                        <PasswordInput
                          mt={15}
                          required
                          variant="filled"
                          value={form1.values.confirmPassword}
                          label="Confirm Password"
                          size="md"
                          placeholder=" Confirm Password"
                          {...form1.getInputProps("confirmPassword")}
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
                </>
              ) : (
                <></>
              )}
            </form>
          </Paper>
        </div>
        <div id="recaptcha-container"></div>
      </div>
    </>
  );
}

export default ForgotPassword;
