import AWS from 'aws-sdk';
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUser
} from 'amazon-cognito-identity-js';

class AwsManager {
  static region = 'us-east-1';
  static identityPoolId = 'us-east-1:1cc7d35e-5a84-4d91-ba02-6f0ae4522362'; // Cognito_SAEArchive
  static userPoolId = 'us-east-1_aJbpn1wXS';
  static clientAppId = '708ghdvttsljnfrvbj6v7cbac8';

  constructor() {
    // AWS.config.region = AwsManager.region;

    
    // const identityCreds = new AWS.CognitoIdentityCredentials({
    //   IdentityPoolId: AwsManager.identityPoolId
    // });

    // const lastAuthUser = identityCreds.storage.getItem(`CognitoIdentityServiceProvider.${AwsManager.clientAppId}.LastAuthUser`);
    // let idTokenJwt = '';
    // console.log('last auth user', lastAuthUser);
    // if (lastAuthUser) {
    //   idTokenJwt = identityCreds.storage.getItem(`CognitoIdentityServiceProvider.${AwsManager.clientAppId}.${lastAuthUser}.idToken`);
    //   console.log('got id token', idTokenJwt);
    //   this.setCredentials(lastAuthUser, idTokenJwt)
    //   console.log('refresh?', AWS.config.credentials.needsRefresh());
    //   AWS.config.credentials.get(() => console.log(AWS));
    // } else {
    //   console.log('defaulting to unauth user');
    //   AWS.config.credentials = identityCreds
    // }

    // this.debug = true;
    // this.loggedIn = false;
  }

  login(username, password) {
    return new Promise((resolve, reject) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: username,
        Password: password,
      });

      const cognitoUser = new CognitoUser({
        Username : username,
        Pool : new CognitoUserPool({
          UserPoolId: AwsManager.userPoolId,
          ClientId: AwsManager.clientAppId,
        })
      });

      cognitoUser.setAuthenticationFlowType('USER_PASSWORD_AUTH');

      cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: result => {
            this.loggedIn = true;
            this.setCredentials(username, result.getIdToken().getJwtToken());

            if (this.debug) {
              const sts = new AWS.STS();
              sts.getCallerIdentity({}, (err, response) => {
                if (err) console.error('error', err);
                else console.log('response', response);
              });
            }
            return resolve();
          },
          onFailure: err => {
            return reject(err);
          },
      });
    });
  }

  setCredentials(username, idTokenJwt) {
    const loginKey = `cognito-idp.${AwsManager.region}.amazonaws.com/${AwsManager.userPoolId}`;

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: AwsManager.identityPoolId,
      Logins: { [loginKey]: idTokenJwt },
      LoginId: username
    });

    console.log('set creds: ', AWS.config.credentials);
  }

  isLoggedIn() {
    if (!this.loggedIn) return false;

    if (this.loggedIn && AWS.config.credentials.needsRefresh()) {
      AWS.config.credentials.get()
    }

    return true
  }

  listObjects(bucketName) {
    return new Promise((resolve, reject) => {
      const s3 = new AWS.S3();
      s3.listObjects({ "Bucket": bucketName }, (err, data) => {
        if (err) return reject(err);
        return resolve(data.Contents);
      })
    });
  }

  upload(file, bucket, key) {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: bucket,
        Key: key,
        Body: file,
        ACL: 'public-read',
        Metadata: (file.tags || '').split(',').reduce((acc, tag) => {
          const [key, value] = tag.split('=')
          acc[tag.key] = value;
          return acc;
        }, {})
      };

      const options = {
        partSize: 0.5 * 1024 * 1024,
        queueSize: 1
      };

      const s3 = new AWS.S3();
      s3.upload(params, (err, data) => {
        if (err) return reject(err);
        console.log('done uploading', data);
        return resolve(data);
      });
    })
  }
}

const manager = new AwsManager();
export default manager;
