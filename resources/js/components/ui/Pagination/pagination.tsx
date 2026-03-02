import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PaginationLinkData, PaginationMeta } from '@/types';
import classNames from 'classnames';

function PaginationItem(
    {
        link
    }: {
        link: PaginationLinkData
    }){
    const { active, url, label } = link;
    const className = classNames([
        'flex h-8 w-8 items-center justify-center border px-3 text-xs bg-sidebar'
    ],
        {
            'font-normal': !active,
            'font-bold cursor-not-allowed opacity-50': active
        })
    return <li>
        {
            active || !url ? <span className={className}>{label}</span> : <Link className={className} href={url as string}>
                {label}
            </Link>
        }
    </li>
}

function FirstAndLastPageItem(
    {
        isFirstPage,
        link
    } : {
        isFirstPage: boolean,
        link: PaginationLinkData
    }){

    const isDisabled = link.url === null
    const className = classNames([
        'flex h-8 items-center justify-center border px-3 text-sm font-medium',
    ], {
        'rounded-l-sm': isFirstPage,
        'rounded-r-sm': !isFirstPage,
        'cursor-not-allowed opacity-50': isDisabled,
    })
    return isDisabled ? (
        <span className={className}>
        {isFirstPage ? <ArrowLeft className='w-4 h-4'/> : <ArrowRight className='w-4 h-4'/>}
    </span>
    ) : (
        <Link href={link.url as string} className={className}>
            {isFirstPage ? <ArrowLeft className='w-4 h-4'/> : <ArrowRight className='w-4 h-4'/>}
        </Link>
    )
}

export function Pagination({ meta }: {meta: PaginationMeta}) {
    return (
        <div className="mt-4 flex items-center justify-between px-2">
            <div className='text-xs'>
                Showing <span className='font-bold'>{meta.from}</span> to <span className='font-bold'>{meta.to}</span> of <span className='font-bold'>{meta.total}</span> Records
            </div>
            <nav>
                <ul className="flex -space-x-px text-sm">
                    {meta.links.map((link, index) => {
                        if (index === 0 || index === meta.links.length - 1) {
                            return (
                                <FirstAndLastPageItem
                                    key={index}
                                    isFirstPage={index === 0}
                                    link={link}
                                />
                            )
                        }

                        return <PaginationItem key={index} link={link} />
                    })}
                </ul>
            </nav>
        </div>
    );
}
