# envelope-encryptor

[Envelope encryption](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#enveloping) with configurable KEK (Key Encryption Key) provider.

## Installation

```sh
npm install @autotelic/envelope-encryptor
```

## Usage

### AWS KMS

Using [AWS KMS](https://docs.aws.amazon.com/kms/latest/developerguide/overview.html)

```js
import { createEnvelopeEncryptor, awsKms } from '@autotelic/envelope-encryptor'

const {
  AWS_REGION,
  KMS_KEY_ID,
  KMS_ACCESS_KEY_ID,
  KMS_SECRET_ACCESS_KEY
} = process.env

const keyService = awsKms(KMS_KEY_ID, {
  region: AWS_REGION,
  credentials: {
    accessKeyId: KMS_ACCESS_KEY_ID,
    secretAccessKey: KMS_SECRET_ACCESS_KEY
  }
})

const encryptor = createEnvelopeEncryptor(keyService)

const { encrypt, decrypt } = encryptor

const {
  ciphertext,
  key,
  salt
 } = await encrypt('plaintext')

const plaintext = await decrypt({
  ciphertext: ciphertext.toString(),
  key,
  salt
})
```

### KEK from an env variable

If your KEK will be e.g. stored in a secrets manager you can pass
it as a base64 encoded string. The key length must be 32 bytes,
you can generate a suitable one like this:
`crypto.randomBytes(32).toString('base64')`

```js
import { createEnvelopeEncryptor, kekService } from '@autotelic/envelope-encryptor'

const keyService = kekService(process.env.KEY_ENCRYPTION_KEY)

const { encrypt, decrypt } = createEnvelopeEncryptor(keyService)

const {
  ciphertext,
  key,
  salt
} = await encrypt('plaintext')

const plaintext = await decrypt({
  ciphertext: ciphertext.toString(),
  key,
  salt
})
```

## In development and testing

If you don't really need to use a secure KEK, e.g. in development or for testing,
but you do need to generate DEKs (Data Encryption Key) to work with, there is
a dummy KMS service.
This should definitely not be used in production!

```js
import { createEnvelopeEncryptor, dummyKms } from '@autotelic/envelope-encryptor'

const keyService = dummyKms()

const { encrypt, decrypt } = createEnvelopeEncryptor(keyService)

const {
  ciphertext,
  key,
  salt
} = await encrypt('plaintext')

const plaintext = await decrypt({
  ciphertext: ciphertext.toString(),
  key,
  salt
})
```

## Custom Key Service

You can implement a custom key service to pass to
`createEnvelopeEncryptor`. It should be an object that
provides two async functions, `getDataKey` and `decryptDataKey`.

`getDataKey` accepts no arguments and should return a
an object containing the encrypted data encryption key (which has been encrypted by the KEK),
and the plaintext data encryption key.

`decryptDataKey` accepts an encrypted data key and should
return the plaintext data encryption key.

See the key service implementations in this module for examples.





