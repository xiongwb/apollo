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
class TradePasswordReset extends BasePage {
   constructor(props){
    super(props);
      this.state = {
        disabled:true,
        password:'',
        confirmPassword:'',
        validateCode:'',
        m:0,
      };
  }
  get_loading() {
    return this.refs.loading;
  }
  setPassword(text){
    this.setState({password:text})
    if(text.length==6&&this.state.confirmPassword!=null&&this.state.confirmPassword.length==6){
      this.setState({disabled:false})
    }else{
      this.setState({disabled:true})
    }
  }
  setConfirmPassword(text){
    this.setState({confirmPassword:text})
    if(this.state.password!=null&&this.state.password.length==6&&text.length==6){
      this.setState({disabled:false})
    }else{
      this.setState({disabled:true})
    }
    // if(value){
    //   let text = value.length>6?value.substring(0,6):value
    //   if(!isNaN(parseInt(text,10))){
    //     this.setState({confirmPassword:text})
    //     if(this.state.password!=null&&this.state.password.length==6&&text.length==6){
    //       this.setState({disabled:false})
    //     }else{
    //       this.setState({disabled:true})
    //     }
    //   }else{
    //     this.setState({disabled:true})
    //   }
    // }else{
    //   this.setState({confirmPassword:value,disabled:true})
    // }
  }
  _onBlur(){
     if(this.state.password!=this.state.confirmPassword){
      PlateFormUtils.plateFormAlert(Platform,'错误提示','两次密码不一致');
     }
  }
  getValidateCode() {
    this.get_loading().show();
    ApolloAPI.APILogin.getloginState({
      tenantNo:COMMON_CONFIG.tenantNo
    }).done(async(res_json, res) => {
        this.get_loading().dismiss();
        if(res_json.retCode == 1){
          let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
          let hash = JSON.parse(value);
          if(!!hash && hash.retCode == 1 && hash.retMsg){
            Alert.alert('确认手机号', `短信验证码将发送到你的手机\n+86 ${hash.retMsg}`, [
                { text: '取消'},
                { text: '好的', onPress: () => {
                    this.get_loading().show();
                    ApolloAPI.APIRegister.getVarCode({
                        phoneNo: hash.retMsg,
                        flag:5,
                        tenantNo: COMMON_CONFIG.tenantNo,
                    }).done((res_data_json, res) => {
                        this.get_loading().dismiss();
                        if (res_data_json.retCode != 1) { 
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
        }else{
          PlateFormUtils.plateFormAlert(Platform,"提示","登录超时，为了安全，请重新登录!");
          this.props.navigator.push({id:'Login',params:{}});
        }
    })
  }
  
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
   
  submit(){
    try {
      this.get_loading().show();
    ApolloAPI.APILogin.getloginState({
      tenantNo:COMMON_CONFIG.tenantNo
    }).done(async(res_json, res) => {
        if(res_json.retCode == 1){
          let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
          let hash = JSON.parse(value);
          if(!!hash && hash.retCode == 1 && hash.retMsg){
            if(this.state.validateCode == null || this.state.validateCode ==""){
              this.get_loading().dismiss();
              PlateFormUtils.plateFormAlert(Platform,'错误提示','验证码不能为空!');
            }else{
                ApolloAPI.APIRegister.validateVarCode({
              phoneNo:hash.retMsg,
              varCode:this.state.validateCode
            }).done((res_json, res) => {
                if(res_json.retCode == 1){
                  if(this.state.password===this.state.confirmPassword){
                    ApolloAPI.APIPersonal.updateTranPswd({
                      newPswd:this.state.password,
                      type:'3',
                      checkCode:res_json.map.checkCode
                    }).done((res_json, res) => {
                      this.get_loading().dismiss();
                      if(res_json.retCode == 1){
                        PlateFormUtils.plateFormAlert(Platform,'提示','重置交易密码成功！');
                        this.props.navigator.pop()
                      }else{
                        Alert.alert('错误提示',res_json.retMsg)
                      }
                    })
                  }else{
                    this.get_loading().dismiss();
                    PlateFormUtils.plateFormAlert(Platform,'错误提示','两次密码不一致');
                  }
                }else{
                  this.get_loading().dismiss();
                  PlateFormUtils.plateFormAlert(Platform,'错误提示','验证码有误');
                }
            })

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
        <BackNavBar style={{backgroundColor:'#ed5565'}} component={this}>重置交易密码</BackNavBar>
        <View style={{flex:1}}>
          <View style={styles.input_box}>
            <View style={{flexDirection:'row',paddingHorizontal:12,height:44,borderBottomColor:'#e5e5e5',borderBottomWidth:1}}>
              <View style={{flex:1,justifyContent:'center'}}><Text style={{fontSize:16,color:'#000000'}}>交易密码：</Text></View>
              <View style={{flex:3,justifyContent:'center'}}>
                <TextInput 
                  style={{height:44}}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  placeholder='请输入六位交易密码'
                  keyboardType='numeric'
                  secureTextEntry={true}
                  maxLength={6}
                  value={this.state.password}
                  onChangeText={value=>this.setPassword(value)}
                  />
              </View>
            </View>
            <View style={{flexDirection:'row',paddingHorizontal:12,height:44,borderBottomColor:'#e5e5e5',borderBottomWidth:1}}>
              <View style={{flex:1,justifyContent:'center'}}><Text style={{fontSize:16,color:'#000000'}}>确认密码：</Text></View>
              <View style={{flex:3,justifyContent:'center'}}>
                <TextInput 
                  style={{height:44}}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  placeholder='请再次输入交易密码'
                  keyboardType='numeric'
                  secureTextEntry={true}
                  maxLength={6}
                  onBlur={()=>this._onBlur()}
                  value={this.state.confirmPassword}
                  onChangeText={value=>this.setConfirmPassword(value)}
                  />
              </View>
            </View>
            <View style={{flexDirection:'row',paddingHorizontal:12,height:44,borderBottomColor:'#e5e5e5',borderBottomWidth:1}}>
              <View style={{flex:1,justifyContent:'center'}}><Text style={{fontSize:16,color:'#000000'}}>验证码：</Text></View>
              <View style={{flex:2,justifyContent:'center'}}>
                <TextInput 
                  style={{height:44}}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  keyboardType='numeric'
                  placeholder='请输入验证码'
                  value={this.state.validateCode}
                  onChangeText={value=>this.setState({validateCode:value})}
                  />
              </View>
              <View style={{flex:2,justifyContent: "center",alignItems:'center',}}>
                <TouchableOpacity disabled={d} onPress={this.getValidateCode.bind(this)}>
                  <View style={{ backgroundColor: d == true ? "#a19d9e" : "#ed5565", justifyContent: "center",alignItems:'center', borderRadius: 4, height: 35 }}>
                    <Text style={varCodeTextStyle}>{t}</Text>
                  </View>
                </TouchableOpacity>
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
export default TradePasswordReset