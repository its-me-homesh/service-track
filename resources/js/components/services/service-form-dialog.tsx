import { Button } from '@/components/ui/button';

import InputError from '@/components/input-error';
import { DatePicker } from '@/components/ui/date-picker';
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
import { Textarea } from '@/components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    store as servicesStore,
    update as servicesUpdate,
} from '@/routes/services';
import { Customer, Service, ServiceFormData, ServiceStatus } from '@/types';
import { useForm } from '@inertiajs/react';
import { Info } from 'lucide-react';
import { useEffect, type FormEvent } from 'react';

import { CustomerSelect } from '@/components/select-customer';
import { SelectStatus } from '@/components/select-status';

const initialFormData: ServiceFormData = {
    customerId: null,
    serviceDate: '',
    notes: '',
    cost: null,
    changeStatus: false,
    status: 'pending',
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onClose?: () => void;
    selectedService?: Service | null;
    className?: string;
    statuses: ServiceStatus[];
    customer?: Customer | null;
};

const mapServiceToFormData = (
    service: Service,
    customer?: Customer | null,
): ServiceFormData => ({
    customerId: service.customerId ?? customer?.id ?? null,
    serviceDate: service.serviceDate ?? '',
    notes: service.notes ?? '',
    cost: service.cost ?? null,
    changeStatus: false,
    status: service.status ?? 'pending',
});

export default function ServiceFormDialog({
    open,
    onOpenChange,
    onClose,
    selectedService,
    className = '',
    statuses,
    customer,
}: Props) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<ServiceFormData>(initialFormData);
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
        if (selectedService) {
            put(servicesUpdate(selectedService.id).url, {
                onSuccess: () => {
                    handleResetAndClose();
                },
            });
        } else {
            post(servicesStore().url, {
                onSuccess: () => {
                    handleResetAndClose();
                },
            });
        }
    };

    useEffect(() => {
        if (!open) return;
        if (selectedService) {
            setData(mapServiceToFormData(selectedService, customer));
            return;
        }

        if (customer) {
            setData({
                ...initialFormData,
                customerId: customer.id,
            });
            return;
        }

        setData(initialFormData);
    }, [customer, open, selectedService, setData]);

    const showCustomerSelect = !customer && !selectedService;

    return (
        <Dialog open={open} onOpenChange={handleDialogOpenChange}>
            <DialogContent className={className}>
                <DialogHeader>
                    <DialogTitle>
                        {selectedService
                            ? 'Edit Service'
                            : 'Create a new Service'}
                    </DialogTitle>
                </DialogHeader>
                <form
                    method="post"
                    onSubmit={handleFormSubmit}
                    className="flex flex-1 flex-col overflow-hidden"
                >
                    <div className="flex-1 space-y-4 overflow-y-auto scroll-smooth px-1">
                        <div className="grid grid-cols-1 gap-4">
                            {showCustomerSelect && (
                                <div>
                                    <Label htmlFor="customerId">
                                        Select a Customer*
                                    </Label>
                                    <CustomerSelect
                                        value={data.customerId}
                                        onChange={(customerId) =>
                                            setData('customerId', customerId)
                                        }
                                        error={errors.customerId}
                                        placeholder="Select a customer"
                                        allowClear
                                    />
                                    <InputError message={errors.customerId} />
                                </div>
                            )}
                            <div>
                                <Label htmlFor="serviceDate">
                                    Service Date*
                                </Label>
                                <DatePicker
                                    id="serviceDate"
                                    name="serviceDate"
                                    placeholder="Select Service Date*"
                                    value={data.serviceDate}
                                    onChange={(value) =>
                                        setData('serviceDate', value)
                                    }
                                    error={errors.serviceDate}
                                />
                                <InputError message={errors.serviceDate} />
                            </div>

                            <div>
                                <Label htmlFor="notes">Notes/Remarks</Label>
                                <Textarea
                                    id="notes"
                                    name="notes"
                                    tabIndex={3}
                                    placeholder="Enter notes or remarks"
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData('notes', e.target.value)
                                    }
                                    rows={3}
                                />
                                <InputError message={errors.notes} />
                            </div>
                            <div>
                                <Label htmlFor="cost">Cost</Label>
                                <Input
                                    id="cost"
                                    name="cost"
                                    type="number"
                                    tabIndex={4}
                                    placeholder="Enter Cost"
                                    value={data.cost || ''}
                                    onChange={(e) =>
                                        setData('cost', Number(e.target.value))
                                    }
                                />
                                <InputError message={errors.cost} />
                            </div>
                            {selectedService && (
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="changeStatus"
                                            checked={data.changeStatus}
                                            onCheckedChange={(checked) => {
                                                setData((prev) => ({
                                                    ...prev,
                                                    changeStatus: checked,
                                                    status: checked
                                                        ? selectedService.status
                                                        : prev.status,
                                                }));
                                            }}
                                        />
                                        <Label htmlFor="changeStatus">
                                            Change Status
                                        </Label>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Info className="h-4 w-4" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Turn this on to change the
                                                status of the service.
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                    {data.changeStatus && (
                                        <div className="mt-2">
                                            <Label
                                                htmlFor="status"
                                                className="mb-2"
                                            >
                                                Select a status*
                                            </Label>
                                            <SelectStatus
                                                id="status"
                                                name="status"
                                                label="Status"
                                                placeholder="Select status"
                                                statuses={statuses}
                                                value={data.status}
                                                onChange={(value) =>
                                                    setData(
                                                        'status',
                                                        value ?? '',
                                                    )
                                                }
                                                error={errors.status}
                                                allowClear
                                            />
                                            <InputError
                                                message={errors.status}
                                            />
                                        </div>
                                    )}
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

                        {!selectedService?.deletedAt && (
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
