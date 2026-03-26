import { TableHeader } from '@/types';
import classNames from 'classnames';

function TableHeadItem({
                           header,
    isFirstColumn,
    isLastColumn
                       }: {
    header: TableHeader<object>,
    isFirstColumn: boolean,
    isLastColumn: boolean
}){
    const className = classNames([
            'px-2 py-3 text-xs font-medium uppercase'
        ],
        {
            'rounded-tl-sm': isFirstColumn,
            'rounded-tr-sm': isLastColumn
        })

    return <th
        scope="col"
        className={className}
    >
        {header.label || header.key}
    </th>
}

function TableRowItem({
                          index,
                          item,
                          headers
                      }: {
    headers: TableHeader<object>[],
    index: number,
    item: object
}){
    const rowClassName = classNames([
            'bg-white dark:bg-gray-700'
        ],
        {
            'bg-gray-50 dark:bg-gray-800': index % 2 === 0,
        })

    return <tr
        className={rowClassName}
    >
        {
            headers.map((header: TableHeader<object>, hIndex) => {
                const value = (item as never)[header.key] || (item as never)[header.label];
                if (hIndex === 0) {
                    return (
                        <th
                            key={hIndex}
                            scope="row"
                            className="text-heading px-2 py-1 font-medium whitespace-nowrap"
                        >
                            {value}
                        </th>
                    );
                }
                return (
                    <td key={hIndex} className="px-2 py-1">
                        {value}
                    </td>
                );
            })
        }
    </tr>
}

export function Table({ headers, rows }: {headers: TableHeader<object>[], rows: object[]}) {
    return (
        <div className="relative rounded-sm bg-gray-100 px-0 text-gray-600 shadow dark:bg-gray-800 dark:text-gray-100">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="rounded-sm bg-gray-600 text-sm font-bold text-gray-100 dark:bg-gray-100 dark:text-gray-600">
                    <tr>
                        {headers.map((header: TableHeader<object>, index) => (
                            <TableHeadItem
                                key={index}
                                isFirstColumn={index === 0}
                                isLastColumn={index === headers.length - 1}
                                header={header}
                            />
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {rows?.map(
                        (row: object, index: number) => (
                            <TableRowItem item={row} headers={headers} index={index}/>
                        ),
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
