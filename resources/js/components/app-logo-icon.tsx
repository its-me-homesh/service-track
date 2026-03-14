import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/assets/logo.png"
            alt={`${props.alt} logo`}
            {...props}
        />
    );
}
