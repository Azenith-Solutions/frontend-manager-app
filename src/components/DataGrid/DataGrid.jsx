import { DataGrid } from '@mui/x-data-grid';
import './DataGrid.css';

export function DataGridComponent({ rows, columns, pageSize, onPageChange }) {
  return (
    <div className="data-grid-container">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        onPageChange={onPageChange}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
        disableColumnMenu={true}
      />
    </div>
  );
}