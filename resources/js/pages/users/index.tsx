import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    PaginatedData,
    Role,
    User,
} from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

import { Pagination } from '@/components/ui/Pagination/pagination';
import { UserCheck, UserPlus } from 'lucide-react';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';

import { Button } from '@/components/ui/button';
import {
    DataTable,
    DataTableColumn,
    DataTableSortDirection,
    DataTableSortState,
} from '@/components/ui/data-table';
import { useState } from 'react';
import { index as usersIndex } from '@/routes/users';
import moment from 'moment';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import UserFormDialog from '@/components/users/user-form-dialog';
import ActionsDropdown from '@/components/users/actions-dropdown';
import Filters from '@/components/users/filters';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: usersIndex().url,
    },
];

export default function Users({
    users,
    roles,
}: {
    users: PaginatedData<User>;
    roles: Role[];
}) {
    const { data, meta } = users;
    const { url } = usePage();
    const params = new URLSearchParams(url.split('?')[1]);

    const [userFormOpened, setUserFormOpened] = useState<boolean>(false);

    const [selectedUser, setSelectedUser] = useState<User | null>(
        null,
    );

    const handleOpenUserForm = (user?: User) => {
        setSelectedUser(user ?? null);
        setUserFormOpened(true);
    };

    const handleCloseUserForm = () => {
        setSelectedUser(null);
        setUserFormOpened(false);
    };

    const sortableKeys = new Set([
        'name',
        'email',
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

    const columns: DataTableColumn<User>[] = [
        {
            key: 'name',
            header: 'Name',
            accessorKey: 'name',
            cellClassName: 'text-heading whitespace-nowrap',
            isRowHeader: true,
            sortable: true,
            cell: (item) => (
                <HoverCard>
                    <HoverCardTrigger>
                        <div className="flex cursor-help flex-col items-start justify-start gap-0.5">
                            <span>{item.name}</span>
                        </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64 space-y-2">
                        {item.roles?.map((role) => (
                            <div className="flex items-center gap-2">
                                <UserCheck className="h-4 w-4 shrink-0" />
                                <span className="text-sm break-all">
                                    {role?.name}
                                </span>
                            </div>
                        ))}
                    </HoverCardContent>
                </HoverCard>
            ),
        },
        {
            key: 'email',
            header: 'Email',
            accessorKey: 'email',
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
                    {item.createdBy && <small>by {item.createdBy.name}</small>}
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
                    {item.updatedBy && <small>by {item.updatedBy.name}</small>}
                </div>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            cell: (user) => (
                <ActionsDropdown user={user} onOpenForm={handleOpenUserForm} />
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

        router.get(usersIndex().url, query, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative flex-1 overflow-hidden">
                    <div className="flex items-center justify-end gap-2 px-1 py-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="secondary"
                                    onClick={() => handleOpenUserForm()}
                                >
                                    <UserPlus className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Click to add a new user.
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    {userFormOpened && (
                        <UserFormDialog
                            open={userFormOpened}
                            onOpenChange={setUserFormOpened}
                            onClose={handleCloseUserForm}
                            selectedUser={selectedUser}
                            roles={roles}
                        />
                    )}

                    <div className="relative mt-2 rounded-sm">
                        <div className="px-1 py-2">
                            <Filters roles={roles} />
                        </div>
                        <DataTable
                            columns={columns}
                            data={data}
                            getRowKey={(item) => item.id}
                            rowClassName={(_, index) =>
                                index % 2 === 0 ? 'bg-sidebar' : 'bg-background'
                            }
                            sortState={sortState}
                            onSortChange={handleSortChange}
                        />
                    </div>
                    <Pagination meta={meta} />
                </div>
            </div>
        </AppLayout>
    );
}
