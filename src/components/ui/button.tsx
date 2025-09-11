import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 transform active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl focus-visible:ring-blue-500",
        primary:
          "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:from-purple-700 hover:to-pink-700 hover:shadow-xl focus-visible:ring-purple-500",
        success:
          "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:from-green-700 hover:to-emerald-700 hover:shadow-xl focus-visible:ring-green-500",
        destructive:
          "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg hover:from-red-700 hover:to-rose-700 hover:shadow-xl focus-visible:ring-red-500",
        warning:
          "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg hover:from-orange-600 hover:to-amber-600 hover:shadow-xl focus-visible:ring-orange-500",
        outline:
          "border-2 border-gray-300 bg-white/80 backdrop-blur-sm text-gray-700 shadow-md hover:bg-white hover:border-gray-400 hover:shadow-lg focus-visible:ring-gray-500",
        secondary:
          "bg-gray-100/80 backdrop-blur-sm text-gray-900 shadow-md hover:bg-gray-200/90 hover:shadow-lg focus-visible:ring-gray-500",
        ghost:
          "bg-white/10 backdrop-blur-sm text-gray-700 hover:bg-white/20 hover:shadow-md focus-visible:ring-gray-500",
        link: 
          "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700 focus-visible:ring-blue-500",
        glass:
          "bg-white/20 backdrop-blur-md border border-white/30 text-gray-800 shadow-lg hover:bg-white/30 hover:shadow-xl focus-visible:ring-white/50",
      },
      size: {
        xs: "h-7 px-2 text-xs gap-1",
        sm: "h-8 px-3 text-xs gap-1.5",
        default: "h-10 px-4 py-2.5",
        lg: "h-12 px-6 text-base gap-3",
        xl: "h-14 px-8 text-lg gap-3",
        icon: "h-10 w-10",
        iconSm: "h-8 w-8",
        iconLg: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
