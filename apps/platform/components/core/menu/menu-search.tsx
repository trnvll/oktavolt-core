'use client'

import {
  Binary,
  CreditCard,
  LayoutDashboard,
  Settings,
  User,
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
import { getRoutes } from '@/app/utils/links'

interface MenuSearchProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export function MenuSearch({ open, setOpen }: MenuSearchProps) {
  const { Home, Profile, Projects, Connections } = getRoutes()
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
          <CommandGroup heading="Platform">
            <Link href={Home}>
              <CommandItem>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </CommandItem>
            </Link>
            <Link href={Projects}>
              <CommandItem>
                <Binary className="mr-2 h-4 w-4" />
                <span>Projects</span>
              </CommandItem>
            </Link>
            <Link href={Connections}>
              <CommandItem>
                <Users className="mr-2 h-4 w-4" />
                <span>Connections</span>
              </CommandItem>
            </Link>
            <Link href={Profile}>
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
