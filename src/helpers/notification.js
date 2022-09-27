import React from "react";
import { showNotification } from "@mantine/notifications";
import { AlertCircle, Check, X } from "tabler-icons-react";

export const notificationHelper = (data) => {
  if (data.color === "red") {
    showNotification({
      color: data.color,
      title: data.title,
      message: data.message,
      icon: <X />,
    });
  } else if (data.color === "green") {
    showNotification({
      color: data.color,
      title: data.title,
      message: data.message,
      icon: <Check />,
    });
  } else if (data.color === "yellow") {
    showNotification({
      color: data.color,
      title: data.title,
      message: data.message,
      onClick: () => {
        localStorage.setItem("depletion", "1");
      },
      icon: <AlertCircle />,
    });
  }
};

export default notificationHelper;
