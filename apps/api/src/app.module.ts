import { Module } from '@nestjs/common'
import { AuthzModule } from '@/authz/authz.module'
import { UsersModule } from './modules/users/users.module'

@Module({
  imports: [AuthzModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
