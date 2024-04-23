import { createEnvelopeEncryptor, gcpKms } from '../../index.js'

;(async function () {
  const kms = gcpKms()
  // const { encrypt, decrypt } = createEnvelopeEncryptor(kms)

  // const plaintext = 'Hello, world!'

  // // encrypted is object containing ciphertext, key, and salt to store in db
  // const encrypted = await encrypt(plaintext)

  // // pass encrypted object to decrypt function to get plaintext
  // const decrypted = await decrypt(encrypted)

  // console.log(decrypted) // Hello, world!
}())
