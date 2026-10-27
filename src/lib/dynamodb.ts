import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const REGION = 'us-east-1';

const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID || '';
const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '';
const sessionToken = import.meta.env.VITE_AWS_SESSION_TOKEN || '';

const client = new DynamoDBClient({
  region: REGION,
  credentials: accessKeyId && secretAccessKey ? {
    accessKeyId,
    secretAccessKey,
    sessionToken
  } : undefined
});

export const docClient = DynamoDBDocumentClient.from(client);