import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeBase =
  "inline-flex items-center justify-center rounded-sm border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden"

const badgeVariants = cva(
  badgeBase,
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const badgeColorClasses: Record<
  | "amber"
  | "blue"
  | "violet"
  | "orange"
  | "green"
  | "red",
  string
> = {
  amber: "bg-amber-100 text-amber-600 border-none",
  blue: "bg-blue-100 text-blue-600 border-none",
  violet: "bg-violet-100 text-violet-600 border-none",
  orange: "bg-orange-100 text-orange-600 border-none",
  green: "bg-emerald-100 text-emerald-600 border-none",
  red: "bg-red-100 text-red-600 border-none",
}

export type BadgeColor = keyof typeof badgeColorClasses

const isBadgeColor = (color: string | null | undefined): color is BadgeColor =>
  Boolean(color && Object.prototype.hasOwnProperty.call(badgeColorClasses, color))

function Badge({
  className,
  variant,
  color,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean
    color?: BadgeColor | string | null
  }) {
  const Comp = asChild ? Slot : "span"
  const resolvedColor = isBadgeColor(color) ? color : undefined
  const colorClass = resolvedColor ? badgeColorClasses[resolvedColor] : undefined
  const resolvedClassName = resolvedColor
    ? cn(badgeBase, colorClass, className)
    : cn(badgeVariants({ variant }), className)

  return (
    <Comp
      data-slot="badge"
      className={resolvedClassName}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
