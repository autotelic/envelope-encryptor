declare module '@autotelic/envelope-encryptor' {

  export interface AwsKmsConfig {
    region?: string;
    credentials?: {
      accessKeyId?: string;
      secretAccessKey?: string;
    };
  }

  export interface AwsKmsClient {
    generateDataKey: (params: {
      KeyId: string;
      KeySpec: 'AES_256';
    }) => { promise: () => Promise<{ CiphertextBlob: Buffer; Plaintext: Buffer }> };

    decrypt: (params: {
      CiphertextBlob: Buffer;
    }) => { promise: () => Promise<{ Plaintext: Buffer }> };
  }

  export interface AwsKmsService {
    getDataKey: () => Promise<{ encryptedKey: string; plaintextKey: Buffer }>;
    decryptDataKey: (key: string) => Promise<Buffer>;
  }

  export function awsKms(
    keyId: string,
    config?: AwsKmsConfig,
    Client?: new (config?: AwsKmsConfig) => AwsKmsClient
  ): AwsKmsService;

  export interface KeyService {
    getDataKey: () => Promise<{ encryptedKey: string; plaintextKey: Buffer }>;
    decryptDataKey: (key: string) => Promise<Buffer>;
  }

  export interface EncryptorOptions {
    encoding?: 'hex';
  }

  export interface EncryptedData {
    ciphertext: string;
    key: Buffer;
    salt: string;
  }

  export interface EnvelopeEncryptor {
    encrypt: (plaintext: string) => Promise<EncryptedData>;
    decrypt: (data: EncryptedData) => Promise<string>;
  }

  export function createEnvelopeEncryptor(
    keyService: KeyService,
    options?: EncryptorOptions
  ): EnvelopeEncryptor;

}
