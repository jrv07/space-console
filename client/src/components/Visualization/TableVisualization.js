import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

const TableVisualization = ({ data }) => {
  // Define columns based on keys of first row
  const columns = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    const firstRow = data[0];
    return Object.keys(firstRow).map((key) => ({
      header: key,
      accessorKey: key,
      cell: ({ getValue }) => {
        const value = getValue();
        return value !== null && value !== undefined ? value.toString() : '';
      },
    }));
  }, [data]);

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!data || data.length === 0) return null;

  return (
    <div className="table-scroll-body">
      <table className="data-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} title={cell.getValue()}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableVisualization;
