'use client'

import { Title } from 'ui'
import { ProfileBasicInformation } from '@/app/profile/components/profile-basic-information/profile-basic-information'
import { useProfile } from '@/app/profile/hooks/hooks'
import { withAuthenticationRequired } from '@auth0/auth0-react'

function Profile() {
  const data = useProfile(11)
  console.log(data)
  return (
    <div>
      <Title variant="h2" fontWeight="font-bold">
        Profile
      </Title>
      <div className="mt-10">
        <Title variant="h4" fontWeight="font-bold">
          Basic information
        </Title>
        <ProfileBasicInformation className="mt-10" />
      </div>
    </div>
  )
}

export default withAuthenticationRequired(Profile)
