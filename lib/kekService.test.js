import crypto from 'crypto'
import t from 'tap'
import sinon from 'sinon'
import kekService from './kekService.js'

const base64Kek = crypto.randomBytes(32).toString('base64')
const kms = kekService(base64Kek)

t.test('kekService', async t => {
  const { encryptedKey, plaintextKey } = await kms.getDataKey()
  t.test('getDataKey', async t => {
    t.type(encryptedKey, 'string')
    t.type(plaintextKey, Buffer)
  })
  t.test('decryptDataKey', async t => {
    const decryptedKey = await kms.decryptDataKey(encryptedKey)
    t.same(decryptedKey, plaintextKey)
  })
})
