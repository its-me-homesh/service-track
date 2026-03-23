import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { index as servicesIndex } from '@/routes/services';
import { ServiceFilters, ServiceStatus } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { CustomerSelect } from '@/components/select-customer';

const statusToggleClasses: Record<
    NonNullable<ServiceStatus['color']>,
    string
> = {
    amber: 'data-[state=on]:bg-amber-100 data-[state=on]:text-amber-600',
    blue: 'data-[state=on]:bg-blue-100 data-[state=on]:text-blue-600',
    sky: 'data-[state=on]:bg-sky-100 data-[state=on]:text-sky-600',
    violet: 'data-[state=on]:bg-violet-100 data-[state=on]:text-violet-600',
    orange: 'data-[state=on]:bg-orange-100 data-[state=on]:text-orange-600',
    green: 'data-[state=on]:bg-green-100 data-[state=on]:text-green-600',
    emerald: 'data-[state=on]:bg-emerald-100 data-[state=on]:text-emerald-600',
    red: 'data-[state=on]:bg-red-100 data-[state=on]:text-red-600',
};

const getArrayParam = (params: URLSearchParams, key: string): string[] => {
    const direct = params.getAll(key).filter(Boolean);
    if (direct.length) {
        return direct;
    }

    const bracket = params.getAll(`${key}[]`).filter(Boolean);
    if (bracket.length) {
        return bracket;
    }

    const indexed: string[] = [];
    params.forEach((value, paramKey) => {
        if (paramKey.startsWith(`${key}[`)) {
            indexed.push(value);
        }
    });

    return indexed.filter(Boolean);
};

const getNumberArrayParam = (
    params: URLSearchParams,
    key: string,
): number[] => {
    return getArrayParam(params, key)
        .map((value) => Number(value))
        .filter((value) => Number.isInteger(value) && value > 0);
};

export default function Filters({ statuses }: { statuses: ServiceStatus[] }) {
    const { url } = usePage();

    const params = new URLSearchParams(url.split('?')[1]);
    const selectedStatuses = Array.from(
        new Set(getArrayParam(params, 'status')),
    );
    const selectedCustomerIds = Array.from(
        new Set(getNumberArrayParam(params, 'customerId')),
    );

    const [searchTerm, setSearchTerm] = useState<string>(
        params.get('term') ?? '',
    );

    const filters: ServiceFilters = {
        includeTrashed: params.get('includeTrashed') === 'true',
        onlyTrashed: params.get('onlyTrashed') === 'true',
        status: selectedStatuses,
        customerId: selectedCustomerIds,
    };

    const handleSearch = () => {
        const query: Record<string, string> = {};

        if (searchTerm?.trim().length > 0) {
            query.term = searchTerm.trim();
        }

        router.get(servicesIndex().url, query, {
            preserveState: true,
            replace: true,
        });
    };

    const updateFilters = (newFilters: Partial<ServiceFilters>) => {
        const updated = { ...filters, ...newFilters };
        const query: Record<string, boolean | string[] | number[]> = {};

        if (updated.includeTrashed) {
            query.includeTrashed = true;
        }

        if (updated.onlyTrashed) {
            query.onlyTrashed = true;
        }

        if (updated.status.length > 0) {
            query.status = updated.status;
        }
        if (updated.customerId.length > 0) {
            query.customerId = updated.customerId;
        }

        router.get(servicesIndex().url, query, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <Input
                    placeholder="Search"
                    prefixIcon={<Search className="h-4 w-4" />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
            </div>
            <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                <div>
                    <CustomerSelect
                        value={filters.customerId}
                        onChange={(customerId) =>
                            updateFilters({ customerId: customerId })
                        }
                        multiple={true}
                        placeholder="Select Customers"
                        allowClear
                    />
                </div>
                <div className="flex flex-wrap items-center justify-center gap-1">
                    {statuses?.map((status: ServiceStatus) => (
                        <Toggle
                            value={status.value}
                            key={status.value}
                            className={cn(
                                status.color
                                    ? statusToggleClasses[status.color]
                                    : undefined,
                            )}
                            pressed={filters.status.includes(status.value)}
                            onPressedChange={(pressed) => {
                                const nextStatuses = pressed
                                    ? Array.from(
                                          new Set([
                                              ...filters.status,
                                              status.value,
                                          ]),
                                      )
                                    : filters.status.filter(
                                          (value) => value !== status.value,
                                      );
                                updateFilters({ status: nextStatuses });
                            }}
                        >
                            {status?.label}
                        </Toggle>
                    ))}
                </div>
                <ToggleGroup
                    className="flex items-center justify-center"
                    type="single"
                    aria-label="Deleted Type Filters"
                    value={
                        filters.onlyTrashed
                            ? 'only'
                            : filters.includeTrashed
                              ? 'include'
                              : ''
                    }
                    onValueChange={(value) => {
                        if (value === 'include') {
                            updateFilters({
                                includeTrashed: true,
                                onlyTrashed: false,
                            });
                        }

                        if (value === 'only') {
                            updateFilters({
                                includeTrashed: false,
                                onlyTrashed: true,
                            });
                        }

                        if (!value) {
                            updateFilters({
                                includeTrashed: false,
                                onlyTrashed: false,
                            });
                        }
                    }}
                >
                    <ToggleGroupItem
                        value="include"
                        aria-label="Include deleted"
                    >
                        Include Deleted
                    </ToggleGroupItem>
                    <ToggleGroupItem value="only" aria-label="Deleted only">
                        Deleted Only
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>
        </div>
    );
}
