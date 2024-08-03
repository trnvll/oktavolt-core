export enum EventTypeEnum {
  UserCreated = 'user-created',
  UserDataUpdated = 'user-data-updated',
  UserDeleted = 'user-deleted',
  UserTracking = 'user-tracking',
}

export enum EventTargetEnum {
  TimeSeriesDb = 'time-series-db',
  FileStorage = 's3',
  MessageQueue = 'mq',
  LogService = 'logs',
  AnalyticsService = 'analytics',
  Mixpanel = 'mixpanel',
  EmailService = 'email',
  NotificationService = 'notification',
  Crm = 'crm',
}

export enum EventOriginEnum {
  Platform = 'platform',
  Web = 'web',
  Api = 'api',
  Events = 'events',
}

export enum EntityTypeEnum {
  User = 'user',
  Relationship = 'relationship',
  Preference = 'preference',
  Communication = 'communication',
  Chat = 'chat',
}

export enum EventActionEnum {
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}
