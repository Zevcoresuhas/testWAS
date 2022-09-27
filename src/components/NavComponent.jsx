import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

function NavComponent({ data, id }) {
  let navigate = useNavigate();

  navigate(data + id);
}
export default NavComponent;
