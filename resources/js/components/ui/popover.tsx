import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverPortal({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Portal>) {
  return <PopoverPrimitive.Portal data-slot="popover-portal" {...props} />
}

function PopoverTrigger({
                           ...props
                       }: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
    return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverClose({
                           ...props
                       }: React.ComponentProps<typeof PopoverPrimitive.Close>) {
    return <PopoverPrimitive.Trigger data-slot="popover-close" {...props} />
}

function PopoverAnchor({
                           ...props
                       }: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
    return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverArrow({
                           ...props
                       }: React.ComponentProps<typeof PopoverPrimitive.Arrow>) {
    return <PopoverPrimitive.Arrow data-slot="popover-arrow" {...props} />
}

function PopoverContent({
                            className,
                            children,
                            sideOffset = 8,
                            ...props
                        }: React.ComponentProps<typeof PopoverPrimitive.Content>) {
    return (
        <PopoverPortal>
            <PopoverPrimitive.Content
                sideOffset={sideOffset}
                className={cn(
                    "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-lg outline-none",
                    "data-[state=open]:animate-in data-[state=closed]:animate-out",
                    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                    "data-[side=bottom]:slide-in-from-top-2",
                    "data-[side=left]:slide-in-from-right-2",
                    "data-[side=right]:slide-in-from-left-2",
                    "data-[side=top]:slide-in-from-bottom-2",
                    "origin-[var(--radix-popover-content-transform-origin)]",
                    className
                )}
                {...props}
            >
                {children}
                <PopoverArrow
                    className="fill-border"
                    width={12}
                    height={6}
                />
            </PopoverPrimitive.Content>
        </PopoverPortal>
    )
}

export {
    Popover,
    PopoverPortal,
    PopoverContent,
    PopoverTrigger,
    PopoverAnchor,
    PopoverClose
}
