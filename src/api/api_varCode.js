import APIFetch from 'APIFetch'

import {
  DeviceUtils,
} from 'ApolloUtils'

/**
* 请求向注册手机号发送验证码
＊ by fushang318
*/
const get = (data) => {
  let url = HOSTURL + '/varCode/get';
  //data.phoneId   = DeviceUtils.getPhoneId()
 // data.phoneName = DeviceUtils.getPhoneName()
  return APIFetch.post(url, data)
}

/**
* 验证手机号验证码是否正确
＊ by fushang318
*/
const validate = (data) => {
  let url = HOSTURL + '/varCode/validateVarCode';
 // data.phoneId   = DeviceUtils.getPhoneId()
  //data.phoneName = DeviceUtils.getPhoneName()
  return APIFetch.post(url, data)
}

export default {
  get,
  validate,
}
