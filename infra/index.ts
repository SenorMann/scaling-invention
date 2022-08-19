import * as cdk from "aws-cdk-lib";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import path from "path";
import { Cloudfront, S3 } from "./constructs";
import { IDistribution } from "./constructs/cloudfront";
import { IBucket } from "./constructs/s3";
import { ENV, SERVICE_NAME } from "./constants";

class Stack extends cdk.Stack {
  public readonly UIbucket: IBucket;
  public readonly CDN: IDistribution;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    this.UIbucket = new S3(this, "s3");
    this.CDN = new Cloudfront(this, "cloudfront", { bucket: this.UIbucket.UIBucket });

    new BucketDeployment(this, `bucket-deployment`, {
      destinationBucket: this.UIbucket.UIBucket,
      distribution: this.CDN.distribution,
      distributionPaths: ["/*"],
      sources: [Source.asset(path.join(__dirname, "../out"))],
    })
    cdk.Tags.of(this).add("Author", "Malik Mahmud");
    cdk.Tags.of(this).add("ProjectName", "Scaling Invention");
    this.templateOptions.description
  }
}

const app = new cdk.App();
const stack = new Stack(app, `${ENV}-${SERVICE_NAME}`, {
  terminationProtection: false,
});
stack.templateOptions.description = "Scaling Invention 😆";