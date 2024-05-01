import { Button, Card, cn, Text, Title } from 'ui'
import { ComponentProps } from 'react'
import { Badge } from 'ui/components/badge/badge.component'
import { Check, X } from 'lucide-react'
import Link from 'next/link'
import { getRoutes, joinWithSlash } from '@/app/utils/links'

interface ConnectionsShowcaseProps extends ComponentProps<'div'> {
  connections: ConnectionProps[]
}

export function ConnectionsShowcase({
  connections,
  className,
  ...rest
}: ConnectionsShowcaseProps) {
  const connects = connections.map(Connection)
  return (
    <div className={cn('grid grid-cols-2 gap-4', className)} {...rest}>
      {connects}
    </div>
  )
}

interface ConnectionProps {
  id: number
  username: string
  bio: string
  projects: string[]
  avatarImage: string
}

function Connection(props: ConnectionProps) {
  const { id, username, bio, projects, avatarImage } = props
  const { Profile } = getRoutes()

  const projectBadges = projects.map((project) => (
    <Badge variant="outline">{project}</Badge>
  ))

  return (
    <Card className="p-2.5">
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <Link href={joinWithSlash(Profile, id)}>
            <div className="flex items-center space-x-2.5">
              <img
                src={avatarImage}
                alt="Profile"
                className="object-cover rounded-full max-w-[40px]"
              />
              <Title variant="h6" className="font-medium">
                {username}
              </Title>
            </div>
          </Link>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" className="rounded-full">
              <Check className="h-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <X className="h-5" />
            </Button>
          </div>
        </div>
        <Text size="md" className="line-clamp-3">
          {bio}
        </Text>
        <div className="flex space-x-2">{projectBadges}</div>
      </div>
    </Card>
  )
}
