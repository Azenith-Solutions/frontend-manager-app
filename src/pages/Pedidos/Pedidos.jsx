import React from "react";
import { useEffect } from "react";
import { Typography } from "@mui/material";

const Pedidos = () => {
  useEffect(() => {
      document.title = "HardwareTech | Pedidos";
  }, []);

  return (
    <div>
      <Typography paragraph>
        Bem-vindo à página de Pedidos. Aqui você pode visualizar e gerenciar os pedidos realizados no sistema.
      </Typography>
    </div>
  );
};

export default Pedidos;
