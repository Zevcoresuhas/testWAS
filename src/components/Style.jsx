import { createStyles } from "@mantine/core"; // Import the mantine custome style creater for application
import BG from "../assets/images/bg.png";

const useStyles = createStyles((theme) => ({
  // For login page wallpaer style
  wrapper: {
    minHeight: "100%",
    backgroundSize: "cover",
    minWidth: "100%",
    position: "fixed",
    backgroundImage: `url(${BG})`,
  },
  //  For login page side form style
  loginForm: {
    position: "absolute",
    top: "20%",
    left: "35%",
  },
  loginForm2: {
    minHeight: 1000,
    borderRight: `1px solid ${
      theme.colorScheme === "dark"
        ? theme.colors.zevcore[7]
        : theme.colors.zevcore[3]
    }`,
    maxWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  // For sidebar styles list
  navbar: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
  },

  links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },
  "mantine-Drawer-drawer": {
    padding: 0,
  },

  link2: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.md,
    display: "flex",

    alignItems: "center",
    justifyContent: "center",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
    },
  },

  active2: {
    "&, &:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color:
        theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 7],
    },
  },

  linksInner: {
    paddingBottom: theme.spacing.lg,
  },

  footer: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  // For side bad navigation link hover on sidebar openable navbar
  control: {
    fontWeight: 500,
    display: "block",

    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontSize: theme.fontSizes.sm,
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.zevcore[5]
          : theme.colors.zevcore[2],
    },
  },

  link: {
    fontWeight: 500,
    display: "block",
    textDecoration: "none",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    paddingLeft: 31,
    marginLeft: 30,
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    borderLeft: `1px solid ${
      theme.colorScheme === "dark"
        ? theme.colors.zevcore[3]
        : theme.colors.zevcore[3]
    }`,
    cursor: "pointer",
  },

  linkActive: {
    borderLeft: `1px solid ${
      theme.colorScheme === "dark"
        ? theme.colors.zevcore[8]
        : theme.colors.zevcore[5]
    }`,
    "&, &:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.zevcore[5]
          : theme.colors.zevcore[2],
      color:
        theme.colorScheme === "dark"
          ? theme.colors.zevcore[1]
          : theme.colors.zevcore[9],
    },
  },

  chevron: {
    transition: "transform 200ms ease",
  },

  // For drawer header color settings
  drawer: {
    padding: 0,
    margin: 0,
  },
  header: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.zevcore[7]
        : theme.colors.zevcore[3],
    color: theme.colorScheme === "dark" ? "#ffffff" : "#000000",
    padding: 12,
  },
  closeButton: {
    color: theme.colorScheme === "dark" ? "#ffffff" : "#000000",
  },

  // Table striped show data
  striped: {
    width: "100%",
    "thead tr th button:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
    tbody: {
      border: "1px solid rgba(180, 180, 180,0.5)",
    },
    "thead tr th": {
      border: "1px solid rgba(180, 180, 180,0.5)",
    },
    "thead tr th button div": {
      fontSize: 12,
    },
    "tbody tr td": {
      border: "1px solid rgba(180, 180, 180,0.5)",
      fontWeight: 400,
      fontSize: 12,
    },
    "tbody tr:nth-of-type(odd)": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
  th: {
    padding: "0 !important",
  },
  controlTable: {
    width: "100%",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    "&:hover": {
      backgroundColor: theme.colors.orange[0],
    },
  },

  // Custome style start
  boxShadowBottom: {
    boxShadow: "0px 10px 10px -15px rgb(0 0 0 0.93)",
  },
  boxShadowRight: {
    boxShadow: "10px 0px 10px -15px rgb(0 0 0 0.93)",
  },
  boxShadow: {
    boxShadow: "0 4px 24px 0 rgb(34 41 47 / 10%)",
  },

  progress: {
    position: "absolute",
    bottom: -1,
    right: -1,
    left: -1,
    top: -1,
    height: "auto",
    backgroundColor: "transparent",
    zIndex: 0,
  },
  SettingBox2: {
    height: 130,
    width: 160,
    padding: 20,
    position: "relative",
    textAlign: "center",
    background:
      theme.colorScheme === "dark" ? theme.colors.zevcore[9] : "white",
    color: theme.colorScheme === "dark" ? "white" : "black",
    borderRadius: "8px",
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.zevcore[9] : " white"
    }`,
    boxShadow: `0 0px 2px 2px ${
      theme.colorScheme === "dark"
        ? "rgba(75, 79, 83, 0.007)"
        : "rgba(175, 183, 190, 0.007)"
    }`,
    transition: "all .4s",
    cursor: "pointer",
    "&:hover": {
      border: "1px solid #292929",
      color: "#292929",
      boxShadow: "-1px 3px 10px 0 rgb(0 0 0 / 6%)",
      "& svg": {
        opacity: 1,
      },
    },
  },

  BankBox: {
    height: 130,
    width: 160,
    padding: 20,
    position: "relative",
    textAlign: "center",
    background:
      theme.colorScheme === "dark" ? theme.colors.zevcore[9] : "white",
    color: theme.colorScheme === "dark" ? "white" : "black",
    borderRadius: "8px",
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.zevcore[9] : "#EEEEEE"
    }`,
    boxShadow: `0 0px 2px 2px ${
      theme.colorScheme === "dark"
        ? "rgba(75, 79, 83, 0.007)"
        : "rgba(175, 183, 190, 0.007)"
    }`,
    transition: "all .4s",
    cursor: "pointer",
    "&:hover": {
      border: "1px solid #292929",
      color: "#292929",
      boxShadow: "-1px 3px 10px 0 rgb(0 0 0 / 6%)",
      "& svg": {
        opacity: 1,
      },
    },
  },

  BankBoxActive: {
    height: 130,
    width: 160,
    padding: 20,
    position: "relative",
    textAlign: "center",
    background:
      theme.colorScheme === "dark" ? theme.colors.zevcore[9] : "white",
    color: theme.colorScheme === "dark" ? "white" : "black",
    borderRadius: "8px",
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.zevcore[9] : "#EEEEEE"
    }`,
    boxShadow: `0 0px 2px 2px ${
      theme.colorScheme === "dark"
        ? "rgba(75, 79, 83, 0.007)"
        : "rgba(175, 183, 190, 0.007)"
    }`,
    border: "1px solid #292929",
    color: "#292929",
    boxShadow: "-1px 3px 10px 0 rgb(0 0 0 / 6%)",
    "& svg": {
      opacity: 1,
    },
    transition: "all .4s",
    cursor: "pointer",
  },

  bankIcon2: {
    position: "absolute",
    bottom: "6px",
    right: "6px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "18px",
    width: "18px",
    borderRadius: "2px",
    opacity: 0,
    pointerEvents: "none",
    transition: "all .5s",
    "&:hover": {
      opacity: 1,
    },
  },

  editIcon2: {
    position: "absolute",
    top: "6px",
    left: "6px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "18px",
    width: "18px",
    borderRadius: "2px",
    opacity: 0,
    pointerEvents: "none",
    transition: "all .5s",
    "&:hover": {
      opacity: 1,
    },
  },
  Text1: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[3]
        : theme.colors.dark[6],
    fontSize: "20px",
  },
  selectItem: {
    // applies styles to selected item
    "&[data-selected]": {
      "&, &:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.zevcore[5]
            : theme.colors.zevcore[4],
        color:
          theme.colorScheme === "dark"
            ? theme.colors.zevcore[0]
            : theme.colors.zevcore[9],
      },
    },
    // applies styles to hovered item (with mouse or keyboard)
    "&[data-hovered]": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.zevcore[4]
          : theme.colors.zevcore[0],
      color:
        theme.colorScheme === "dark" ? theme.white : theme.colors.zevcore[9],
    },
  },
  imageSection: {
    padding: theme.spacing.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  section: {
    padding: theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
  cartHeader: {
    display: "flex",
    flexDirection: "row",
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: "space-between",
    marginTop: 0,

    backgroundColor: theme.colors.zevcore[4],
  },
  total: {
    display: "flex",
    flexDirection: "row",
    padding: 5,
    justifyContent: "space-between",
    marginTop: 3,
    backgroundColor: theme.colors.zevcore[4],
  },

  searchCode: {
    fontWeight: 700,
    fontSize: 10,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[2]
    }`,
  },

  // For the pdf export and excel export css
  pdfExcel: {
    backgroundColor: "rgba(0,0,0,0)",
    cursor: "pointer",
    borderStyle: "none",
  },
  // For top navigation custom css
  navButton: {
    paddingRight: 10,
    paddingLeft: 10,
    marginRight: 2,
    " &:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.zevcore[8]
          : theme.colors.zevcore[1],
      color:
        theme.colorScheme === "dark"
          ? theme.colors.zevcore[1]
          : theme.colors.zevcore[9],
    },
    transition: "all 0.5s ease",
    "& span": {
      margin: "auto",
      paddingRight: 5,
    },
  },

  navButtonActive: {
    paddingRight: 10,
    paddingLeft: 10,
    marginRight: 2,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.zevcore[8]
        : theme.colors.zevcore[1],
    color:
      theme.colorScheme === "dark"
        ? theme.colors.zevcore[0]
        : theme.colors.zevcore[9],
    " &:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.zevcore[8]
          : theme.colors.zevcore[1],
      color:
        theme.colorScheme === "dark"
          ? theme.colors.zevcore[0]
          : theme.colors.zevcore[9],
    },
    transition: "all 0.5s ease",
    "& span": {
      margin: "auto",
      paddingRight: 5,
    },
  },
}));

export default useStyles;
