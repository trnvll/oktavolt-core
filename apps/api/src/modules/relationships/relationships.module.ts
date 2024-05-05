import { Module } from '@nestjs/common'
import { DrizzleModule } from '@/core/drizzle/drizzle.module'
import { UsersService } from '@/modules/users/services/users.service'
import { DrizzleService } from '@/core/drizzle/drizzle.service'
import { UsersController } from '@/modules/users/controllers/users.controller'

@Module({
  imports: [DrizzleModule],
  providers: [UsersService, DrizzleService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class RelationshipsModule {}
