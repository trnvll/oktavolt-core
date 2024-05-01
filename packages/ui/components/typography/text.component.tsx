import {
  ComponentPropsWithoutRef,
  createElement,
  ElementType,
  ReactNode,
} from 'react'
import { cn } from 'ui'

const textSizes = {
  '2xs': 'text-[10px]',
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-md',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
}

interface TextProps extends ComponentPropsWithoutRef<'div'> {
  size?: keyof typeof textSizes
  as?: ElementType
  lineHeight?: string
  tracking?: string
  color?: string
  children: ReactNode
}

export const Text = ({
  className = '',
  lineHeight = 'leading-snug',
  tracking = 'tracking-tight',
  color = 'text-gray-400',
  size = 'lg',
  as = 'p',
  ...rest
}: TextProps) => {
  return createElement(as, {
    className: cn(
      lineHeight,
      tracking,
      color,
      !!rest.onClick && 'cursor-pointer',
      textSizes[size],
      className,
    ),
    ...rest,
  })
}
