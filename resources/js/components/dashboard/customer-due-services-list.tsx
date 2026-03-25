import { DataTable, DataTableColumn } from '@/components/ui/data-table';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Customer, ServiceStatus } from '@/types';
import { Link } from '@inertiajs/react';
import { ExternalLink, Mail, MapPin, NotebookPen } from 'lucide-react';
import moment from 'moment';
import ActionsDropdown from '@/components/customers/actions-dropdown';

type Props = {
    context: 'overdue' | 'upcoming';
    onOpenCustomerForm?: (customer?: Customer) => void;
    onOpenServiceForm?: (customer?: Customer) => void;
    statuses: ServiceStatus[];
    data: Customer[];
};

export default function CustomerDueServicesList({
    context = 'overdue',
    onOpenCustomerForm,
    onOpenServiceForm,
    data,
}: Props) {
    const columns: DataTableColumn<Customer>[] = [
        {
            key: 'name',
            header: 'Customer',
            cell: (customer) => (
                <HoverCard>
                    <HoverCardTrigger>
                        <div className="flex cursor-help flex-col items-start justify-start gap-0.5">
                            <span>{customer.name}</span>
                            <small>{customer.contactNumber}</small>
                        </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64 space-y-2">
                        {customer.email && (
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 shrink-0" />
                                <span className="text-sm break-all">
                                    {customer.email}
                                </span>
                            </div>
                        )}

                        {customer.address && (
                            <div className="flex items-start gap-2">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                <span className="text-sm leading-snug">
                                    {customer.address}
                                </span>
                            </div>
                        )}
                        {customer.notes && (
                            <div className="flex items-start gap-2">
                                <NotebookPen className="mt-0.5 h-4 w-4 shrink-0" />
                                <span className="text-sm leading-snug">
                                    {customer.notes}
                                </span>
                            </div>
                        )}
                    </HoverCardContent>
                </HoverCard>
            ),
        },
        {
            key: 'last_service_date',
            header: 'Last Service Date',
            accessorKey: 'lastServiceDate',
            sortable: true,
            cell: (customer) => (
                <div className="flex flex-col items-start justify-start gap-0.5">
                    <span>
                        {customer.lastServiceDate
                            ? moment(customer.lastServiceDate).format('ll')
                            : null}
                    </span>
                    <small>
                        {customer.lastServiceDate
                            ? moment(customer.lastServiceDate).fromNow()
                            : null}
                    </small>
                </div>
            ),
        },
        {
            key: 'next_service_date',
            header: 'Next Service Date',
            accessorKey: 'nextServiceDate',
            sortable: true,
            cell: (customer) => (
                <div className="flex flex-col items-start justify-start gap-0.5">
                    <span>
                        {customer.nextServiceDate
                            ? moment(customer.nextServiceDate).format('ll')
                            : null}
                    </span>
                    <small>
                        {customer.nextServiceDate
                            ? moment(customer.nextServiceDate).fromNow()
                            : null}
                    </small>
                </div>
            ),
        },
        {
            key: 'actions',
            header: 'Actions',
            cell: (customer) => (
                <ActionsDropdown
                    customer={customer}
                    onFormOpen={onOpenCustomerForm}
                    onServiceFormOpen={onOpenServiceForm}
                />
            ),
        },
    ];

    return (
        <div className="relative mt-2 rounded-sm">
            <div className="px-1 py-2">
                <div className="flex items-center justify-between gap-2">
                    <div className="text-xs uppercase">
                        {context == 'overdue'
                            ? 'Overdue Services'
                            : 'Upcoming Services'}
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <Link
                            href={`customers?${context == 'overdue' ? 'serviceOverdue' : 'serviceDue'}=true`}
                            className="flex items-center justify-end gap-2 text-sm text-sky-600 uppercase"
                        >
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <ExternalLink className="h-4 w-4" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    Click this link to view all list.
                                </TooltipContent>
                            </Tooltip>
                        </Link>
                    </div>
                </div>
            </div>
            <DataTable
                columns={columns}
                data={data}
                rowClassName={(_, index) =>
                    index % 2 === 0 ? 'bg-sidebar' : 'bg-background'
                }
                getRowKey={(service) => service.id}
            />
        </div>
    );
}
