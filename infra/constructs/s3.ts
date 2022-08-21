import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export interface IS3Construct {
  UIBucket: s3.IBucket;
}

export default class S3Construct extends Construct implements IS3Construct {
  public readonly UIBucket: s3.IBucket;

  constructor(scope: Construct, id: string, props: s3.BucketProps) {
    super(scope, id);
    this.UIBucket = new s3.Bucket(this, "UISourceBucket", {
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      autoDeleteObjects: props.autoDeleteObjects,
      removalPolicy: props.removalPolicy,
    });
    cdk.Tags.of(this.UIBucket).add("ResourceName", "Worker Order UI Source Bucket");
  }
}
