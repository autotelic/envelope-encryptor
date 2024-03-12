import crypto from 'crypto'

const dummyKms = () => {
  const getDataKey = async () => {
    const plaintextKey = crypto.randomBytes(20)
    return Promise.resolve({
      encryptedKey: plaintextKey.toString('base64'),
      plaintextKey
    })
  }

  const decryptDataKey = async key => Promise.resolve(Buffer.from(key, 'base64'))

  return {
    getDataKey,
    decryptDataKey
  }
}

export default dummyKms
