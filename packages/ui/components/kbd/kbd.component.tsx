import { ComponentPropsWithoutRef } from 'react'
import { cn } from '../../lib/utils'

type KbdProps = ComponentPropsWithoutRef<'kbd'>

export const Kbd = ({ className, ...rest }: KbdProps) => {
  return (
    <kbd
      className={cn(
        'inline-flex items-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64',
        className,
      )}
      {...rest}
    />
  )
}
