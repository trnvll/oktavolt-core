import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/database/prisma.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(params: {
    userData: Prisma.UserCreateInput
    profileData: Prisma.ProfileCreateInput
  }) {
    const { userData, profileData } = params
    return this.prisma.user.create({
      data: {
        ...userData,
        profile: {
          create: profileData,
        },
      },
    })
  }

  async findUser(params: { where: Prisma.UserWhereUniqueInput }) {
    const { where } = params
    return this.prisma.user.findUniqueOrThrow({
      where,
      include: {
        profile: true,
      },
    })
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput
    data: Prisma.UserUpdateInput
  }) {
    const { where, data } = params
    return this.prisma.user.update({
      data,
      where,
    })
  }

  async deleteUser(params: { where: Prisma.UserWhereUniqueInput }) {
    const { where } = params
    return this.prisma.user.delete({
      where,
    })
  }
}
