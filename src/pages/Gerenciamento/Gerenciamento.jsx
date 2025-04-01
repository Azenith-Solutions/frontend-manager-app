import React from "react";
import { useEffect } from "react";
import { Typography } from "@mui/material";
import SearchAndImportBar from "../../components/SearchAndImportBar/SearchAndImportBar";

const Gerenciamento = () => {
  useEffect(() => {
    document.title = "HardwareTech | Gerenciamento";
  }, []);


  return (
    <div>
      <SearchAndImportBar />

      <Typography paragraph>
        Bem-vindo à página de Gerenciamento. Aqui você pode gerenciar os recursos do sistema.
      </Typography>
    </div>
  );
};

export default Gerenciamento;
