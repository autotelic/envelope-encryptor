# envelope-encryptor

Envelope encryption with configurable KMS.

## Installation

```sh
npm install @autotelic/envelope-encryptor
```

## Usage

```js

// Using AWS KMS
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

// encrypt; store these in the db; plaintext is encrypted at rest
const {
  ciphertext,
  key,
  salt
 } = await encrypt('plaintext')

// decrypt
const plaintext = await decrypt({
  ciphertext: ciphertext.toString(),
  key,
  salt
})
```
