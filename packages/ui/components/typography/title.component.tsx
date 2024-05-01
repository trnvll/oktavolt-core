import clsx from 'clsx'
import { ReactNode, ComponentPropsWithoutRef, ElementType } from 'react'

const DEFAULT_PROPS = {
  h1: {
    as: 'h1',
    size: 'text-4xl md:text-6xl',
    lineHeight: 'md:leading-[3rem]',
    letterSpacing: 'tracking-[-1px] md:tracking-[-1.5px]',
  },
  h2: {
    as: 'h2',
    size: 'text-4xl',
    lineHeight: 'leading-10',
    letterSpacing: 'tracking-[-1px]',
  },
  h3: {
    as: 'h3',
    size: 'text-[26px]',
    lineHeight: 'leading-9',
    letterSpacing: 'tracking-[-0.75px]',
  },
  h4: {
    as: 'h4',
    size: 'text-2xl',
    lineHeight: 'leading-8',
    letterSpacing: 'tracking-[-1px]',
  },
  h5: {
    as: 'h5',
    size: 'text-[20px]',
    lineHeight: 'leading-7',
    letterSpacing: 'tracking-[-0.28px]',
  },
  h6: {
    as: 'h6',
    size: 'text-lg',
    lineHeight: 'leading-6',
    letterSpacing: 'tracking-[-0.35px]',
  },
}

interface TitleProps extends ComponentPropsWithoutRef<'div'> {
  variant?: keyof typeof DEFAULT_PROPS
  as?: ElementType
  children?: ReactNode
  fontWeight?: string
}

export const Title = ({
  variant = 'h2',
  as,
  children,
  className = '',
  fontWeight = 'font-bold',
  ...rest
}: TitleProps) => {
  const selectedVariation = DEFAULT_PROPS[variant]
  const El = as ?? selectedVariation.as
  const cssClasses = clsx(
    selectedVariation.size,
    selectedVariation.lineHeight,
    selectedVariation.letterSpacing,
    fontWeight,
    'text-gray',
    `${selectedVariation.size}`,
    className,
  )
  return (
    <El className={cssClasses} {...rest}>
      {children}
    </El>
  )
}
