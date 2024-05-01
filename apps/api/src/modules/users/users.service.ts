import { BadRequestException, Injectable } from '@nestjs/common'
import { UsersRepository } from '@/modules/users/users.repository'
import { Profile, User } from '@prisma/client'
import { UserResponseDto } from '@/modules/users/dtos/user-response.dto'

@Injectable()
export class UsersService {
  constructor(private usersRepo: UsersRepository) {}

  async createUser(params: {
    email: User['email']
    username: User['username']
    auth0Id: User['auth0Id']
    firstName: Profile['firstName']
    lastName: Profile['lastName']
    location: Profile['location']
  }) {
    const { email, username, auth0Id, firstName, lastName, location } = params
    return this.usersRepo.createUser({
      userData: {
        email,
        username,
        auth0Id,
      },
      profileData: {
        firstName,
        lastName,
        location,
      },
    })
  }

  async findUser(params: { id: User['id']; auth0Id: User['auth0Id'] }) {
    const { id, auth0Id } = params
    const user = await this.usersRepo.findUser({
      where: {
        auth0Id,
      },
    })
    console.log(user)

    if (user.id !== id) {
      console.error(
        'Provided user id=%s and user=%j returned by sub do not match',
        id,
        user,
      )
      throw new BadRequestException(
        'Provided user id and user returned by sub do not match',
      )
    }

    return UserResponseDto.fromEntity(user)
  }
}
