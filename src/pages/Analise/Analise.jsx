import React from "react";
import { useEffect } from "react";
import { Typography } from "@mui/material";

const Analise = () => {
  useEffect(() => {
      document.title = "HardwareTech | Relatórios e Análise";
  }, []);
  return (
    <div>
      <Typography paragraph>
        Bem-vindo à página de Relatórios e Análise. Aqui você pode visualizar gráficos e relatórios detalhados sobre o desempenho do sistema.
      </Typography>
    </div>
  );
};

export default Analise;