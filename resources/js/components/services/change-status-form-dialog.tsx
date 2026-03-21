import { Button } from '@/components/ui/button';

import { Label } from '@/components/ui/label';
import { Service, ServiceStatus, ServiceStatusFormData } from '@/types';
import { useForm } from '@inertiajs/react';
import { useEffect, type FormEvent } from 'react';
import { updateServiceStatus } from '@/routes/services';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import InputError from '@/components/input-error';
import { Textarea } from '@/components/ui/textarea';
import { SelectStatus } from '@/components/select-status';

const initialFormData: ServiceStatusFormData = {
    serviceId: null,
    status: '',
    notes: '',
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onClose?: () => void;
    selectedService: Service;
    statuses: ServiceStatus[];
    className?: string;
};

const mapServiceToFormData = (service: Service): ServiceStatusFormData => ({
    serviceId: service.id,
    status: service.status ?? 'pending',
    notes: service.notes ?? '',
});

export default function ChangeStatusFormDialog({
    open,
    onOpenChange,
    onClose,
    selectedService,
    className = '',
    statuses,
    ...props
}: Props) {
    const { data, setData, patch, processing, errors } =
        useForm<ServiceStatusFormData>(initialFormData);

    const handleResetForm = () => {
        setData(mapServiceToFormData(selectedService));
        if (onClose) {
            onClose();
        }
    };

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        patch(updateServiceStatus(selectedService.id).url, {
            onSuccess: () => {
                if (onClose) {
                    onClose();
                }
            },
            onFinish: () => {},
            onError: () => {},
        });
    };

    useEffect(() => {
        if (!open) return;
        if (selectedService) {
            setData(mapServiceToFormData(selectedService));
        } else {
            setData(initialFormData);
        }
    }, [open, selectedService, setData]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange} {...props}>
            <DialogContent className={className}>
                <DialogHeader>
                    <DialogTitle>Change Service Status</DialogTitle>
                </DialogHeader>
                <form
                    method="post"
                    onSubmit={handleFormSubmit}
                    className="flex flex-1 flex-col overflow-hidden"
                >
                    <div className="flex-1 space-y-4 overflow-y-auto scroll-smooth px-1">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <Label htmlFor="status" className="mb-2">
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
                                        setData('status', value ?? '')
                                    }
                                    error={errors.status}
                                    allowClear
                                />
                                <InputError message={errors.status} />
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
                        </div>
                    </div>
                    <DialogFooter className="my-1 mt-3">
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={processing}
                            onClick={handleResetForm}
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
