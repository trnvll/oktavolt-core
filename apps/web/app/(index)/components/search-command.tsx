import { Button, Text } from 'ui'
import { NavigateCommand } from '@/app/(index)/components/navigate-command'
import { useState } from 'react'

export const SearchCommand = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="inline-flex items-center relative justify-start text-muted-foreground sm:pr-12 w-28"
        onClick={() => setOpen(true)}
      >
        <Text size="sm" color="text-gray-200">
          Search
        </Text>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <NavigateCommand open={open} setOpen={setOpen} />
    </>
  )
}
