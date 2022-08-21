import * as cdk from "aws-cdk-lib";
import { PriceClass } from "aws-cdk-lib/aws-cloudfront";
import * as logs from "aws-cdk-lib/aws-logs";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import path from "path";
import {
  CloudfrontConstruct,
  ICloudfrontConstruct,
  ILambdaConstruct,
  IS3Construct,
  LambdaConstruct,
  S3Construct
} from "./constructs";

const env = process.env.DEPLOY_ENV || "dev";
const isProd = (env === "prod");
const isProdOrUAT = isProd || (env === "uat");
const stackId = `${env}-worker-order-ui`;

class Stack extends cdk.Stack {
  public readonly cloudfront: ICloudfrontConstruct;
  public readonly lambda: ILambdaConstruct;
  public readonly s3: IS3Construct;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    this.templateOptions.description = "Worker Order UI CDK Stack";

    this.s3 = new S3Construct(this, "S3", {
      autoDeleteObjects: !isProdOrUAT,
      removalPolicy: isProdOrUAT ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });

    this.lambda = new LambdaConstruct(this, "Lambda", {
      logRetention: isProd ? logs.RetentionDays.ONE_MONTH : logs.RetentionDays.ONE_WEEK,
    });

    this.cloudfront = new CloudfrontConstruct(this, "Cloudfront", {
      functionVersion: this.lambda.appendHtmlExtensionFunction.currentVersion,
      priceClass: isProd ? PriceClass.PRICE_CLASS_ALL : PriceClass.PRICE_CLASS_100,
      sourceBucket: this.s3.UIBucket,
    });

    new BucketDeployment(this, "BucketDeployment", {
      destinationBucket: this.s3.UIBucket,
      distribution: this.cloudfront.distribution,
      distributionPaths: ["/*"],
      sources: [Source.asset(path.join(__dirname, "../out"))],
    });

    cdk.Tags.of(this).add("Product Name", "Worker Order UI");
    cdk.Tags.of(this).add("Team", "Geo Cloud");
    cdk.Tags.of(this).add("Environment", env);
  }
}

const app = new cdk.App();
new Stack(app, stackId, {
  terminationProtection: isProdOrUAT,
});
