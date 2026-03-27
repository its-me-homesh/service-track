import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Permission, Role } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

import { UserRoundPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DataTable,
    DataTableColumn,
    DataTableSortDirection,
    DataTableSortState,
} from '@/components/ui/data-table';
import { useState } from 'react';
import { index as rolesIndex } from '@/routes/roles';
import moment from 'moment';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import ActionsDropdown from '@/components/roles/actions-dropdown';
import ItemFormDialog from '@/components/roles/item-form-dialog';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles & Permissions',
        href: rolesIndex().url,
    },
];
export default function Roles({
    roles,
    permissions,
}: {
    roles: Role[];
    permissions: Permission[]
}) {
    const { url } = usePage();
    const params = new URLSearchParams(url.split('?')[1]);

    const [itemFormOpened, setItemFormOpened] = useState<boolean>(false);

    const [selectedItem, setSelectedItem] = useState<Role | null>(
        null,
    );

    const handleOpenItemForm = (item?: Role) => {
        setSelectedItem(item ?? null);
        setItemFormOpened(true);
    };

    const handleCloseItemForm = () => {
        setSelectedItem(null);
        setItemFormOpened(false);
    };

    const sortableKeys = new Set([
        'name',
        'guard_name',
        'created_at',
        'updated_at',
    ]);

    const orderByParam = params.get('orderBy');
    const orderParam = params.get('order');
    const sortDirection: DataTableSortDirection =
        orderParam === 'desc' ? 'desc' : 'asc';
    const sortState: DataTableSortState =
        orderByParam && sortableKeys.has(orderByParam)
            ? { key: orderByParam, direction: sortDirection }
            : null;

    const columns: DataTableColumn<Role>[] = [
        {
            key: 'name',
            header: 'Name',
            accessorKey: 'name',
            cellClassName: 'text-heading whitespace-nowrap',
            isRowHeader: true,
            sortable: true,
        },
        {
            key: 'guard_name',
            header: 'Guard',
            accessorKey: 'guardName',
            sortable: true,
        },
        {
            key: 'created_at',
            header: 'Created',
            accessorKey: 'createdAt',
            sortable: true,
            cell: (item) => (
                <div className="flex flex-col items-start justify-start gap-0.5">
                    <span>
                        {item.createdAt
                            ? moment(item.createdAt).format('lll')
                            : null}
                    </span>
                </div>
            ),
        },
        {
            key: 'updated_at',
            header: 'Updated',
            accessorKey: 'updatedAt',
            sortable: true,
            cell: (item) => (
                <div className="flex flex-col items-start justify-start gap-0.5">
                    <span>
                        {item.updatedAt
                            ? moment(item.updatedAt).format('lll')
                            : null}
                    </span>
                </div>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            cell: (item) => (
                <ActionsDropdown item={item} onOpenForm={handleOpenItemForm} />
            ),
        },
    ];

    const handleSortChange = (columnKey: string) => {
        const nextDirection: DataTableSortDirection | null =
            sortState?.key === columnKey
                ? sortState.direction === 'asc'
                    ? 'desc'
                    : null
                : 'asc';

        const query = Object.fromEntries(params.entries());

        if (nextDirection) {
            query.orderBy = columnKey;
            query.order = nextDirection;
        } else {
            delete query.orderBy;
            delete query.order;
        }

        delete query.page;

        router.get(rolesIndex().url, query, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles & Permissions" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative flex-1 overflow-hidden">
                    <div className="flex items-center justify-end gap-2 px-1 py-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="secondary"
                                    onClick={() => handleOpenItemForm()}
                                >
                                    <UserRoundPlus className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Click to add a new user.
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    {itemFormOpened && (
                        <ItemFormDialog
                            open={itemFormOpened}
                            onOpenChange={setItemFormOpened}
                            onClose={handleCloseItemForm}
                            selectedItem={selectedItem}
                            permissions={permissions}
                        />
                    )}

                    <div className="relative mt-2 rounded-sm">
                        <DataTable
                            columns={columns}
                            data={roles}
                            getRowKey={(item) => item.id}
                            rowClassName={(_, index) =>
                                index % 2 === 0 ? 'bg-sidebar' : 'bg-background'
                            }
                            sortState={sortState}
                            onSortChange={handleSortChange}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
