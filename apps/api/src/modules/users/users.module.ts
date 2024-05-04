import { Module } from '@nestjs/common'
import { UsersService } from '@/modules/users/users.service'
import { UsersController } from '@/modules/users/users.controller'
import { DrizzleModule } from '@/core/drizzle/drizzle.module'
import { DrizzleService } from '@/core/drizzle/drizzle.service'

@Module({
  imports: [DrizzleModule],
  providers: [UsersService, DrizzleService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
