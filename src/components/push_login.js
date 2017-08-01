import {
  AsyncStorage,
  Platform
} from 'react-native'

import {
  STORAGE_KEYS,
  COMMON_CONFIG
} from 'ApolloConstant'
import ApolloAPI from 'ApolloAPI';
import { PlateFormUtils } from 'ApolloUtils';
export default class PushLogin {
  
  static push_login_destination(destination,navigator,data){
    ApolloAPI.APILogin.getloginState({
          tenantNo:COMMON_CONFIG.tenantNo
        }).done((res_json, res) => {
                if(res_json.retCode == 1){
                    navigator.push({id: destination, params:data})
                }else{
                 //跳转登录页面
                  PlateFormUtils.plateFormAlert(Platform,"错误提示","您还未登录或注册!");
                  navigator.push({
                    id:'Login',params:{}
                  });
              }
    })

  }
  
 
}