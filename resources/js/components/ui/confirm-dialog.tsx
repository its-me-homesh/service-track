import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useConfirm } from '@/hooks/use-confirm';
import { Button } from '@/components/ui/button';

export function ConfirmDialog() {
    const { isOpen, title, description, variant, resolve } = useConfirm();

    const handleConfirm = () => {
        if (resolve) {
            resolve(true);
        }
        // We don't set isOpen to false directly here.
        // The `onOpenChange` prop of AlertDialog will call `close()` from the store
        // which will handle setting isOpen to false and resolving the promise if needed.
    };

    const handleCancel = () => {
        if (resolve) {
            resolve(false);
        }
        // Similar to handleConfirm, `onOpenChange` will handle closing the dialog.
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => {
            // This handles closing the dialog via escape key or clicking outside
            if (!open) {
                // If the dialog is closed without explicit confirm/cancel,
                // we should resolve the promise as false.
                if (resolve) {
                    resolve(false);
                }
                useConfirm.setState({ isOpen: false, resolve: null });
            }
        }}>
            <AlertDialogContent>
                <AlertDialogTitle className="text-xl font-semibold">{title}</AlertDialogTitle>
                <AlertDialogDescription>
                    {description}
                </AlertDialogDescription>

                <div className="flex items-center justify-end gap-2">
                    <AlertDialogCancel asChild>
                        <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button variant={variant} onClick={handleConfirm}>
                            Confirm
                        </Button>
                    </AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}
