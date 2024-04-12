import t from 'tap'
import sinon from 'sinon'
import awsKms from './awsKms.js'

const config = { foo: 'bar' }
const keyId = 'keyId'
const ciphertextBlob = Uint8Array.from('thing')
const encryptedKey = Buffer.from(ciphertextBlob).toString('base64')
const plaintextKey = Uint8Array.from('something')
const Client = sinon.stub()
const generateDataKeyStub = sinon.stub().returns({
  CiphertextBlob: ciphertextBlob,
  Plaintext: plaintextKey
})
const decryptStub = sinon.stub().returns({
  Plaintext: plaintextKey
})

Client.prototype.generateDataKey = generateDataKeyStub
Client.prototype.decrypt = decryptStub

t.test('awsKms', async t => {
  t.test('with default parameters', async t => {
    awsKms(keyId)
  })
  const keyService = awsKms(keyId, config, Client)
  t.test('instantiates Client', async t => {
    sinon.assert.calledWithNew(Client, config)
  })
  t.test('getDataKey calls generateDataKey with keyId', async t => {
    const result = await keyService.getDataKey()
    generateDataKeyStub.calledWithExactly({
      KeyId: keyId,
      KeySpec: 'AES_256'
    })
    t.same(
      result,
      {
        encryptedKey,
        plaintextKey
      },
      'and returns encrypted and plaintext keys'
    )
  })
  t.test('decryptDataKey calls decrypt with key', async t => {
    const result = await keyService.decryptDataKey(encryptedKey)
    decryptStub.calledWithExactly({
      CiphertextBlob: ciphertextBlob
    })
    t.equal(result, plaintextKey, 'and returns plaintext key')
  })
})
