import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { confirm } from '@/hooks/use-confirm';
import { Role } from '@/types';
import { router } from '@inertiajs/react';
import {
    EllipsisIcon,
    Eraser,
    SquarePen,
} from 'lucide-react';
import {
    deleteMethod,
} from '@/routes/roles';

export default function ActionsDropdown({
    item,
    onOpenForm,
}: {
    item: Role;
    onOpenForm?: (item: Role) => void;
    context?: 'table' | 'details' | 'compact';
}) {
    const handleDelete = async () => {
        const wasConfirmed = await confirm(
            'Delete Permanently',
            'Are you sure you want to delete this role permanently? This action is permanent and cannot be undone.',
        );

        if (wasConfirmed) {
            router.delete(deleteMethod(item.id), {
                preserveScroll: true,
                onSuccess: () => {},
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
                    {onOpenForm && (
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => onOpenForm(item)}
                        >
                            <span className="flex items-center gap-2 text-amber-500">
                                <SquarePen className="h-5 w-5 text-amber-500" />
                                <span>Edit</span>
                            </span>
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={handleDelete}
                    >
                        <span className="flex items-center gap-2 text-red-600">
                            <Eraser className="h-5 w-5 text-red-600" />
                            <span>Delete</span>
                        </span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
