import DeviceInfo from 'react-native-device-info'

/**
*  获取设备名称
*  by fushang318
*/
export default class DeviceUtils {
  static getPhoneName(){
    return `${DeviceInfo.getBrand()}::${DeviceInfo.getModel()}::${DeviceInfo.getDeviceId()}`
  }

  static getPhoneId(){
    return "xxxxx"
    // return DeviceInfo.getUniqueID()
  }
}