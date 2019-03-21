

import { request, URLDefines } from '../../client.js'

const app = getApp()

function prepare(success) {
  app.makeActivity()
  request(URLDefines.addMerchantIntendedConst, {
    autoDealError: true,
    dateValidate: ({ inData }) => {
      return inData && inData.inmDealerType && inData.inmManagerType && inData.inmRank
    },
    complete: ({ inData }) => {
      app.hiddenActivity()
      success(inData)
    }
  })
}

module.exports = {
  prepare
}