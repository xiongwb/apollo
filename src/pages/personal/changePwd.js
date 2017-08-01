
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
import { Color } from 'ApolloConstant';
import {
  BackNavBar,
  BasePage,
  Pertxtin,
  Wcardtxtin,
  NavigatorUtils,
  Logintxtin,
  ChangePwdtxtin,
  FormProvider,
  Submit,
  Loading
} from 'ApolloComponent'

import ApolloAPI from 'ApolloAPI';
import { observable, toJS } from 'mobx';
import validate from 'mobx-form-validate';

import {
  COMMON_STYLES,
  EVENT_EMITTER_CONST,
  STORAGE_KEYS,
  COMMON_CONFIG
} from 'ApolloConstant'
import { PlateFormUtils } from 'ApolloUtils';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

var Md5_Encrypt = require("crypto-js/md5"); //引入md5加密
var full_height = Dimensions.get('window').height
var full_width = Dimensions.get('window').width;
var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
/**
 * 密码修改
 * zqf
 * 2017/04/19
 */
class ChangePwdForm {

  @observable
  @validate(/^[A-Za-z0-9]{6,30}$/, '密码必须为数字、字母的组合，长度为6-30位!')
  oldPswd = '';

  @observable
  @validate(/^[A-Za-z0-9]{6,30}$/, '密码必须为数字、字母的组合，长度为6-30位!')
  newPswd = '';

  @observable
  @validate(/^[A-Za-z0-9]{6,30}$/, '密码必须为数字、字母的组合，长度为6-30位!')
  confirmPswd = '';

}

class ChangePwd extends BasePage {
   constructor(props){
    super(props);
      this.state = {
      oldPswd: '',
      newPswd:'',
      confirmPswd:'',
      isPickerVisible: false,
      disabled:false,
    };
  }

  componentDidMount(){
    this.request_api();
  }
  async request_api(){
    let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
    let hash = JSON.parse(value);
    //console.log(hash);
    //1.判断登录与否
    if(!!hash && hash.retCode == 1 && hash.retMsg){
      this.setState({phoneNo:hash.retMsg})
    }else{
      PlateFormUtils.plateFormAlert(Platform,"错误提示","您还未登录或注册!");
      this.props.navigator.push({
        id:'Login',params:{}
      });
    }
  }
  get_loading() {
    return this.refs.loading;
  }

  //new一个form表单
  form = new ChangePwdForm();
    onsubmit_1 = async () =>{
    //let oldPswd = this.state.oldPswd;
    //let newPswd = this.state.newPswd;
    let oldPswd = Md5_Encrypt(this.form.oldPswd).toString();
    let newPswd = Md5_Encrypt(this.form.newPswd).toString();  
    if(this.form.newPswd!=this.form.confirmPswd){
      PlateFormUtils.plateFormAlert(Platform,"错误提示","两次密码不一致!");
    }else{
      this.get_loading().show();
      //将json对象合并成一个对象
    var jsonbject1= {oldPswd:oldPswd,newPswd:newPswd};
    //循环form里的参数phoneNo，pswd,,,
    let resultJsonObject={};
    //循环，最后都放入resultJsonObject
    for(var attr in jsonbject1){
      resultJsonObject[attr]=jsonbject1[attr];
    }
    ApolloAPI.APIPersonal.changePwd({
      ...resultJsonObject,//参数传给login_api
      phoneNo:this.state.phoneNo
      }).done((res_data, res) => {//成功后的操作，（返回的数据，响应）
        if(res_data.retCode == 1){     
        //console.log("res_data测试:",res_data),
         this.get_loading().dismiss();
          let tips = "成功提示";
          let showContent = res_data.retMsg;
          PlateFormUtils.plateFormAlert(Platform,tips,showContent);
          this.props.navigator.pop();
      }else{
          this.get_loading().dismiss();
          let tips = "错误提示";
          let showContent = res_data.retMsg;
          PlateFormUtils.plateFormAlert(Platform,tips,showContent);
        }
      })
      }

      
  }
    render() {
    return (
    <View style={styles.root}>
        <BackNavBar  style={{backgroundColor:'#ed5565'}} component={this}>密码修改</BackNavBar>
        <ScrollView style={styles.excelContainer} showsVerticalScrollIndicator={false}>
        <FormProvider form={this.form}>
        <View>
            <View style={styles.input_box}>
              <ChangePwdtxtin  name="oldPswd" secureTextEntry bBWidthdraw={1} flexdraw={1.3} colorTex='#000000'  placeholder='请输入原密码' editable={true}>原密码</ChangePwdtxtin>
              <ChangePwdtxtin name="newPswd" secureTextEntry bBWidthdraw={1} flexdraw={1.3} colorTex='#000000' placeholder='请输入新密码' editable={true}>新密码</ChangePwdtxtin>
              <ChangePwdtxtin name="confirmPswd" secureTextEntry bBWidthdraw={1} flexdraw={1.3} colorTex='#000000' placeholder='请输入新密码' editable={true}>确认密码</ChangePwdtxtin>
              
            </View>   
              <View style={{height:full_height*0.15,borderTopColor:'#dddddd',borderTopWidth:1}}>
                <View style={{marginTop:12,flexDirection:'row',}}>
                  <Image style={{marginLeft:14,height:12,width:12,marginTop:4,}} source={require('apollo/src/image/prompt.png')}/>
                    <Text style={{fontSize:14,color:'#808080',marginLeft:4,marginRight:full_width*0.09}}>提示：原密码输错五次将被锁定；新密码要求:密码必须为数字、字母的组合，长度为6-30位，且不能为连续的数字或字母。</Text>
                </View>   
              </View> 
             <View style={[styles.btnContainer]}>
              <Submit  containerStyle={[styles.btn]} textStyle={[styles.textBtn]} onSubmit={this.onsubmit_1}>完  成</Submit>
            </View>
      </View>
       </FormProvider>
      </ScrollView>
      <Loading ref="loading" />
</View>  
    );
  }
}

const styles = StyleSheet.create({

   root: {
    backgroundColor: '#ffffff',//页面的布局和颜色
    flex: 1,
  },
  verification: {
        height: 44,
        width:full_width,
        flexDirection: 'row',
        borderColor: '#e5e5e5',
        backgroundColor: '#ffffff',

    },
 input_box: {
    height: full_height/4,
    backgroundColor: '#ffffff', 
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.backgroundColor,
  },
  // submitStyle:{
  //     height:44, 
  //     flexDirection:'row',
  //     marginHorizontal:12,
  //     justifyContent: "center",
  //     alignItems:'center',
  //     backgroundColor:'#ed5565', 
  //     borderRadius: 8,
  //     marginTop:30
  //   },
  btnContainer:{
      height:44,
      marginHorizontal:12,
      justifyContent: "center",
      alignItems:'center',
      marginTop:30
    },
  btn:{
    width:0.8 * full_width,
    height:44,
    borderRadius:8,
    backgroundColor:'#a19d9e',//灰色
    justifyContent:'center',
    alignItems:'center',
    overflow:'hidden'
  },
  textBtn: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});


export default ChangePwd