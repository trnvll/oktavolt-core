export enum EventTypeEnum {
  UserCreated = 'user-created',
  UserDataUpdated = 'user-data-updated',
  UserDeleted = 'user-deleted',
}

export enum EventTargetEnum {
  TimeSeriesDb = 'time-series-db',
  FileStorage = 's3',
  MessageQueue = 'mq',
  LogService = 'logs',
  AnalyticsService = 'analytics',
  EmailService = 'email',
  NotificationService = 'notification',
  Crm = 'crm',
}

export enum EventOriginEnum {
  Platform = 'platform',
  Web = 'web',
  Api = 'api',
}

export enum EntityTypeEnum {
  User = 'user',
  Authentication = 'authentication',
  Relationship = 'relationship',
  Preference = 'preference',
  Communication = 'communication',
}

export enum EventActionEnum {
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}
