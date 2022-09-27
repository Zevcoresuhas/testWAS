import React, { useState, useEffect } from "react"; // Main react importer
import { useNavigate } from "react-router-dom";
import useStyles from "../../components/Style"; // Import the mantine custome styles from the compoents
import {
  Button,
  Paper,
  PasswordInput,
  TextInput,
  Group,
  Text,
  ActionIcon,
  HoverCard,
} from "@mantine/core";
import Logo from "../../assets/images/logo.png"; // Import logo image
import { useForm } from "@mantine/form"; // Mantine form import
import {
  handleLogin,
  handleRegister,
  handleUserCount,
} from "../../helpers/apis"; // Helper for import the axios request in open page
import { notificationHelper } from "../../helpers/notification";
import { InfoCircle, QuestionMark } from "tabler-icons-react";
import HelperFloat from "../../components/HelperFlaot";

// Main login page start here
function Login() {
  let navigate = useNavigate();
  // Mantine custome style use
  const { classes } = useStyles();

  // For only electron use only
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      if (mounted) {
        //   For get all the brand data list
        const response = await handleUserCount();

        setVariables({ ...variables, userCount: response.data.data });
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // Setting the variables data list here
  const [variables, setVariables] = useState({
    submitLoading: false,
    userCount: 0,
  });

  // For form validation
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (value.length < 1 ? "Email is required" : null),
      password: (value) => (value.length < 1 ? "Password is required" : null),
    },
  });

  //   Submit the login information
  const LoginUser = async (e) => {
    setVariables({ ...variables, submitLoading: true });
    const response = await handleLogin(e);

    if (response.status === 200) {
      var data = response.data.user;
      setTimeout(() => {
        localStorage.setItem("notification", "yes");
        localStorage.setItem("brandCheck", data.brandCheck);
        localStorage.setItem("brand", data.brand);
        localStorage.setItem("brands", data.brand);
        localStorage.setItem("groupCheck", data.groupCheck);
        localStorage.setItem("group", data.group);
        localStorage.setItem("groups", data.group);
        localStorage.setItem("subgroupCheck", data.subgroupCheck);
        localStorage.setItem("subgroup", data.subgroup);
        localStorage.setItem("subgroups", data.subgroup);
        localStorage.setItem("product", data.product);
        localStorage.setItem("products", data.product);
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

  return (
    <div>
      {/* For adding left side form style */}
      <Paper className={classes.loginForm} radius={0} p={30}>
        {/* Main logo in login form */}
        <div justify="center" align="center" style={{ marginBottom: 25 }}>
          <img src={Logo} alt="" style={{ height: "80px" }} />
        </div>

        <Text align="center" size="md" mb={20} weight={500}>
          Login
          <HoverCard shadow="md" openDelay={600}>
            <HoverCard.Target>
              <InfoCircle size={18} />
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Text size="sm">
                Login using your register email or phone and password that u
                enter in starting registration process
              </Text>
            </HoverCard.Dropdown>
          </HoverCard>
        </Text>

        {/* Form for login or signup user by phone no or email */}
        <form onSubmit={form.onSubmit((values) => LoginUser(values))}>
          <TextInput
            variant="filled"
            value={form.values.email}
            label="Email address or Phone No"
            placeholder="Enter Email or Phone No"
            size="md"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            variant="filled"
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
            value={form.values.password}
            {...form.getInputProps("password")}
          />
          <Button
            mt="xl"
            type="submit"
            fullWidth
            color="zevcore"
            loading={variables.submitLoading}
          >
            Login
          </Button>
        </form>

        {variables.userCount == 0 ? (
          <div justify="center">
            <Button
              variant="subtle"
              fullWidth
              mt="md"
              onClick={() => navigate("/register")}
            >
              Register new user
              <HoverCard shadow="md" openDelay={1000}>
                <HoverCard.Target>
                  <InfoCircle size={18} />
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text size="sm">
                    For register first time login create account with email and
                    phone number
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
            </Button>
          </div>
        ) : (
          <Button
            variant="subtle"
            fullWidth
            mt="md"
            onClick={() => navigate("/forgot_password")}
          >
            Forgot Password
            <HoverCard shadow="md" openDelay={1000}>
              <HoverCard.Target>
                <InfoCircle size={18} />
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <Text size="sm">
                  For reset password we send otp for register email address
                </Text>
              </HoverCard.Dropdown>
            </HoverCard>
          </Button>
        )}
      </Paper>
    </div>
  );
}

export default Login;
