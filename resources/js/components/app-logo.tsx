import AppLogoIcon from './app-logo-icon';
import AppLogoText from '@/components/app-logo-text';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-sm">
                <AppLogoIcon />
            </div>
            <div className="ml-1 grid flex-1">
                <span className="mt-1.5 truncate leading-tight font-semibold">
                    <AppLogoText />
                </span>
            </div>
        </>
    );
}
