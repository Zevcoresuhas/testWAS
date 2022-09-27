import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // for import react dom navigation components
import {
  Group,
  Box,
  Collapse,
  ThemeIcon,
  Text,
  UnstyledButton,
} from "@mantine/core"; //for import mantine required functions and theme
import { CalendarStats, ChevronLeft, ChevronRight } from "tabler-icons-react";
import useStyles from "./Style"; // For import thte styles

export function LinksGroup({ icon: Icon, label, links, link }) {
  const { classes, theme } = useStyles();
  let navigate = useNavigate();
  const [active, setActive] = useState("Billing");
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(false);
  const ChevronIcon = theme.dir === "ltr" ? ChevronRight : ChevronLeft;
  // For navgation links drop downs
  const items = (hasLinks ? links : []).map((link) => (
    <Text
      className={[classes.link, { [classes.linkActive]: link.link === active }]}
      href={link.link}
      onClick={() => handlePage(link.link)}
      key={link.label}
    >
      {link.label}
    </Text>
  ));
  // For handel the navigation route
  const handlePage = (e) => {
    if (typeof e != "undefined") {
      navigate(e);
      setActive(e);
    }
  };
  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        className={classes.control}
      >
        <Group position="apart" spacing={0} onClick={() => handlePage(link)}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ThemeIcon variant="dark" color="zevcore" size={30}>
              <Icon size={18} />
            </ThemeIcon>
            <Box ml="md">{label} </Box>
          </Box>
          {hasLinks && (
            <ChevronIcon
              className={classes.chevron}
              size={14}
              style={{
                transform: opened
                  ? `rotate(${theme.dir === "rtl" ? -90 : 90}deg)`
                  : "none",
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}

const mockdata = {
  label: "Releases",
  icon: CalendarStats,
  links: [
    { label: "Upcoming releases", link: "/" },
    { label: "Previous releases", link: "/" },
    { label: "Releases schedule", link: "/" },
  ],
};

// Group navigation links
export function NavbarLinksGroup() {
  return (
    <Box
      sx={(theme) => ({
        minHeight: 220,
        padding: theme.spacing.md,
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
      })}
    >
      <LinksGroup {...mockdata} />
    </Box>
  );
}
