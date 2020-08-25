// @flow

const crypto = require('crypto')

type DecryptArgs = {
  ciphertext: string,
  key: string,
  salt: string,
};

const createEnvelopeEncrypter = keyService => {
  const algorithm = 'aes256'

  const { getDataKey, decryptDataKey } = keyService

  const encrypt = async (plaintext: string) => {
    const { encryptedKey, plaintextKey } = await getDataKey()
    const salt = Buffer.from(crypto.randomBytes(8)).toString('hex')
    const cipher = crypto.createCipheriv(algorithm, plaintextKey, salt)
    const ciphertext = [
      cipher.update(plaintext, 'utf8'),
      cipher.final('hex')
    ].join('')
    return {
      ciphertext,
      key: encryptedKey,
      salt
    }
  }

  const decrypt = async ({ ciphertext, key, salt }: DecryptArgs) => {
    const dataKey = await decryptDataKey(key)
    const decipher = crypto.createDecipheriv(algorithm, dataKey, salt)
    return [
      decipher.update(ciphertext, 'hex', 'utf8'),
      decipher.final('utf8')
    ].join('')
  }

  return {
    decrypt,
    encrypt
  }
}

module.exports = createEnvelopeEncrypter
