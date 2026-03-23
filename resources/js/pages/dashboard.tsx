import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { DashboardProps } from '@/types';

import {
    CalendarClock,
    CalendarX2,
    Contact,
    Calendar1,
    CalendarCheck2,
    CalendarRange,
} from 'lucide-react';
import CustomerDueServicesList from '@/components/dashboard/customer-due-services-list';
import ServicesList from '@/components/dashboard/services-list';

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
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Link
                        href="customers"
                        className="rounded-sm bg-sidebar-accent p-6 text-sm font-bold text-sidebar-accent-foreground"
                    >
                        <div className="flex flex-col items-center justify-center justify-self-center">
                            <div className="flex flex-row items-center justify-center text-violet-500">
                                <p className="ml-2 text-4xl font-bold">
                                    {counts.totalCustomers || 0}
                                </p>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-200">
                                <Contact className="ml-2 h-6 w-6" />
                                <p className="text-center text-xs font-bold uppercase">
                                    Total Customers
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/services?status=assigned"
                        className="rounded-sm bg-sidebar-accent p-6 text-sm font-bold text-sidebar-accent-foreground"
                    >
                        <div className="flex flex-col items-center justify-center justify-self-center">
                            <div className="flex flex-row items-center justify-center text-sky-500">
                                <p className="ml-2 text-4xl font-bold">
                                    {counts.activeServices || 0}
                                </p>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-200">
                                <CalendarClock />
                                <p className="text-center text-xs uppercase">
                                    Active Services
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/services?status=in_progress"
                        className="rounded-sm bg-sidebar-accent p-6 text-sm font-bold text-sidebar-accent-foreground"
                    >
                        <div className="flex flex-col items-center justify-center justify-self-center">
                            <div className="flex flex-row items-center justify-center">
                                <p className="ml-2 text-4xl font-bold text-red-500">
                                    {counts.serviceOverdueCustomers || 0}
                                </p>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-200">
                                <CalendarX2 className="ml-2 h-6 w-6" />
                                <p className="text-center text-xs uppercase">
                                    Overdue Services
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/services?status=completed"
                        className="rounded-sm bg-sidebar-accent p-6 text-sm font-bold text-sidebar-accent-foreground"
                    >
                        <div className="flex flex-col items-center justify-center justify-self-center">
                            <div className="flex flex-row items-center justify-center">
                                <p className="ml-2 text-4xl font-bold text-yellow-500">
                                    {counts.todayServices || 0}
                                </p>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-200">
                                <Calendar1 className="h-4 w-4" />
                                <p className="text-center text-xs uppercase">
                                    Today Services
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/customers?status=due"
                        className="rounded-sm bg-sidebar-accent p-6 text-sm font-bold text-sidebar-accent-foreground"
                    >
                        <div className="flex flex-col items-center justify-center justify-self-center">
                            <div className="flex flex-row items-center justify-center text-amber-500">
                                <p className="ml-2 text-4xl font-bold">
                                    {counts.serviceUpcomingCustomers || 0}
                                </p>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-200">
                                <CalendarRange className="ml-2 h-6 w-6" />
                                <p className="text-center text-xs font-bold uppercase">
                                    Due Services in Next 7 Days
                                </p>
                            </div>
                        </div>
                    </Link>
                    <Link
                        href="/services?status=overdue"
                        className="rounded-sm bg-sidebar-accent p-6 text-sm font-bold text-sidebar-accent-foreground"
                    >
                        <div className="flex flex-col items-center justify-center justify-self-center">
                            <div className="flex flex-row items-center justify-center text-emerald-500">
                                <p className="ml-2 text-4xl font-bold">
                                    {counts.completedThisMonthServices || 0}
                                </p>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-200">
                                <CalendarCheck2 className="ml-2 h-6 w-6" />
                                <p className="text-center text-xs font-bold uppercase">
                                    Completed Services this month
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="relative flex-1 overflow-hidden">
                    <div className="grid auto-rows-min grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2">
                        <CustomerDueServicesList
                            context="overdue"
                            data={serviceOverdueCustomers}
                        />
                        <CustomerDueServicesList
                            context="upcoming"
                            data={serviceUpcomingCustomers}
                        />
                        <ServicesList data={activeServices} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
