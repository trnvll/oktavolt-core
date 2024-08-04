import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { OmniService } from '@/modules/omni/services/omni.service'

@Controller('omni')
export class OmniController {
  constructor(private readonly omniService: OmniService) {}

  @Post()
  async omni(@Body('query') query: string) {
    return this.omniService.omni(query)
  }

  @Get()
  async openapi(@Query('query') query: string) {
    return this.omniService.openapi(query)
  }
}
