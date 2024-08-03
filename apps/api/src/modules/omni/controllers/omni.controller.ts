import { Controller, Get, Query } from '@nestjs/common'
import { OmniService } from '@/modules/omni/services/omni.service'

@Controller('omni')
export class OmniController {
  constructor(private readonly omniService: OmniService) {}

  @Get()
  async omni(@Query('query') query: string) {
    return this.omniService.omni(query)
  }
}
