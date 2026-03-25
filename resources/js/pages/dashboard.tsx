import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, Customer, Service } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { DashboardProps } from '@/types';

import {
    CalendarClock,
    CalendarX2,
    Contact,
    Calendar1,
    CalendarCheck2,
    CalendarRange,
    UserRoundPlus,
    CalendarPlus,
} from 'lucide-react';
import CustomerDueServicesList from '@/components/dashboard/customer-due-services-list';
import ServicesList from '@/components/dashboard/services-list';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import ChangeStatusFormDialog from '@/components/services/change-status-form-dialog';
import CustomerFormCard from '@/components/customers/customer-form-card';
import ServiceFormDialog from '@/components/services/service-form-dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({
    counts,
    serviceOverdueCustomers,
    serviceUpcomingCustomers,
    activeServices,
    serviceStatuses,
}: DashboardProps) {
    const [serviceFormOpened, setServiceFormOpened] = useState<boolean>(false);

    const [statusFormOpened, setStatusFormOpened] = useState<boolean>(false);

    const [selectedService, setSelectedService] = useState<Service | null>(
        null,
    );

    const [customerFormOpened, setCustomerFormOpened] =
        useState<boolean>(false);

    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
        null,
    );

    const handleOpenServiceForm = (service?: Service) => {
        setSelectedService(service ?? null);
        setSelectedCustomer(null);
        setServiceFormOpened(true);
    };

    const handleOpenServiceFormForCustomer = (customer?: Customer) => {
        setSelectedCustomer(customer ?? null);
        setSelectedService(null);
        setServiceFormOpened(true);
    };

    const handleCloseServiceForm = () => {
        setSelectedService(null);
        setServiceFormOpened(false);
    };

    const handleOpenStatusForm = (service: Service) => {
        setSelectedService(service);
        setStatusFormOpened(true);
    };

    const handleCloseStatusForm = () => {
        setSelectedService(null);
        setStatusFormOpened(false);
    };

    const handleOpenCustomerForm = (customer?: Customer) => {
        setSelectedCustomer(customer ?? null);
        setCustomerFormOpened(true);
    };

    const handleCloseCustomerForm = () => {
        setSelectedCustomer(null);
        setCustomerFormOpened(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative flex-1 overflow-hidden">
                    <div className="flex items-center justify-end gap-2 px-1 py-1">
                        {!customerFormOpened && (
                            <Button
                                variant="secondary"
                                onClick={() => handleOpenCustomerForm()}
                            >
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <UserRoundPlus className="h-4 w-4" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Click to add a new customer.
                                    </TooltipContent>
                                </Tooltip>
                            </Button>
                        )}
                        <Button
                            variant="secondary"
                            onClick={() => handleOpenServiceForm()}
                        >
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <CalendarPlus className="h-4 w-4" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    Click to add a new service.
                                </TooltipContent>
                            </Tooltip>
                        </Button>
                    </div>
                    {selectedService && statusFormOpened && (
                        <ChangeStatusFormDialog
                            open={statusFormOpened}
                            onOpenChange={setStatusFormOpened}
                            onClose={handleCloseStatusForm}
                            selectedService={selectedService}
                            statuses={serviceStatuses}
                        />
                    )}

                    {serviceFormOpened && (
                        <ServiceFormDialog
                            open={serviceFormOpened}
                            onOpenChange={setServiceFormOpened}
                            onClose={handleCloseServiceForm}
                            selectedService={selectedService}
                            statuses={serviceStatuses}
                            customer={selectedCustomer}
                        />
                    )}

                    {customerFormOpened && (
                        <div className="mt-2 px-1">
                            <CustomerFormCard
                                onClose={handleCloseCustomerForm}
                                selectedCustomer={selectedCustomer}
                            />
                        </div>
                    )}

                    <div className="relative mt-3 rounded-sm">
                        <div className="grid auto-rows-min grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <Link
                                href="/customers"
                                className="rounded-sm bg-sidebar-accent p-6 text-sm font-bold text-sidebar-accent-foreground"
                            >
                                <div className="flex flex-col items-center justify-center justify-self-center">
                                    <div className="flex flex-row items-center justify-center">
                                        <p className="font-bold text-violet-500 text-4xl">
                                            {counts.totalCustomers || 0}
                                        </p>
                                    </div>
                                    <div className="mt-4 flex items-center justify-center gap-1 text-gray-600 dark:text-gray-200">
                                        <Contact className="h-5 w-5" />
                                        <p className="text-center text-xs font-bold uppercase">
                                            Total Customers
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href="/services?status[]=pending&status[]=in_progress&status[]=on_hold&status[]=rescheduled"
                                className="rounded-sm bg-sidebar-accent p-6 text-sm font-bold text-sidebar-accent-foreground"
                            >
                                <div className="flex flex-col items-center justify-center justify-self-center">
                                    <div className="flex flex-row items-center justify-center">
                                        <p className="text-4xl font-bold text-sky-500">
                                            {counts.activeServices || 0}
                                        </p>
                                    </div>
                                    <div className="mt-4 flex items-center justify-center gap-1 text-gray-600 dark:text-gray-200">
                                        <CalendarClock className="h-5 w-5" />
                                        <p className="text-center text-xs uppercase">
                                            Active Services
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href="/customers?serviceOverdue=true"
                                className="rounded-sm bg-sidebar-accent p-6 text-sm font-bold text-sidebar-accent-foreground"
                            >
                                <div className="flex flex-col items-center justify-center justify-self-center">
                                    <div className="flex flex-row items-center justify-center">
                                        <p className="text-4xl font-bold text-red-500">
                                            {counts.serviceOverdueCustomers || 0}
                                        </p>
                                    </div>
                                    <div className="mt-4 flex items-center justify-center gap-1 text-gray-600 dark:text-gray-200">
                                        <CalendarX2 className="h-5 w-5" />
                                        <p className="text-center text-xs uppercase">
                                            Overdue Services
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href="/services"
                                className="rounded-sm bg-sidebar-accent p-6 text-sm font-bold text-sidebar-accent-foreground"
                            >
                                <div className="flex flex-col items-center justify-center justify-self-center">
                                    <div className="flex flex-row items-center justify-center">
                                        <p className="text-4xl font-bold text-yellow-500">
                                            {counts.todayServices || 0}
                                        </p>
                                    </div>
                                    <div className="mt-4 flex items-center justify-center gap-1 text-gray-600 dark:text-gray-200">
                                        <Calendar1 className="h-5 w-5" />
                                        <p className="text-center text-xs uppercase">
                                            Today Services
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href="/customers?serviceDue=true"
                                className="rounded-sm bg-sidebar-accent p-6 text-sm font-bold text-sidebar-accent-foreground"
                            >
                                <div className="flex flex-col items-center justify-center justify-self-center">
                                    <div className="flex flex-row items-center justify-center text-amber-500">
                                        <p className="text-4xl font-bold">
                                            {counts.serviceUpcomingCustomers || 0}
                                        </p>
                                    </div>
                                    <div className="mt-4 flex items-center justify-center gap-1 text-gray-600 dark:text-gray-200">
                                        <CalendarRange className="h-5 w-5" />
                                        <p className="text-center text-xs font-bold uppercase">
                                            Due Services in Next 7 Days
                                        </p>
                                    </div>
                                </div>
                            </Link>
                            <Link
                                href="/services?status[]=completed"
                                className="rounded-sm bg-sidebar-accent p-6 text-sm font-bold text-sidebar-accent-foreground"
                            >
                                <div className="flex flex-col items-center justify-center justify-self-center">
                                    <div className="flex flex-row items-center justify-center text-emerald-500">
                                        <p className="text-4xl font-bold">
                                            {counts.completedThisMonthServices || 0}
                                        </p>
                                    </div>
                                    <div className="mt-4 flex items-center justify-center gap-1 text-gray-600 dark:text-gray-200">
                                        <CalendarCheck2 className="h-5 w-5" />
                                        <p className="text-center text-xs font-bold uppercase">
                                            Completed Services this month
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="grid auto-rows-min grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2">
                            <CustomerDueServicesList
                                context="overdue"
                                data={serviceOverdueCustomers}
                                onOpenCustomerForm={handleOpenCustomerForm}
                                onOpenServiceForm={
                                    handleOpenServiceFormForCustomer
                                }
                                statuses={serviceStatuses}
                            />
                            <CustomerDueServicesList
                                context="upcoming"
                                data={serviceUpcomingCustomers}
                                onOpenCustomerForm={handleOpenCustomerForm}
                                onOpenServiceForm={
                                    handleOpenServiceFormForCustomer
                                }
                                statuses={serviceStatuses}
                            />
                            <ServicesList
                                data={activeServices}
                                onOpenServiceForm={handleOpenServiceForm}
                                onOpenStatusForm={handleOpenStatusForm}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
