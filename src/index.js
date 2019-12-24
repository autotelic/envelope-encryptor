// @flow

import crypto from 'crypto';
import KMS from 'aws-sdk/clients/kms';

type DecryptArgs = {
  ciphertext: string,
  key: string,
  salt: string,
};

export const awsKms = (keyId: string, config: Object = {}, Client = KMS) => {
  const kms = new Client(config);

  const getDataKey = async () => {
    const { CiphertextBlob, Plaintext } = await kms
      .generateDataKey({
        KeyId: keyId,
        KeySpec: 'AES_256',
      })
      .promise();

    return {
      encryptedKey: CiphertextBlob.toString('base64'),
      plaintextKey: Plaintext,
    };
  };

  const decryptDataKey = async key => {
    const { Plaintext } = await kms
      .decrypt({
        CiphertextBlob: Buffer.from(key, 'base64'),
      })
      .promise();

    return Plaintext;
  };

  return {
    getDataKey,
    decryptDataKey,
  };
};

const createEnvelopeEncrypter = keyService => {
  const algorithm = 'aes256';

  const { getDataKey, decryptDataKey } = keyService;

  const encrypt = async (plaintext: string) => {
    const { encryptedKey, plaintextKey } = await getDataKey();
    const salt = Buffer.from(crypto.randomBytes(8)).toString('hex');
    const cipher = crypto.createCipheriv(algorithm, plaintextKey, salt);
    const ciphertext = [
      cipher.update(plaintext, 'utf8'),
      cipher.final('hex'),
    ].join('');
    return {
      ciphertext,
      key: encryptedKey,
      salt,
    };
  };

  const decrypt = async ({ ciphertext, key, salt }: DecryptArgs) => {
    const dataKey = await decryptDataKey(key);
    const decipher = crypto.createDecipheriv(algorithm, dataKey, salt);
    return [
      decipher.update(ciphertext, 'hex', 'utf8'),
      decipher.final('utf8'),
    ].join('');
  };

  return {
    decrypt,
    encrypt,
  };
};

export default createEnvelopeEncrypter;
