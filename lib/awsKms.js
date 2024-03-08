import * as AWS from '@aws-sdk/client-kms'

const awsKms = (keyId, config = {}, Client = AWS.KMS) => {
  const kms = new Client(config)

  const getDataKey = async () => {
    const { CiphertextBlob, Plaintext } = await kms
      .generateDataKey({
        KeyId: keyId,
        KeySpec: 'AES_256'
      })

    return {
      encryptedKey: CiphertextBlob.toString('base64'),
      plaintextKey: Plaintext
    }
  }

  const decryptDataKey = async key => {
    const { Plaintext } = await kms
      .decrypt({
        CiphertextBlob: Buffer.from(key, 'base64')
      })

    return Plaintext
  }

  return {
    getDataKey,
    decryptDataKey
  }
}

export default awsKms
