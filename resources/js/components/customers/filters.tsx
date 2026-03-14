import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { index as customersIndex } from '@/routes/customers';
import { CustomerFilters } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function Filters() {
    const { url } = usePage();

    const params = new URLSearchParams(url.split('?')[1]);

    const [searchTerm, setSearchTerm] = useState<string>(
        params.get('term') ?? '',
    );

    const filters: CustomerFilters = {
        includeTrashed: params.get('includeTrashed') === 'true',
        onlyTrashed: params.get('onlyTrashed') === 'true',
        serviceOverdue: params.get('serviceOverdue') === 'true',
        serviceDue: params.get('serviceDue') === 'true',
    };

    const handleSearch = () => {
        const query: Record<string, string> = {};

        if (searchTerm?.trim().length > 0) {
            query.term = searchTerm.trim();
        }

        router.get(customersIndex().url, query, {
            preserveState: true,
            replace: true,
        });
    };

    const updateFilters = (newFilters: Partial<CustomerFilters>) => {
        const updated = { ...filters, ...newFilters };

        const query = Object.fromEntries(
            Object.entries(updated).filter(([, value]) => value),
        );

        router.get(customersIndex().url, query, {
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
                <ToggleGroup
                    className="flex items-center justify-center"
                    type="single"
                    aria-label="Service Type Filters"
                    value={
                        filters.serviceOverdue
                            ? 'overdue'
                            : filters.serviceDue
                              ? 'due'
                              : ''
                    }
                    onValueChange={(value) => {
                        if (value === 'overdue') {
                            updateFilters({
                                serviceOverdue: true,
                                serviceDue: false,
                            });
                        }

                        if (value === 'due') {
                            updateFilters({
                                serviceOverdue: false,
                                serviceDue: true,
                            });
                        }

                        if (!value) {
                            updateFilters({
                                serviceOverdue: false,
                                serviceDue: false,
                            });
                        }
                    }}
                >
                    <ToggleGroupItem
                        value="overdue"
                        aria-label="service overdue"
                    >
                        Service Overdue
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="due"
                        aria-label="Service due in 7 days"
                    >
                        Service Due in 7 Days
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>
        </div>
    );
}
