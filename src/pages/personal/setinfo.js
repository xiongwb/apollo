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
  TextInput
} from 'react-native'
import {
  BasePage,
  BackNavBar,
  NavigatorUtils,
  Pertxtin,
  Moretxtin,

} from 'ApolloComponent'
import {
  EVENT_EMITTER_CONST,
  STORAGE_KEYS,
} from 'ApolloConstant'


var full_height = Dimensions.get('window').height

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#dddddd",
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
class Setinfo extends BasePage {
  change_Pwd = () =>{
   this.props.navigator.push({
     id: "ChangePwd", params: { }
   })
 }
   on_Press=()=>{
    this.props.navigator.push({id:'RealName',params:{}})
  }
 cardMag = () =>{
   this.props.navigator.push({
     id: "CardMagAddRelieve", params: { }
   })
 }
 
  render() {
    return (
      <View style={styles.root}>
        <BackNavBar
          component={this}>设置</BackNavBar>
        <View style={styles.input_box}>
          <Moretxtin ImageLeft={require('apollo/src/image/login_password.png')} invite_words='修改登录密码' borderBottomWidth1={1}
            ImageRight={require('apollo/src/image/arrow_right.png')} onPressButton={this.change_Pwd} />
            <Moretxtin ImageLeft={require('apollo/src/image/gesture_password.png')} invite_words='手势密码' borderBottomWidth1={1}
            ImageRight={require('apollo/src/image/arrow_right.png')} onPressButton={this.change_Pwd} />
            <Moretxtin ImageLeft={require('apollo/src/image/fingerprint.png')} invite_words='开启指纹验证' borderBottomWidth1={0}
            ImageRight={require('apollo/src/image/arrow_right.png')} onPressButton={this.change_Pwd} />
        </View>
        <View style={styles.input_box}>
          <Moretxtin ImageLeft={require('apollo/src/image/bank_card.png')} invite_words='银行卡管理' borderBottomWidth1={1}
            ImageRight={require('apollo/src/image/arrow_right.png')} onPressButton={this.cardMag} />
          <Moretxtin ImageLeft={require('apollo/src/image/my_message.png')} invite_words='实名认证' borderBottomWidth1={0}
            ImageRight={require('apollo/src/image/arrow_right.png')} onPressButton={this.on_Press} />
        </View>
      </View>
    )
  }
}

export default Setinfo
