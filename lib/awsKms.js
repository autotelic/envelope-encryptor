const KMS = require('aws-sdk/clients/kms')

const awsKms = (keyId, config = {}, Client = KMS) => {
  const kms = new Client(config)

  const getDataKey = async () => {
    const { CiphertextBlob, Plaintext } = await kms
      .generateDataKey({
        KeyId: keyId,
        KeySpec: 'AES_256'
      })
      .promise()

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
      .promise()

    return Plaintext
  }

  return {
    getDataKey,
    decryptDataKey
  }
}

module.exports = awsKms
