import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import { Version } from "aws-cdk-lib/aws-lambda";
import { IBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export interface ICloudfrontConstruct {
  distribution: cloudfront.IDistribution;
}

interface Props {
  priceClass: cloudfront.PriceClass;
  sourceBucket: IBucket;
  functionVersion: Version;
}

export default class CloudfrontConstruct extends Construct implements ICloudfrontConstruct {
  public readonly distribution: cloudfront.IDistribution;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, "OriginAccessIdentity", {
      comment: "Worker Order UI Origin Access Identity"
    });

    this.distribution = new cloudfront.Distribution(this, "WebDistribution", {
      defaultBehavior: {
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        edgeLambdas: [
          {
            eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
            functionVersion: props.functionVersion,
          }
        ],
        compress: true,
        origin: new origins.S3Origin(props.sourceBucket, {
          originAccessIdentity,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: "index.html",
      enabled: true,
      enableIpv6: false,
      errorResponses: [
        {
          httpStatus: 403,
          responsePagePath: "/404.html",
          responseHttpStatus: 404,
        },
        {
          httpStatus: 404,
          responsePagePath: "/404.html",
          responseHttpStatus: 404,
        },
      ],
      priceClass: props.priceClass,
    });
    cdk.Tags.of(this.distribution).add("ResourceName", "Worker Order UI CDN Distribution");
  }
}