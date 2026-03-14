import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { Toaster as Toast } from '@/components/ui/toaster';
import { toast } from '@/hooks/use-toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const appDescription = import.meta.env.VITE_APP_DESCRIPTION || 'Laravel';
let flashListenerBound = false;

type FlashMessages = {
    success?: string;
    error?: string;
    info?: string;
};

const showFlash = (flash?: FlashMessages) => {
    if (!flash) return;
    if (flash.success) toast.success('Success', flash.success);
    if (flash.error) toast.error('Error', flash.error);
    if (flash.info) toast.info('Info', flash.info);
};

createInertiaApp({
    title: (title) =>
        title
            ? `${title} - ${appName} - ${appDescription}`
            : `${appName} - ${appDescription}`,
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <Toast />
                <ConfirmDialog />
                <App {...props} />
            </StrictMode>,
        );

        if (!flashListenerBound) {
            flashListenerBound = true;
            router.on('success', (event) => {
                showFlash(event.detail.page.props.flash as FlashMessages | undefined);
            });
        }

        showFlash(props.initialPage?.props?.flash as FlashMessages | undefined);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
