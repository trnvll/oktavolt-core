import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable, tap } from 'rxjs'
import { SqsService } from '@/core/sqs/sqs.service'
import {
  CreateEventDto,
  EventOriginEnum,
  EventTargetEnum,
  EventTypeEnum,
  json,
  TrackingEventDetailsDto,
} from 'shared'
import { AppRequestInterface } from '@/types/app-request.interface'

@Injectable()
export class AnalyticsInterceptor implements NestInterceptor {
  constructor(private readonly sqsService: SqsService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest() as AppRequestInterface
    const { method, url, query, body } = request

    const dto: Omit<CreateEventDto<TrackingEventDetailsDto>, 'toEntity'> = {
      userId: 0, // TODO: fix to use the actual user ID
      data: {
        pageUrl: url,
        action: 'API Request',
        metadata: {
          method,
          query,
          body,
          ipAddress: this.getIpAddress(request),
        },
      },
      type: EventTypeEnum.UserTracking,
      targets: [EventTargetEnum.Mixpanel],
      origin: EventOriginEnum.Api,
      timestamp: new Date(),
    }

    console.log('Analytics interceptor dto:', json(dto))

    await this.sqsService.sendMessage(dto)

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return next.handle().pipe(tap(() => {}))
  }

  private getIpAddress(request: any): string | undefined {
    const ip =
      request.ip ||
      request.headers['x-forwarded-for'] ||
      request.headers['x-real-ip'] ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      request.connection.socket.remoteAddress

    return Array.isArray(ip) ? ip[0] : ip?.split(',')[0].trim()
  }
}
