import { DataGrid } from '@mui/x-data-grid';

export function DataGridComponent({ rows, columns, pageSize, onPageChange }) {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        onPageChange={onPageChange}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
      />
    </div>
  );
}