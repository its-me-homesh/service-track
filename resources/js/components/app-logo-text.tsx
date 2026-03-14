import { ImgHTMLAttributes } from 'react';

export default function AppLogoText(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/assets/logo-text.png"
            alt={`${props.alt} logo`}
            {...props}
        />
    );
}
