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
  Logintxtin,
  PushLogin,
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
import { observable, toJS } from 'mobx';
import validate from 'mobx-form-validate';
import ApolloAPI from 'ApolloAPI';

var Md5_Encrypt = require("crypto-js/md5"); //引入md5加密
const full_height = Dimensions.get('window').height
const full_width = Dimensions.get('window').width

class ForgetForm {
  
  @observable
  @validate(/^1(3|4|5|7|8)\d{9}$/, '请输入正确的手机号.')
  phoneNo = '';

  @observable
  @validate(/^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{6,30}$/, '密码必须为数字、字母的组合，长度为6-30位!')
  newPswd = '';

  @observable
  @validate(/^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{6,30}$/, '密码必须为数字、字母的组合，长度为6-30位!')
  confirmNewPswd = '';

  }



const styles = StyleSheet.create({
  root: {
    backgroundColor: "#fff",
    flex: 1,
  },

 input_box: {
    height: 45,
    marginHorizontal: 20,
    marginTop: 8,
    flexDirection: 'row',
    // borderColor: 'red',
    borderColor: '#e5e5e5',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 2,
    justifyContent:'center',
    alignItems:'center',
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
  font: {
    fontSize: 18,
    color:'#FFFFFF',
    textAlign: 'center'
  },
  error:{
    color:'red'
  }
});

/**
*  登录页面
*  by fushang318
*/
class Forgetpd extends BasePage {
  constructor(props) {
    super(props)
    this.state = {
      varCode: '',
      editable:false,
      verifyCode:'',
      m: 0,
      verified:false,
      haveVfcode:false,
      onChecked:false,
      disabled:true,
      secureTextEntry1:true,
      secureTextEntry2:true,
    }
  }

  get_loading() {
    return this.refs.loading;
  }

  form = new ForgetForm();

  onsubmit_1 =()=>{   
      //将json对象合并成一个对象
      var jsonbject2 = this.form;

     

      var resultJsonObject={};
      for(var attr in jsonbject2){
        resultJsonObject[attr]=jsonbject2[attr];
      }
      
      this.get_loading().show();

      if(this.state.verifyCode == ''){
        this.get_loading().dismiss();
        let tips = "错误提示";
        let showContent = "请先获取验证码!";
        PlateFormUtils.plateFormAlert(Platform,tips,showContent);
      }else if(this.state.verified == false){
        this.get_loading().dismiss();
        let tips = "错误提示";
        let showContent = "验证码不正确!";
        PlateFormUtils.plateFormAlert(Platform,tips,showContent);
      }else if(this.form.confirmNewPswd != this.form.newPswd){
        this.get_loading().dismiss();
        let tips = "错误提示";
        let showContent = "两次输入密码不一致!";
        PlateFormUtils.plateFormAlert(Platform,tips,showContent);
      }else{
        let newPswd = Md5_Encrypt(this.form.newPswd).toString();
        ApolloAPI.APILogin.forgot_pd({
          ...resultJsonObject,
          checkCode:this.state.checkCode,
          newPswd:newPswd,
          }).done((res_json, res) => {
            this.get_loading().dismiss();
            if(res_json.retCode == 1){
              PlateFormUtils.plateFormAlert(Platform,'提示','修改成功');
              this.props.navigator.pop();
            }else{
              let tips = "错误提示";
              let showContent = res_json.retMsg;
              PlateFormUtils.plateFormAlert(Platform,tips,showContent);
            }
          })
      }
  }

 //点击获取验证码按钮 触发这个方法，获取到手机验证码
    on_pushone() {
        let phoneNo= this.form.phoneNo;
        if(phoneNo == ''){
            let tips = "错误提示";
            let showContent = "获取验证码前必须先输入手机号码!";
            PlateFormUtils.plateFormAlert(Platform,tips,showContent);
        }else{
            Alert.alert('确认手机号', `短信验证码将发送到你的手机\n+86 ${phoneNo}`, [
                { text: '取消'},
                { text: '好的', onPress: () => {
                    this.get_loading().show();
                    ApolloAPI.APIRegister.getVarCode({
                            phoneNo: phoneNo,
                            flag:4,
                            tenantNo: COMMON_CONFIG.tenantNo,
                            //.done是什么意思,res_data_json这是从哪知道的，没有声明
                        }).done((res_data_json, res) => {
                          this.get_loading().dismiss();
                            console.log("收到的验证码是",res_data_json);
                            if (res_data_json.retCode == 1) { 
                              this.setState({editable:true})
                             } else {
                                let tips = "错误提示";
                                let showContent = res_data_json.retMsg;
                                PlateFormUtils.plateFormAlert(Platform,tips,showContent);
                            }
                        });
                        this.daojishi(60);
                    }
                },
            ])
           
        }     
        
    }
  //倒计时验证码，默认为60秒

  daojishi(m) {
      if (m > 0) {
         this.timer= setTimeout(() => {
              m = m - 1
              this.setState({ 
                  m: m ,
              })
          }, 1000)
      }
  }
  componentWillUnmount(){
    this.timer && clearTimeout(this.timer)
  }
 on_change_vfCode = (text) => {
        let phoneNo= this.form.phoneNo;
        this.setState({ verifyCode:text});      
        if(text.length == 6){
              ApolloAPI.APIRegister.validateVarCode({
                        phoneNo: phoneNo,
                       // flag:3,
                        varCode: text,
                    }).done((res_data_json, res) => {
                        if (res_data_json.retCode == 0) {
                            let tips = "错误提示";
                            let showContent = res_data_json.retMsg;
                            PlateFormUtils.plateFormAlert(Platform,tips,showContent);
                        }else{
                            this.setState({
                                verified:true,
                                haveVfcode:true,
                                checkCode:res_data_json.map.checkCode
                            })
                        }
                    });
        }
    }
  render() {
        let d;
        let t;
        let varCodeTextStyle;
        if (this.state.m == 0) {
            d = false;
            t = '获取验证码';
            varCodeTextStyle = { color: '#ffffff', fontSize: 14, marginHorizontal: 8 };
        } else {
            d = true;
            t = this.state.m + '秒后重发验证码';
            varCodeTextStyle = { color: '#cccccc', fontSize: 14, justifyContent: 'center' };
            this.daojishi(this.state.m);
        }

    return (
      <View style={styles.root}>
        <BackNavBar
          component={this}>忘记密码</BackNavBar>
          <FormProvider form={this.form}>
            <View>
              <Logintxtin name="phoneNo" ImageLeft={require('apollo/src/image/phone.png')} placeholder='请输入您的手机号' />
              <View style={styles.input_box}>
                  <View style={{ justifyContent: 'center', marginHorizontal: 8 }}>
                      <Image source={require('apollo/src/image/identifying_code.png')} />
                  </View>
                  <View style={{ flex: 1,justifyContent: 'center',}}>
                      <TextInput style={{height:45}}
                          //editable={this.state.editable}
                          onChangeText={this.on_change_vfCode.bind(this)}
                          underlineColorAndroid='rgba(0,0,0,0)'
                          placeholder='请输入您的验证码'
                          keyboardType='numeric'
                          value={this.state.verifyCode}
                      />
                  </View>
                  <View style={{ flex: 0.8, backgroundColor: d == true ? "#a19d9e" : "#ed5565", justifyContent: "center",alignItems:'center', borderRadius: 4, height: 32,marginRight:10 }}>
                      <TouchableOpacity disabled={d} onPress={this.on_pushone.bind(this)}>
                          <Text style={varCodeTextStyle}>{t}</Text>
                      </TouchableOpacity>
                  </View>
              </View>
              <Logintxtin secureTextEntry={this.state.secureTextEntry1} name="newPswd" ImageLeft={require('apollo/src/image/lock.png')} placeholder='请输入新密码' onPress={()=>this.setState({secureTextEntry1:!this.state.secureTextEntry1})} showPswd={true}/>
              <Logintxtin secureTextEntry={this.state.secureTextEntry2} name="confirmNewPswd" ImageLeft={require('apollo/src/image/lock.png')} placeholder='请确认新密码' onPress={()=>this.setState({secureTextEntry2:!this.state.secureTextEntry2})} showPswd={true}/>
              <View style={[styles.btnContainer]}>
                <Submit  onChecked={this.state.onChecked} containerStyle={[styles.btn]} textStyle={[styles.textBtn]} onSubmit={this.onsubmit_1}>提 交</Submit>
              </View>
          </View>
        </FormProvider>
         <Loading ref="loading" />
      </View>
    )
  }
}

export default Forgetpd
