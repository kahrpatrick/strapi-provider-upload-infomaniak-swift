# strapi-provider-upload-infomaniak-swift

Forked from: @strapi/provider-upload-aws-s3

## Resources

- [LICENSE](LICENSE)

## Links

- [Strapi website](https://strapi.io/)
- [Strapi documentation](https://docs.strapi.io)
- [Strapi community on Discord](https://discord.strapi.io)
- [Strapi news on Twitter](https://twitter.com/strapijs)

## Installation

```bash
# using yarn
yarn add git+https://github.com/kahrpatrick/strapi-provider-upload-infomaniak-swift.git#main
```

## Configurations

Your configuration is passed down to the AWS SDK v3 client (`new S3(config)`). You can see the complete list of options [here](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/).

Checksums are only sent where S3 requires them (`requestChecksumCalculation` and `responseChecksumValidation` default to `WHEN_REQUIRED`), because the default of the SDK since 3.729 is not accepted by every S3-compatible endpoint. Both can be overridden in `providerOptions`.

Requires Node.js 20 or newer.

See the [using a provider](https://docs.strapi.io/developer-docs/latest/plugins/upload.html#using-a-provider) documentation for information on installing and using a provider. And see the [environment variables](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/optional/environment.html#environment-variables) for setting and using environment variables in your configs.

### Provider Configuration

`./config/plugins.js`

```js
module.exports = ({ env }) => ({
  // ...
  upload: {
    config: {
      provider: 'strapi-provider-upload-infomaniak-swift',
      providerOptions: {
        credentials: {
          accessKeyId: env('S3_ACCESS_KEY_ID'),
          secretAccessKey: env('S3_ACCESS_SECRET'),
        },
        region: env('S3_REGION', 'us-east-1'),
        params: {
          Bucket: env('S3_BUCKET'),
        },
        endpoint: env('S3_ENDPOINT'),
        access_endpoint: env('S3_ACCESS_ENDPOINT'),
        forcePathStyle: true,
      },
    },
  },
  // ...
});
```

### Security Middleware Configuration

Due to the default settings in the Strapi Security Middleware you will need to modify the `contentSecurityPolicy` settings to properly see thumbnail previews in the Media Library. You should replace `strapi::security` string with the object bellow instead as explained in the [middleware configuration](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/configurations/required/middlewares.html#loading-order) documentation.

`./config/middlewares.js`

```js
module.exports = [
  // ...
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', '<projectID>.s3.pub1.infomaniak.cloud'],
          'media-src': ["'self'", 'data:', 'blob:', '<projectID>.s3.pub1.infomaniak.cloud'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  // ...
];
```

## Required AWS Policy Actions

These are the minimum amount of permissions needed for this provider to work.

```json
"Action": [
  "s3:PutObject",
  "s3:GetObject",
  "s3:ListBucket",
  "s3:DeleteObject",
  "s3:PutObjectAcl"
],
```
