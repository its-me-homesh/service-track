'use client';

import { Combobox } from '@base-ui/react/combobox';
import { XIcon } from 'lucide-react';
import * as React from 'react';
import type { ServiceStatus } from '@/types';

type SelectStatusBaseProps = {
    statuses: ServiceStatus[];
    error?: string;
    allowClear?: boolean;
    multiple?: boolean;
    placeholder?: string;
    label?: string;
    id?: string;
    name?: string;
};

type SelectStatusSingleProps = SelectStatusBaseProps & {
    multiple?: false;
    value: string | null;
    onChange: (value: string | null) => void;
};

type SelectStatusMultipleProps = SelectStatusBaseProps & {
    multiple: true;
    value: string[];
    onChange: (value: string[]) => void;
};

type SelectStatusProps = SelectStatusSingleProps | SelectStatusMultipleProps;

export function SelectStatus(props: SelectStatusProps) {
    const [open, setOpen] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const [portalContainer, setPortalContainer] =
        React.useState<HTMLElement | null>(null);
    const [inputValue, setInputValue] = React.useState('');

    const {
        statuses,
        error,
        allowClear = true,
        placeholder = 'Select statuses...',
        id = 'status',
        name = 'status',
    } = props;

    const selectedValue = React.useMemo(() => {
        if (props.multiple) {
            return null;
        }

        return statuses.find((status) => status.value === props.value) ?? null;
    }, [props.multiple, props.value, statuses]);

    React.useEffect(() => {
        if (props.multiple) {
            return;
        }

        if (open) {
            return;
        }

        setInputValue(selectedValue?.label ?? '');
    }, [open, props.multiple, selectedValue]);

    const selectedValues = React.useMemo(() => {
        if (!props.multiple) {
            return [];
        }

        const selectedIds = props.value;
        const statusMap = new Map(
            statuses.map((status) => [status.value, status]),
        );
        return selectedIds
            .map((value) => statusMap.get(value))
            .filter((status): status is ServiceStatus => Boolean(status));
    }, [props.multiple, props.value, statuses]);

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

    const popup = (
        <Combobox.Portal container={portalContainer ?? undefined}>
            <Combobox.Positioner
                className="outline-none"
                sideOffset={4}
                align="start"
            >
                <Combobox.Popup className="z-50 max-h-80 w-(--anchor-width) min-w-[12rem] overflow-y-auto rounded-md border border-input bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10">
                    {statuses.length === 0 && (
                        <Combobox.Empty className="px-3 py-2 text-sm text-muted-foreground">
                            No statuses found.
                        </Combobox.Empty>
                    )}

                    <Combobox.List>
                        {(status) => (
                            <Combobox.Item
                                key={status.value}
                                value={status}
                                className="cursor-pointer rounded px-3 py-2 text-sm text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                            >
                                {status.label}
                            </Combobox.Item>
                        )}
                    </Combobox.List>
                </Combobox.Popup>
            </Combobox.Positioner>
        </Combobox.Portal>
    );

    if (props.multiple) {
        return (
            <Combobox.Root<ServiceStatus, true>
                items={statuses}
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
                itemToStringLabel={(status) => status.label}
                itemToStringValue={(status) => status.value}
                isItemEqualToValue={(item, nextValue) =>
                    item.value === nextValue.value
                }
                onValueChange={(nextSelectedValue) => {
                    const nextValues = Array.isArray(nextSelectedValue)
                        ? nextSelectedValue
                        : [];
                    props.onChange(nextValues.map((status) => status.value));
                }}
                onInputValueChange={(nextSearchValue, { reason }) => {
                    if (reason === 'item-press') {
                        return;
                    }

                    if (nextSearchValue !== '') {
                        setOpen(true);
                    }
                }}
            >
                <Combobox.Chips className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-sm border border-input bg-transparent bg-clip-padding px-2.5 py-1.5 text-sm shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-[3px] has-aria-invalid:ring-destructive/20 dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40">
                    {selectedValues.map((status) => (
                        <Combobox.Chip
                            key={status.value}
                            className="flex h-[calc(--spacing(5.5))] w-fit items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-xs font-medium whitespace-nowrap text-foreground has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50"
                        >
                            <span className="max-w-[10rem] truncate">
                                {status.label}
                            </span>
                            <Combobox.ChipRemove
                                className="-ml-1 rounded-xs p-0.5 text-muted-foreground hover:text-foreground"
                                aria-label={`Remove ${status.label}`}
                            >
                                <XIcon className="size-3" />
                            </Combobox.ChipRemove>
                        </Combobox.Chip>
                    ))}
                    <Combobox.Input
                        id={id}
                        name={name}
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
        );
    }

    return (
        <Combobox.Root<ServiceStatus, false>
            items={statuses}
            value={selectedValue}
            multiple={false}
            open={open}
            onOpenChange={setOpen}
            inputValue={inputValue}
            inputRef={inputRef}
            itemToStringLabel={(status) => status.label}
            itemToStringValue={(status) => status.value}
            isItemEqualToValue={(item, nextValue) =>
                item.value === nextValue.value
            }
            onValueChange={(nextSelectedValue) => {
                props.onChange(
                    nextSelectedValue ? nextSelectedValue.value : null,
                );
                setOpen(false);
            }}
            onInputValueChange={(nextSearchValue, { reason }) => {
                if (reason === 'item-press') {
                    return;
                }

                setInputValue(nextSearchValue);
                if (nextSearchValue !== '') {
                    setOpen(true);
                }
            }}
        >
            <div className="relative">
                <Combobox.Input
                    id={id}
                    name={name}
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
    );
}
