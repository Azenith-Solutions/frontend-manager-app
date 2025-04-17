import React from "react";
import { useEffect } from "react";
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
    { field: 'idParticao', headerName: 'Part. Number', width: 150 },
    { field: 'quantidade', headerName: 'Qtd', width: 80 },
    { field: 'anunciadoMercadoLivre', headerName: 'Anunciado ML', width: 150 },
    { field: 'idMercadoLivre', headerName: 'Cód. EAN ML', width: 150 },
    { field: 'verificado', headerName: 'Verificado', width: 150 },
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

 const rows = [
    { id: 1, caixa: 'Caixa 1', idParticao: 'ACA654521AS', quantidade: 12, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '123456', verificado: 'Ok', descricao: 'Venda de notebook' },
    { id: 2, caixa: 'Caixa 2', idParticao: 'ACA654521AS', quantidade: 56, anunciadoMercadoLivre: 'Pendente', idMercadoLivre: '789012', verificado: 'Usado', descricao: 'Venda de smartphone' },
    { id: 3, caixa: 'Caixa 3', idParticao: 'ACA654521AS', quantidade: 2, anunciadoMercadoLivre: 'Cancelado', idMercadoLivre: '345678', verificado: 'Usado ou velho', descricao: 'Venda de monitor' },
    { id: 4, caixa: 'Caixa 4', idParticao: 'ACA654521AS', quantidade: 6, anunciadoMercadoLivre: 'Em andamento', idMercadoLivre: '901234', verificado: 'Ruim', descricao: 'Venda de teclado' },
    { id: 5, caixa: 'Caixa 5', idParticao: 'ACA654521AS', quantidade: 17, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '567890', verificado: 'Terminais tortos', descricao: '8-bit ALTA VELOCIDADE RAM ESTÁTICO' },
    
    // Adicionando linhas até o id 100
    { id: 6, caixa: 'Caixa 6', idParticao: 'ACA654521AS', quantidade: 30, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '135792', verificado: 'Novo', descricao: 'Venda de impressora' },
    { id: 7, caixa: 'Caixa 7', idParticao: 'ACA654521AS', quantidade: 45, anunciadoMercadoLivre: 'Pendente', idMercadoLivre: '246801', verificado: 'Usado', descricao: 'Venda de tablet' },
    { id: 8, caixa: 'Caixa 8', idParticao: 'ACA654521AS', quantidade: 10, anunciadoMercadoLivre: 'Cancelado', idMercadoLivre: '357913', verificado: 'Novo', descricao: 'Venda de câmera' },
    { id: 9, caixa: 'Caixa 9', idParticao: 'ACA654521AS', quantidade: 21, anunciadoMercadoLivre: 'Em andamento', idMercadoLivre: '468024', verificado: 'Ok', descricao: 'Venda de monitor gamer' },
    { id: 10, caixa: 'Caixa 10', idParticao: 'ACA654521AS', quantidade: 15, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '579135', verificado: 'Novo', descricao: 'Venda de console de videogame' },
    { id: 11, caixa: 'Caixa 11', idParticao: 'ACA654521AS', quantidade: 8, anunciadoMercadoLivre: 'Pendente', idMercadoLivre: '680246', verificado: 'Usado', descricao: 'Venda de fones de ouvido' },
    { id: 12, caixa: 'Caixa 12', idParticao: 'ACA654521AS', quantidade: 12, anunciadoMercadoLivre: 'Cancelado', idMercadoLivre: '791357', verificado: 'Novo', descricao: 'Venda de mouse' },
    { id: 13, caixa: 'Caixa 13', idParticao: 'ACA654521AS', quantidade: 5, anunciadoMercadoLivre: 'Em andamento', idMercadoLivre: '802468', verificado: 'Ruim', descricao: 'Venda de teclado mecânico' },
    { id: 14, caixa: 'Caixa 14', idParticao: 'ACA654521AS', quantidade: 9, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '913579', verificado: 'Usado', descricao: 'Venda de disco rígido' },
    { id: 15, caixa: 'Caixa 15', idParticao: 'ACA654521AS', quantidade: 20, anunciadoMercadoLivre: 'Pendente', idMercadoLivre: '024680', verificado: 'Novo', descricao: 'Venda de SSD' },
    { id: 16, caixa: 'Caixa 16', idParticao: 'ACA654521AS', quantidade: 3, anunciadoMercadoLivre: 'Cancelado', idMercadoLivre: '135791', verificado: 'Usado', descricao: 'Venda de gabinete de PC' },
    { id: 17, caixa: 'Caixa 17', idParticao: 'ACA654521AS', quantidade: 7, anunciadoMercadoLivre: 'Em andamento', idMercadoLivre: '246802', verificado: 'Ok', descricao: 'Venda de placa mãe' },
    { id: 18, caixa: 'Caixa 18', idParticao: 'ACA654521AS', quantidade: 4, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '357913', verificado: 'Novo', descricao: 'Venda de fonte de alimentação' },
    { id: 19, caixa: 'Caixa 19', idParticao: 'ACA654521AS', quantidade: 1, anunciadoMercadoLivre: 'Pendente', idMercadoLivre: '468024', verificado: 'Ruim', descricao: 'Venda de cooler' },
    { id: 20, caixa: 'Caixa 20', idParticao: 'ACA654521AS', quantidade: 50, anunciadoMercadoLivre: 'Cancelado', idMercadoLivre: '579135', verificado: 'Usado', descricao: 'Venda de cabos HDMI' },
    { id: 21, caixa: 'Caixa 21', idParticao: 'ACA654521AS', quantidade: 13, anunciadoMercadoLivre: 'Em andamento', idMercadoLivre: '680246', verificado: 'Novo', descricao: 'Venda de adaptadores' },
    { id: 22, caixa: 'Caixa 22', idParticao: 'ACA654521AS', quantidade: 19, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '791357', verificado: 'Usado', descricao: 'Venda de impressora 3D' },
    { id: 23, caixa: 'Caixa 23', idParticao: 'ACA654521AS', quantidade: 34, anunciadoMercadoLivre: 'Pendente', idMercadoLivre: '802468', verificado: 'Novo', descricao: 'Venda de scanner' },
    { id: 24, caixa: 'Caixa 24', idParticao: 'ACA654521AS', quantidade: 28, anunciadoMercadoLivre: 'Cancelado', idMercadoLivre: '913579', verificado: 'Ruim', descricao: 'Venda de tablet gráfico' },
    { id: 25, caixa: 'Caixa 25', idParticao: 'ACA654521AS', quantidade: 15, anunciadoMercadoLivre: 'Em andamento', idMercadoLivre: '024680', verificado: 'Usado', descricao: 'Venda de microfone' },
    { id: 26, caixa: 'Caixa 26', idParticao: 'ACA654521AS', quantidade: 22, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '135791', verificado: 'Novo', descricao: 'Venda de webcam' },
    { id: 27, caixa: 'Caixa 27', idParticao: 'ACA654521AS', quantidade: 18, anunciadoMercadoLivre: 'Pendente', idMercadoLivre: '246802', verificado: 'Usado', descricao: 'Venda de projetor' },
    { id: 28, caixa: 'Caixa 28', idParticao: 'ACA654521AS', quantidade: 9, anunciadoMercadoLivre: 'Cancelado', idMercadoLivre: '357913', verificado: 'Novo', descricao: 'Venda de caixa de som' },
    { id: 29, caixa: 'Caixa 29', idParticao: 'ACA654521AS', quantidade: 11, anunciadoMercadoLivre: 'Em andamento', idMercadoLivre: '468024', verificado: 'Ruim', descricao: 'Venda de suporte para monitor' },
    { id: 30, caixa: 'Caixa 30', idParticao: 'ACA654521AS', quantidade: 14, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '579135', verificado: 'Usado', descricao: 'Venda de mesa digitalizadora' },
    { id: 31, caixa: 'Caixa 31', idParticao: 'ACA654521AS', quantidade: 5, anunciadoMercadoLivre: 'Pendente', idMercadoLivre: '680246', verificado: 'Novo', descricao: 'Venda de suporte para laptop' },
    { id: 32, caixa: 'Caixa 32', idParticao: 'ACA654521AS', quantidade: 7, anunciadoMercadoLivre: 'Cancelado', idMercadoLivre: '791357', verificado: 'Usado', descricao: 'Venda de capas para laptop' },
    { id: 33, caixa: 'Caixa 33', idParticao: 'ACA654521AS', quantidade: 3, anunciadoMercadoLivre: 'Em andamento', idMercadoLivre: '802468', verificado: 'Ruim', descricao: 'Venda de porta-copos' },
    { id: 34, caixa: 'Caixa 34', idParticao: 'ACA654521AS', quantidade: 20, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '913579', verificado: 'Novo', descricao: 'Venda de canetas' },
    { id: 35, caixa: 'Caixa 35', idParticao: 'ACA654521AS', quantidade: 8, anunciadoMercadoLivre: 'Pendente', idMercadoLivre: '024680', verificado: 'Usado', descricao: 'Venda de cadernos' },
    { id: 36, caixa: 'Caixa 36', idParticao: 'ACA654521AS', quantidade: 12, anunciadoMercadoLivre: 'Cancelado', idMercadoLivre: '135791', verificado: 'Novo', descricao: 'Venda de folhas A4' },
    { id: 37, caixa: 'Caixa 37', idParticao: 'ACA654521AS', quantidade: 9, anunciadoMercadoLivre: 'Em andamento', idMercadoLivre: '246802', verificado: 'Ruim', descricao: 'Venda de grampeadores' },
    { id: 38, caixa: 'Caixa 38', idParticao: 'ACA654521AS', quantidade: 15, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '357913', verificado: 'Usado', descricao: 'Venda de tesouras' },
    { id: 39, caixa: 'Caixa 39', idParticao: 'ACA654521AS', quantidade: 4, anunciadoMercadoLivre: 'Pendente', idMercadoLivre: '468024', verificado: 'Novo', descricao: 'Venda de colas' },
    { id: 40, caixa: 'Caixa 40', idParticao: 'ACA654521AS', quantidade: 10, anunciadoMercadoLivre: 'Cancelado', idMercadoLivre: '579135', verificado: 'Ruim', descricao: 'Venda de lápis' },
    { id: 41, caixa: 'Caixa 41', idParticao: 'ACA654521AS', quantidade: 6, anunciadoMercadoLivre: 'Em andamento', idMercadoLivre: '680246', verificado: 'Usado', descricao: 'Venda de borrachas' },
    { id: 42, caixa: 'Caixa 42', idParticao: 'ACA654521AS', quantidade: 11, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '791357', verificado: 'Novo', descricao: 'Venda de canetas coloridas' },
    { id: 43, caixa: 'Caixa 43', idParticao: 'ACA654521AS', quantidade: 8, anunciadoMercadoLivre: 'Pendente', idMercadoLivre: '802468', verificado: 'Usado', descricao: 'Venda de lápis de cor' },
    { id: 44, caixa: 'Caixa 44', idParticao: 'ACA654521AS', quantidade: 3, anunciadoMercadoLivre: 'Cancelado', idMercadoLivre: '913579', verificado: 'Novo', descricao: 'Venda de marcadores' },
    { id: 45, caixa: 'Caixa 45', idParticao: 'ACA654521AS', quantidade: 2, anunciadoMercadoLivre: 'Em andamento', idMercadoLivre: '024680', verificado: 'Ruim', descricao: 'Venda de pastas' },
    { id: 46, caixa: 'Caixa 46', idParticao: 'ACA654521AS', quantidade: 7, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '135791', verificado: 'Usado', descricao: 'Venda de fichários' },
    { id: 47, caixa: 'Caixa 47', idParticao: 'ACA654521AS', quantidade: 5, anunciadoMercadoLivre: 'Pendente', idMercadoLivre: '246802', verificado: 'Novo', descricao: 'Venda de organizadores' },
    { id: 48, caixa: 'Caixa 48', idParticao: 'ACA654521AS', quantidade: 9, anunciadoMercadoLivre: 'Cancelado', idMercadoLivre: '357913', verificado: 'Ruim', descricao: 'Venda de cadernetas' },
    { id: 49, caixa: 'Caixa 49', idParticao: 'ACA654521AS', quantidade: 13, anunciadoMercadoLivre: 'Em andamento', idMercadoLivre: '468024', verificado: 'Usado', descricao: 'Venda de papéis adesivos' },
    { id: 50, caixa: 'Caixa 50', idParticao: 'ACA654521AS', quantidade: 18, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '579135', verificado: 'Novo', descricao: 'Venda de post-its' },
    { id: 51, caixa: 'Caixa 51', idParticao: 'ACA654521AS', quantidade: 5, anunciadoMercadoLivre: 'Pendente', idMercadoLivre: '680246', verificado: 'Usado', descricao: 'Venda de blocos de notas' },
    { id: 52, caixa: 'Caixa 52', idParticao: 'ACA654521AS', quantidade: 6, anunciadoMercadoLivre: 'Cancelado', idMercadoLivre: '791357', verificado: 'Novo', descricao: 'Venda de canetas hidrográficas' },
    { id: 53, caixa: 'Caixa 53', idParticao: 'ACA654521AS', quantidade: 4, anunciadoMercadoLivre: 'Em andamento', idMercadoLivre: '802468', verificado: 'Ruim', descricao: 'Venda de canetas esferográficas' },
    { id: 54, caixa: 'Caixa 54', idParticao: 'ACA654521AS', quantidade: 10, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '913579', verificado: 'Usado', descricao: 'Venda de canetas gel' },
    { id: 55, caixa: 'Caixa 55', idParticao: 'ACA654521AS', quantidade: 15, anunciadoMercadoLivre: 'Pendente', idMercadoLivre: '024680', verificado: 'Novo', descricao: 'Venda de canetas permanentes' },
    { id: 56, caixa: 'Caixa 56', idParticao: 'ACA654521AS', quantidade: 12, anunciadoMercadoLivre: 'Cancelado', idMercadoLivre: '135791', verificado: 'Ruim', descricao: 'Venda de lápis mecânicos' },
    { id: 57, caixa: 'Caixa 57', idParticao: 'ACA654521AS', quantidade: 8, anunciadoMercadoLivre: 'Em andamento', idMercadoLivre: '246802', verificado: 'Usado', descricao: 'Venda de lápis de cera' },
    { id: 58, caixa: 'Caixa 58', idParticao: 'ACA654521AS', quantidade: 3, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '357913', verificado: 'Novo', descricao: 'Venda de tintas' },
    { id: 59, caixa: 'Caixa 59', idParticao: 'ACA654521AS', quantidade: 7, anunciadoMercadoLivre: 'Pendente', idMercadoLivre: '468024', verificado: 'Ruim', descricao: 'Venda de aquarelas' },
    { id: 60, caixa: 'Caixa 60', idParticao: 'ACA654521AS', quantidade: 5, anunciadoMercadoLivre: 'Cancelado', idMercadoLivre: '579135', verificado: 'Usado', descricao: 'Venda de pincéis' },
    { id: 61, caixa: 'Caixa 61', idParticao: 'ACA654521AS', quantidade: 2, anunciadoMercadoLivre: 'Em andamento', idMercadoLivre: '680246', verificado: 'Novo', descricao: 'Venda de telas' },
    { id: 62, caixa: 'Caixa 62', idParticao: 'ACA654521AS', quantidade: 11, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '791357', verificado: 'Usado', descricao: 'Venda de quadros' },
    { id: 63, caixa: 'Caixa 63', idParticao: 'ACA654521AS', quantidade: 9, anunciadoMercadoLivre: 'Pendente', idMercadoLivre: '802468', verificado: 'Ruim', descricao: 'Venda de molduras' },
    { id: 64, caixa: 'Caixa 64', idParticao: 'ACA654521AS', quantidade: 4, anunciadoMercadoLivre: 'Cancelado', idMercadoLivre: '913579', verificado: 'Novo', descricao: 'Venda de colas coloridas' },
    { id: 65, caixa: 'Caixa 65', idParticao: 'ACA654521AS', quantidade: 3, anunciadoMercadoLivre: 'Em andamento', idMercadoLivre: '024680', verificado: 'Usado', descricao: 'Venda de canudos' },
    { id: 66, caixa: 'Caixa 66', idParticao: 'ACA654521AS', quantidade: 8, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '135791', verificado: 'Novo', descricao: 'Venda de fitas adesivas' },
    { id: 67, caixa: 'Caixa 67', idParticao: 'ACA654521AS', quantidade: 6, anunciadoMercadoLivre: 'Pendente', idMercadoLivre: '246802', verificado: 'Ruim', descricao: 'Venda de grampos' },
    { id: 68, caixa: 'Caixa 68', idParticao: 'ACA654521AS', quantidade: 10, anunciadoMercadoLivre: 'Cancelado', idMercadoLivre: '357913', verificado: 'Usado', descricao: 'Venda de tesouras de picotar' },
    { id: 69, caixa: 'Caixa 69', idParticao: 'ACA654521AS', quantidade: 5, anunciadoMercadoLivre: 'Em andamento', idMercadoLivre: '468024', verificado: 'Novo', descricao: 'Venda de papel de presente' },
    { id: 70, caixa: 'Caixa 70', idParticao: 'ACA654521AS', quantidade: 12, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '579135', verificado: 'Ruim', descricao: 'Venda de cartolina' },
    { id: 71, caixa: 'Caixa 71', idParticao: 'ACA654521AS', quantidade: 14, anunciadoMercadoLivre: 'Pendente', idMercadoLivre: '680246', verificado: 'Usado', descricao: 'Venda de papéis de scrapbook' },
    { id: 72, caixa: 'Caixa 72', idParticao: 'ACA654521AS', quantidade: 3, anunciadoMercadoLivre: 'Cancelado', idMercadoLivre: '791357', verificado: 'Novo', descricao: 'Venda de papéis coloridos' },
    { id: 73, caixa: 'Caixa 73', idParticao: 'ACA654521AS', quantidade: 7, anunciadoMercadoLivre: 'Em andamento', idMercadoLivre: '802468', verificado: 'Ruim', descricao: 'Venda de papéis recicláveis' },
    { id: 74, caixa: 'Caixa 74', idParticao: 'ACA654521AS', quantidade: 11, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '913579', verificado: 'Usado', descricao: 'Venda de papéis para origami' },
    { id: 75, caixa: 'Caixa 75', idParticao: 'ACA654521AS', quantidade: 5, anunciadoMercadoLivre: 'Pendente', idMercadoLivre: '024680', verificado: 'Novo', descricao: 'Venda de papéis para pintura' },
    { id: 76, caixa: 'Caixa 76', idParticao: 'ACA654521AS', quantidade: 6, anunciadoMercadoLivre: 'Cancelado', idMercadoLivre: '135791', verificado: 'Ruim', descricao: 'Venda de papéis para colagem' },
    { id: 77, caixa: 'Caixa 77', idParticao: 'ACA654521AS', quantidade: 2, anunciadoMercadoLivre: 'Em andamento', idMercadoLivre: '246802', verificado: 'Usado', descricao: 'Venda de papéis para desenho' },
    { id: 78, caixa: 'Caixa 78', idParticao: 'ACA654521AS', quantidade: 9, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '357913', verificado: 'Novo', descricao: 'Venda de papéis para escrita' },
    { id: 79, caixa: 'Caixa 79', idParticao: 'ACA654521AS', quantidade: 3, anunciadoMercadoLivre: 'Pendente', idMercadoLivre: '468024', verificado: 'Ruim', descricao: 'Venda de papéis para impressão' },
    { id: 80, caixa: 'Caixa 80', idParticao: 'ACA654521AS', quantidade: 8, anunciadoMercadoLivre: 'Cancelado', idMercadoLivre: '579135', verificado: 'Usado', descricao: 'Venda de papéis para encadernação' },
    { id: 81, caixa: 'Caixa 81', idParticao: 'ACA654521AS', quantidade: 10, anunciadoMercadoLivre: 'Em andamento', idMercadoLivre: '680246', verificado: 'Novo', descricao: 'Venda de papéis para scrapbook' },
    { id: 82, caixa: 'Caixa 82', idParticao: 'ACA654521AS', quantidade: 11, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '791357', verificado: 'Usado', descricao: 'Venda de papéis de seda' },
    { id: 83, caixa: 'Caixa 83', idParticao: 'ACA654521AS', quantidade: 4, anunciadoMercadoLivre: 'Pendente', idMercadoLivre: '802468', verificado: 'Novo', descricao: 'Venda de papéis de papelão' },
    { id: 84, caixa: 'Caixa 84', idParticao: 'ACA654521AS', quantidade: 5, anunciadoMercadoLivre: 'Cancelado', idMercadoLivre: '913579', verificado: 'Ruim', descricao: 'Venda de papéis de alumínio' },
    { id: 85, caixa: 'Caixa 85', idParticao: 'ACA654521AS', quantidade: 3, anunciadoMercadoLivre: 'Em andamento', idMercadoLivre: '024680', verificado: 'Usado', descricao: 'Venda de papéis de plástico' },
    { id: 86, caixa: 'Caixa 86', idParticao: 'ACA654521AS', quantidade: 9, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '135791', verificado: 'Novo', descricao: 'Venda de papéis de papelão' },
    { id: 87, caixa: 'Caixa 87', idParticao: 'ACA654521AS', quantidade: 2, anunciadoMercadoLivre: 'Pendente', idMercadoLivre: '246802', verificado: 'Ruim', descricao: 'Venda de papéis de papelão' },
    { id: 88, caixa: 'Caixa 88', idParticao: 'ACA654521AS', quantidade: 4, anunciadoMercadoLivre: 'Cancelado', idMercadoLivre: '357913', verificado: 'Usado', descricao: 'Venda de papéis de papelão' },
    { id: 89, caixa: 'Caixa 89', idParticao: 'ACA654521AS', quantidade: 6, anunciadoMercadoLivre: 'Em andamento', idMercadoLivre: '468024', verificado: 'Novo', descricao: 'Venda de papéis de papelão' },
    { id: 90, caixa: 'Caixa 90', idParticao: 'ACA654521AS', quantidade: 8, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '579135', verificado: 'Ruim', descricao: 'Venda de papéis de papelão' },
    { id: 91, caixa: 'Caixa 91', idParticao: 'ACA654521AS', quantidade: 2, anunciadoMercadoLivre: 'Pendente', idMercadoLivre: '680246', verificado: 'Usado', descricao: 'Venda de papéis de papelão' },
    { id: 92, caixa: 'Caixa 92', idParticao: 'ACA654521AS', quantidade: 3, anunciadoMercadoLivre: 'Cancelado', idMercadoLivre: '791357', verificado: 'Novo', descricao: 'Venda de papéis de papelão' },
    { id: 93, caixa: 'Caixa 93', idParticao: 'ACA654521AS', quantidade: 5, anunciadoMercadoLivre: 'Em andamento', idMercadoLivre: '802468', verificado: 'Ruim', descricao: 'Venda de papéis de papelão' },
    { id: 94, caixa: 'Caixa 94', idParticao: 'ACA654521AS', quantidade: 7, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '913579', verificado: 'Usado', descricao: 'Venda de papéis de papelão' },
    { id: 95, caixa: 'Caixa 95', idParticao: 'ACA654521AS', quantidade: 1, anunciadoMercadoLivre: 'Pendente', idMercadoLivre: '024680', verificado: 'Novo', descricao: 'Venda de papéis de papelão' },
    { id: 96, caixa: 'Caixa 96', idParticao: 'ACA654521AS', quantidade: 4, anunciadoMercadoLivre: 'Cancelado', idMercadoLivre: '135791', verificado: 'Ruim', descricao: 'Venda de papéis de papelão' },
    { id: 97, caixa: 'Caixa 97', idParticao: 'ACA654521AS', quantidade: 6, anunciadoMercadoLivre: 'Em andamento', idMercadoLivre: '246802', verificado: 'Usado', descricao: 'Venda de papéis de papelão' },
    { id: 98, caixa: 'Caixa 98', idParticao: 'ACA654521AS', quantidade: 5, anunciadoMercadoLivre: 'Concluído', idMercadoLivre: '357913', verificado: 'Novo', descricao: 'Venda de papéis de papelão' },
    { id: 99, caixa: 'Caixa 99', idParticao: 'ACA654521AS', quantidade: 8, anunciadoMercadoLivre: 'Pendente', idMercadoLivre: '468024', verificado: 'Ruim', descricao: 'Venda de papéis de papelão' },
    { id: 100, caixa: 'Caixa 100', idParticao: 'ACA654521AS', quantidade: 9, anunciadoMercadoLivre: 'Cancelado', idMercadoLivre: '579135', verificado: 'Usado', descricao: 'Venda de papéis de papelão' }
];

  return (
    <div>
      <SearchAndImportBar addButtonTitle={"Adicionar Componente"} />
      <DataGridComponent rows={rows} columns={columns} pageSize={6} />
    </div>
  );
};

export default Gerenciamento;
