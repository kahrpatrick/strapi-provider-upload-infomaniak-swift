'use strict';

/**
 * Module dependencies
 */

/* eslint-disable no-unused-vars */
// Public node modules.
const _ = require('lodash');
const Upload = require("@aws-sdk/lib-storage").Upload;
const S3 = require("@aws-sdk/client-s3").S3;

module.exports = {
  init(config) {
    const S3 = new S3({
      apiVersion: '2006-03-01',
      ...config,
    });

    const upload = (file, customParams = {}) =>
      new Promise((resolve, reject) => {
        // upload file on S3 bucket
        const path = file.path ? `${file.path}/` : '';

        const uploadParams = {
          Key: `${path}${file.hash}${file.ext}`,
          Body: file.stream || Buffer.from(file.buffer, 'binary'),
          ACL: 'public-read',
          ContentType: file.mime,
          ...customParams,
        }

        try {
          const upload = new Upload({
            client: S3,
            params: uploadParams,
          });

          const data = await parallelUploads3.done();
          // set the bucket file url
          if (config.access_endpoint) {
            file.url = `${config.access_endpoint}/${config.params['Bucket']}/${data.Key}`
          } else {
            // fackback to default aws-s3 provider
            file.url = data.Location;
          }

          resolve();

        }
        catch(e) {
          return reject(e);
        }
      });

    return {
      uploadStream(file, customParams = {}) {
        return upload(file, customParams);
      },
      upload(file, customParams = {}) {
        return upload(file, customParams);
      },
      delete(file, customParams = {}) {
        return new Promise((resolve, reject) => {
          // delete file on S3 bucket
          const path = file.path ? `${file.path}/` : '';
          S3.deleteObject(
            {
              Key: `${path}${file.hash}${file.ext}`,
              ...customParams,
            },
            (err, data) => {
              if (err) {
                return reject(err);
              }

              resolve();
            }
          );
        });
      },
    };
  },
};