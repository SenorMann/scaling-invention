import { CloudFrontRequestEvent } from "aws-lambda";

export function main (event: CloudFrontRequestEvent) {
  const { request } = event.Records[0].cf;

  if (request.uri.endsWith("/")) {
    request.uri += "index.html";

    // If the request path does not include a file extension
    // Append "/index.html" to it.
    // i.e rewrite /about to /about/index.html
  } else if (!(/\.\w+$/.test(request.uri))) {
    request.uri += "/index.html";
  }

  return request;
}