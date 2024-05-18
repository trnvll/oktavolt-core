import { Module } from '@nestjs/common'
import { SqsService } from '@/core/sqs/sqs.service'

@Module({
  providers: [SqsService],
  exports: [SqsService],
})
export class SqsModule {}
