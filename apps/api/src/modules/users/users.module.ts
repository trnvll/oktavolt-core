import { Module } from '@nestjs/common'
import { UsersService } from '@/modules/users/services/users.service'
import { UsersController } from '@/modules/users/controllers/users.controller'
import { DrizzleModule } from '@/core/drizzle/drizzle.module'
import { DrizzleService } from '@/core/drizzle/drizzle.service'

@Module({
  imports: [DrizzleModule],
  providers: [UsersService, DrizzleService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
