/*
* zgx
* 2017/03/27
*/
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
  PixelRatio
} from 'react-native'
import {
  BasePage,
  BackNavBar,
  NavigatorUtils,
  Logintxtin,

} from 'ApolloComponent'
import {
  Color, 
  COMMON_STYLES,
  EVENT_EMITTER_CONST,
  STORAGE_KEYS,
} from 'ApolloConstant'
import ModalDropdown from 'react-native-modal-dropdown';

var full_height = Dimensions.get('window').height
var full_width = Dimensions.get('window').width
var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
class RealNameAuth extends BasePage {
    alertItem(){
        alert('已提交！');
    }
  render() {

    return (
      <View style={styles.root}>
        <BackNavBar
          component={this}>实名认证</BackNavBar>
        <Text style={styles.warnning}>请确保以下信息真实有效：</Text>
        <Logintxtin ImageLeft={require('apollo/src/image/account_number.png')} placeholder='请输入您的真实姓名' />
        <Logintxtin ImageLeft={require('apollo/src/image/lock.png')} placeholder='请输入您的真实身份证号' />
       <View style={{ height: 44,marginHorizontal: 20, marginTop: 12,flexDirection: 'row', borderColor: '#e5e5e5',backgroundColor: '#ffffff',borderWidth: 1,borderRadius: 2,}}>
          <View style={{ justifyContent: 'center', marginHorizontal: 12 }}>
             <Image source={require('apollo/src/image/lock.png')}/>
          </View>
          <View style={{ flex: 1,justifyContent: 'center', }}>
             <ModalDropdown 
             defaultValue={'性别'}
             showsVerticalScrollIndicator={false} 
             style={{ flex: 1,justifyContent: 'center',width:0.75 * full_width}} 
             textStyle={{fontSize:14,color:'#909090'}}
             dropdownStyle={{flex: 1,width:0.75 * full_width,alignItems:'center',height:80,}}
             options={['男', '女']}/>
          </View>
        </View>
        <View style={[styles.btnContainer]}>
            <TouchableOpacity 
            onPress={this.alertItem.bind(this)}
            style={[styles.btn]} >
                <Text style={[styles.textBtn]}>
                    实名认证
                </Text>
            </TouchableOpacity>
        </View>
        <Text style={[styles.tip]}>
            *若实名认证不通过，请联系我们客服申请人工实名认证，客服电话：4006-099-296
        </Text>
          
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#fff',
    flex: 1,
  },
  warnning:{
    fontSize:14,
    color:'#333333',
    fontWeight:'bold',
    marginTop:10,
    marginLeft:10
  },
 btn:{
      width:0.9 * full_width,
      marginTop:30,
      borderRadius:8,
      backgroundColor:'#ED5565',
      height:0.06 * full_height,
      justifyContent:'center',
      alignItems:'center',
      overflow:'hidden'
  },
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  textBtn: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  tip:{
    marginTop:5,
    marginLeft:10,
    marginRight:10,
    fontSize: 12,
    color: '#909090',
    
  }
});

export default RealNameAuth
