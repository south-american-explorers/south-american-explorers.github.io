import AWS from 'aws-sdk';

AWS.config.region = 'us-east-1'; // Region

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'us-east-1:1cc7d35e-5a84-4d91-ba02-6f0ae4522362', // Cognito_SAEArchiveUnauth_Role
});
