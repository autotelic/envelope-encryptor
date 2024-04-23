import crypto from 'crypto'

const kekService = (base64Kek) => {
  const algorithm = 'aes256'
  const encoding = 'hex'
  const kek = Buffer.from(base64Kek, 'base64')

  const getDataKey = async () => {
    const plaintextKey = Buffer.from(crypto.randomBytes(32))
    const salt = Buffer.from(crypto.randomBytes(8)).toString('hex')

    const cipher = crypto.createCipheriv(algorithm, kek, salt)
    const ciphertext = [
      cipher.update(plaintextKey.toString('base64'), 'utf8', encoding),
      cipher.final(encoding)
    ].join('')
    return Promise.resolve({
      encryptedKey: `${ciphertext}:${salt}`,
      plaintextKey
    })
  }

  const decryptDataKey = async key => {
    const [ciphertext, salt] = key.split(':')
    const decipher = crypto.createDecipheriv(algorithm, kek, salt)
    const decipheredtext = [
      decipher.update(ciphertext, encoding, 'utf8'),
      decipher.final('utf8')
    ].join('')
    return Buffer.from(decipheredtext, 'base64')
  }

  return {
    getDataKey,
    decryptDataKey
  }
}

export default kekService
