import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";
import path from "path";

export interface ILambdaConstruct {
  appendHtmlExtensionFunction: lambda.Function;
}

interface Props {
  logRetention: RetentionDays;
}

export default class LambdaConstruct extends Construct implements ILambdaConstruct {
  public appendHtmlExtensionFunction: lambda.Function;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const lambdaExecutionRole = new iam.Role(this, "LambdaExecutionRole", {
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal("lambda.amazonaws.com"),
        new iam.ServicePrincipal("edgelambda.amazonaws.com")
      ),
      managedPolicies: [
        iam.ManagedPolicy.fromManagedPolicyArn(
          this,
          "LambdaExecutionPolicy",
          "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
        )
      ]
    });

    this.appendHtmlExtensionFunction= new NodejsFunction(this, "AppendHtmlExtensionFunction", {
      bundling: {
        minify: true,
      },
      description: "This function appends index.html to Cloudfront origin requests that don’t include a file name or extension in the URL.",
      entry: path.join(__dirname, "../handlers/appendHtmlExtension.ts"),
      handler: "main",
      memorySize: 256,
      role: lambdaExecutionRole,
      runtime: lambda.Runtime.NODEJS_16_X,
      timeout: cdk.Duration.seconds(10),
      logRetention: props.logRetention,
    });
  }
}