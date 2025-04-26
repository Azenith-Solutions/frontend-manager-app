import React from "react";
import { useEffect, useState } from "react";
import SearchAndImportBar from "../../components/SearchAndImportBar/SearchAndImportBar";
import { DataGridComponent } from "../../components/DataGrid/DataGrid";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import SearchIcon from '@mui/icons-material/Search';
import Toggle from "../../components/Buttons/Toggle/Toggle";


const Gerenciamento = () => {
  useEffect(() => {
    document.title = "HardwareTech | Gerenciamento";
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID H', width: 80 },
    { field: 'caixa', headerName: 'Caixa', width: 80 },
    { field: 'partNumber', headerName: 'Part. Number', width: 150 },
    { field: 'quantidade', headerName: 'Qtd', width: 80 },
    { field: 'flagML', headerName: 'Anunciado ML', width: 150 },
    { field: 'idMercadoLivre', headerName: 'Cód. EAN ML', width: 150 },
    { field: 'flagVerificado', headerName: 'Verificado', width: 150 },
    { field: 'condicao', headerName: 'Condição', width: 150 },
    { field: 'observacao', headerName: 'Verificado', width: 150 },
    { field: 'descricao', headerName: 'Descrição', width: 150 },
    {
      field: 'catalogo',
      headerName: 'Exibir',
      width: 250,
      renderCell: () => (
        <div className="toggle-button">
          <Toggle />
        </div>
      )
    },
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 250,
      renderCell: () => (
        <div className="catalogo-buttons">
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

  var [rows, setRows] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/components' , {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJiYWNrZW5kLWFwaS1yZXN0Iiwic3ViIjoia2F1YW4uZnJhbmNhQHNwdGVjaC5zY2hvb2wiLCJleHAiOjE3NDQ5MzI5MDF9.cp2k-3P5I1LI_u1RvG1FFRSl78AuwqAV_QWszdPrw9Q'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const formattedRows = data.map((item, index) => ({
          id: item.idHardWareTech,
          caixa: item.caixa,
          partNumber: item.partNumber,
          quantidade: item.quantidade,
          anunciadoMercadoLivre: item.flagML,
          idMercadoLivre: item.codigoML,
          flagVerificado: item.flagVerificado? 'Sim' : 'Não',
          condicao: item.condicao,
          observacao: item.verificado,
          descricao: item.descricao
        }));
        setRows(formattedRows);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <SearchAndImportBar addButtonTitle={"Adicionar Componente"} />
      <DataGridComponent rows={rows} columns={columns} pageSize={6} />
    </div>
  );
};

export default Gerenciamento;
