import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import { IBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { ENV } from "../constants";

type Props = {
  bucket: IBucket
}

export interface IDistribution {
  distribution: cloudfront.IDistribution;
}

export default class CloudfrontConstruct extends Construct implements IDistribution {
  public readonly distribution: cloudfront.IDistribution;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, "cdn-oai", {
      comment: "Worker Order UI Origin Access Identity"
    });

    this.distribution = new cloudfront.CloudFrontWebDistribution(scope, "cdn", {
      originConfigs: [
        {
          behaviors: [{ isDefaultBehavior: true }],
          s3OriginSource: {
            s3BucketSource: props.bucket,
            originAccessIdentity,
          },
        },
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      enabled: true,
      comment: 'Ruleset UI Distribution',
      enableIpV6: false,
    });
    cdk.Tags.of(this.distribution).add("ResourceName", `Worker Order UI CDN ${ENV}`);
  }
}