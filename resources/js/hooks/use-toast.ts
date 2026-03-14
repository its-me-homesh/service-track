import { create } from 'zustand';

type ToastVariant = 'success' | 'error' | 'info';

export type Toast = {
    id: number;
    title: string;
    description?: string;
    variant: ToastVariant;
};

type ToastStore = {
    toasts: Toast[];
    addToast: (
        title: string,
        description: string | undefined,
        variant: ToastVariant,
    ) => void;
    removeToast: (id: number) => void;
};

const useToastStore = create<ToastStore>((set) => ({
    toasts: [],
    addToast: (title, description, variant) =>
        set((state) => ({
            toasts: [
                ...state.toasts,
                { id: Date.now(), title, description, variant },
            ],
        })),
    removeToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((toast) => toast.id !== id),
        })),
}));

export const toast = {
    success: (title: string, description?: string) => {
        useToastStore.getState().addToast(title, description, 'success');
    },
    error: (title: string, description?: string) => {
        useToastStore.getState().addToast(title, description, 'error');
    },
    info: (title: string, description?: string) => {
        useToastStore.getState().addToast(title, description, 'info');
    },
};

export const useToast = useToastStore;
