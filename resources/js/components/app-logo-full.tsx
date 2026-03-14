import { ImgHTMLAttributes } from 'react';

export default function AppLogoFull(
    props: ImgHTMLAttributes<HTMLImageElement>,
) {
    return <img src="/assets/logo-full.png" alt={`${props.alt} logo`} {...props} />;
}
