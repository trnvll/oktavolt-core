import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as s3 from 'aws-cdk-lib/aws-s3'

export class EventsS3Stack extends Stack {
  public readonly bucket: s3.Bucket

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    this.bucket = new s3.Bucket(this, 'EventsBucket', {
      removalPolicy: RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
    })
  }
}
