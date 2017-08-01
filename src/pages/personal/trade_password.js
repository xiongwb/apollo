import React from 'react'

import {
  Dimensions,
  Text,
  Image,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  AsyncStorage,
  TextInput,
  Platform
} from 'react-native'
import {
  BasePage,
  BackNavBar,
  NavigatorUtils,
  Pertxtin,
  Moretxtin,
  PushLogin,
} from 'ApolloComponent'

import {
  EVENT_EMITTER_CONST,
  STORAGE_KEYS,
  Color,
} from 'ApolloConstant'

import { PlateFormUtils } from 'ApolloUtils';
import ApolloAPI from 'ApolloAPI';

var full_height = Dimensions.get('window').height

const styles = StyleSheet.create({
  root: {
    backgroundColor: Color.backgroundColor,
    flex: 1,
  },
  input_box: {
    borderColor: '#e5e5e5',
    backgroundColor: '#ffffff',
    marginBottom: 10,
  },
});

/**
*  设置页面
*  by fushang318
*/
class TradePassword extends BasePage {
 
 async toSetup(){
    let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
    let hash = JSON.parse(value);
      if(!!hash && hash.retCode == 1 && hash.retMsg){
        ApolloAPI.APIPersonal.haveTradePassword({
          telno:hash.retMsg
        }).done((res_json, res) => {
            if(res_json.retCode == 1&&res_json.settranpswdflag=='0'){
              PushLogin.push_login_destination('TradePasswordSetup',this.props.navigator,{validate:true})
            }else if(res_json.retCode == 1&&res_json.settranpswdflag=='1'){
              Alert.alert('提示','您已经设置过支付密码，请选择修改或重置支付密码')
            }else{
              Alert.alert('错误提示',res_json.retMsg)
            }
        })
      }else{
        PlateFormUtils.plateFormAlert(Platform,"错误提示","您还未登录或注册!");
        this.props.navigator.push({id:'Login',params:{}});
      }
  }

  async toModify(){
    let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
    let hash = JSON.parse(value);
      if(!!hash && hash.retCode == 1 && hash.retMsg){
        ApolloAPI.APIPersonal.haveTradePassword({
          telno:hash.retMsg
        }).done((res_json, res) => {
            if(res_json.retCode == 1&&res_json.settranpswdflag=='1'){
              PushLogin.push_login_destination('TradePasswordModify',this.props.navigator)
            }else if(res_json.retCode == 1&&res_json.settranpswdflag=='0'){
              Alert.alert('提示','您尚未设置支付密码')
            }else{
              Alert.alert('错误提示',res_json.retMsg)
            }
        })
      }else{
        PlateFormUtils.plateFormAlert(Platform,"错误提示","您还未登录或注册!");
        this.props.navigator.push({id:'Login',params:{}});
      }
  }

  async toReset(){
    let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
    let hash = JSON.parse(value);
    if(!!hash && hash.retCode == 1 && hash.retMsg){
      ApolloAPI.APIPersonal.haveTradePassword({
        telno:hash.retMsg
      }).done((res_json, res) => {
          if(res_json.retCode == 1&&res_json.settranpswdflag=='1'){
            PushLogin.push_login_destination('TradePasswordReset',this.props.navigator)
          }else if(res_json.retCode == 1&&res_json.settranpswdflag=='0'){
            Alert.alert('提示','您尚未设置支付密码')
          }else{
            Alert.alert('错误提示',res_json.retMsg)
          }
      })
    }else{
      PlateFormUtils.plateFormAlert(Platform,"错误提示","您还未登录或注册!");
      this.props.navigator.push({id:'Login',params:{}});
    }
  }

  render() {
    return (
      <View style={styles.root}>
        <BackNavBar
          component={this}>资金交易密码</BackNavBar>
        <View style={styles.input_box}>
          <Moretxtin 
            ImageLeft={require('apollo/src/image/transaction_password.png')} 
            invite_words='设置资金交易密码' 
            borderBottomWidth1={1}
            ImageRight={require('apollo/src/image/arrow_right.png')} 
            onPressButton={()=>this.toSetup()} 
            />
          <Moretxtin 
            ImageLeft={require('apollo/src/image/transaction_password.png')} 
            invite_words='修改资金交易密码' 
            borderBottomWidth1={1}
            ImageRight={require('apollo/src/image/arrow_right.png')} 
            onPressButton={()=>this.toModify()} 
            />
          <Moretxtin 
            ImageLeft={require('apollo/src/image/transaction_password.png')} 
            invite_words='重置资金交易密码' 
            borderBottomWidth1={0}
            ImageRight={require('apollo/src/image/arrow_right.png')} 
            onPressButton={()=>this.toReset()} 
            />
        </View>
      </View>
    )
  }
}

export default TradePassword
