import { Controller } from '@nestjs/common'
import { OmniService } from '@/modules/omni/services/omni.service'

@Controller('users/:userId/omni')
export class OmniController {
  constructor(private readonly omniService: OmniService) {}
}
