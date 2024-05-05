import { Module } from '@nestjs/common'
import { DrizzleModule } from '@/core/drizzle/drizzle.module'
import { DrizzleService } from '@/core/drizzle/drizzle.service'
import { AuthService } from '@/modules/auth/services/auth.service'
import { AuthController } from '@/modules/auth/controllers/auth.controller'

@Module({
  imports: [DrizzleModule],
  providers: [DrizzleService, AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
