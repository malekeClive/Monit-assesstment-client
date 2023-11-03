import React from "react";
import { useRowSelect, useTable } from "react-table";

export default function Table({
  columns,
  data,
  onRowClick = null,
  scrollId = "",
}) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useRowSelect
    );

  return (
    <table
      {...getTableProps()}
      className="relative w-full rounded shadow-lg mt-4"
    >
      <thead className="py-2">
        {headerGroups.map((headerGroup) => (
          <tr
            {...headerGroup.getHeaderGroupProps()}
            className="flex flex-row bg-primary text-white py-2 rounded-tl rounded-tr"
          >
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps({
                  style: {
                    width: column.width,
                  },
                })}
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody
        {...getTableBodyProps()}
        className="block max-h-80 overflow-y-auto"
        id={scrollId}
      >
        {rows.length === 0 ? (
          <p className="text-center w-full py-2 text-sm">No data</p>
        ) : (
          rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                onClick={() => {
                  if (onRowClick) {
                    onRowClick(row.original.id);
                  }
                }}
                className={`flex flex-row py-2 last:rounded-bl last:rounded-br ${
                  onRowClick &&
                  "hover:bg-purple-400 hover:text-white hover:cursor-pointer"
                }`}
              >
                {row.cells.map((cell) => {
                  return (
                    <td
                      {...cell.getCellProps({
                        style: {
                          width: cell.column.width,
                        },
                      })}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
