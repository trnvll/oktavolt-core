'use client'
import { Card, Text, Title } from 'ui'
import { withAuthenticationRequired } from '@auth0/auth0-react'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { getRoutes } from '@/app/utils/links'
import { ProjectShowcase } from '@/app/(index)/components/projects/project-showcase'
import { useProfile } from '@/app/profile/hooks/hooks'
import { ConnectionsShowcase } from '@/app/(index)/components/connections/connections-showcase'
import { EventsShowcase } from '@/app/(index)/components/events/events-showcase'

const projectsMockData = [
  {
    id: 3,
    image: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg',
    title: 'CodeCollab',
    description:
      'CodeCollab is a platform for developers to collaborate on projects, share code, and get real-time feedback. It integrates with common coding tools and provides a space for learning and mentorship.',
    profileImage: 'https://github.com/smith.png',
    profileName: 'Smith',
  },
  {
    id: 4,
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
    title: 'MindFlow',
    description:
      'MindFlow is a mindfulness and meditation app that uses AI to personalize meditation practices. It offers a variety of guided sessions, breathing exercises, and a community to share experiences.',
    profileImage: 'https://github.com/williams.png',
    profileName: 'Williams',
  },
  {
    id: 5,
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
    title: 'FitLife',
    description:
      'FitLife is a fitness app that provides personalized workout plans, nutrition advice, and tracks progress. It connects users with a community of fitness enthusiasts for motivation and support.',
    profileImage: 'https://github.com/taylor.png',
    profileName: 'Taylor',
  },
]

const connectionsMockData = [
  {
    id: 1,
    username: 'devguru',
    bio: 'Passionate about web technologies. Co-founder of WebCraft, a startup focused on innovative web solutions. Always looking to collaborate on challenging projects.',
    projects: ['WebCraft', 'JSFiddle Pro', 'ReactX'],
    avatarImage: 'https://avatars.githubusercontent.com/u/52507655?v=4',
  },
  {
    id: 4,
    username: 'trnvll',
    bio: 'Fullstack dev with a passion for entrepreneurship. Currently building @Reconneqt with the goal of connecting like-minded and ambitious individuals.',
    projects: ['Reconneqt', 'Visionary', 'TypeScript'],
    avatarImage: 'https://avatars.githubusercontent.com/u/52507655?v=4',
  },
  {
    id: 2,
    username: 'aiMaverick',
    bio: 'AI enthusiast with a knack for deep learning. Currently leading the AI team at Insightful, working on machine vision projects. Open to connect and share ideas.',
    projects: ['Insightful', 'DeepDream', 'Visionary'],
    avatarImage: 'https://github.com/aimaverick.png',
  },
]

function Home() {
  const { Projects, Connections } = getRoutes()

  const projects = projectsMockData.map(ProjectShowcase)
  const { data: profile } = useProfile(11)

  return (
    <div>
      <Title variant="h2" fontWeight="font-bold">
        Welcome {profile?.firstName}
      </Title>
      <div className="grid grid-cols-2 gap-6 mt-10">
        <Card className="p-4 relative">
          <Title variant="h5" fontWeight="font-medium">
            New Connections
          </Title>
          <Link href={Connections}>
            <div className="absolute top-4 right-4">
              <div className="flex items-center space-x-1">
                <Text size="md" color="text-grey-100" className="font-medium">
                  View all
                </Text>
                <ChevronRight size={16} />
              </div>
            </div>
          </Link>
          <Text size="md">
            New members that you can connect with and collaborate on projects
          </Text>
          <ConnectionsShowcase
            connections={connectionsMockData}
            className="mt-6"
          />
        </Card>
        <Card className="p-4 relative">
          <Title variant="h5" fontWeight="font-medium">
            Top Projects
          </Title>
          <Link href={Projects}>
            <div className="absolute top-4 right-4">
              <div className="flex items-center space-x-1">
                <Text size="md" color="text-grey-100" className="font-medium">
                  View all
                </Text>
                <ChevronRight size={16} />
              </div>
            </div>
          </Link>
          <Text size="md">The top projects for this week</Text>
          <div className="mt-6 grid grid-cols-1 gap-6">{projects}</div>
        </Card>
      </div>
      <Card className="p-4 relative mt-6 rounded-xl">
        <Title variant="h5" fontWeight="font-medium">
          Your Events
        </Title>
        <Link href={Projects}>
          <div className="absolute top-4 right-4">
            <div className="flex items-center space-x-1">
              <Text size="md" color="text-grey-100" className="font-medium">
                View all
              </Text>
              <ChevronRight size={16} />
            </div>
          </div>
        </Link>
        <Text size="md">
          Upcoming events, anything from meeting a new connect to hackathons
        </Text>
        <EventsShowcase />
      </Card>
    </div>
  )
}

export default withAuthenticationRequired(Home)
