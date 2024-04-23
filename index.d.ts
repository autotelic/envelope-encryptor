declare module '@autotelic/envelope-encryptor' {
  import { createCipheriv } from 'node:crypto'
  import { KMS, KMSClientConfig } from '@aws-sdk/client-kms'

  export type CipherKey = Parameters<typeof createCipheriv>[1]

  export interface KeyService {
    getDataKey: () => Promise<{
      encryptedKey: string
      plaintextKey: CipherKey
    }>
    decryptDataKey: (key: string) => Promise<CipherKey>
  }

  export interface AwsKmsConfig extends KMSClientConfig {}

  export type AwsKmsClient = Pick<KMS, 'generateDataKey' | 'decrypt'>

  export interface AwsKmsService extends KeyService {}

  export function awsKms(
    keyId: string,
    config?: AwsKmsConfig,
    Client?: new (config?: AwsKmsConfig) => AwsKmsClient
  ): AwsKmsService

  export function dummyKms (): KeyService

  export function kekService(base64kek: string): KeyService

  export interface EncryptorOptions {
    encoding?: 'hex'
  }

  export interface EncryptedData {
    ciphertext: string
    key: string
    salt: string
  }

  export interface EnvelopeEncryptor {
    encrypt: (plaintext: string) => Promise<EncryptedData>
    decrypt: (data: EncryptedData) => Promise<string>
  }

  export function createEnvelopeEncryptor(
    keyService: KeyService,
    options?: EncryptorOptions
  ): EnvelopeEncryptor

}
