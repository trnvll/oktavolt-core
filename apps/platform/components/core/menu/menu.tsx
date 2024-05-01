'use client'

import { Avatar, AvatarFallback, AvatarImage, Button, Title } from 'ui'
import { useState } from 'react'
import { MenuSearch } from '@/components/core/menu/menu-search'
import Link from 'next/link'
import { getRouterLinks, getRoutes } from '@/app/utils/links'

const Menu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { Profile } = getRoutes()

  const getLinks = () =>
    getRouterLinks().map((link) => (
      <Link href={link.path} key={link.id}>
        <Button variant="outline" size="sm" className="rounded-lg">
          {link.name}
        </Button>
      </Link>
    ))

  return (
    <div>
      <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Title variant="h5" className="lowercase">
                Reconneqt
              </Title>
            </Link>
            <div className="flex items-center space-x-3 text-sm font-medium">
              {getLinks()}
            </div>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-4 md:justify-end">
            <Button
              className="inline-flex items-center relative justify-start text-muted-foreground sm:pr-12 w-40"
              variant="outline"
              size="sm"
              onClick={() => setIsMenuOpen(true)}
            >
              Search...
              <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
            <Link href={Profile}>
              <div className="relative">
                <Avatar>
                  <AvatarImage
                    src="https://avatars.githubusercontent.com/u/52507655?v=4"
                    alt="@trnvll"
                  />
                  <AvatarFallback>AT</AvatarFallback>
                </Avatar>
                <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-600 rounded-full text-[9px] font-semibold flex justify-center items-center">
                  <span className="pb-[1px]">6</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </header>
      <MenuSearch open={isMenuOpen} setOpen={setIsMenuOpen} />
    </div>
  )
}

export { Menu }
