import React, { useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import AlertIcon from "../../../assets/icons/icon-warning.svg";
import "./DeletionModal.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "400px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  textAlign: "center",
};

export default function DeletionModal() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = () => {
    console.log("Item excluído!");
    handleClose();
  };

  return (
    <div>
      <Button variant="contained" color="error" onClick={handleOpen}>
        Abrir Modal de Exclusão
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box className="modal-box">
          <img
            src={AlertIcon}
            alt="Ícone de alerta"
            className="modal-icon"
          />
          <Typography
            id="modal-description"
            className="modal-description"
            sx={{
              fontSize: { xs: "1rem", sm: "1.2rem" }, // Responsividade mantida no Material-UI
            }}
          >
            Essa ação é irreversível. Tem certeza de que deseja prosseguir com a exclusão?
          </Typography>
          <Box className="modal-buttons">
            <Button
              className="modal-button voltar"
              onClick={handleClose}
            >
              Voltar
            </Button>
            <Button
              className="modal-button excluir"
              onClick={handleDelete}
            >
              Excluir
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}