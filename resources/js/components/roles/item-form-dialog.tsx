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
    store,
    update,
} from '@/routes/roles';
import { Role, RoleFormData, Permission } from '@/types';
import { useForm } from '@inertiajs/react';
import { useEffect, type FormEvent } from 'react';

const initialFormData: RoleFormData = {
    name: '',
    permissions: [],
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onClose?: () => void;
    selectedItem?: Role | null;
    className?: string;
    permissions: Permission[];
};

const mapItemToFormData = (role: Role): RoleFormData => ({
    name: role.name ?? '',
    permissions: role.permissions
        ? role.permissions.map((item) => item.id)
        : [],
});

export default function ItemFormDialog({
    open,
    onOpenChange,
    onClose,
    selectedItem,
    className = '',
    permissions,
}: Props) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<RoleFormData>(initialFormData);
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
        if (selectedItem) {
            put(update(selectedItem.id).url, {
                onSuccess: () => {
                    handleResetAndClose();
                },
            });
        } else {
            post(store().url, {
                onSuccess: () => {
                    handleResetAndClose();
                },
            });
        }
    };

    useEffect(() => {
        if (!open) return;
        if (selectedItem) {
            setData(mapItemToFormData(selectedItem));
            return;
        }

        setData(initialFormData);
    }, [open, selectedItem, setData]);

    return (
        <Dialog open={open} onOpenChange={handleDialogOpenChange}>
            <DialogContent className={className}>
                <DialogHeader>
                    <DialogTitle>
                        {selectedItem ? 'Edit Role' : 'Create a new Role'}
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

                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-2'>
                                {permissions.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-2"
                                    >
                                        <Switch
                                            id={`permissions-${item.id}`}
                                            checked={data.permissions.includes(item.id)}
                                            onCheckedChange={(checked) => {
                                                setData((prev) => ({
                                                    ...prev,

                                                    permissions: checked
                                                        ? (prev.permissions.includes(item.id)
                                                              ? prev.permissions
                                                              : [
                                                                    ...prev.permissions,
                                                                    item.id,
                                                                ])
                                                        : prev.permissions.filter(
                                                              (i) => i !== item.id
                                                          ),
                                                }));
                                            }}
                                        />
                                        <Label
                                            htmlFor={`permissions-${item.id}`}
                                        >
                                            {item.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
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

                        <Button type="submit" disabled={processing}>
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
