// @flow

const crypto = require('crypto')

type DecryptArgs = {
  ciphertext: string,
  key: string,
  salt: string,
};

const defaults = {
  encoding: 'hex'
}

const createEnvelopeEncryptor = (keyService, options = defaults) => {
  const { encoding } = options
  const algorithm = 'aes256'

  const { getDataKey, decryptDataKey } = keyService

  const encrypt = async (plaintext: string) => {
    const { encryptedKey, plaintextKey } = await getDataKey()
    const salt = Buffer.from(crypto.randomBytes(8)).toString('hex')
    const cipher = crypto.createCipheriv(algorithm, plaintextKey, salt)
    const ciphertext = [
      cipher.update(plaintext, 'utf8'),
      cipher.final(encoding)
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
      decipher.update(ciphertext, encoding, 'utf8'),
      decipher.final('utf8')
    ].join('')
  }

  return {
    decrypt,
    encrypt
  }
}

module.exports = createEnvelopeEncryptor
