import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Customer, DashboardProps } from '@/types';

import {
    Eye,
    Phone,
    Clock,
    UserRoundCheck,
    LoaderCircle,
    BadgeCheck,
    CalendarClock,
    CalendarX2
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({
    serviceDueInNextSevenDaysCustomers,
    serviceOverdueCustomers,
    serviceCounts
}: DashboardProps) {
    console.log(serviceOverdueCustomers);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Link
                        href="/services?status=pending"
                        className="relative rounded-sm bg-gray-100 p-6 text-center shadow dark:bg-gray-800"
                    >
                        <div className="flex flex-col items-center justify-center justify-self-center">
                            <div className="flex flex-row items-center justify-center">
                                <p className="ml-2 text-4xl font-bold text-gray-600 dark:text-gray-200">
                                    {serviceCounts.pending || 0}
                                </p>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-2 text-gray-500">
                                <Clock className="ml-2 h-6 w-6" />
                                <p className="text-center text-xs font-bold uppercase">
                                    Pending Services
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/services?status=assigned"
                        className="relative rounded-sm bg-gray-100 p-6 text-center shadow dark:bg-gray-800"
                    >
                        <div className="flex flex-col items-center justify-center justify-self-center">
                            <div className="flex flex-row items-center justify-center">
                                <p className="ml-2 text-4xl font-bold text-gray-600 dark:text-gray-200">
                                    {serviceCounts.assigned || 0}
                                </p>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-2 text-cyan-500">
                                <UserRoundCheck className="ml-2 h-6 w-6" />
                                <p className="text-center text-xs font-bold uppercase">
                                    Assigned Services
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/services?status=in_progress"
                        className="relative rounded-sm bg-gray-100 p-6 text-center shadow dark:bg-gray-800"
                    >
                        <div className="flex flex-col items-center justify-center justify-self-center">
                            <div className="flex flex-row items-center justify-center">
                                <p className="ml-2 text-4xl font-bold text-gray-600 dark:text-gray-200">
                                    {serviceCounts.inProgress || 0}
                                </p>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-2 text-amber-500">
                                <LoaderCircle className="ml-2 h-6 w-6" />
                                <p className="text-center text-xs font-bold uppercase">
                                    In Progress Services
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/services?status=completed"
                        className="relative rounded-sm bg-gray-100 p-6 text-center shadow dark:bg-gray-800"
                    >
                        <div className="flex flex-col items-center justify-center justify-self-center">
                            <div className="flex flex-row items-center justify-center">
                                <p className="ml-2 text-4xl font-bold text-gray-600 dark:text-gray-200">
                                    {serviceCounts.completed || 0}
                                </p>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-2 text-green-500">
                                <BadgeCheck className="ml-2 h-6 w-6" />
                                <p className="text-center text-xs font-bold uppercase">
                                    Completed Services
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/customers?status=due"
                        className="relative rounded-sm bg-gray-100 p-6 text-center shadow dark:bg-gray-800"
                    >
                        <div className="flex flex-col items-center justify-center justify-self-center">
                            <div className="flex flex-row items-center justify-center">
                                <p className="ml-2 text-4xl font-bold text-gray-600 dark:text-gray-200">
                                    5000000
                                </p>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-2 text-orange-500">
                                <CalendarClock className="ml-2 h-6 w-6" />
                                <p className="text-center text-xs font-bold uppercase">
                                    Due Services
                                </p>
                            </div>
                        </div>
                    </Link>
                    <Link
                        href="/services?status=overdue"
                        className="relative rounded-sm bg-gray-100 p-6 text-center shadow dark:bg-gray-800"
                    >
                        <div className="flex flex-col items-center justify-center justify-self-center">
                            <div className="flex flex-row items-center justify-center">
                                <p className="ml-2 text-4xl font-bold text-gray-600 dark:text-gray-200">
                                    5000000
                                </p>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-2 text-red-500">
                                <CalendarX2 className="ml-2 h-6 w-6" />
                                <p className="text-center text-xs font-bold uppercase">
                                    Overdue Services
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="relative flex-1 overflow-hidden">
                    <div className="grid auto-rows-min grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2">
                        <div className="relative rounded-sm bg-gray-100 px-0 pt-4 text-gray-600 shadow dark:bg-gray-800 dark:text-gray-100">
                            <div className="flex items-center justify-between gap-2 px-2">
                                <div className="text-sm font-medium uppercase">
                                    Service Due in next 7 days
                                </div>
                            </div>

                            <div className="mt-2 overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="rounded-sm bg-gray-600 text-sm font-bold text-gray-100 dark:bg-gray-100 dark:text-gray-600">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-2 py-3 text-xs font-medium uppercase"
                                            >
                                                Customer
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-2 py-1 text-xs font-medium uppercase"
                                            >
                                                Last Service Date
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-2 py-1 text-xs font-medium uppercase"
                                            >
                                                Next Service Date
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-2 py-1 text-end text-xs font-medium uppercase"
                                            >
                                                View
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {serviceDueInNextSevenDaysCustomers?.map(
                                            (
                                                customer: Customer,
                                                index: number,
                                            ) => (
                                                <tr
                                                    key={customer.id}
                                                    className={`${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-700'}`}
                                                >
                                                    <th
                                                        scope="row"
                                                        className="text-heading px-2 py-1 font-medium whitespace-nowrap"
                                                    >
                                                        <div className="flex items-center justify-start gap-2">
                                                            {customer.name}
                                                            <div className="flex items-center gap-1">
                                                                <Phone className="ml-2 h-4 w-4" />
                                                                {
                                                                    customer.contactNumber
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="text-xs">
                                                            {customer.address}
                                                        </div>
                                                    </th>
                                                    <td className="px-2 py-1">
                                                        {
                                                            customer.lastServiceDate
                                                        }
                                                    </td>
                                                    <td className="px-2 py-1">
                                                        {
                                                            customer.nextServiceDate
                                                        }
                                                    </td>
                                                    <td className="px-2 py-1">
                                                        <Link
                                                            href={`/customers/${customer.id}`}
                                                        >
                                                            <Eye className="h-4 w-4 text-blue-500 hover:text-blue-300" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="relative rounded-sm bg-gray-100 px-0 pt-4 text-gray-600 shadow dark:bg-gray-800 dark:text-gray-100">
                            <div className="flex items-center justify-between gap-2 px-2">
                                <div className="text-sm font-medium uppercase">
                                    Overdue Services
                                </div>
                            </div>

                            <div className="mt-2 overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="rounded-sm bg-gray-600 text-sm font-bold text-gray-100 dark:bg-gray-100 dark:text-gray-600">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-2 py-3 text-xs font-medium uppercase"
                                            >
                                                Customer
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-2 py-1 text-xs font-medium uppercase"
                                            >
                                                Last Service Date
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-2 py-1 text-xs font-medium uppercase"
                                            >
                                                Next Service Date
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-2 py-1 text-end text-xs font-medium uppercase"
                                            >
                                                View
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {serviceOverdueCustomers?.map(
                                            (
                                                customer: Customer,
                                                index: number,
                                            ) => (
                                                <tr
                                                    key={customer.id}
                                                    className={`${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-700'}`}
                                                >
                                                    <th
                                                        scope="row"
                                                        className="text-heading px-2 py-1 font-medium whitespace-nowrap"
                                                    >
                                                        <div className="flex items-center justify-start gap-2">
                                                            {customer.name}
                                                            <div className="flex items-center gap-1">
                                                                <Phone className="ml-2 h-4 w-4" />
                                                                {
                                                                    customer.contactNumber
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="text-xs">
                                                            {customer.address}
                                                        </div>
                                                    </th>
                                                    <td className="px-2 py-1">
                                                        {
                                                            customer.lastServiceDate
                                                        }
                                                    </td>
                                                    <td className="px-2 py-1">
                                                        {
                                                            customer.nextServiceDate
                                                        }
                                                    </td>
                                                    <td className="px-2 py-1">
                                                        <Link
                                                            href={`/customers/${customer.id}`}
                                                            className="flex items-center justify-center gap-1"
                                                        >
                                                            <Eye className="h-4 w-4 text-blue-500 hover:text-blue-300" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
