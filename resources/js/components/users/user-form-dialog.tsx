import { Button } from '@/components/ui/button';

import InputError from '@/components/input-error';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    store as usersStore,
    update as usersUpdate,
} from '@/routes/users';
import {
    Role,
    User,
    UserFormData,
} from '@/types';
import { useForm } from '@inertiajs/react';
import { Info } from 'lucide-react';
import { useEffect, type FormEvent } from 'react';
import { SelectStatus } from '@/components/select-status';

const initialFormData: UserFormData = {
    name: '',
    email: '',
    roles: [],
    changePassword: false,
    password: '',
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onClose?: () => void;
    selectedUser?: User | null;
    className?: string;
    roles: Role[] | { data: Role[] };
};

const mapUserToFormData = (user: User): UserFormData => ({
    name: user.name ?? '',
    email: user.email ?? '',
    roles: user.roles ? user.roles.map((role) => role.id) : [],
    changePassword: false,
    password: '',
});

export default function UserFormDialog({
    open,
    onOpenChange,
    onClose,
    selectedUser,
    className = '',
    roles,
}: Props) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<UserFormData>(initialFormData);
    const handleResetAndClose = () => {
        reset();
        clearErrors();
        if (onClose) {
            onClose();
        }
    };

    const handleDialogOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            handleResetAndClose();
        }
        onOpenChange(nextOpen);
    };

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (selectedUser) {
            put(usersUpdate(selectedUser.id).url, {
                onSuccess: () => {
                    handleResetAndClose();
                },
            });
        } else {
            post(usersStore().url, {
                onSuccess: () => {
                    handleResetAndClose();
                },
            });
        }
    };

    useEffect(() => {
        if (!open) return;
        if (selectedUser) {
            setData(mapUserToFormData(selectedUser));
            return;
        }

        setData(initialFormData);
    }, [open, selectedUser, setData]);

    const roleList = Array.isArray(roles) ? roles : roles.data ?? [];
    const roleOptions = roleList.map((role) => ({
        value: String(role.id),
        label: role.name,
    }));

    return (
        <Dialog open={open} onOpenChange={handleDialogOpenChange}>
            <DialogContent className={className}>
                <DialogHeader>
                    <DialogTitle>
                        {selectedUser ? 'Edit User' : 'Create a new User'}
                    </DialogTitle>
                </DialogHeader>
                <form
                    method="post"
                    onSubmit={handleFormSubmit}
                    className="flex flex-1 flex-col overflow-hidden"
                >
                    <div className="flex-1 space-y-4 overflow-y-auto scroll-smooth px-1">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <Label htmlFor="name">Name*</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    tabIndex={1}
                                    placeholder="Enter name*"
                                    value={data.name || ''}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div>
                                <Label htmlFor="email">Email*</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    tabIndex={2}
                                    placeholder="Enter email*"
                                    value={data.email || ''}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div>
                                <Label htmlFor="roles" className="mb-2">
                                    Select roles*
                                </Label>
                                <SelectStatus
                                    id="roles"
                                    name="roles"
                                    label="Roles"
                                    placeholder="Select roles"
                                    statuses={roleOptions}
                                    value={data.roles.map(String)}
                                    onChange={(value) =>
                                        setData(
                                            'roles',
                                            value.map((roleId) =>
                                                Number(roleId),
                                            ),
                                        )
                                    }
                                    error={errors.roles}
                                    allowClear
                                    multiple
                                />
                                <InputError message={errors.roles} />
                            </div>

                            {selectedUser && (
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="changePassword"
                                            checked={data.changePassword}
                                            onCheckedChange={(checked) => {
                                                setData((prev) => ({
                                                    ...prev,
                                                    changePassword: checked,
                                                    password: checked
                                                        ? prev.password
                                                        : '',
                                                }));
                                            }}
                                        />
                                        <Label htmlFor="changePassword">
                                            Change Password
                                        </Label>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Info className="h-4 w-4" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Turn this on to change the
                                                password of the user.
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>
                            )}

                            {(!selectedUser ||
                                (selectedUser && data.changePassword)) && (
                                <div>
                                    <Label htmlFor="password">Password*</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        tabIndex={4}
                                        placeholder="Enter password*"
                                        value={data.password || ''}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.password} />
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="my-1 mt-3">
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={processing}
                            onClick={handleResetAndClose}
                        >
                            Close
                        </Button>

                        {!selectedUser?.deletedAt && (
                            <Button type="submit" disabled={processing}>
                                Save
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
