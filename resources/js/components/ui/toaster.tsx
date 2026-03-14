import * as Toast from '@radix-ui/react-toast';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast, type Toast as ToastType } from '@/hooks/use-toast';
import { useEffect } from 'react';

function ToastItem({
    toast,
    onDismiss,
}: {
    toast: ToastType;
    onDismiss: (id: number) => void;
}) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss(toast.id);
        }, 5000);

        return () => clearTimeout(timer);
    }, [toast, onDismiss]);

    return (
        <Toast.Root
            open
            onOpenChange={(open) => !open && onDismiss(toast.id)}
            className={cn(
                'group pointer-events-auto relative flex w-full items-start gap-3 rounded-md border border-neutral-200/70 bg-white/95 p-3 text-neutral-900 shadow-md backdrop-blur-sm transition',
                'data-[state=open]:animate-in',
                'data-[state=closed]:animate-out',
                'data-[state=open]:duration-200',
                'data-[state=closed]:duration-200',
                'data-[state=closed]:fade-out-0',
                'data-[state=open]:fade-in-0',
                'data-[state=closed]:slide-out-to-right-2',
                'data-[state=open]:slide-in-from-top-2',
                'dark:border-neutral-800 dark:bg-neutral-900/90 dark:text-neutral-100',
            )}
        >
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Toast.Title
                    className={cn(
                        'text-sm font-semibold leading-5',
                        toast.variant === 'success'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : '',
                        toast.variant === 'error'
                            ? 'text-red-600 dark:text-red-400'
                            : '',
                        toast.variant === 'info'
                            ? 'text-sky-600 dark:text-sky-400'
                            : '',
                    )}
                >
                    {toast.title}
                </Toast.Title>

                {toast.description && (
                    <Toast.Description className="text-sm text-neutral-600 dark:text-neutral-300">
                        {toast.description}
                    </Toast.Description>
                )}
            </div>

            <Toast.Close
                aria-label="Close"
                className="text-neutral-400 transition hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/50 dark:text-neutral-500 dark:hover:text-neutral-200 cursor-pointer"
            >
                <X className="h-4 w-4" />
            </Toast.Close>
        </Toast.Root>
    );
}

export function Toaster() {
    const { toasts, removeToast } = useToast();

    return (
        <Toast.Provider swipeDirection="right">
            {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} onDismiss={removeToast} />
            ))}
            <Toast.Viewport className="fixed top-4 right-4 z-50 flex w-[22rem] max-w-[calc(100vw-2rem)] flex-col gap-2 outline-none" />
        </Toast.Provider>
    );
}
