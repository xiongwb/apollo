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
  Platform,
} from 'react-native'
import {
  BasePage,
  BackNavBar,
  NavigatorUtils,
  Logintxtin,
  FormProvider,
  Submit,
  Loading
} from 'ApolloComponent'
import {
  EVENT_EMITTER_CONST,
  STORAGE_KEYS,
  COMMON_CONFIG
} from 'ApolloConstant'
import { PlateFormUtils } from 'ApolloUtils';
import ApolloAPI from 'ApolloAPI';
import { observable, toJS } from 'mobx';
import validate from 'mobx-form-validate';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

var Md5_Encrypt = require("crypto-js/md5"); //引入md5加密
var full_width = Dimensions.get('window').width;
var full_height = Dimensions.get('window').height;
class LoginForm {
  @observable
  @validate(/^1(3|4|5|7|8)\d{9}$/,'请输入正确的手机号码!')
  phoneNo = '';
  @observable
  @validate(/^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{6,30}$/, '密码必须为数字、字母的组合，长度为6-30位!')
  pswd = '';
}
var full_height = Dimensions.get('window').height
const styles = StyleSheet.create({
  root: {
    backgroundColor: "#fff",
    flex: 1,
  },
  input_box: {
    height: 45,
    marginHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    // borderColor: 'red',
    borderColor: '#e5e5e5',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 2,
  },
  input_Login: {
    height: 45,
    marginHorizontal: 30,
    marginTop: 20,
    flexDirection: 'row',
    // borderColor: 'red',
    borderColor: '#e5e5e5',
    backgroundColor: '#ed5565',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent:'center',
    alignItems:'center'
  },
  sign_box: {
    paddingHorizontal: 10,
    //alignItems:'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 30,
  },
  forgetPwd_box: {
    paddingHorizontal: 10,
    alignItems: 'flex-end',
  },
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  btn:{
    width:0.8 * full_width,
    borderRadius:8,
    backgroundColor:'#a19d9e',
    height:0.06 * full_height,
    justifyContent:'center',
    alignItems:'center',
    overflow:'hidden'
  },
  textBtn: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});
/**
*  登录页面
*  by fushang318
*/
class Login extends BasePage {
  constructor(props){
    super(props);
    this.state={
      secureTextEntry:true,
    }
  }
  get_loading() {
    return this.refs.loading;
  }
  //new一个form表单
  form = new LoginForm();
  _onsubmit = async () =>{
    this.get_loading().show();//？？？这里异步提交show表示的加载页面的的内容提交是吗
    let tenantNo = COMMON_CONFIG.tenantNo;
    let channel =  COMMON_CONFIG.channel;
    let pswd = this.form.pswd;
    let phoneNo = this.form.phoneNo;
    //把密码进行MD5值加密
    let passwd = Md5_Encrypt(pswd).toString();
    //alert(passwd);
    //租户号
    //let jsonbject1 = {tenantNo:tenantNo,pswd:passwd,phoneNo:phoneNo};
    //将json对象合并成一个对象
    //let jsonbject2 = this.form;
    //循环form里的参数phoneNo，pswd,,,
    //let resultJsonObject={};
    //循环，最后都放入resultJsonObject
    // for(var attr in jsonbject1){
    //   resultJsonObject[attr]=jsonbject1[attr];
    // }
    // for(var attr in jsonbject2){
    //   resultJsonObject[attr]=jsonbject2[attr];
    // }
    ApolloAPI.APILogin.signIn(
     {tenantNo:tenantNo,channel:channel,pswd:passwd,phoneNo:phoneNo}
      ).done(async (res_data, res) => {
        if(res_data.retCode == 1){  
        //等待异步保存登录状态的数据      
        await AsyncStorage.setItem(STORAGE_KEYS.SIGN_TOKEN, JSON.stringify(res_data))
        //登录成功后更改我的界面
        RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.DIDLOGINSUCCESS, 'login'); 
        //跳转首页
        this.props.navigator.pop();
        this.get_loading().dismiss();
      }else{
          this.get_loading().dismiss();
          let tips = "错误提示";
          let showContent = res_data.retMsg;
          PlateFormUtils.plateFormAlert(Platform,tips,showContent);
        }
      })
  }
  render() {
    return (
      <View style={styles.root}>
        <BackNavBar component={this}>登录</BackNavBar>
        <FormProvider form={this.form}>
          <View>
            <Logintxtin name="phoneNo" ImageLeft={require('apollo/src/image/account_number.png')} placeholder='请输入账号' ></Logintxtin>
            <Logintxtin secureTextEntry={this.state.secureTextEntry}  name="pswd" ImageLeft={require('apollo/src/image/lock.png')} placeholder='请输入密码' onPress={()=>this.setState({secureTextEntry:!this.state.secureTextEntry})} showPswd={true}></Logintxtin>
            <View style={[styles.btnContainer]}>
                <Submit onChecked={false} haveVfcode={false} containerStyle={[styles.btn]} textStyle={[styles.textBtn]} onSubmit={this._onsubmit}>登录</Submit>
            </View>
          </View>
        </FormProvider>
        <View style={styles.sign_box}>
          <View style={{ flexDirection: 'row' }}>
            <Image source={require('apollo/src/image/registe_now.png')} />
            <Text onPress={() => this.props.navigator.push({ id: 'Register', params: {} })} style={{ fontSize: 14, color: '#555555' }}>立即注册</Text>
          </View>
          <Text onPress={() => this.props.navigator.push({ id: 'Forgetpd', params: {} })} style={{ fontSize: 14, color: '#0073ff' }}>忘记密码?</Text>
        </View>
        <Loading ref="loading" />
      </View>
    )
  }
}
export default Login