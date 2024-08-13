import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@/core/database/database.service'

@Injectable()
export class OmniService {
  constructor(private readonly database: DatabaseService) {}
}
