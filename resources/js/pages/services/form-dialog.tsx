import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
    store as customersStore,
    update as customersUpdate,
} from '@/routes/customers';
import { Customer, type CustomerFormData } from '@/types';
import { useForm } from '@inertiajs/react';
import { Dispatch, SetStateAction, useEffect, type FormEvent } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

const initialFormData: CustomerFormData = {
    id: null,
    name: '',
    contactNumber: '',
    alternateContactNumber: '',
    email: '',
    address: '',
    productModel: '',
    installationDate: new Date().toISOString().split('T')[0],
    serviceInterval: 365,
    notes: '',
    lastServiceDate: '',
    nextServiceDate: '',
    resetServiceDate: false,
};

type Props = {
    open: boolean;
    onOpen: (value: boolean) => void;
    selectedCustomer: Customer | null;
    onSetSelectedCustomer: Dispatch<SetStateAction<Customer | null>>;
};

const mapCustomerToFormData = (customer: Customer): CustomerFormData => ({
    id: customer.id,
    name: customer.name ?? '',
    contactNumber: customer.contactNumber ?? '',
    alternateContactNumber: customer.alternateContactNumber ?? '',
    email: customer.email ?? '',
    address: customer.address ?? '',
    productModel: customer.productModel ?? '',
    installationDate: customer.installationDate ?? '',
    serviceInterval: customer.serviceInterval ?? 365,
    notes: customer.notes ?? '',
    lastServiceDate: customer.lastServiceDate ?? '',
    nextServiceDate: customer.nextServiceDate ?? '',
    resetServiceDate: false,
});

export default function CustomerFormDialog({
    open,
    onOpen,
    selectedCustomer,
    onSetSelectedCustomer,
}: Props) {
    const { data, setData, post, put, processing, errors, reset } =
        useForm<CustomerFormData>(initialFormData);

    const handleResetAndClose = () => {
        reset();
        onOpen(false);
        onSetSelectedCustomer(null);
    };

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (selectedCustomer) {
            put(customersUpdate(selectedCustomer.id).url, {
                onSuccess: () => {
                    handleResetAndClose();
                },
                onFinish: () => {},
                onError: () => {},
            });
        } else {
            post(customersStore().url, {
                onSuccess: () => {
                    handleResetAndClose();
                },
                onFinish: () => {},
                onError: () => {},
            });
        }
    };

    useEffect(() => {
        if (!open) return;
        if (selectedCustomer) {
            setData(mapCustomerToFormData(selectedCustomer));
        } else {
            setData(initialFormData);
        }
    }, [open, selectedCustomer, setData]);

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                onOpen(value);
                handleResetAndClose();
            }}
        >
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                className="flex max-h-[90vh] flex-col sm:max-w-4xl"
            >
                <DialogHeader>
                    <DialogTitle>
                        {selectedCustomer ? 'Edit' : 'Add'} Customer
                    </DialogTitle>
                    <DialogDescription>
                        <small className="text-red-500">
                            All the fields marked as *(asterisk) are required.
                        </small>
                    </DialogDescription>
                </DialogHeader>

                <form
                    method="post"
                    onSubmit={handleFormSubmit}
                    className="flex flex-1 flex-col overflow-hidden"
                >
                    <div className="flex-1 space-y-4 overflow-y-auto scroll-smooth px-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name">Name*</label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    tabIndex={1}
                                    placeholder="Enter Customer Name*"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                />
                                {errors.name && (
                                    <small className="text-red-500">
                                        {errors.name}
                                    </small>
                                )}
                            </div>
                            <div>
                                <label htmlFor="contactNumber">
                                    Contact Number*
                                </label>
                                <Input
                                    id="contactNumber"
                                    name="contactNumber"
                                    required
                                    tabIndex={2}
                                    placeholder="Enter Contact Number*"
                                    value={data.contactNumber}
                                    onChange={(e) =>
                                        setData('contactNumber', e.target.value)
                                    }
                                />
                                {errors.contactNumber && (
                                    <small className="text-red-500">
                                        {errors.contactNumber}
                                    </small>
                                )}
                            </div>
                            <div>
                                <label htmlFor="alternateContactNumber">
                                    Alternate Contact Number
                                </label>
                                <Input
                                    id="alternateContactNumber"
                                    name="alternateContactNumber"
                                    tabIndex={2}
                                    placeholder="Enter Alternate Contact Number"
                                    value={data.alternateContactNumber}
                                    onChange={(e) =>
                                        setData(
                                            'alternateContactNumber',
                                            e.target.value,
                                        )
                                    }
                                />
                                {errors.contactNumber && (
                                    <small className="text-red-500">
                                        {errors.contactNumber}
                                    </small>
                                )}
                            </div>
                            <div>
                                <label htmlFor="email">Email</label>
                                <Input
                                    id="email"
                                    name="email"
                                    tabIndex={3}
                                    placeholder="Enter Email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                />
                                {errors.email && (
                                    <small className="text-red-500">
                                        {errors.email}
                                    </small>
                                )}
                            </div>
                            <div className="col-span-2">
                                <label htmlFor="address">Address*</label>
                                <Textarea
                                    id="address"
                                    name="address"
                                    required
                                    tabIndex={4}
                                    placeholder="Enter Address"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                    rows={3}
                                />
                                {errors.address && (
                                    <small className="text-red-500">
                                        {errors.address}
                                    </small>
                                )}
                            </div>
                            <div>
                                <label htmlFor="productModel">
                                    Product Model*
                                </label>
                                <Input
                                    id="productModel"
                                    name="productModel"
                                    required
                                    tabIndex={5}
                                    placeholder="Enter Product Model"
                                    value={data.productModel}
                                    onChange={(e) =>
                                        setData('productModel', e.target.value)
                                    }
                                />
                                {errors.productModel && (
                                    <small className="text-red-500">
                                        {errors.productModel}
                                    </small>
                                )}
                            </div>
                            <div>
                                <label htmlFor="installationDate">
                                    Installation Date*
                                </label>
                                <Input
                                    id="installationDate"
                                    name="installationDate"
                                    required
                                    tabIndex={6}
                                    placeholder="Select installation_date"
                                    type="date"
                                    value={data.installationDate}
                                    onChange={(e) =>
                                        setData(
                                            'installationDate',
                                            e.target.value,
                                        )
                                    }
                                />
                                {errors.installationDate && (
                                    <small className="text-red-500">
                                        {errors.installationDate}
                                    </small>
                                )}
                            </div>
                            <div>
                                <label htmlFor="serviceInterval">
                                    Service Interval
                                </label>
                                <Input
                                    id="serviceInterval"
                                    name="serviceInterval"
                                    tabIndex={7}
                                    placeholder="Enter Service Interval"
                                    type="number"
                                    value={data.serviceInterval}
                                    onChange={(e) =>
                                        setData(
                                            'serviceInterval',
                                            Number(e.target.value),
                                        )
                                    }
                                />
                                {errors.serviceInterval && (
                                    <small className="text-red-500">
                                        {errors.serviceInterval}
                                    </small>
                                )}
                            </div>
                            <div className="col-span-2">
                                <label htmlFor="notes">Notes/Remarks</label>
                                <Textarea
                                    id="notes"
                                    name="notes"
                                    required
                                    tabIndex={4}
                                    placeholder="Enter notes or remarks"
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData('notes', e.target.value)
                                    }
                                    rows={3}
                                />
                                {errors.notes && (
                                    <small className="text-red-500">
                                        {errors.notes}
                                    </small>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="resetServiceDate"
                                    checked={data.autoCalculateNextServiceDate}
                                    onCheckedChange={(checked) => {
                                        setData((prev) => ({
                                            ...prev,
                                            resetServiceDate: checked,
                                            nextServiceDate: checked
                                                ? ''
                                                : prev.nextServiceDate,
                                        }));
                                    }}
                                />
                                <label htmlFor="resetServiceDate">
                                    Advanced Service Settings
                                </label>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Info className="h-4 w-4" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Use these settings to manually override
                                        the system's automatic service dates.
                                        Ideal for migrating older customers or
                                        adjusting custom schedules.
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <div className="flex flex-col gap-2 border-2 p-2">
                                <div>
                                    <label htmlFor="lastServiceDate">
                                        Last Service Date
                                    </label>
                                    <Input
                                        id="lastServiceDate"
                                        name="lastServiceDate"
                                        tabIndex={8}
                                        placeholder="Select Last Service Date"
                                        type="date"
                                        value={data.lastServiceDate}
                                        onChange={(e) =>
                                            setData(
                                                'lastServiceDate',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.lastServiceDate && (
                                        <small className="text-red-500">
                                            {errors.lastServiceDate}
                                        </small>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="resetServiceDate"
                                            checked={data.resetServiceDate}
                                            onCheckedChange={(checked) => {
                                                setData((prev) => ({
                                                    ...prev,
                                                    resetServiceDate: checked,
                                                    nextServiceDate: checked
                                                        ? ''
                                                        : prev.nextServiceDate,
                                                }));
                                            }}
                                        />
                                        <label htmlFor="resetServiceDate">
                                            Reset Service Date
                                        </label>
                                    </div>
                                    {errors.resetServiceDate && (
                                        <small className="text-red-500">
                                            {errors.resetServiceDate}
                                        </small>
                                    )}
                                </div>
                                {!data.resetServiceDate && (
                                    <div>
                                        <label htmlFor="nextServiceDate">
                                            Next Service Date
                                        </label>
                                        <Input
                                            id="nextServiceDate"
                                            name="nextServiceDate"
                                            tabIndex={9}
                                            placeholder="Select Next Service Date"
                                            type="date"
                                            value={data.nextServiceDate}
                                            onChange={(e) =>
                                                setData(
                                                    'nextServiceDate',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {errors.nextServiceDate && (
                                            <small className="text-red-500">
                                                {errors.nextServiceDate}
                                            </small>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="mt-3">
                        <div className="flex justify-end gap-2">
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    disabled={processing}
                                >
                                    Close
                                </Button>
                            </DialogClose>

                            <Button type="submit" disabled={processing}>
                                Save
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
