import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { confirm } from '@/hooks/use-confirm';
import { Service } from '@/types';
import { Link, router } from '@inertiajs/react';
import {
    ArchiveRestore,
    ArrowRightLeft,
    EllipsisIcon,
    Eraser,
    Eye,
    SquarePen,
    Trash,
} from 'lucide-react';
import { deleteMethod as servicesDelete, restore as servicesRestore, view as servicesView } from '@/routes/services';

export default function ActionsDropdown({
    service,
    onOpenForm,
    onOpenStatusForm,
    context = 'table',
}: {
    service: Service;
    onOpenForm?: (service: Service) => void;
    onOpenStatusForm?: (service: Service) => void;
    context?: 'table' | 'details' | 'compact';
}) {
    const handleDelete = async (type: 'soft' | 'permanent' = 'soft') => {
        const wasConfirmed = await confirm(
            type === 'soft' ? 'Delete Service' : 'Delete Permanently',
            type === 'soft'
                ? 'Are you sure you want to delete this service?'
                : 'Are you sure you want to delete this service permanently? This action is permanent and cannot be undone.',
        );

        if (wasConfirmed) {
            router.delete(servicesDelete(service.id), {
                data: { type },
                preserveScroll: true,
                onSuccess: () => {},
            });
        }
    };

    const handleRestore = async () => {
        const wasConfirmed = await confirm(
            'Restore Service',
            'Do you want to restore this service?',
            'default',
        );

        if (wasConfirmed) {
            router.patch(servicesRestore(service.id), undefined, {
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
                        className="h-9 w-9 rounded-sm"
                    >
                        <EllipsisIcon className="h-5 w-5" />
                        <span className="sr-only">Actions</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {context != 'details' && (
                        <DropdownMenuItem className="cursor-pointer" asChild>
                            <Link
                                href={servicesView(service.id)}
                                className="flex items-center gap-2"
                            >
                                <Eye className="h-5 w-5 text-sky-600" />
                                <span className="text-sky-600">View</span>
                            </Link>
                        </DropdownMenuItem>
                    )}

                    {onOpenForm && !service.deletedAt && (
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => onOpenForm(service)}
                        >
                            <span className="flex items-center gap-2 text-amber-500">
                                <SquarePen className="h-5 w-5 text-amber-500" />
                                <span>Edit</span>
                            </span>
                        </DropdownMenuItem>
                    )}

                    {onOpenStatusForm && !service.deletedAt && (
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => onOpenStatusForm(service)}
                        >
                            <span className="flex items-center gap-2 text-amber-600">
                                <ArrowRightLeft className="h-5 w-5 text-amber-600" />
                                <span>Change Status</span>
                            </span>
                        </DropdownMenuItem>
                    )}

                    {!service.deletedAt && context !== 'compact' && (
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

                    {service.deletedAt && context !== 'compact' && (
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
                    {service.deletedAt && context !== 'compact' && (
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
