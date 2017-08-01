
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
  Loading,
  PushLogin,
} from 'ApolloComponent'

import ApolloAPI from 'ApolloAPI';

import {
  COMMON_STYLES,
  EVENT_EMITTER_CONST,
  STORAGE_KEYS,
  COMMON_CONFIG,
  Color,
  DEFAULT_STYLES
} from 'ApolloConstant'

import { PlateFormUtils } from 'ApolloUtils';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

var full_height = Dimensions.get('window').height
var full_width = Dimensions.get('window').width;
var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度

class RepaymentPayPenalty extends BasePage {
   constructor(props){
    super(props);
      this.state = {
        feeTypeList:[],
        days:'',
        penaltyInt:'',
      };
  }

  get_loading() {
    return this.refs.loading;
  }

  setDays(value){
    let result = /^\+?[1-9]\d*$/.test(value); //正则表达式验证只能输入大于0的正整数
    //验证不通过，天数设置为空
    if(result ==false){
      this.setState({
        days:'',
        penaltyInt:'',
      });
    //通过，进行后台获取费用
    }else{
      this.setState({
        days:value,
      });
      //计算罚息
      ApolloAPI.APIPersonal.payPenalty({
        finpayrcdid:this.props.finpayrcdid,
        days:value
      }).done((res_json,res) => {
          
        if (res_json.retCode == '1') {
          this.setState({
            penaltyInt:res_json.feeSum+''
          })
        }else {
          Alert.alert('错误提示', res_json.retMsg)
        }
      })
    }
  }

  setPenaltyInt(text){
    this.setState({
      penaltyInt:text,
    });
    let result = /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,13}\.\d{0,2}$|^[1-9]\d{0,30}$/.test(text);
    if(result ==false){
      this.setState({
        penaltyInt:'',
      });
    }
  }

  async submit(){
    this.get_loading().show();
    //1.登录验证
    let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
    let hash = JSON.parse(value);
    if(!!hash && hash.retCode == 1 && hash.retMsg){
      ApolloAPI.APILogin.getloginState({
        tenantNo:COMMON_CONFIG.tenantNo
      }).done((res_json, res) => {
        if(res_json.retCode == 1){
          //2.绑卡验证
          ApolloAPI.APIcard.getIsBindList({
            telno:hash.retMsg,
          }).done((res_json, res)=>{
              if(res_json.retCode === 1 && res_json.bindList.length >0){
                  //获取个人的免密支付
                  ApolloAPI.APIPersonal.getPerInfo({
                    //通过参数获取个人信息
                    telno:hash.retMsg
                  }).done((res_json, res)=>{
                    if(res_json.retCode === 1 && res_json.nopswdflag == 1){ //免密
                        ApolloAPI.APIPersonal.savePenalty({
                          finpayrcdid:this.props.finpayrcdid,
                          penaltyInt:this.state.penaltyInt,
                          businessSeqNo:''
                        }).done((res_json,res) => {
                          this.get_loading().dismiss();
                          if (res_json.retCode == '1') {
                            PlateFormUtils.plateFormAlert(Platform,"提示","支付成功");
                            RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.PAYPENALTYSUCCESS, 'payPenaltyIntSuccess'); 
                          }else {
                            PlateFormUtils.plateFormAlert(Platform,"提示",res_json.retMsg);
                          }
                        })
                      }else if(res_json.retCode === 1 && res_json.nopswdflag == 0){
                          this.get_loading().dismiss();
                          PushLogin.push_login_destination('TradePasswordValidate', this.props.navigator,{from:'payPenalty',prdcode:this.props.prdcode,money:this.state.penaltyInt,data:{finpayrcdid:this.props.finpayrcdid,penaltyInt:this.state.penaltyInt}})
                      }else{
                          this.get_loading().dismiss();
                          PlateFormUtils.plateFormAlert(Platform,'错误提示',"信息未获得!");
                      }
                  })
                
              }else{
                this.get_loading().dismiss();
                PlateFormUtils.plateFormAlert(Platform,'错误提示',"您尚未绑卡!");
                this.props.navigator.push({id:"CardMagAddRelieve"})
              }
          })
        }else{
          this.get_loading().dismiss();
          PlateFormUtils.plateFormAlert(Platform,"提示","登录超时，为了安全，请重新登录!");
          this.props.navigator.push({id:'Login',params:{}});
        }
      })
    }else{
      this.get_loading().dismiss();
      PlateFormUtils.plateFormAlert(Platform,"错误提示","您还未登录或注册!");
      this.props.navigator.push({id:'Login',params:{}});
    }
  }

  render() {
    let disabled = true;
    if(this.state.days!=null && this.state.days!='' && this.state.penaltyInt!=null && this.state.penaltyInt!='' ){
      disabled = false;
    }
    return (
      <View style={styles.root}>
        <BackNavBar style={{backgroundColor:'#ed5565'}} component={this}>支付罚息</BackNavBar>
        <View style={{flex:1}}>
          <View style={styles.input_box}>
            <View style={{flexDirection:'row',paddingHorizontal:12,height:44,borderBottomColor:'#e5e5e5',borderBottomWidth:1}}>
              <View style={{flex:1,justifyContent:'center'}}><Text style={{fontSize:16,color:'#000000'}}>顺延天数：</Text></View>
              <View style={{flex:3,justifyContent:'center'}}>
                 <TextInput 
                  style={{height:44}}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  placeholder='请输入罚息顺延天数'
                  keyboardType='numeric'
                  value={this.state.days}
                  onChangeText={(value)=>this.setDays(value)}
                />
              </View>
            </View>
            <View style={{flexDirection:'row',paddingHorizontal:12,height:44,borderBottomColor:'#e5e5e5',borderBottomWidth:1}}>
              <View style={{flex:1,justifyContent:'center'}}><Text style={{fontSize:16,color:'#000000'}}>费   用：</Text></View>
              <View style={{flex:3,justifyContent:'center'}}>
                <TextInput 
                  style={{height:44}}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  placeholder='请输入支付费用'
                  keyboardType='numeric'
                  value={this.state.penaltyInt}
                  onChangeText={(value)=>this.setPenaltyInt(value)}
                />
              </View>
            </View>
          </View>
          <View style={{justifyContent: 'center',alignItems: 'center',marginTop: 15}}>
            <TouchableOpacity onPress={()=>this.submit()} disabled={disabled} style={[styles.submitBtn,{backgroundColor:disabled?'#a19d9e':'#ED5565'}]}>
              <Text style={styles.btnText}>确定</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.downView}>
            <View style={{flexDirection:'row',marginTop:24,alignItems:'center',marginLeft:5,marginRight:5}}>
                <Image style={{height:12,width:12,}} source={require('apollo/src/image/prompt.png')}/>
                <Text style={{marginLeft:4,fontSize:12,color:'#4d4d4d'}}>罚息顺延天数是指法定节假日跳过不计算入内,时间往后顺延。</Text>
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
  },
  downView:{
      marginTop:30,
      backgroundColor:'#ffffff',
  },
});


export default RepaymentPayPenalty