import { Button } from '@/components/ui/button';

import InputError from '@/components/input-error';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
    store as customersStore,
    update as customersUpdate,
} from '@/routes/customers';
import { Customer, type CustomerFormData } from '@/types';
import { useForm } from '@inertiajs/react';
import { Info } from 'lucide-react';
import { useEffect, type FormEvent } from 'react';
import { DatePicker } from '@/components/ui/date-picker';

const initialFormData: CustomerFormData = {
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
    advanceServiceSettings: false,
    autoCalculateNextServiceDate: true,
};

type Props = {
    onClose?: () => void;
    selectedCustomer: Customer | null;
    className?: string;
};

const mapCustomerToFormData = (customer: Customer): CustomerFormData => ({
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
    advanceServiceSettings: false,
    autoCalculateNextServiceDate: true,
});

export default function CustomerFormCard({
    onClose,
    selectedCustomer,
    className = '',
    ...props
}: Props) {
    const { data, setData, post, put, processing, errors, reset } =
        useForm<CustomerFormData>(initialFormData);

    const handleResetAndClose = () => {
        reset();
        if (onClose){
            onClose();
        }
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
    }, [selectedCustomer, setData]);

    const renderAdvancedServiceSettings = () => {
        return (
            <div>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="advanceServiceSettings"
                        checked={data.advanceServiceSettings}
                        onCheckedChange={(checked) => {
                            setData((prev) => ({
                                ...prev,
                                advanceServiceSettings: checked,
                                nextServiceDate: checked
                                    ? ''
                                    : prev.nextServiceDate,
                                lastServiceDate: checked
                                    ? ''
                                    : prev.lastServiceDate,
                            }));
                        }}
                    />
                    <Label htmlFor="advanceServiceSettings">
                        Advanced Service Settings
                    </Label>
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
                {data.advanceServiceSettings && (
                    <div className="mt-1 flex flex-col gap-2 rounded-sm border-2 p-2">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <Label
                                    htmlFor="lastServiceDate"
                                    className="flex items-center justify-start gap-2"
                                >
                                    Last Service Date
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="autoCalculateNextServiceDate"
                                            checked={
                                                data.autoCalculateNextServiceDate
                                            }
                                            onCheckedChange={(checked) => {
                                                setData((prev) => ({
                                                    ...prev,
                                                    autoCalculateNextServiceDate:
                                                        checked,
                                                    nextServiceDate: checked
                                                        ? ''
                                                        : prev.nextServiceDate,
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
                                                Turn this on to let the system
                                                calculate the next service date
                                                automatically using the service
                                                interval.
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </Label>
                                <DatePicker
                                    className='mt-1'
                                    id="lastServiceDate"
                                    name="lastServiceDate"
                                    placeholder="Select Last Service Date"
                                    value={data.lastServiceDate}
                                    onChange={(value) =>
                                        setData('lastServiceDate', value)
                                    }
                                    error={errors.lastServiceDate}
                                />
                                <InputError message={errors.lastServiceDate} />
                            </div>
                            {!data.autoCalculateNextServiceDate && (
                                <div>
                                    <Label htmlFor="nextServiceDate">
                                        Next Service Date*
                                    </Label>
                                    <DatePicker
                                        id="nextServiceDate"
                                        name="nextServiceDate"
                                        placeholder="Select Next Service Date*"
                                        value={data.nextServiceDate}
                                        onChange={(value) =>
                                            setData('nextServiceDate', value)
                                        }
                                        error={errors.nextServiceDate}
                                    />
                                    <InputError
                                        message={errors.nextServiceDate}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Card className={cn('p-2', className)} {...props}>
            <form
                method="post"
                onSubmit={handleFormSubmit}
                className="flex flex-1 flex-col overflow-hidden"
            >
                <div className="flex-1 space-y-4 overflow-y-auto scroll-smooth px-1">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="name">Name*</Label>
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
                            <InputError message={errors.name} />
                        </div>
                        <div>
                            <Label htmlFor="contactNumber">
                                Contact Number*
                            </Label>
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
                            <InputError message={errors.contactNumber} />
                        </div>
                        <div>
                            <Label htmlFor="alternateContactNumber">
                                Alternate Contact Number
                            </Label>
                            <Input
                                id="alternateContactNumber"
                                name="alternateContactNumber"
                                tabIndex={3}
                                placeholder="Enter Alternate Contact Number"
                                value={data.alternateContactNumber}
                                onChange={(e) =>
                                    setData(
                                        'alternateContactNumber',
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError
                                message={errors.alternateContactNumber}
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                tabIndex={4}
                                placeholder="Enter Email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                            />
                            <InputError message={errors.email} />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <Label htmlFor="address">Address*</Label>
                            <Textarea
                                id="address"
                                name="address"
                                required
                                tabIndex={5}
                                placeholder="Enter Address"
                                value={data.address}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                                rows={3}
                            />
                            <InputError message={errors.address} />
                        </div>
                        <div>
                            <Label htmlFor="productModel">Product Model*</Label>
                            <Input
                                id="productModel"
                                name="productModel"
                                required
                                tabIndex={6}
                                placeholder="Enter Product Model"
                                value={data.productModel}
                                onChange={(e) =>
                                    setData('productModel', e.target.value)
                                }
                            />
                            <InputError message={errors.productModel} />
                        </div>
                        <div>
                            <Label htmlFor="installationDate">
                                Installation Date*
                            </Label>
                            <DatePicker
                                id="installationDate"
                                name="installationDate"
                                placeholder="Select Installation Date*"
                                value={data.installationDate}
                                onChange={(value) =>
                                    setData('installationDate', value)
                                }
                                error={errors.installationDate}
                            />
                            <InputError message={errors.installationDate} />
                        </div>
                        <div>
                            <Label htmlFor="serviceInterval">
                                Service Interval
                                <small>(in days|default is 365 days)</small>
                            </Label>
                            <Input
                                id="serviceInterval"
                                name="serviceInterval"
                                tabIndex={8}
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
                            <InputError message={errors.serviceInterval} />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <Label htmlFor="notes">Notes/Remarks</Label>
                            <Textarea
                                id="notes"
                                name="notes"
                                tabIndex={9}
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
                    {!selectedCustomer && renderAdvancedServiceSettings()}
                </div>
                <div className="my-1 mt-3 flex justify-end gap-2">
                    {!selectedCustomer?.deletedAt && onClose && (
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={processing}
                            onClick={handleResetAndClose}
                        >
                            Close
                        </Button>
                    )}

                    {!selectedCustomer?.deletedAt && (
                        <Button type="submit" disabled={processing}>
                            Save
                        </Button>
                    )}
                </div>
            </form>
        </Card>
    );
}
