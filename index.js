export { default as awsKms } from './lib/awsKms.js'
import crypto from 'crypto'

const defaults = {
  encoding: 'hex'
}

export const createEnvelopeEncryptor = (keyService, options = defaults) => {
  const { encoding } = options
  const algorithm = 'aes256'

  const { getDataKey, decryptDataKey } = keyService

  const encrypt = async (plaintext) => {
    const { encryptedKey, plaintextKey } = await getDataKey()
    const salt = Buffer.from(crypto.randomBytes(8)).toString('hex')
    const cipher = crypto.createCipheriv(algorithm, plaintextKey, salt)
    const ciphertext = [
      cipher.update(plaintext, 'utf8', encoding),
      cipher.final(encoding)
    ].join('')

    return {
      ciphertext,
      key: encryptedKey,
      salt
    }
  }

  const decrypt = async ({ ciphertext, key, salt }) => {
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
