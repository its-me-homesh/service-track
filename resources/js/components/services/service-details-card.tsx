import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Service } from '@/types';
import moment from 'moment';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';

type Props = {
    service: Service;
    className?: string;
};

export default function ServiceDetailsCard({
    service,
    className = '',
    ...props
}: Props) {
    return (
        <Card className={cn('rounded-sm px-2 py-3', className)} {...props}>
            <dl className="mt-0 mb-1 grid gap-2 px-2 py-0 text-sm">
                <div className="flex items-start gap-2">
                    <dt className="min-w-[110px] text-muted-foreground">
                        Customer:
                    </dt>
                    <dd className="flex flex-col gap-1">
                        <div className="flex items-end gap-0.5">
                            <Link href={`/customers/${service.customer?.id}`}>
                                <span className="text-sky-600 hover:text-sky-300">
                                    <span>{service.customer?.name}</span>
                                </span>
                            </Link>
                        </div>
                        <div className="flex flex-col items-start gap-0.5">
                            <div className="flex items-start justify-start gap-0.5">
                                <div className="flex flex-col justify-start gap-0.5">
                                    <small className="font-bold text-muted-foreground uppercase">
                                        Contact Number:
                                    </small>
                                    <span>
                                        {service.customer?.contactNumber}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {service.customer?.alternateContactNumber && (
                            <div className="flex flex-col items-start gap-0.5">
                                <div className="flex items-start justify-start gap-0.5">
                                    <div className="flex flex-col justify-start gap-0.5">
                                        <small className="font-bold text-muted-foreground uppercase">
                                            Alternate Contact Number:
                                        </small>
                                        <span>
                                            {
                                                service.customer
                                                    ?.alternateContactNumber
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {service.customer?.email && (
                            <div className="flex flex-col items-start gap-0.5">
                                <div className="flex items-start justify-start gap-0.5">
                                    <div className="flex flex-col justify-start gap-0.5">
                                        <small className="font-bold text-muted-foreground uppercase">
                                            Email:
                                        </small>
                                        <span>{service.customer?.email}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {service.customer?.address && (
                            <div className="flex flex-col items-start gap-0.5">
                                <div className="flex items-start justify-start gap-0.5">
                                    <div className="flex flex-col justify-start gap-0.5">
                                        <small className="font-bold text-muted-foreground uppercase">
                                            Address:
                                        </small>
                                        <span>{service.customer?.address}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {service.customer?.notes && (
                            <div className="flex flex-col items-start gap-0.5">
                                <div className="flex items-start justify-start gap-0.5">
                                    <div className="flex flex-col justify-start gap-0.5">
                                        <small className="font-bold text-muted-foreground uppercase">
                                            Notes/Remarks:
                                        </small>
                                        <span>{service.customer?.notes}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </dd>
                </div>
                <div className="flex items-start gap-2">
                    <dt className="min-w-[110px] text-muted-foreground">
                        Service Date:
                    </dt>
                    <dd>
                        <div className="flex items-end gap-0.5">
                            <span>
                                {service.serviceDate
                                    ? moment(service.serviceDate).format('ll')
                                    : '-'}
                            </span>
                            {service.serviceDate && (
                                <small>
                                    {moment(service.serviceDate).fromNow()}
                                </small>
                            )}
                        </div>
                    </dd>
                </div>
                <div className="flex items-start gap-2">
                    <dt className="min-w-[110px] text-muted-foreground">
                        Status:
                    </dt>
                    <dd>
                        <Badge color={service.statusDetail?.color}>
                            {service.statusDetail?.label}
                        </Badge>
                    </dd>
                </div>
                <div className="flex items-start gap-2">
                    <dt className="min-w-[110px] text-muted-foreground">
                        Cost:
                    </dt>
                    <dd>
                        <div className="flex items-end gap-0.5">
                            <span>{service.cost || '-'}</span>
                        </div>
                    </dd>
                </div>
                <div className="flex items-start gap-2">
                    <dt className="min-w-[110px] text-muted-foreground">
                        Notes:
                    </dt>
                    <dd className="flex-1">
                        <div className="text-sm text-foreground">
                            {service.notes}
                        </div>
                    </dd>
                </div>
                <div className="flex items-start gap-2">
                    <dt className="min-w-[110px] text-muted-foreground">
                        Created:
                    </dt>
                    <dd>
                        <div className="flex items-end gap-0.5">
                            <span>
                                {service.createdAt
                                    ? moment(service.createdAt).format('lll')
                                    : '-'}
                            </span>
                            <small>
                                {service.createdAt && (
                                    <small>
                                        {moment(service.createdAt).fromNow()}
                                    </small>
                                )}
                            </small>
                        </div>
                        <div className="flex items-end gap-0.5">
                            {service.createdBy && (
                                <small>by {service.createdBy.name}</small>
                            )}
                        </div>
                    </dd>
                </div>
                <div className="flex items-start gap-2">
                    <dt className="min-w-[110px] text-muted-foreground">
                        Updated:
                    </dt>
                    <dd>
                        <div className="flex items-end gap-0.5">
                            <span>
                                {service.updatedAt
                                    ? moment(service.updatedAt).format('lll')
                                    : '-'}
                            </span>
                            <small>
                                {service.updatedAt && (
                                    <small>
                                        {moment(service.updatedAt).fromNow()}
                                    </small>
                                )}
                            </small>
                        </div>
                        <div className="flex items-end gap-0.5">
                            {service.updatedBy && (
                                <small>by {service.updatedBy.name}</small>
                            )}
                        </div>
                    </dd>
                </div>
            </dl>
        </Card>
    );
}
