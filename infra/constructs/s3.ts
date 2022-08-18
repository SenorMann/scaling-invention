import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";


export interface IBucket {
  UIBucket: s3.IBucket;
}

export default class S3Construct extends Construct implements IBucket {
  public readonly UIBucket: s3.IBucket;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.UIBucket = new s3.Bucket(this, "s3-bucket", {
      encryption: s3.BucketEncryption.S3_MANAGED,
      publicReadAccess: false,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "404.html",
      // False for UAT and PROD
      autoDeleteObjects: true,
      // retain for UAT and PROD
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // new BucketDeployment(this, `${SERVICE_NAME}-bucket-deployment-${env}`, {
    //   destinationBucket: this.UIBucket,
    //   distribution: props.cloudfrontDistribution,
    //   distributionPaths: ["/*"],
    //   sources: [Source.asset(path.join(__dirname, "../../out"))],
    // })
  }
}