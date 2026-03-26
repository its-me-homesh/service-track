import { Button } from '@/components/ui/button';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { updateServiceSchedule as customersUpdateServiceSchedule } from '@/routes/customers';
import { Customer, CustomerAdvancedServiceSettingsFormData } from '@/types';
import { useForm } from '@inertiajs/react';
import { Info } from 'lucide-react';
import { useEffect, type FormEvent } from 'react';
import { cn } from '@/lib/utils';
import { DatePicker } from '@/components/ui/date-picker';

const initialFormData: CustomerAdvancedServiceSettingsFormData = {
    customerId: null,
    serviceInterval: 365,
    lastServiceDate: '',
    nextServiceDate: '',
    autoCalculateNextServiceDate: true,
};

type Props = {
    selectedCustomer: Customer;
    className?: string;
};

const mapCustomerToFormData = (
    customer: Customer,
): CustomerAdvancedServiceSettingsFormData => ({
    customerId: customer.id,
    serviceInterval: customer.serviceInterval ?? 365,
    lastServiceDate: customer.lastServiceDate ?? '',
    nextServiceDate: customer.nextServiceDate ?? '',
    autoCalculateNextServiceDate: false,
});

export default function CustomerAdvancedServiceSettingsForm({
    selectedCustomer,
    className = '',
    ...props
}: Props) {
    const { data, setData, patch, processing, errors } =
        useForm<CustomerAdvancedServiceSettingsFormData>(initialFormData);

    const handleResetForm = () => {
        setData(mapCustomerToFormData(selectedCustomer));
    }

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        patch(customersUpdateServiceSchedule(selectedCustomer.id).url, {
            onSuccess: () => {},
            onFinish: () => {},
            onError: () => {},
        });
    };

    useEffect(() => {
        if (!open) return;
        if (selectedCustomer) {
            setData(mapCustomerToFormData(selectedCustomer));
        } else {
            setData(initialFormData);
        }
    }, [selectedCustomer, setData]);

    return (
        <div className={cn(className)} {...props}>
            <div className="flex items-center justify-start gap-2">
                Advanced Service Settings
                <Tooltip>
                    <TooltipTrigger>
                        <Info className="h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                        Use these settings to manually override the system's
                        automatic service dates. Ideal for migrating older
                        customers or adjusting custom schedules.
                    </TooltipContent>
                </Tooltip>
            </div>
            <form
                method="post"
                onSubmit={handleFormSubmit}
                className="flex flex-1 flex-col overflow-hidden"
            >
                <div className="flex-1 space-y-4 overflow-y-auto scroll-smooth px-1">
                    <div className="mt-1 flex flex-col gap-2 rounded-sm">
                        <div>
                            <Label
                                htmlFor="lastServiceDate"
                                className="flex items-center justify-start gap-2"
                            >
                                Last Service Date
                            </Label>
                            <DatePicker
                                id="lastServiceDate"
                                name="lastServiceDate"
                                placeholder="Select Last Service Date"
                                value={data.lastServiceDate}
                                onChange={(value) =>
                                    setData('lastServiceDate', value)
                                }
                                error={errors.lastServiceDate}
                            />
                            {errors.lastServiceDate && (
                                <small className="text-red-500">
                                    {errors.lastServiceDate}
                                </small>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="autoCalculateNextServiceDate"
                                checked={data.autoCalculateNextServiceDate}
                                onCheckedChange={(checked) => {
                                    setData((prev) => ({
                                        ...prev,
                                        autoCalculateNextServiceDate: checked,
                                        nextServiceDate: checked
                                            ? ''
                                            : (selectedCustomer?.nextServiceDate ??
                                              prev.nextServiceDate),
                                    }));
                                }}
                            />
                            <Label htmlFor="autoCalculateNextServiceDate">
                                Auto-calculate Next Service Date
                            </Label>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="h-4 w-4" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    Turn this on to let the system calculate the
                                    next service date automatically using the
                                    service interval.
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        {!data.autoCalculateNextServiceDate && (
                            <div>
                                <Label htmlFor="nextServiceDate">
                                    Next Service Date
                                </Label>
                                <DatePicker
                                    id="nextServiceDate"
                                    name="nextServiceDate"
                                    placeholder="Select Next Service Date"
                                    value={data.nextServiceDate}
                                    onChange={(value) =>
                                        setData('nextServiceDate', value)
                                    }
                                    error={errors.nextServiceDate}
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
                {!selectedCustomer.deletedAt && (
                    <div className="my-1 mt-3 flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={processing}
                            onClick={handleResetForm}
                        >
                            Reset
                        </Button>

                        <Button type="submit" disabled={processing}>
                            Save
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
}
