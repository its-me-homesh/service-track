import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { confirm } from '@/hooks/use-confirm';
import { User } from '@/types';
import { router } from '@inertiajs/react';
import {
    ArchiveRestore,
    EllipsisIcon,
    Eraser,
    SquarePen,
    Trash,
} from 'lucide-react';
import {
    deleteMethod as usersDelete,
    restore as usersRestore,
} from '@/routes/users';

export default function ActionsDropdown({
    user,
    onOpenForm,
    context = 'table',
}: {
    user: User;
    onOpenForm?: (user: User) => void;
    context?: 'table' | 'details' | 'compact';
}) {
    const handleDelete = async (type: 'soft' | 'permanent' = 'soft') => {
        const wasConfirmed = await confirm(
            type === 'soft' ? 'Delete User' : 'Delete Permanently',
            type === 'soft'
                ? 'Are you sure you want to delete this user?'
                : 'Are you sure you want to delete this user permanently? This action is permanent and cannot be undone.',
        );

        if (wasConfirmed) {
            router.delete(usersDelete(user.id), {
                data: { type },
                preserveScroll: true,
                onSuccess: () => {},
            });
        }
    };

    const handleRestore = async () => {
        const wasConfirmed = await confirm(
            'Restore User',
            'Do you want to restore this user?',
            'default',
        );

        if (wasConfirmed) {
            router.patch(usersRestore(user.id), undefined, {
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
                    {onOpenForm && !user.deletedAt && (
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => onOpenForm(user)}
                        >
                            <span className="flex items-center gap-2 text-amber-500">
                                <SquarePen className="h-5 w-5 text-amber-500" />
                                <span>Edit</span>
                            </span>
                        </DropdownMenuItem>
                    )}

                    {!user.deletedAt && context !== 'compact' && (
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

                    {user.deletedAt && context !== 'compact' && (
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
                    {user.deletedAt && context !== 'compact' && (
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
