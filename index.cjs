'use strict';

var crypto = require('crypto');
var AWS = require('@aws-sdk/client-kms');

function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var AWS__namespace = /*#__PURE__*/_interopNamespaceDefault(AWS);

const awsKms = (keyId, config = {}, Client = AWS__namespace.KMS) => {
  const kms = new Client(config);

  const getDataKey = async () => {
    const { CiphertextBlob, Plaintext } = await kms
      .generateDataKey({
        KeyId: keyId,
        KeySpec: 'AES_256'
      });

    return {
      encryptedKey: (Buffer.from(CiphertextBlob)).toString('base64'),
      plaintextKey: Plaintext
    }
  };

  const decryptDataKey = async key => {
    const { Plaintext } = await kms
      .decrypt({
        CiphertextBlob: Buffer.from(key, 'base64')
      });

    return Plaintext
  };

  return {
    getDataKey,
    decryptDataKey
  }
};

const dummyKms = () => {
  const getDataKey = async () => {
    const plaintextKey = crypto.randomBytes(32);
    return Promise.resolve({
      encryptedKey: plaintextKey.toString('base64'),
      plaintextKey
    })
  };

  const decryptDataKey = async key => Promise.resolve(Buffer.from(key, 'base64'));

  return {
    getDataKey,
    decryptDataKey
  }
};

const kekService = (base64Kek) => {
  const algorithm = 'aes256';
  const encoding = 'hex';
  const kek = Buffer.from(base64Kek, 'base64');

  const getDataKey = async () => {
    const plaintextKey = Buffer.from(crypto.randomBytes(32));
    const salt = Buffer.from(crypto.randomBytes(8)).toString('hex');

    const cipher = crypto.createCipheriv(algorithm, kek, salt);
    const ciphertext = [
      cipher.update(plaintextKey.toString('base64'), 'utf8', encoding),
      cipher.final(encoding)
    ].join('');
    return Promise.resolve({
      encryptedKey: `${ciphertext}:${salt}`,
      plaintextKey
    })
  };

  const decryptDataKey = async key => {
    const [ciphertext, salt] = key.split(':');
    const decipher = crypto.createDecipheriv(algorithm, kek, salt);
    const decipheredtext = [
      decipher.update(ciphertext, encoding, 'utf8'),
      decipher.final('utf8')
    ].join('');
    return Buffer.from(decipheredtext, 'base64')
  };

  return {
    getDataKey,
    decryptDataKey
  }
};

const defaults = {
  encoding: 'hex'
};

const createEnvelopeEncryptor = (keyService, options = defaults) => {
  const { encoding } = options;
  const algorithm = 'aes256';

  const { getDataKey, decryptDataKey } = keyService;

  const encrypt = async (plaintext) => {
    const { encryptedKey, plaintextKey } = await getDataKey();
    const salt = Buffer.from(crypto.randomBytes(8)).toString('hex');
    const cipher = crypto.createCipheriv(algorithm, plaintextKey, salt);
    const ciphertext = [
      cipher.update(plaintext, 'utf8', encoding),
      cipher.final(encoding)
    ].join('');

    return {
      ciphertext,
      key: encryptedKey,
      salt
    }
  };

  const decrypt = async ({ ciphertext, key, salt }) => {
    const dataKey = await decryptDataKey(key);
    const decipher = crypto.createDecipheriv(algorithm, dataKey, salt);
    return [
      decipher.update(ciphertext, encoding, 'utf8'),
      decipher.final('utf8')
    ].join('')
  };

  return {
    decrypt,
    encrypt
  }
};

exports.awsKms = awsKms;
exports.createEnvelopeEncryptor = createEnvelopeEncryptor;
exports.dummyKms = dummyKms;
exports.kekService = kekService;
