import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_EctXuwCPU',
      userPoolClientId: 'qg8cp7db70oqiacfeff2dvhsj',
      loginWith: {
        email: true,
      },
    },
  },
});
