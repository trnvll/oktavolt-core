import { Card, Text } from 'ui'
import Link from 'next/link'
import { getRoutes, joinWithSlash } from '@/app/utils/links'

const evts = [
  {
    id: 1,
    title: 'Startup Pitch Night',
    description:
      'Local startups pitch their ideas to a panel of investors. Networking session to follow.',
    type: 'Pitch Event',
    location: 'Tech Hub Auditorium, 123 Innovation Dr, Stockholm',
    dateTime: '2023-11-05T18:00:00',
    duration: '3 hours',
  },
  {
    id: 2,
    title: 'React Native Workshop',
    description:
      'A hands-on workshop on building mobile apps with React Native. Bring your own laptop.',
    type: 'Workshop',
    location: 'Dev Studio, 456 Code Ln, Stockholm',
    dateTime: '2023-11-12T09:00:00',
    duration: '6 hours',
  },
  {
    id: 3,
    title: 'Entrepreneurial Coffee Meetup',
    description:
      'Casual meetup for entrepreneurs to share ideas and experiences over coffee.',
    type: 'Meetup',
    location: 'Cafe Innovate, 789 Brew St, Stockholm',
    dateTime: '2023-11-19T10:00:00',
    duration: '2 hours',
  },
]

export function EventsShowcase() {
  const events = evts.map(Event)
  return <div className="grid grid-cols-3 gap-4 mt-6">{events}</div>
}

interface EventProps {
  id: number
  title: string
  description: string
  type: string
  location: string
  dateTime: string
  duration: string
}

function Event(props: EventProps) {
  const { Events } = getRoutes()
  const { id, title, type, location, dateTime, duration } = props
  return (
    <Link href={joinWithSlash(Events, id)}>
      <Card className="p-2 space-y-1">
        <Text size="md" className="text-white font-medium">
          {title}
        </Text>
        <Text size="sm">{type}</Text>
        <Text size="sm">
          {Intl.DateTimeFormat('sv-SE', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(dateTime))}{' '}
          - {duration}
        </Text>
        <Text size="sm">{location}</Text>
      </Card>
    </Link>
  )
}
