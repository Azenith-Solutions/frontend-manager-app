import React from "react";
import { useEffect } from "react";
import SearchAndImportBar from "../../components/SearchAndImportBar/SearchAndImportBar";
import { DataGridComponent } from "../../components/DataGrid/DataGrid";
import LupaIcon from '../../assets/icons/lupa.svg';
import FavoriteIcon from '../../assets/icons/favorite-icon.svg';
import EditarIcon from '../../assets/icons/editar.svg';
import LixeiraIcon from '../../assets/icons/lixeira.svg';
import GreenBackgroundButton from "../../components/Buttons/GreenBackground/GreenBackgroundButton";


const Gerenciamento = () => {
  useEffect(() => {
    document.title = "HardwareTech | Gerenciamento";
  }, []);

  const columns = [
    { field: 'id', headerName: 'Pedido', width: 100 },
    { field: 'cliente', headerName: 'Cliente', width: 200 },
    { field: 'status', headerName: 'Status', width: 150 },
    { field: 'categoria', headerName: 'Categoria', width: 200 },
    { field: 'valor', headerName: 'Valor', width: 150 },
    { 
      field: 'acoes', 
      headerName: 'Ações', 
      width: 250, 
      renderCell: () => (
        <div style={{ display: 'flex', gap: '10px', width: '40%' }}>
          <GreenBackgroundButton iconPath={LupaIcon} />
          <GreenBackgroundButton iconPath={EditarIcon} />
          <GreenBackgroundButton iconPath={LixeiraIcon} />
        </div>
      ) 
    },
  ];

  const rows = [
    { id: 1, cliente: 'João Silva', status: 'Concluído', categoria: 'Notebook', valor: 'R$ 4.500,00' },
    { id: 2, cliente: 'Maria Oliveira', status: 'Pendente', categoria: 'Smartphone', valor: 'R$ 2.300,00' },
    { id: 3, cliente: 'Carlos Pereira', status: 'Cancelado', categoria: 'Monitor', valor: 'R$ 1.200,00' },
    { id: 4, cliente: 'Ana Costa', status: 'Em andamento', categoria: 'Teclado', valor: 'R$ 250,00' },
    { id: 5, cliente: 'Lucas Martins', status: 'Concluído', categoria: 'Mouse', valor: 'R$ 150,00' },
  ];

  return (
    <div>
      <SearchAndImportBar />
      <DataGridComponent rows={rows} columns={columns} pageSize={6} />
    </div>
  );
};

export default Gerenciamento;
