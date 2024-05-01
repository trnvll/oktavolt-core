import { getRoutes, joinWithSlash } from '@/app/utils/links'
import Link from 'next/link'
import { Avatar, AvatarImage, Text, Title } from 'ui'

interface ProjectShowcaseProps {
  id: number
  image: string
  title: string
  description: string
  profileImage: string
  profileName: string
}

export function ProjectShowcase(props: ProjectShowcaseProps) {
  const { Projects } = getRoutes()
  const { id, image, title, description, profileImage, profileName } = props
  return (
    <Link href={joinWithSlash(Projects, id)}>
      <div className="flex gap-x-3 cursor-pointer">
        <img
          src={image}
          alt="Image logo"
          className="object-cover max-w-[130px] aspect-video rounded-md"
        />
        <div className="">
          <Title variant="h6">{title}</Title>
          <Text size="md" className="mt-1 line-clamp-2">
            {description}
          </Text>
          <div className="mt-2 flex gap-x-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={profileImage} alt={`@${profileName}`} />
            </Avatar>
            <Text size="sm">by {profileName}</Text>
          </div>
        </div>
      </div>
    </Link>
  )
}
