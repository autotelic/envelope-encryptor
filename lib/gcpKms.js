import { KeyManagementServiceClient } from '@google-cloud/kms'

const gcpKms = (Client = KeyManagementServiceClient) => {
  const client = new Client()
  const locationName = client.locationPath('cdo-shaktireforestation-pr-36', locationId)

  const getDataKey = async () => {
    return {
      encryptedKey: '',
      plaintextKey: ''
    }
  }

  const decryptDataKey = async key => {
    return ''
  }

  return {
    getDataKey,
    decryptDataKey
  }
}

export default gcpKms
