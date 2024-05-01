import { Module } from '@nestjs/common'
import { UsersRepository } from '@/modules/users/users.repository'
import { PrismaModule } from '@/database/prisma.module'
import { UsersService } from '@/modules/users/users.service'

@Module({
  imports: [PrismaModule],
  providers: [UsersRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
