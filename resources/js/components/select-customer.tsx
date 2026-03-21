'use client';

import {
    useCustomerOptions,
    type CustomerOption as CustomerOptionData,
} from '@/hooks/use-customer-options';
import { Combobox } from '@base-ui/react/combobox';
import { XIcon } from 'lucide-react';
import * as React from 'react';

type CustomerOption = CustomerOptionData;

type SelectCustomerBaseProps = {
    error?: string;
    allowClear?: boolean;
    multiple?: boolean;
    placeholder?: string;
};

type SelectCustomerSingleProps = SelectCustomerBaseProps & {
    multiple?: false;
    value: number | null;
    onChange: (value: number | null) => void;
};

type SelectCustomerMultipleProps = SelectCustomerBaseProps & {
    multiple: true;
    value: number[];
    onChange: (value: number[]) => void;
};

type SelectCustomerProps =
    | SelectCustomerSingleProps
    | SelectCustomerMultipleProps;

export function CustomerSelect(props: SelectCustomerProps) {
    const { items, isLoading, setSearchQuery } = useCustomerOptions();
    const [open, setOpen] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const popupRef = React.useRef<HTMLDivElement | null>(null);
    const [portalContainer, setPortalContainer] =
        React.useState<HTMLElement | null>(null);

    const {
        error,
        allowClear = false,
        placeholder = 'Search customers...',
    } = props;

    const [selectedCache, setSelectedCache] = React.useState<
        Map<number, CustomerOption>
    >(new Map());

    React.useEffect(() => {
        if (items.length === 0) {
            return;
        }

        setSelectedCache((prev) => {
            const next = new Map(prev);
            let changed = false;

            items.forEach((customer) => {
                const existing = next.get(customer.id);
                if (
                    !existing ||
                    existing.name !== customer.name ||
                    existing.contactNumber !== customer.contactNumber
                ) {
                    next.set(customer.id, customer);
                    changed = true;
                }
            });

            return changed ? next : prev;
        });
    }, [items]);

    const optionsById = React.useMemo(() => {
        const map = new Map<number, CustomerOption>();
        selectedCache.forEach((customer, id) => {
            map.set(id, customer);
        });
        items.forEach((customer) => {
            map.set(customer.id, customer);
        });
        return map;
    }, [items, selectedCache]);

    const selectedValue = React.useMemo(() => {
        if (props.multiple) {
            return null;
        }

        return optionsById.get(props.value ?? -1) ?? null;
    }, [optionsById, props.multiple, props.value]);

    const selectedValues = React.useMemo(() => {
        if (!props.multiple) {
            return [];
        }

        const selectedIds = props.value;
        return selectedIds
            .map((id) => optionsById.get(id))
            .filter((customer): customer is CustomerOption =>
                Boolean(customer),
            );
    }, [optionsById, props.multiple, props.value]);

    const availableItems = React.useMemo(() => {
        const map = new Map<number, CustomerOption>();

        if (props.multiple) {
            selectedValues.forEach((customer) => {
                map.set(customer.id, customer);
            });
        } else if (selectedValue) {
            map.set(selectedValue.id, selectedValue);
        }

        items.forEach((customer) => {
            map.set(customer.id, customer);
        });

        return Array.from(map.values());
    }, [items, props.multiple, selectedValue, selectedValues]);

    const maxVisibleChips = 2;
    const visibleChips = selectedValues.slice(0, maxVisibleChips);
    const remainingChipCount = Math.max(
        0,
        selectedValues.length - visibleChips.length,
    );

    React.useEffect(() => {
        if (!open) return;

        const dialogContent = inputRef.current?.closest(
            '[data-slot="dialog-content"]',
        );
        if (dialogContent instanceof HTMLElement) {
            setPortalContainer(dialogContent);
        } else {
            setPortalContainer(null);
        }
    }, [open]);

    React.useEffect(() => {
        if (!open) return;

        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target as Node;

            if (rootRef.current?.contains(target)) {
                return;
            }

            if (popupRef.current?.contains(target)) {
                return;
            }

            setOpen(false);
        };

        document.addEventListener('pointerdown', handlePointerDown);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
        };
    }, [open]);

    const popup = (
        <Combobox.Portal container={portalContainer ?? undefined}>
            <Combobox.Positioner
                className="outline-none"
                sideOffset={4}
                align="start"
            >
                <Combobox.Popup
                    ref={popupRef}
                    className="z-50 max-h-80 w-(--anchor-width) min-w-[12rem] overflow-y-auto rounded-md border border-input bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10"
                >
                    {isLoading && (
                        <Combobox.Status className="px-3 py-2 text-sm text-muted-foreground">
                            Searching...
                        </Combobox.Status>
                    )}

                    {!isLoading && availableItems.length === 0 && (
                        <Combobox.Empty className="px-3 py-2 text-sm text-muted-foreground">
                            No customers found.
                        </Combobox.Empty>
                    )}

                    <Combobox.List>
                        {(customer) => (
                            <Combobox.Item
                                key={customer.id}
                                value={customer}
                                className="cursor-pointer rounded px-3 py-2 text-sm text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[selected]:bg-accent data-[selected]:text-accent-foreground data-[selected]:font-medium data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                            >
                                <div className="flex flex-col">
                                    <span>{customer.name}</span>
                                    <small>{customer.contactNumber}</small>
                                </div>
                            </Combobox.Item>
                        )}
                    </Combobox.List>
                </Combobox.Popup>
            </Combobox.Positioner>
        </Combobox.Portal>
    );

    if (props.multiple) {
        return (
            <div ref={rootRef}>
                <Combobox.Root<CustomerOption, true>
                    items={availableItems}
                    value={selectedValues}
                    multiple
                    open={open}
                    onOpenChange={(nextOpen, { reason }) => {
                        if (!nextOpen && reason === 'item-press') {
                            return;
                        }

                        setOpen(nextOpen);
                    }}
                    inputRef={inputRef}
                    itemToStringLabel={(customer) => customer.name}
                    itemToStringValue={(customer) => String(customer.id)}
                    isItemEqualToValue={(item, nextValue) =>
                        item.id === nextValue.id
                    }
                    filter={null}
                    onValueChange={(nextSelectedValue) => {
                        const nextValues = Array.isArray(nextSelectedValue)
                            ? nextSelectedValue
                            : [];
                        props.onChange(
                            nextValues.map((customer) => customer.id),
                        );
                    }}
                    onInputValueChange={(nextSearchValue, { reason }) => {
                        if (reason === 'item-press') {
                            return;
                        }

                        setSearchQuery(nextSearchValue);
                        setOpen(true);
                    }}
                >
                    <Combobox.Chips className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-sm border border-input bg-transparent bg-clip-padding px-2.5 py-1.5 text-sm shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-[3px] has-aria-invalid:ring-destructive/20 dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40">
                        {visibleChips.map((customer) => (
                            <Combobox.Chip
                                key={customer.id}
                                className="flex h-[calc(--spacing(5.5))] w-fit items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-xs font-medium whitespace-nowrap text-foreground has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50"
                            >
                                <span className="max-w-[10rem] truncate">
                                    {customer.name}
                                </span>
                                <Combobox.ChipRemove
                                    className="-ml-1 rounded-xs p-0.5 text-muted-foreground hover:text-foreground"
                                    aria-label={`Remove ${customer.name}`}
                                >
                                    <XIcon className="size-3" />
                                </Combobox.ChipRemove>
                            </Combobox.Chip>
                        ))}
                        {remainingChipCount > 0 && (
                            <span className="flex h-[calc(--spacing(5.5))] items-center rounded-sm bg-muted px-1.5 text-xs font-medium whitespace-nowrap text-foreground">
                                +{remainingChipCount} selected
                            </span>
                        )}
                        <Combobox.Input
                            id="customerId"
                            placeholder={placeholder}
                            className="min-w-16 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                            aria-invalid={Boolean(error)}
                            onFocus={() => setOpen(true)}
                        />
                        {allowClear && (
                            <Combobox.Clear
                                className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-xs text-muted-foreground transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                aria-label="Clear selection"
                            >
                                <XIcon className="size-4" />
                            </Combobox.Clear>
                        )}
                    </Combobox.Chips>
                    {popup}
                </Combobox.Root>
            </div>
        );
    }

    return (
        <div ref={rootRef}>
            <Combobox.Root<CustomerOption, false>
                items={availableItems}
                value={selectedValue}
                multiple={false}
                open={open}
                onOpenChange={setOpen}
                inputRef={inputRef}
                itemToStringLabel={(customer) => customer.name}
                itemToStringValue={(customer) => String(customer.id)}
                isItemEqualToValue={(item, nextValue) =>
                    item.id === nextValue.id
                }
                filter={null}
                onValueChange={(nextSelectedValue) => {
                    props.onChange(
                        nextSelectedValue ? nextSelectedValue.id : null,
                    );
                    setOpen(false);
                }}
                onInputValueChange={(nextSearchValue, { reason }) => {
                    if (reason === 'item-press') {
                        return;
                    }

                    setSearchQuery(nextSearchValue);
                    setOpen(true);
                }}
            >
                <div className="relative">
                    <Combobox.Input
                        id="customerId"
                        placeholder={placeholder}
                        className={`flex h-9 w-full min-w-0 rounded-sm border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 md:text-sm${allowClear ? 'pr-9' : ''}`}
                        aria-invalid={Boolean(error)}
                        onFocus={() => setOpen(true)}
                    />
                    {allowClear && (
                        <Combobox.Clear
                            className="absolute top-1/2 right-2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-xs text-muted-foreground transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                            aria-label="Clear selection"
                        >
                            <XIcon className="size-4" />
                        </Combobox.Clear>
                    )}
                </div>
                {popup}
            </Combobox.Root>
        </div>
    );
}
