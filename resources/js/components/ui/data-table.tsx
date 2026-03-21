import classNames from 'classnames';
import { ArrowDownZA, ArrowUpAZ, ArrowUpDown } from 'lucide-react';
import { ReactNode } from 'react';

type AccessorColumn<T> = {
    key: string;
    header: ReactNode;
    accessorKey: keyof T;
    headerClassName?: string;
    cellClassName?: string;
    isRowHeader?: boolean;
    sortable?: boolean;
};

type CellColumn<T> = {
    key: string;
    header: ReactNode;
    accessorKey?: keyof T;
    cell: (row: T) => ReactNode;
    headerClassName?: string;
    cellClassName?: string;
    isRowHeader?: boolean;
    sortable?: boolean;
};

export type DataTableColumn<T> = AccessorColumn<T> | CellColumn<T>;

export type DataTableSortDirection = 'asc' | 'desc';
export type DataTableSortState = {
    key: string;
    direction: DataTableSortDirection;
} | null;

type DataTableProps<T> = {
    columns: DataTableColumn<T>[];
    data?: T[];
    getRowKey: (row: T, index: number) => string | number;
    rowClassName?: (row: T, index: number) => string;
    tableClassName?: string;
    headClassName?: string;
    bodyClassName?: string;
    wrapperClassName?: string;
    emptyState?: ReactNode;
    sortState?: DataTableSortState;
    onSortChange?: (columnKey: string) => void;
};

export function DataTable<T>({
    columns,
    data = [],
    getRowKey,
    rowClassName,
    tableClassName,
    headClassName,
    bodyClassName,
    wrapperClassName,
    emptyState,
    sortState,
    onSortChange,
}: DataTableProps<T>) {
    const hasRows = data.length > 0;
    const activeSort = sortState ?? null;

    return (
        <div className={classNames('overflow-x-auto', wrapperClassName)}>
            <table className={classNames('w-full text-left text-sm', tableClassName)}>
                <thead
                    className={classNames(
                        'rounded-sm bg-sidebar-accent text-sm font-bold text-sidebar-accent-foreground py-3',
                        headClassName,
                    )}
                >
                    <tr>
                        {columns.map((column, index) => {
                            const isSorted = activeSort?.key === column.key;
                            const sortIcon = !column.sortable ? null : !isSorted ? (
                                <ArrowUpDown className="h-3 w-3" />
                            ) : activeSort?.direction === 'asc' ? (
                                <ArrowUpAZ className="h-3 w-3" />
                            ) : (
                                <ArrowDownZA className="h-3 w-3" />
                            );
                            const ariaSort = isSorted
                                ? activeSort?.direction === 'asc'
                                    ? 'ascending'
                                    : 'descending'
                                : 'none';

                            const isSortable = Boolean(column.sortable);
                            const isInteractive = Boolean(column.sortable && onSortChange);

                            return (
                                <th
                                    key={column.key}
                                    scope="col"
                                    aria-sort={isSortable ? ariaSort : undefined}
                                    className={classNames(
                                        'px-2 py-3 text-xs font-medium uppercase',
                                        column.headerClassName,
                                        {
                                            'rounded-tl-sm': index === 0,
                                            'rounded-tr-sm': index === columns.length - 1,
                                        },
                                    )}
                                >
                                    {isSortable ? (
                                        isInteractive ? (
                                        <button
                                            type="button"
                                            onClick={() => onSortChange?.(column.key)}
                                            className="inline-flex items-center gap-1 bg-transparent p-0 text-left text-xs font-medium uppercase text-[inherit] font-[inherit] outline-none border-0 shadow-none appearance-none"
                                        >
                                            {column.header}
                                            {sortIcon}
                                        </button>
                                        ) : (
                                            <span className="inline-flex items-center gap-1">
                                                {column.header}
                                                {sortIcon}
                                            </span>
                                        )
                                    ) : (
                                        column.header
                                    )}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody className={bodyClassName}>
                    {hasRows
                        ? data.map((row, rowIndex) => (
                              <tr
                                  key={getRowKey(row, rowIndex)}
                                  className={rowClassName?.(row, rowIndex)}
                              >
                                  {columns.map((column, columnIndex) => {
                                      const isRowHeader =
                                          column.isRowHeader ?? columnIndex === 0;
                                      const cellValue: ReactNode =
                                          'cell' in column
                                              ? column.cell(row)
                                              : (row[column.accessorKey] as ReactNode);
                                      const cellClassName = classNames(
                                          'px-2 py-1',
                                          isRowHeader && 'font-medium',
                                          column.cellClassName,
                                      );

                                      if (isRowHeader) {
                                          return (
                                              <th
                                                  key={column.key}
                                                  scope="row"
                                                  className={cellClassName}
                                              >
                                                  {cellValue}
                                              </th>
                                          );
                                      }

                                      return (
                                          <td key={column.key} className={cellClassName}>
                                              {cellValue}
                                          </td>
                                      );
                                  })}
                              </tr>
                          ))
                        : emptyState && (
                              <tr>
                                  <td
                                      colSpan={columns.length}
                                      className="px-2 py-4 text-center text-sm text-muted-foreground"
                                  >
                                      {emptyState}
                                  </td>
                              </tr>
                          )}
                </tbody>
            </table>
        </div>
    );
}
