import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, Customer, PaginatedData } from '@/types';
import { Head, Link } from '@inertiajs/react';

import {
    Eye,
    Phone,
    Mail,
} from 'lucide-react';
import { Pagination } from '@/components/ui/Pagination/pagination';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customers',
        href: dashboard().url,
    },
];

export default function Customers(
    {
        customers
    } : {
        customers: PaginatedData<Customer>
    }) {
    console.log("customers", customers);
    const {data, meta} = customers;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customers" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative flex-1 overflow-hidden">
                    <div className="flex items-center justify-between px-0 py-4">
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
                                name="test"
                                className="bg-neutral-secondary-medium border-default-medium text-heading rounded-base focus:ring-brand focus:border-brand placeholder:text-body block w-full max-w-96 border py-2 ps-9 pe-3 text-sm shadow-xs"
                                placeholder="Search"
                            />
                        </div>
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
                                name="test"
                                className="bg-neutral-secondary-medium border-default-medium text-heading rounded-base focus:ring-brand focus:border-brand placeholder:text-body block w-full max-w-96 border py-2 ps-9 pe-3 text-sm shadow-xs"
                                placeholder="Search"
                            />
                        </div>
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
                                name="test"
                                className="flex h-9 w-full min-w-0 rounded-sm border border-input bg-transparent px-3 py-2 ps-9 pe-3 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:ring-destructive/40"
                                placeholder="Search"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Input
                                id="search"
                                required
                                tabIndex={2}
                                placeholder="Searches"
                            />
                            {/*<InputError message={errors.password} />*/}
                        </div>
                        <div className="bg-sidebar px-5 py-5">My name</div>
                        <button className="cursor-pointer rounded-sm bg-gray-600 px-2 py-1.5 text-sm text-gray-200 hover:text-gray-50 dark:bg-gray-100 dark:text-gray-600 dark:hover:text-gray-800">
                            Filter
                        </button>
                    </div>

                    <div className="relative rounded-md">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="rounded-lg bg-sidebar-accent text-sm font-bold text-sidebar-accent-foreground">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="rounded-tl-sm px-2 py-3 text-xs font-medium uppercase"
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
                                            className="rounded-tr-sm px-2 py-1 text-xs font-medium uppercase"
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.map(
                                        (customer: Customer, index: number) => (
                                            <tr
                                                className={`${index % 2 === 0 ? 'bg-sidebar' : 'bg-background'}`}
                                            >
                                                <th
                                                    scope="row"
                                                    className="text-heading px-2 py-1 font-medium whitespace-nowrap"
                                                >
                                                    {customer.name}
                                                </th>
                                                <td className="px-2 py-1">
                                                    <div className="flex items-center justify-start gap-2">
                                                        <div className="text-md flex items-center gap-1">
                                                            <Phone className="h-4 w-4" />
                                                            <span className="">
                                                                { customer?.contactNumber }
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
                                                    { customer.installationDate }
                                                </td>
                                                <td className="px-2 py-1">
                                                    { customer?.lastServiceDate }
                                                </td>
                                                <td className="px-2 py-1">
                                                    { customer.nextServiceDate }
                                                </td>
                                                <td className="px-2 py-1">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Button className="bg-default cursor-pointer">
                                                            Delete
                                                        </Button>
                                                        <Button className="size-sm bg-destructive">
                                                            Delete
                                                        </Button>
                                                        <Button className="bg-outline">
                                                            Outline
                                                        </Button>
                                                        <Button className="cursor-pointer bg-secondary">
                                                            Delete
                                                        </Button>
                                                        <Button className="bg-ghost cursor-pointer">
                                                            Delete
                                                        </Button>
                                                        <Button className="bg-link size-sm cursor-pointer">
                                                            Delete
                                                        </Button>

                                                        <Link
                                                            href={`/customers/${customer.id}`}
                                                        >
                                                            <Eye className="h-4 w-4 text-blue-500 hover:text-blue-300" />
                                                        </Link>
                                                        <Link
                                                            href={`/customers/${customer.id}`}
                                                        >
                                                            <Eye className="h-4 w-4 text-blue-500 hover:text-blue-300" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pagination meta={meta} />
                </div>
            </div>
        </AppLayout>
    );
}
