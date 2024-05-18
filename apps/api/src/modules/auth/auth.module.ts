import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/core/database/database.module'
import { DatabaseService } from '@/core/database/database.service'
import { AuthService } from '@/modules/auth/services/auth.service'
import { AuthController } from '@/modules/auth/controllers/auth.controller'

@Module({
  imports: [DatabaseModule],
  providers: [DatabaseService, AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
