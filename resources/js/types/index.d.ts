import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Customer {
    id: number;
    name: string;
    contactNumber: string;
    email: string;
    address: string;
    productModel: string;
    installationDate: string;
    serviceInterval: number;
    lastServiceDate: string;
    nextServiceDate: string;
    createdById: number;
    createdBy: User | null;
    updatedById: number;
    updatedBy: User | null;
    createdAt: string;
    updatedAt: string;
    [key: string]: unknown;
}

export interface ServiceCounts{
    pending: number;
    assigned: number;
    inProgress: number;
    completed: number;
}
export interface DashboardProps {
    serviceDueInNextSevenDaysCustomers: Customer[];
    serviceOverdueCustomers: Customer[];
    serviceCounts: ServiceCounts;
    [key: string]: unknown;
}

export interface PaginationLinkData {
    active: boolean;
    label: string;
    page: number;
    url: null | string;
}
export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    links: PaginationLinkData[];
    path: string;
    per_page: number;
    to: number;
    total: number;
}

export type PaginatedData<T> = {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };

    meta: PaginationMeta;
};


export type TableHeader<T> = {
    label: string;
    key: keyof T;
};
