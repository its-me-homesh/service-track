import AppLayout from '@/layouts/app-layout';
import { index as customersIndex } from '@/routes/customers';
import { type BreadcrumbItem, Customer } from '@/types';
import { Head, Link } from '@inertiajs/react';

import { Search, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { services } from '@/routes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import CustomerFormCard from '@/components/customers/customer-form-card';
import CustomerAdvancedServiceSettingsForm from '@/components/customers/advance-service-settings-form';
import ActionsDropdown from '@/components/customers/actions-dropdown';
import { DataTable, DataTableColumn } from '@/components/ui/data-table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customers',
        href: customersIndex().url,
    },
    {
        title: 'Customer Details & Recent Services',
        href: customersIndex().url,
    },
];

export default function CustomerDetails({customer}: {customer: Customer}) {

    const columns: DataTableColumn<Customer>[] = [
        {
            key: 'name',
            header: 'Customer',
            accessorKey: 'name',
            headerClassName: 'py-3',
            cellClassName: 'text-heading whitespace-nowrap',
            isRowHeader: true,
        },
        {
            key: 'assigned_to_id',
            header: 'Assignee',
            accessorKey: 'assignedTo',
        },
        {
            key: 'service_date',
            header: 'service Date',
            accessorKey: 'serviceDate',
        },
        {
            key: 'status',
            header: 'Status',
            accessorKey: 'status',
        },
        {
            key: 'created_by_id',
            header: 'Created By',
            accessorKey: 'createdBy',
        },
        {
            key: 'updated_by_id',
            header: 'Updated By',
            accessorKey: 'updatedBy',
        },
        {
            key: 'actions',
            header: 'Actions',
            cell: (customer) => <ActionsDropdown customer={customer} />,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customer Details & Recent Services" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="relative flex-1 overflow-hidden">
                    <div className="flex items-center justify-end gap-2 px-1 py-1">
                        <ActionsDropdown
                            customer={customer}
                            context="details"
                        />
                        <Button variant="default">Add Service</Button>
                    </div>

                    <div className="mt-2 px-1">
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                            <CustomerFormCard
                                className="col-span-1 lg:col-span-2"
                                selectedCustomer={customer}
                            />
                            <div className="col-span-1">
                                <Card className="py-0">
                                    <Tabs defaultValue="activity-log">
                                        <TabsList className="rounded-b-none">
                                            <TabsTrigger value="advanced-service-settings">
                                                Advanced Service Settings
                                            </TabsTrigger>
                                            <TabsTrigger value="activity-log">
                                                Activity Log
                                            </TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="advanced-service-settings">
                                            <CustomerAdvancedServiceSettingsForm
                                                selectedCustomer={customer}
                                            />
                                        </TabsContent>
                                        <TabsContent value="activity-log">
                                            Activity Log
                                        </TabsContent>
                                    </Tabs>
                                </Card>
                            </div>
                        </div>
                    </div>

                    <div className="relative rounded-md mt-2">
                        <div className="px-1 py-2">
                            <div className="flex items-center justify-between gap-2">
                                <div>
                                    <Input
                                        placeholder="Search"
                                        prefixIcon={
                                            <Search className="h-4 w-4" />
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-2">
                                    <Link
                                        href={`${services().url}?customerId=${customer.id}`}
                                        className="flex items-center justify-end gap-2 text-sm text-blue-500 uppercase"
                                    >
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <ExternalLink className="h-4 w-4" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Click this link to view all
                                                services for this customer.
                                            </TooltipContent>
                                        </Tooltip>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <DataTable
                            columns={columns}
                            data={[]}
                            rowClassName={(_, index) =>
                                index % 2 === 0 ? 'bg-sidebar' : 'bg-background'
                            }
                            getRowKey={(service) => service.id}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
