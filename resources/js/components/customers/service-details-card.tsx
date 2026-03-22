import ServiceActionsDropdown from '@/components/services/actions-dropdown';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Service } from '@/types';
import moment from 'moment';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

type Props = {
    onOpenForm: () => void;
    onOpenStatusForm: () => void;
    service: Service;
    className?: string;
};

export default function ServiceDetailsCard({
    onOpenForm,
    onOpenStatusForm,
    service,
    className = '',
    ...props
}: Props) {
    const previewLength = 120;
    const [notesExpanded, setNotesExpanded] = useState(false);
    const notesText = service.notes ?? '';
    const hasLongNotes = notesText.length > previewLength;
    const notesPreview = hasLongNotes
        ? `${notesText.slice(0, previewLength).trimEnd()}...`
        : notesText;

    return (
        <Card className={cn('rounded-sm px-0 py-0', className)} {...props}>
            <div className="flex items-center justify-between gap-2 rounded-t-sm border-b bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800">
                <div>Last Service Details</div>
                <div>
                    <ServiceActionsDropdown
                        service={service}
                        onOpenForm={onOpenForm}
                        onOpenStatusForm={onOpenStatusForm}
                        context="compact"
                    />
                </div>
            </div>
            <dl className="mt-0 mb-1 grid gap-2 px-2 py-0 text-sm">
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
                            <span>
                                {service.cost || '-'}
                            </span>
                        </div>
                    </dd>
                </div>
                <div className="flex items-start gap-2">
                    <dt className="min-w-[110px] text-muted-foreground">
                        Notes:
                    </dt>
                    <dd className="flex-1">
                        {notesText ? (
                            <div>
                                <div className="text-sm text-foreground">
                                    {notesExpanded || !hasLongNotes
                                        ? notesText
                                        : notesPreview}
                                </div>
                                {hasLongNotes && (
                                    <button
                                        type="button"
                                        className="mt-1 cursor-pointer text-xs text-sky-600 underline-offset-2 hover:underline"
                                        onClick={() =>
                                            setNotesExpanded((prev) => !prev)
                                        }
                                    >
                                        {notesExpanded
                                            ? 'Read less'
                                            : 'Read more'}
                                    </button>
                                )}
                            </div>
                        ) : (
                            '-'
                        )}
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
                                <small>{service.updatedBy.name}</small>
                            )}
                        </div>
                    </dd>
                </div>
            </dl>
        </Card>
    );
}
