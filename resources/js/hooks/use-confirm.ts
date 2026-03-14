import { type VariantProps } from 'class-variance-authority';
import { type ReactNode } from 'react';
import { create } from 'zustand';
import { buttonVariants } from '@/components/ui/button';

type ConfirmDialogStore = {
    isOpen: boolean;
    title: string;
    description: ReactNode;
    variant: VariantProps<typeof buttonVariants>['variant'];
    resolve: ((value: boolean) => void) | null;
};

const useConfirmDialogStore = create<ConfirmDialogStore>(() => ({
    isOpen: false,
    title: '',
    description: null,
    variant: 'destructive',
    resolve: null,
}));

export const confirm = (
    title: string,
    description: ReactNode,
    variant: VariantProps<typeof buttonVariants>['variant'] = 'destructive',
): Promise<boolean> => {
    return new Promise((resolve) => {
        useConfirmDialogStore.setState({
            isOpen: true,
            title,
            description,
            variant,
            resolve,
        });
    });
};

export const useConfirm = useConfirmDialogStore;
