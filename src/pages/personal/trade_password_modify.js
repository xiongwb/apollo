import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Alert,
  Platform,
  ScrollView,
  PixelRatio,
  Dimensions,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import {
  BackNavBar,
  BasePage,
  Pertxtin,
  Wcardtxtin,
  NavigatorUtils,
  Logintxtin,
  FormProvider,
  Submit,
  Loading
} from 'ApolloComponent'
import ApolloAPI from 'ApolloAPI';
import {
  COMMON_STYLES,
  EVENT_EMITTER_CONST,
  STORAGE_KEYS,
  COMMON_CONFIG,
  Color,
} from 'ApolloConstant'
import { PlateFormUtils } from 'ApolloUtils';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
var full_height = Dimensions.get('window').height
var full_width = Dimensions.get('window').width;
var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
class TradePasswordModify extends BasePage {
   constructor(props){
    super(props);
      this.state = {
        disabled:true,
        confirmPassword:'',
        newPassword:'',
        oldPassword:'',
      };
  }
  get_loading() {
    return this.refs.loading;
  }
  setOldPassword(text){
    this.setState({oldPassword:text});
    if(text.length==6&&this.state.newPassword!=null&&this.state.newPassword.length==6&&this.state.confirmPassword!=null&&this.state.confirmPassword.length==6){
      this.setState({disabled:false})
    }else{
      this.setState({disabled:true})
    }
  }
  setNewPassword(text){
    this.setState({newPassword:text});
    if(this.state.oldPassword!=null&&this.state.oldPassword.length==6&&text.length==6&&this.state.confirmPassword!=null&&this.state.confirmPassword.length==6){
      this.setState({disabled:false})
    }else{
      this.setState({disabled:true})
    }
  }
  setConfirmPassword(text){
    this.setState({confirmPassword:text});
    if(this.state.oldPassword!=null&&this.state.oldPassword.length==6&&this.state.newPassword!=null&&this.state.newPassword.length==6&&text.length==6){
      this.setState({disabled:false})
    }else{
      this.setState({disabled:true})
    }
  }
 
  submit(){
    try {
       this.get_loading().show();
    ApolloAPI.APILogin.getloginState({
      tenantNo:COMMON_CONFIG.tenantNo
    }).done(async (res_json, res) => {
        if(res_json.retCode == 1){
          let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
          let hash = JSON.parse(value);
          if(!!hash && hash.retCode == 1 && hash.retMsg){
                  if(this.state.newPassword===this.state.confirmPassword){
                    ApolloAPI.APIPersonal.updateTranPswd({
                      oldPswd:this.state.oldPassword,
                      newPswd:this.state.newPassword,
                      type:'2'
                    }).done((res_json, res) => {
                      if(res_json.retCode == 1){
                        this.get_loading().dismiss();
                        PlateFormUtils.plateFormAlert(Platform,'提示','修改交易密码成功！');
                        this.props.navigator.pop();
                      }else{
                        this.get_loading().dismiss();
                        PlateFormUtils.plateFormAlert(Platform,'错误提示',res_json.retMsg);
                      }
                    })
                  }else{
                    this.get_loading().dismiss();
                    PlateFormUtils.plateFormAlert(Platform,'错误提示','两次密码不一致');
                  }
          }
        }else{
          this.get_loading().dismiss();
          PlateFormUtils.plateFormAlert(Platform,"提示","登录超时，为了安全，请重新登录!");
          this.props.navigator.push({
            id:'Login',params:{}
          });
        }
    })
    } catch (error) {
      console.log(error.stack)
    }
  }
  render() {
    return (
      <View style={styles.root}>
        <BackNavBar style={{backgroundColor:'#ed5565'}} component={this}>修改交易密码</BackNavBar>
        <View style={{flex:1}}>
          <View style={styles.input_box}>
            <View style={{flexDirection:'row',paddingHorizontal:12,height:44,borderBottomColor:'#e5e5e5',borderBottomWidth:1}}>
              <View style={{flex:1,justifyContent:'center'}}><Text style={{fontSize:16,color:'#000000'}}>旧密码：</Text></View>
              <View style={{flex:3,justifyContent:'center'}}>
                <TextInput 
                  style={{height:44}}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  placeholder='请输入旧密码'
                  keyboardType='numeric'
                  secureTextEntry={true}
                  value={this.state.oldPassword}
                  maxLength={6}
                  onChangeText={value=>this.setOldPassword(value)}
                  />
              </View>
            </View>
            <View style={{flexDirection:'row',paddingHorizontal:12,height:44,borderBottomColor:'#e5e5e5',borderBottomWidth:1}}>
              <View style={{flex:1,justifyContent:'center'}}><Text style={{fontSize:16,color:'#000000'}}>新密码：</Text></View>
              <View style={{flex:3,justifyContent:'center'}}>
                <TextInput 
                  style={{height:44}}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  placeholder='请输入六位新密码'
                  keyboardType='numeric'
                  secureTextEntry={true}
                  maxLength={6}
                  value={this.state.newPassword}
                  onChangeText={value=>this.setNewPassword(value)}
                  />
              </View>
            </View>
            <View style={{flexDirection:'row',paddingHorizontal:12,height:44,borderBottomColor:'#e5e5e5',borderBottomWidth:1}}>
              <View style={{flex:1,justifyContent:'center'}}><Text style={{fontSize:16,color:'#000000'}}>确认密码：</Text></View>
              <View style={{flex:3,justifyContent:'center'}}>
                <TextInput 
                  style={{height:44}}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  placeholder='请再次输入新密码'
                  keyboardType='numeric'
                  maxLength={6}
                  secureTextEntry={true}
                  value={this.state.confirmPassword}
                  onChangeText={value=>this.setConfirmPassword(value)}
                  />
              </View>
            </View>
          </View>
          <View style={{justifyContent: 'center',alignItems: 'center',marginTop: 15}}>
            <TouchableOpacity onPress={()=>this.submit()} disabled={this.state.disabled} style={[styles.submitBtn,{backgroundColor:this.state.disabled?'#a19d9e':'#ED5565'}]}>
              <Text style={styles.btnText}>确定</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Loading ref="loading" />
      </View>  
    );
  }
}
const styles = StyleSheet.create({
  root: {
    backgroundColor: Color.backgroundColor,
    flex: 1,
  },
  input_box: {
    marginTop:0.03*full_height,
    backgroundColor: '#ffffff', 
  },
  submitBtn:{
    width:0.8 * full_width,
    borderRadius:8,
    //backgroundColor: '#ED5565',
    height:0.06 * full_height,
    justifyContent:'center',
    alignItems:'center',
    overflow:'hidden'
  },
  btnText:{
    fontSize: 16,
    color: '#FFFFFF',
  }
});
export default TradePasswordModify