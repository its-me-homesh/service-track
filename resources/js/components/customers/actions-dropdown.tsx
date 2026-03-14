import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { confirm } from '@/hooks/use-confirm';
import {
    deleteMethod as customersDelete,
    index as customersIndex,
    restore as customersRestore,
    view as customersView,
} from '@/routes/customers';
import { Customer } from '@/types';
import { Link, router } from '@inertiajs/react';
import {
    ArchiveRestore,
    EllipsisIcon,
    Eraser,
    Eye,
    SquarePen,
    Trash,
} from 'lucide-react';

export default function ActionsDropdown({
    customer,
    onFormOpen,
    context = 'table',
}: {
    customer: Customer;
    onFormOpen?: (customer: Customer) => void;
    context?: 'table' | 'details';
}) {
    const handleDelete = async (type: 'soft' | 'permanent' = 'soft') => {
        const wasConfirmed = await confirm(
            type === 'soft' ? 'Delete Customer' : 'Delete Permanently',
            type === 'soft'
                ? 'Are you sure you want to delete this customer?'
                : 'Are you sure you want to delete this customer permanently? This action is permanent and cannot be undone.',
        );

        if (wasConfirmed) {
            router.delete(customersDelete(customer.id), {
                data: { type },
                preserveScroll: true,
                onSuccess: () => {},
            });
        }
    };

    const handleRestore = async () => {
        const wasConfirmed = await confirm(
            'Restore Customer',
            'Do you want to restore this customer?',
            'default',
        );

        if (wasConfirmed) {
            router.patch(customersRestore(customer.id), undefined, {
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="flex items-center justify-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-md"
                    >
                        <EllipsisIcon className="h-5 w-5" />
                        <span className="sr-only">Actions</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {context != 'details' && (
                        <DropdownMenuItem className="cursor-pointer" asChild>
                            <Link
                                href={customersView(customer.id)}
                                className="flex items-center gap-2"
                            >
                                <Eye className="h-5 w-5 text-sky-600" />
                                <span className="text-sky-600">View </span>
                            </Link>
                        </DropdownMenuItem>
                    )}

                    {context != 'details' &&
                        onFormOpen &&
                        !customer.deletedAt && (
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => onFormOpen(customer)}
                            >
                                <span className="flex items-center gap-2 text-amber-500">
                                    <SquarePen className="h-5 w-5 text-amber-500" />
                                    <span>Edit</span>
                                </span>
                            </DropdownMenuItem>
                        )}

                    {!customer.deletedAt && (
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleDelete('soft')}
                        >
                            <span className="flex items-center gap-2 text-orange-600">
                                <Trash className="h-5 w-5 text-orange-600" />
                                <span>Delete</span>
                            </span>
                        </DropdownMenuItem>
                    )}

                    {customer.deletedAt && (
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={handleRestore}
                        >
                            <span className="flex items-center gap-2 text-emerald-600">
                                <ArchiveRestore className="h-5 w-5 text-emerald-600" />
                                <span>Restore</span>
                            </span>
                        </DropdownMenuItem>
                    )}
                    {customer.deletedAt && (
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleDelete('permanent')}
                        >
                            <span className="flex items-center gap-2 text-red-600">
                                <Eraser className="h-5 w-5 text-red-600" />
                                <span>Delete Permanently</span>
                            </span>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
