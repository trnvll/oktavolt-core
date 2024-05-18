import { Module } from '@nestjs/common'
import { UsersService } from '@/modules/users/services/users.service'
import { UsersController } from '@/modules/users/controllers/users.controller'
import { DatabaseModule } from '@/core/database/database.module'
import { DatabaseService } from '@/core/database/database.service'

@Module({
  imports: [DatabaseModule],
  providers: [UsersService, DatabaseService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
