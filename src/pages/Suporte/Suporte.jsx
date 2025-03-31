import React from "react";
import { useEffect } from "react";
import { Typography } from "@mui/material";

const Suporte = () => {
  useEffect(() => {
      document.title = "HardwareTech | Suporte";
  }, []);

  return (
    <div>
      <Typography paragraph>
        Bem-vindo à página de Suporte. Aqui você pode solicitar suporte
      </Typography>
    </div>
  );
};

export default Suporte;
