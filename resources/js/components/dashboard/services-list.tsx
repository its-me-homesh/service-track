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
import { Service } from '@/types';
import { Link } from '@inertiajs/react';
import { ExternalLink, Mail, MapPin, NotebookPen } from 'lucide-react';
import moment from 'moment';
import { Badge } from '@/components/ui/badge';
import ActionsDropdown from '@/components/services/actions-dropdown';

type Props = {
    onOpenServiceForm?: (service: Service) => void;
    onOpenStatusForm?: (service: Service) => void;
    data: Service[];
};

export default function ServicesList({ onOpenServiceForm, onOpenStatusForm, data }: Props) {
    const columns: DataTableColumn<Service>[] = [
        {
            key: 'name',
            header: 'Customer',
            cell: (service) => (
                <HoverCard>
                    <HoverCardTrigger>
                        <div className="flex cursor-help flex-col items-start justify-start gap-0.5">
                            <span>{service.customer?.name}</span>
                            <small>{service.customer?.contactNumber}</small>
                        </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64 space-y-2">
                        {service.customer?.email && (
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 shrink-0" />
                                <span className="text-sm break-all">
                                    {service.customer.email}
                                </span>
                            </div>
                        )}

                        {service.customer?.address && (
                            <div className="flex items-start gap-2">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                <span className="text-sm leading-snug">
                                    {service.customer.address}
                                </span>
                            </div>
                        )}
                        {service.customer?.notes && (
                            <div className="flex items-start gap-2">
                                <NotebookPen className="mt-0.5 h-4 w-4 shrink-0" />
                                <span className="text-sm leading-snug">
                                    {service.customer.notes}
                                </span>
                            </div>
                        )}
                    </HoverCardContent>
                </HoverCard>
            ),
        },
        {
            key: 'service_date',
            header: 'Service Date',
            accessorKey: 'serviceDate',
            sortable: true,
            cell: (service) => (
                <div className="flex flex-col items-start justify-start gap-0.5">
                    <span>
                        {service.serviceDate
                            ? moment(service.serviceDate).format('ll')
                            : null}
                    </span>
                    <small>
                        {service.serviceDate
                            ? moment(service.serviceDate).fromNow()
                            : null}
                    </small>
                </div>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            accessorKey: 'status',
            cell: (service) => (
                <Badge color={service.statusDetail?.color}>
                    {service.statusDetail?.label}
                </Badge>
            ),
        },
        {
            key: 'view',
            header: 'view',
            cell: (service) => (
                <ActionsDropdown
                    service={service}
                    onOpenForm={onOpenServiceForm}
                    onOpenStatusForm={onOpenStatusForm}
                />
            ),
        },
    ];

    return (
        <div className="relative mt-2 rounded-sm">
            <div className="px-1 py-2">
                <div className="flex items-center justify-between gap-2">
                    <div className="text-xs uppercase">Active Services</div>

                    <div className="flex items-center justify-end gap-2">
                        <Link
                            href="/services?status[]=pending&status[]=in_progress&status[]=on_hold&status[]=rescheduled"
                            className="flex items-center justify-end gap-2 text-sm text-sky-600 uppercase"
                        >
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <ExternalLink className="h-4 w-4" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    Click this link to view all services.
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
