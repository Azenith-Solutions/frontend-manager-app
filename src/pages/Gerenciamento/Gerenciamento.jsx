import React from "react";
import { useEffect } from "react";
import { Typography } from "@mui/material";

const Gerenciamento = () => {
  useEffect(() => {
      document.title = "HardwareTech | Gerenciamento";
  }, []);
  
  return (
    <div>
      <Typography paragraph>
        Bem-vindo à página de Gerenciamento. Aqui você pode gerenciar os recursos do sistema.
      </Typography>
    </div>
  );
};

export default Gerenciamento;
