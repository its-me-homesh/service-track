import { Customer } from '@/types';
import axios from 'axios';
import { useEffect, useState } from 'react';

export type CustomerOption = {
    id: number;
    name: string;
    contactNumber: string;
};

type UseCustomerOptionsParams = {
    initialSearch?: string;
};

export function useCustomerOptions({
    initialSearch = '',
}: UseCustomerOptionsParams = {}) {
    const [items, setItems] = useState<CustomerOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState(initialSearch);

    useEffect(() => {
        const controller = new AbortController();

        const timeout = setTimeout(async () => {
            try {
                setIsLoading(true);

                const response = await axios.get<Customer[]>(
                    '/customers/search',
                    {
                        params: { term: searchQuery },
                        signal: controller.signal,
                    },
                );

                setItems(
                    response.data.map((customer) => ({
                        id: customer.id,
                        name: customer.name,
                        contactNumber: customer.contactNumber,
                    })),
                );
            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.error(error);
                }
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => {
            controller.abort();
            clearTimeout(timeout);
        };

    }, [searchQuery]);

    return {
        items,
        isLoading,
        searchQuery,
        setSearchQuery,
    };
}
