import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { index as usersIndex } from '@/routes/users';
import { Role, UserFilters } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

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

export default function Filters({ roles }: { roles: Role[] }) {
    const { url } = usePage();

    const params = new URLSearchParams(url.split('?')[1]);
    const selectedRoles = Array.from(
        new Set(getNumberArrayParam(params, 'roles')),
    );

    const [searchTerm, setSearchTerm] = useState<string>(
        params.get('term') ?? '',
    );

    const filters: UserFilters = {
        includeTrashed: params.get('includeTrashed') === 'true',
        onlyTrashed: params.get('onlyTrashed') === 'true',
        roles: selectedRoles,
    };

    const handleSearch = () => {
        const query: Record<string, string> = {};

        if (searchTerm?.trim().length > 0) {
            query.term = searchTerm.trim();
        }

        router.get(usersIndex().url, query, {
            preserveState: true,
            replace: true,
        });
    };

    const updateFilters = (newFilters: Partial<UserFilters>) => {
        const updated = { ...filters, ...newFilters };
        const query: Record<string, boolean | string[] | number[]> = {};

        if (updated.includeTrashed) {
            query.includeTrashed = true;
        }

        if (updated.onlyTrashed) {
            query.onlyTrashed = true;
        }

        if (updated.roles.length > 0) {
            query.roles = updated.roles;
        }

        router.get(usersIndex().url, query, {
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
                <div className="flex flex-wrap items-center justify-center gap-1">
                    {roles?.map((role: Role) => (
                        <Toggle
                            value={role.id}
                            key={role.id}
                            pressed={filters.roles.includes(role.id)}
                            onPressedChange={(pressed) => {
                                const nextRoles = pressed
                                    ? Array.from(
                                          new Set([
                                              ...filters.roles,
                                              role.id,
                                          ]),
                                      )
                                    : filters.roles.filter(
                                          (value) => value !== role.id,
                                      );
                                updateFilters({ roles: nextRoles });
                            }}
                        >
                            {role?.name}
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
