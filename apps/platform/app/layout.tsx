import '../../../packages/ui/globals.css'
import { Inter } from 'next/font/google'
import { cn } from 'ui'
import { ThemeProvider } from '@/app/theme-provider'
import { Menu } from '@/components/core/menu/menu'
import { AuthzProvider } from '@/components/core/providers/authz-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthzProvider>
      <html lang="en">
        <body className={cn(inter.className, 'bg-background')}>
          <Menu />
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <main className="container mt-10 mb-20">{children}</main>
          </ThemeProvider>
        </body>
      </html>
    </AuthzProvider>
  )
}
