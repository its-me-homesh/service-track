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

function Ellipsis() {
    return (
        <li>
            <span className="flex h-8 w-8 items-center justify-center border bg-sidebar px-3 text-xs">
                ...
            </span>
        </li>
    );
}

export function Pagination({ meta }: {meta: PaginationMeta}) {
    const { current_page, last_page, links } = meta;

    const findLink = (pageNumber: number): PaginationLinkData | undefined => {
        return links.find(l => l.label === String(pageNumber));
    };

    const renderPageLinks = () => {
        const pageLinks: (PaginationLinkData | '...')[] = [];

        if (last_page <= 7) {
            for (let i = 1; i <= last_page; i++) {
                const link = findLink(i);
                if (link) pageLinks.push(link);
            }
            return pageLinks.map((link) =>
                link === '...' ? null : <PaginationItem key={link.label} link={link} />
            );
        }

        const firstPageLink = findLink(1);
        if (firstPageLink) pageLinks.push(firstPageLink);

        if (current_page > 3) {
            pageLinks.push('...');
        }

        let startPage = Math.max(2, current_page - 1);
        let endPage = Math.min(last_page - 1, current_page + 1);

        if (current_page <= 3) {
            startPage = 2;
            endPage = 4;
        } else if (current_page >= last_page - 2) {
            startPage = last_page - 3;
            endPage = last_page - 1;
        }

        for (let i = startPage; i <= endPage; i++) {
            const link = findLink(i);
            if (link) pageLinks.push(link);
        }

        if (current_page < last_page - 2) {
            pageLinks.push('...');
        }

        const lastPageLink = findLink(last_page);
        if (lastPageLink) pageLinks.push(lastPageLink);

        return pageLinks.map((link, index) => {
            if (link === '...') {
                return <Ellipsis key={`ellipsis-${index}`} />;
            }
            return <PaginationItem key={link.label} link={link} />;
        });
    };

    return (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 px-2">
            <div className='text-sm'>
                Showing <span className='font-bold'>{meta.from}</span> to <span className='font-bold'>{meta.to}</span> of <span className='font-bold'>{meta.total}</span> Records
            </div>
            <nav>
                <ul className="flex -space-x-px text-sm">
                    <FirstAndLastPageItem isFirstPage={true} link={links[0]} />
                    {renderPageLinks()}
                    <FirstAndLastPageItem isFirstPage={false} link={links[links.length - 1]} />
                </ul>
            </nav>
        </div>
    );
}
