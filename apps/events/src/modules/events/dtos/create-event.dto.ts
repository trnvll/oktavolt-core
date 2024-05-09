import { IsDate, IsEnum, IsJSON, IsNotEmpty } from 'class-validator'

enum EventTypeEnum {
  // User Actions
  USER_LOGIN = 'user-login',
  USER_LOGOUT = 'user-logout',
  USER_REGISTER = 'user-register',
  PROFILE_UPDATE = 'profile-update',
  PASSWORD_CHANGE = 'password-change',

  // System Events
  SYSTEM_ERROR = 'system-error',
  SERVICE_START = 'service-start',
  SERVICE_STOP = 'service-stop',
  RESOURCE_CREATED = 'resource-created',
  RESOURCE_UPDATED = 'resource-updated',
  RESOURCE_DELETED = 'resource-deleted',

  // Business Processes

  // Tracking and Analytics
  PAGE_VIEW = 'page-view',
}

enum EventTargetEnum {
  DATABASE = 'db',
  FILE_STORAGE = 's3',
  MESSAGE_QUEUE = 'mq',
  LOG_SERVICE = 'logs',
  ANALYTICS_SERVICE = 'analytics',
  EMAIL_SERVICE = 'email',
  NOTIFICATION_SERVICE = 'notification',
  CRM = 'crm',
}

export class CreateEventDto {
  @IsEnum(EventTypeEnum)
  type: EventTypeEnum

  @IsEnum(EventTargetEnum, { each: true })
  targets: EventTargetEnum[]

  @IsJSON()
  data: any

  @IsDate()
  timestamp: Date

  @IsNotEmpty()
  origin: string
}
