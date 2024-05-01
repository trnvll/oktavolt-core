'use client'
import { Button, Text, Title } from 'ui'
import { SearchCommand } from '@/app/(index)/components/search-command'

export default function Home() {
  return (
    <main className="px-3 md:px-20 lg:px-30 xl:px-40 mx-auto my-20 xl:my-60">
      <div className="w-full flex items-center justify-center mb-3">
        <SearchCommand />
      </div>
      <div className="">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Title>Connect, Collaborate, Create</Title>
            <Text className="mt-8 max-w-[700px] mx-auto">
              Unlock a world where ambition meets action. Join a community of
              driven individuals, united by a shared purpose to innovate,
              achieve, and inspire.
            </Text>
          </div>
          <div className="mt-10 flex justify-center items-center gap-x-4">
            <Button>Connect</Button>
            <a href={process.env.NEXT_PUBLIC_PLATFORM_URL}>
              <Button variant="secondary">Platform</Button>
            </a>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-20 mt-40">
        <div className="my-auto">
          <Title variant="h2">Unleashing Potential Together</Title>
          <Text className="mt-4">
            We're crafting a space where ambition, innovation, and community
            converge. Every connection is an opportunity to collaborate, learn,
            and grow.
          </Text>
        </div>
        <div />
      </div>
      <div className="grid lg:grid-cols-2 gap-20 mt-40">
        <div />
        <div className="my-auto">
          <Title variant="h2">Empowering Your Ambitions</Title>
          <Text className="mt-4">
            Discover a suite of tools and features designed to nurture
            connections, enhance skills, and turn your aspirations into
            achievements.
          </Text>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-20 mt-40">
        <div className="my-auto">
          <Title variant="h2">Rooted in Community, Driven by Ambition</Title>
          <Text className="mt-4">
            Our platform is a harmony of principles that foster self-acceptance,
            present living, and a collective stride towards achievement and
            innovation.
          </Text>
        </div>
        <div />
      </div>
      <div className="max-w-7xl mx-auto mt-40">
        <div className="text-center">
          <Title variant="h2">Connect with Pioneers</Title>
          <Text className="mt-8 max-w-[700px] mx-auto">
            Our community is built on personal connections and shared ambitions.
            While membership is by invitation, we’re always eager to welcome
            those who share our values and aspirations. If you’re looking to
            join a network of trailblazers and innovators, we’d love to hear
            from you.
          </Text>
        </div>
        <div className="mt-10 flex justify-center items-center gap-x-4">
          <Button>Connect</Button>
          <a href={process.env.NEXT_PUBLIC_PLATFORM_URL}>
            <Button variant="secondary">Platform</Button>
          </a>
        </div>
      </div>
    </main>
  )
}
