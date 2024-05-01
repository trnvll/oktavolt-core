import { Module } from '@nestjs/common'
import { AuthzModule } from '@/authz/authz.module'

@Module({
  imports: [AuthzModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
