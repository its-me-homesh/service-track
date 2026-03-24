import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ServiceHistory } from '@/types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';

type Props = {
    histories: ServiceHistory[];
    className?: string;
};

export default function ServiceTimelineCard({ histories, className = '', ...props }: Props) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <Card className={cn('rounded-sm px-0 py-0', className)} {...props}>
            <div className="flex items-center justify-between gap-2 rounded-t-sm border-b bg-neutral-100 px-2 py-2 dark:bg-neutral-800">
                <div>Timeline</div>
            </div>
            <div className="h-[75vh] overflow-y-auto">
                <ol className="m-0 p-0">
                    {histories?.map((history, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <li className="ms-4 mb-4" key={index}>
                                <div className="flex items-start justify-start gap-2">
                                    <div className="mt-0.5 h-2 w-2 rounded-sm bg-sky-600"></div>
                                    <div>
                                        <div
                                            className="cursor-pointer"
                                            onClick={() =>
                                                setOpenIndex(
                                                    isOpen ? null : index,
                                                )
                                            }
                                        >
                                            <time className="text-body text-sm leading-none font-normal">
                                                <div className="flex items-end gap-0.5">
                                                    <span>
                                                        {history.createdAt
                                                            ? moment(
                                                                  history.createdAt,
                                                              ).format('lll')
                                                            : '-'}
                                                    </span>
                                                    <small>
                                                        {history.createdAt && (
                                                            <small>
                                                                {moment(
                                                                    history.createdAt,
                                                                ).fromNow()}
                                                            </small>
                                                        )}
                                                    </small>
                                                </div>
                                            </time>
                                            <div className="flex items-center justify-start gap-2">
                                                <small className="flex items-center justify-start gap-0.5">
                                                    <span className="uppercase">
                                                        {history.eventType}
                                                    </span>
                                                    <span>
                                                        by {history.createdBy?.name}
                                                    </span>
                                                </small>
                                                {isOpen ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                )}
                                            </div>
                                        </div>
                                        {isOpen && (
                                            <div>
                                                <div className="text-heading text-md font-semibold">
                                                    {history.description}
                                                </div>
                                                {history.changes && (
                                                    <div>
                                                        <div className="flex items-center justify-start gap-2">
                                                            <small className="text-xs font-medium uppercase">
                                                                What Changed?
                                                            </small>
                                                        </div>
                                                        <div className="ml-1">
                                                            {(
                                                                Object.keys(
                                                                    history.changes,
                                                                ) as Array<
                                                                    keyof ServiceHistory['changes']
                                                                >
                                                            ).map((key) => {
                                                                const change =
                                                                    history
                                                                        .changes[
                                                                        key
                                                                    ];

                                                                if (!change) {
                                                                    return null;
                                                                }

                                                                return (
                                                                    <div
                                                                        className="ml-0.5"
                                                                        key={
                                                                            key
                                                                        }
                                                                    >
                                                                        <div className="text-xs font-medium italic underline">
                                                                            {
                                                                                key
                                                                            }
                                                                        </div>
                                                                        <div className="ml-1 text-xs">
                                                                            <div>
                                                                                <small className="font-bold text-muted-foreground uppercase">
                                                                                    Old:
                                                                                </small>
                                                                                {change.old ||
                                                                                    ''}
                                                                            </div>
                                                                            <div>
                                                                                <small className="font-bold text-muted-foreground uppercase">
                                                                                    New:
                                                                                </small>
                                                                                {
                                                                                    change.new
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </div>
        </Card>
    );
}
