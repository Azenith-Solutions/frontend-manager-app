import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function OrderModal({ title, buttonText }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        Abrir Modal
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          {/* Título */}
          <DialogTitle
            sx={{
              textAlign: "center",
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: "#6b0f1a",
              mb: 1,
            }}
          >
            {title}
          </DialogTitle>

          {/* Formulário */}
          <Grid container spacing={4} sx={{ display: "flex", justifyContent: "space-around", padding: 2, alignItems: "center"}}>
            {/* Coluna da esquerda */}
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3, // Espaçamento entre os inputs
              }}
            >
              <Box>
                <Typography sx={{ mb: 1, fontWeight: "bold" }}>
                  Cliente
                </Typography>
                <TextField fullWidth sx={{ width: "45vh", maxWidth: '100%'  }} placeholder="Cliente" />
              </Box>

              <Box>
                <Typography sx={{ mb: 1, fontWeight: "bold" }}>
                  Status
                </Typography>
                <TextField fullWidth sx={{ width: "45vh", maxWidth: '100%'  }} placeholder="Status" />
              </Box>

              <Box>
                <Typography sx={{ mb: 1, fontWeight: "bold" }}>
                  Data
                </Typography>
                <TextField fullWidth sx={{ width: "45vh", maxWidth: '100%'  }} placeholder="xx/xx/xxxx" />
              </Box>

              <Box>
                <Typography sx={{ mb: 1, fontWeight: "bold" }}>
                  Valor
                </Typography>
                <TextField fullWidth sx={{ width: "45vh", maxWidth: '100%'  }} placeholder="R$XXXXX" />
              </Box>
            </Grid>

            {/* Coluna da direita */}
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3, // Espaçamento entre os inputs
              }}
            >
              <Box>
                <Typography sx={{ mb: 1, fontWeight: "bold" }}>
                  Pessoa responsável
                </Typography>
                <TextField fullWidth sx={{ width: "45vh", maxWidth: '100%'  }} placeholder="Nome do Produto" />
              </Box>

              <Box>
                <Typography sx={{ mb: 1, fontWeight: "bold" }}>
                  Categoria
                </Typography>
                <TextField fullWidth sx={{ width: "45vh", maxWidth: '100%'}} placeholder="Categoria" />
              </Box>

              <Box>
                <Typography sx={{ mb: 1, fontWeight: "bold" }}>
                  Descrição
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  sx={{ width: "45vh", maxWidth: '100%'  }}
                  placeholder="Descrição..."
                />
              </Box>
            </Grid>
          </Grid>

          {/* Botão */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#6b0f1a",
                color: "#fff",
                px: 5,
                py: 1.5,
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "#500c14",
                },
              }}
            >
              {buttonText}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}