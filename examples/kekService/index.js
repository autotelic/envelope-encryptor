import crypto from 'crypto'
import { createEnvelopeEncryptor, kekService } from '../../index.js'

;(async function () {
  const base64Kek = crypto.randomBytes(32).toString('base64')
  const kms = kekService(base64Kek)
  const { encrypt, decrypt } = createEnvelopeEncryptor(kms)

  const plaintext = 'Hello, world!'

  // encrypted is object containing ciphertext, key, and salt to store in db
  const encrypted = await encrypt(plaintext)

  // pass encrypted object to decrypt function to get plaintext
  const decrypted = await decrypt(encrypted)

  console.log(decrypted) // Hello, world!

}())
