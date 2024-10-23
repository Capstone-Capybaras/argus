import {
  SecretsManagerClient,
  GetSecretValueCommand,
  GetSecretValueCommandOutput,
} from '@aws-sdk/client-secrets-manager';
import { ConfigService } from '@nestjs/config';

/**
 * Interface that describes all secrets stored under the secret name in AWS secrets manager
 */
export interface Secrets {
  DATABASE_URL: string;
  JWT_SECRET: string;
  SALT_OR_ROUNDS: string;
}

const fetchSecrets = async (secretName: string): Promise<Secrets> => {
  const client = new SecretsManagerClient({
    region: 'ap-southeast-1',
  });
  let getSecretsResponse: GetSecretValueCommandOutput | undefined;
  try {
    getSecretsResponse = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
      }),
    );
  } catch (error) {
    throw error;
  }

  if (!getSecretsResponse || !getSecretsResponse.SecretString) {
    throw new Error('Secrets could not be retrieved');
  }

  const secrets = JSON.parse(getSecretsResponse.SecretString) as Secrets;
  console.log({ secrets });

  // swap out DB url, we store DB url in env files becuase drizzle config needs a static value
  // and drizzle does not support async configs to fetch a secret
  // TODO: maybe in the future just store DATABASE_URL separately under ECS env vars
  // instead of duplicating it in secrets manager as well
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error('Could not get local database url while fetching secrets');
  }
  secrets.DATABASE_URL = DATABASE_URL;

  return secrets;
};

export const secretManagerConfig = async () => {
  const configService = new ConfigService();
  const secretName = configService.getOrThrow('AWS_SECRET_NAME');
  return fetchSecrets(secretName);
};
