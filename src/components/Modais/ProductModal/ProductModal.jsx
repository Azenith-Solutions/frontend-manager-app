import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  DialogTitle,
  Typography,
  Grid,
  TextField
} from "@mui/material";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '55%',
  height: '60vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  overflowY: 'auto',
};

export default function ProductModal({ title, buttonText }) {
  const [open, setOpen] = useState(false);
  const [imagem, setImagem] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleImagemChange = (e) => {
    setImagem(URL.createObjectURL(e.target.files[0]));
  };

return (
    <div>
        <Button onClick={handleOpen}>Open modal</Button>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <DialogTitle
                    sx={{
                        textAlign: 'center',
                        fontSize: { xs: '1.8rem', md: '2.2rem' },
                        fontWeight: 'bold',
                        color: '#6b0f1a',
                        mb: 2,
                    }}
                >
                    {title}                
                </DialogTitle>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 4,
                    }}
                >
                    <Box sx={{ flex: 1, textAlign: 'center' }}>
                        <Typography
                            sx={{
                                fontSize: { xs: '1.2rem', md: '1.5rem' },
                                fontWeight: 'bold',
                                mb: 2,
                            }}
                        >
                            Foto do Produto
                        </Typography>
                        <Box
                            sx={{
                                width: { xs: 150, md: 200 },
                                height: { xs: 150, md: 200 },
                                border: '1px dashed gray',
                                margin: 'auto',
                                mb: 1,
                                backgroundImage: imagem ? `url(${imagem})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />
                        <Button
                            variant="outlined"
                            component="label"
                            sx={{
                                color: '#6b0f1a',
                                borderColor: '#6b0f1a',
                                '&:hover': {
                                    backgroundColor: '#fbeaec',
                                    borderColor: '#500c14',
                                },
                            }}
                        >
                            Selecionar arquivo
                            <input
                                hidden
                                accept="image/*"
                                type="file"
                                onChange={handleImagemChange}
                            />
                        </Button>
                    </Box>

                    <Box sx={{ flex: 2 }}>
                        <Box
                            sx={{
                                borderRadius: 2,
                                padding: 2,
                                mt: 2,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            <Grid
                                container
                                spacing={2}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}
                                >
                                    <TextField
                                        label="Nome do Produto"
                                        sx={{ flexGrow: 1, width: { xs: '100%', md: '33vh' } }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}
                                >
                                    <TextField
                                        label="Preço"
                                        sx={{ flexGrow: 1, width: { xs: '100%', md: '33vh' } }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}
                                >
                                    <TextField
                                        label="Categoria"
                                        sx={{ flexGrow: 1, width: { xs: '100%', md: '33vh' } }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}
                                >
                                    <TextField
                                        label="Unidades em estoque"
                                        sx={{ flexGrow: 1, width: { xs: '100%', md: '33vh' } }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            px: { xs: 3, md: 5 },
                            py: { xs: 1, md: 1.5 },
                            fontSize: { xs: '0.9rem', md: '1rem' },
                            minWidth: { xs: 150, md: 200 },
                            backgroundColor: '#6b0f1a',
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
