import React from "react";
import { useEffect } from "react";
import SearchAndImportBar from "../../components/SearchAndImportBar/SearchAndImportBar";
import { DataGridComponent } from "../../components/DataGrid/DataGrid";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import SearchIcon from '@mui/icons-material/Search';



const Gerenciamento = () => {
  useEffect(() => {
    document.title = "HardwareTech | Gerenciamento";
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID H', width: 80 },
    { field: 'caixa', headerName: 'Caixa', width: 200 },
    { field: 'idParticao', headerName: 'Part. Number', width: 150 },
    { field: 'quantidade', headerName: 'Qtd', width: 80 },
    { field: 'anunciadoMercadoLivre', headerName: 'Anunciado ML', width: 150 },
    { field: 'idMercadoLivre', headerName: 'Cód. EAN ML', width: 150 },
    { field: 'verificado', headerName: 'Verificado', width: 150 },
    { field: 'descricao', headerName: 'Descrição', width: 150 },
    { 
      field: 'catalogo', 
      headerName: 'Catálogo', 
      width: 250, 
      renderCell: () => (
        <div className="catalogo-buttons">
          <IconButton aria-label="search" onClick={(e) => e.stopPropagation()}>
            <SearchIcon />
          </IconButton>
          <IconButton aria-label="edit" onClick={(e) => e.stopPropagation()}>
            <EditSquareIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={(e) => e.stopPropagation()}>
            <DeleteIcon />
          </IconButton>
        </div>
      ) 
    },
  ];

  const rows = [
    { id: 1, caixa: 'Caixa 1', idParticao: 'ACA654521AS', quantidade: 12, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '123456', verificado: 'Ok', descricao: 'Venda de notebook' },
    { id: 2, caixa: 'Caixa 2', idParticao: 'ACA654521AS', quantidade: 56, anunciadoMercadoLivre: 'Pendente', idMercadoLivre: '789012', verificado: 'Usado', descricao: 'Venda de smartphone' },
    { id: 3, caixa: 'Caixa 3', idParticao: 'ACA654521AS', quantidade: 2, anunciadoMercadoLivre: 'Cancelado', idMercadoLivre: '345678', verificado: 'Usado ou velho', descricao: 'Venda de monitor' },
    { id: 4, caixa: 'Caixa 4', idParticao: 'ACA654521AS', quantidade: 6, anunciadoMercadoLivre: 'Em andamento', idMercadoLivre: '901234', verificado: 'Ruim', descricao: 'Venda de teclado' },
    { id: 5, caixa: 'Caixa 5', idParticao: 'ACA654521AS', quantidade: 17, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '567890', verificado: 'Terminais tortos', descricao: '8-bit ALTA VELOCIDADE RAM ESTÁTICO' },
    { id: 5, caixa: 'Caixa 5', idParticao: 'ACA654521AS', quantidade: 17, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '567890', verificado: 'Terminais tortos', descricao: '8-bit ALTA VELOCIDADE RAM ESTÁTICO' },
    { id: 5, caixa: 'Caixa 5', idParticao: 'ACA654521AS', quantidade: 17, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '567890', verificado: 'Terminais tortos', descricao: '8-bit ALTA VELOCIDADE RAM ESTÁTICO' },
    { id: 5, caixa: 'Caixa 5', idParticao: 'ACA654521AS', quantidade: 17, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '567890', verificado: 'Terminais tortos', descricao: '8-bit ALTA VELOCIDADE RAM ESTÁTICO' },
    { id: 5, caixa: 'Caixa 5', idParticao: 'ACA654521AS', quantidade: 17, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '567890', verificado: 'Terminais tortos', descricao: '8-bit ALTA VELOCIDADE RAM ESTÁTICO' },
    { id: 5, caixa: 'Caixa 5', idParticao: 'ACA654521AS', quantidade: 17, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '567890', verificado: 'Terminais tortos', descricao: '8-bit ALTA VELOCIDADE RAM ESTÁTICO' },
    { id: 5, caixa: 'Caixa 5', idParticao: 'ACA654521AS', quantidade: 17, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '567890', verificado: 'Terminais tortos', descricao: '8-bit ALTA VELOCIDADE RAM ESTÁTICO' },
    { id: 5, caixa: 'Caixa 5', idParticao: 'ACA654521AS', quantidade: 17, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '567890', verificado: 'Terminais tortos', descricao: '8-bit ALTA VELOCIDADE RAM ESTÁTICO' },
    { id: 5, caixa: 'Caixa 5', idParticao: 'ACA654521AS', quantidade: 17, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '567890', verificado: 'Terminais tortos', descricao: '8-bit ALTA VELOCIDADE RAM ESTÁTICO' },
    { id: 5, caixa: 'Caixa 5', idParticao: 'ACA654521AS', quantidade: 17, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '567890', verificado: 'Terminais tortos', descricao: '8-bit ALTA VELOCIDADE RAM ESTÁTICO' },
    { id: 5, caixa: 'Caixa 5', idParticao: 'ACA654521AS', quantidade: 17, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '567890', verificado: 'Terminais tortos', descricao: '8-bit ALTA VELOCIDADE RAM ESTÁTICO' },
    { id: 5, caixa: 'Caixa 5', idParticao: 'ACA654521AS', quantidade: 17, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '567890', verificado: 'Terminais tortos', descricao: '8-bit ALTA VELOCIDADE RAM ESTÁTICO' },
    { id: 5, caixa: 'Caixa 5', idParticao: 'ACA654521AS', quantidade: 17, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '567890', verificado: 'Terminais tortos', descricao: '8-bit ALTA VELOCIDADE RAM ESTÁTICO' },
  ];
  
  // const rows = [
  //   { id: 1, cliente: 'João Silva', status: 'Concluído', categoria: 'Notebook', valor: 'R$ 4.500,00' },
  //   { id: 2, cliente: 'Maria Oliveira', status: 'Pendente', categoria: 'Smartphone', valor: 'R$ 2.300,00' },
  //   { id: 3, cliente: 'Carlos Pereira', status: 'Cancelado', categoria: 'Monitor', valor: 'R$ 1.200,00' },
  //   { id: 3, cliente: 'Carlos Pereira', status: 'Cancelado', categoria: 'Monitor', valor: 'R$ 1.200,00' },
  //   { id: 4, cliente: 'Ana Costa', status: 'Em andamento', categoria: 'Teclado', valor: 'R$ 250,00' },
  //   { id: 5, cliente: 'Lucas Martins', status: 'Concluído', categoria: 'Mouse', valor: 'R$ 150,00' },
  // ];

  return (
    <div>
      <SearchAndImportBar />
      <DataGridComponent rows={rows} columns={columns} pageSize={6} />
    </div>
  );
};

export default Gerenciamento;
