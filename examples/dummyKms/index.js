import { createEnvelopeEncryptor, dummyKms } from '../../index.js'

;(async function () {
  const kms = dummyKms()
  const { encrypt, decrypt } = createEnvelopeEncryptor(kms)

  const plaintext = 'Hello, world!'

  // encrypted is object containing ciphertext, key, and salt to store in db
  const encrypted = await encrypt(plaintext)

  // pass encrypted object to decrypt function to get plaintext
  const decrypted = await decrypt(encrypted)

  console.log(decrypted) // Hello, world!
}())
