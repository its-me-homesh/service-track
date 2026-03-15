import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
                  ...props
              }: React.ComponentProps<typeof TabsPrimitive.Root>) {
    return <TabsPrimitive.Root data-slot="popover" {...props} />
}

function TabsList({
    className,
                      ...props
                  }: React.ComponentProps<typeof TabsPrimitive.List>) {
    return <TabsPrimitive.List data-slot="popover-portal" className={cn(
        "inline-flex gap-1 rounded-sm w-full bg-neutral-100 p-1 dark:bg-neutral-800",
        className
    )} {...props} />
}

function TabsTrigger({
    className,
                         ...props
                     }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
    return <TabsPrimitive.Trigger className={cn("flex items-center rounded-sm px-3.5 py-1.5 transition-colors",
        "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:bg-white data-[state=active]:shadow-xs data-[state=active]:dark:bg-neutral-700 data-[state=active]:dark:text-neutral-100",
        "data-[state=inactive]:text-neutral-500 data-[state=inactive]:hover:bg-neutral-200/60 data-[state=inactive]:hover:text-black data-[state=inactive]:dark:text-neutral-400 data-[state=inactive]:dark:hover:bg-neutral-700/60",
        className)} data-slot="popover-trigger" {...props} />
}

function TabsContent({
                         className,
                         children,
                         ...props
                     }: React.ComponentProps<typeof TabsPrimitive.Content>) {
    return (
        <TabsPrimitive.Content
            className={cn(
                "mt-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none px-2 py-2",
                className
            )}
            {...props}
        >
            {children}
        </TabsPrimitive.Content>
    )
}

export {
    Tabs,
    TabsTrigger,
    TabsContent,
    TabsList
}
