import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

import {
    Eye,
    Phone,
    Mail,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customers',
        href: dashboard().url,
    },
];

export default function Customers({serviceDueInNextSeveralDays}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customers" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative flex-1 overflow-hidden">
                    <div className="flex items-center justify-between py-4 px-0">
                        <label htmlFor="input-group-1" className="sr-only">
                            Search
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                                <svg
                                    className="text-body h-4 w-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke="currentColor"
                                        stroke-linecap="round"
                                        stroke-width="2"
                                        d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="input-group-1"
                                className="bg-neutral-secondary-medium border-default-medium text-heading rounded-base focus:ring-brand focus:border-brand placeholder:text-body block w-full max-w-96 border py-2 ps-9 pe-3 text-sm shadow-xs"
                                placeholder="Search"
                            />
                        </div>
                        <button className="bg-gray-800">
                            Filter
                        </button>

                    </div>

                    <div className="relative rounded-md bg-gray-100 px-0 text-gray-600 shadow dark:bg-gray-800 dark:text-gray-100">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="rounded-lg bg-gray-600 text-sm font-bold text-gray-100 dark:bg-gray-100 dark:text-gray-600">
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
                                            Contact
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-2 py-1 text-xs font-medium uppercase"
                                        >
                                            Installation Date
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
                                            className="px-2 py-1 text-xs font-medium uppercase"
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {serviceDueInNextSeveralDays?.map(
                                        (customer: object, index: number) => (
                                            <tr
                                                className={`${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-700'}`}
                                            >
                                                <th
                                                    scope="row"
                                                    className="text-heading px-2 py-1 font-medium whitespace-nowrap"
                                                >
                                                    <div className="flex items-center justify-start gap-2">
                                                        {customer.name}
                                                    </div>
                                                    <div className="text-xs">
                                                        {customer.address}
                                                    </div>
                                                </th>
                                                <td className="px-2 py-1">
                                                    <div className="flex items-center justify-start gap-2">
                                                        <div className="text-md flex items-center gap-1">
                                                            <Phone className="h-4 w-4" />
                                                            <span className="">
                                                                {
                                                                    customer.contact_number
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {customer.email && (
                                                        <div className="flex items-center justify-start gap-2">
                                                            <div className="text-sx flex items-center gap-1">
                                                                <Mail className="h-4 w-4" />
                                                                <span className="">
                                                                    {
                                                                        customer.email
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-2 py-1">
                                                    {customer.installation_date}
                                                </td>
                                                <td className="px-2 py-1">
                                                    {customer.last_service_date}
                                                </td>
                                                <td className="px-2 py-1">
                                                    {customer.next_service_date}
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
                    <div className="mt-4 flex items-center justify-between px-2">
                        <div>Showing 1 to 10 of 100 Entries</div>
                        <nav aria-label="Page navigation example">
                            <ul className="flex -space-x-px text-sm">
                                <li>
                                    <a
                                        href="#"
                                        className="text-body bg-neutral-secondary-medium border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading rounded-s-base box-border flex h-9 items-center justify-center border px-3 text-sm font-medium focus:outline-none"
                                    >
                                        Previous
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-body bg-neutral-secondary-medium border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading box-border flex h-9 w-9 items-center justify-center border text-sm font-medium focus:outline-none"
                                    >
                                        1
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-body bg-neutral-secondary-medium border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading box-border flex h-9 w-9 items-center justify-center border text-sm font-medium focus:outline-none"
                                    >
                                        2
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        aria-current="page"
                                        className="text-fg-brand bg-neutral-tertiary-medium border-default-medium hover:text-fg-brand box-border flex h-9 w-9 items-center justify-center border text-sm font-medium focus:outline-none"
                                    >
                                        3
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-body bg-neutral-secondary-medium border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading box-border flex h-9 w-9 items-center justify-center border text-sm font-medium focus:outline-none"
                                    >
                                        4
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-body bg-neutral-secondary-medium border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading box-border flex h-9 w-9 items-center justify-center border text-sm font-medium focus:outline-none"
                                    >
                                        5
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-body bg-neutral-secondary-medium border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading rounded-e-base box-border flex h-9 items-center justify-center border px-3 text-sm font-medium focus:outline-none"
                                    >
                                        Next
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
