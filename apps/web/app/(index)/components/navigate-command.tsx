'use client'

import {
  CreditCard,
  Settings,
  User,
  LayoutDashboard,
  Binary,
  Users,
} from 'lucide-react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from 'ui'
import { Dispatch, SetStateAction, useEffect } from 'react'
import Link from 'next/link'

interface NavigateCommandProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export function NavigateCommand({ open, setOpen }: NavigateCommandProps) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Common">
            <Link href={process.env.NEXT_PUBLIC_PLATFORM_URL}>
              <CommandItem>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Platform</span>
              </CommandItem>
            </Link>
            <Link href="">
              <CommandItem>
                <Binary className="mr-2 h-4 w-4" />
                <span>Projects</span>
              </CommandItem>
            </Link>
            <Link href="">
              <CommandItem>
                <Users className="mr-2 h-4 w-4" />
                <span>Connections</span>
              </CommandItem>
            </Link>
            <Link href="">
              <CommandItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </CommandItem>
            </Link>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
