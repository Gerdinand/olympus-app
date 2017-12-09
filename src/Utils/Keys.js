'use strict'

export function addressFromJSONString(jsonString) {
  try {
    var keyObj = JSON.parse(jsonString)
    var address = keyObj.address
    if (address == undefined || address == "") {
      throw new Error("Invalid keystore format")
    }
    return "0x" + address
  } catch (e) {
    throw new Error("Invalid keystore format")
  }
}
