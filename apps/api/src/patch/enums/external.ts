export enum ChatTypeEnum {
  System = 'system',
  Human = 'human',
  Assistant = 'assistant',
}

export enum CommunicationTypeEnum {
  Text = 'text',
  Email = 'email',
}

export enum CommunicationProviderEnum {
  Icloud = 'icloud',
  LinkedIn = 'linked_in',
  Gmail = 'gmail',
  Outlook = 'outlook',
  Teams = 'teams',
  Slack = 'slack',
  Discord = 'discord',
  Imessage = 'imessage',
}

export enum RelationshipTypeEnum {
  Friend = 'friend',
  CoWorker = 'co_worker',
  Boss = 'boss',
  Romantic = 'romantic',
  Fwb = 'fwb',
}

export enum ToolExecStatus {
  Approved = 'approved',
  Rejected = 'rejected',
  Pending = 'pending',
  Executed = 'executed',
  Failed = 'failed',
}
