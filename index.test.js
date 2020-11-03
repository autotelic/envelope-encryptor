const t = require('tap')
const crypto = require('crypto')
const createEnvelopeEncryptor = require('.')

const plaintextKey = crypto
  .createHash('sha256')
  .update('password')
  .digest()

const keyService = {
  getDataKey: () =>
    Promise.resolve({
      encryptedKey: 'foo',
      plaintextKey
    }),
  decryptDataKey: key => Promise.resolve(plaintextKey)
}

const encryptor = createEnvelopeEncryptor(keyService)

t.test('envelope encrypter', async t => {
  const result = await encryptor.encrypt('secret message')
  const { key } = result
  t.equal(key, 'foo', 'encryptedKey is from keyService.getDataKey')
  const secretMessage = await encryptor.decrypt(result)
  t.equal(
    secretMessage,
    'secret message',
    'given ciphertext, key and salt decrypt returns plaintext message'
  )
})
