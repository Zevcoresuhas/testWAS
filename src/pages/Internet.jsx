import {
  createStyles,
  Image,
  Container,
  Title,
  Text,
  Button,
  SimpleGrid,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import INTERNET from "../assets/images/no-internet.png";

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingBottom: 80,
  },

  title: {
    fontWeight: 900,
    fontSize: 34,
    marginBottom: theme.spacing.md,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan("sm")]: {
      fontSize: 32,
    },
  },

  control: {
    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },

  mobileImage: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  desktopImage: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
}));

function Internet() {
  let navigate = useNavigate();
  const { classes } = useStyles();

  return (
    <div className="error-boundary">
      <div
        style={{
          margin: "auto",
        }}
      >
        <img src={INTERNET} width={400}></img>
      </div>
      <div>
        <Title className={classes.title}>No-intent Connected ...</Title>
        <Text color="dimmed" size="lg">
          Please connect internet for the ensure of register
        </Text>
        <Button
          variant="outline"
          size="md"
          mt="xl"
          className={classes.control}
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Get back to login page
        </Button>
      </div>
    </div>
  );
}

export default Internet;
