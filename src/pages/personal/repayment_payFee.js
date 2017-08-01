
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
import ModalDropdown from 'react-native-modal-dropdown';

var full_height = Dimensions.get('window').height
var full_width = Dimensions.get('window').width;
var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度

class RepaymentPayFee extends BasePage {
   constructor(props){
    super(props);
      this.state = {
        feeTypeList:[],
      };
  }

  componentDidMount(){
    //获取费用类型
    ApolloAPI.APIPersonal.getFeeType({
      dictCode:'FinFeeType'
    }).done((res_json,res) => {
      if (res_json.retCode == '1') {
        let feeTypeList = [];
        let dictkey = '';
        for(let i in res_json.list){
          feeTypeList.push(res_json.list[i].dictvalue);
          if(res_json.list[i].dictvalue=='平台佣金'){
            dictkey = res_json.list[i].dictkey
          }
        }
        this.setState({
          feeTypeList:feeTypeList,
          list:res_json.list,
          feeType:dictkey
        })
      }else {
        Alert.alert('错误提示', res_json.retMsg)
      }
    })
    //获取支付费用
    if(this.props.finpayrcdid!=null){
      ApolloAPI.APIPersonal.sumFee({
        finpayrcdid:this.props.finpayrcdid
      }).done((res_json,res) => {
        if (res_json.retCode == '1') {
          this.setState({
            fee:res_json.feeSum+''
          })
        }else {
          Alert.alert('错误提示', res_json.retMsg)
        }
      })
    }
  }

  get_loading() {
    return this.refs.loading;
  }

  setFee(value){
    if(value!=null && value>0 && this.state.feeType!=null){
      this.setState({
        fee:value,
      })
    }else{
      this.setState({
        fee:value,
      })
    }
  }

  setFeeType(index,value){
    let dictkey = '';
    for(let i in this.state.list){
      if(this.state.list[i].dictvalue==value){
        dictkey = this.state.list[i].dictkey
      }
    }
    this.setState({
      feeType:dictkey,
    })
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
                        ApolloAPI.APIPersonal.finFee({
                          feeType:this.state.feeType,
                          fee:this.state.fee,
                          businessSeqNo:''
                        }).done((res_json,res) => {
                          this.get_loading().dismiss();
                          if (res_json.retCode == '1') {
                            PlateFormUtils.plateFormAlert(Platform,"提示","支付成功");
                            RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.PAYFEESUCCESS, 'payFeeSuccess'); 
                          }else {
                            PlateFormUtils.plateFormAlert(Platform,"提示",res_json.retMsg);
                          }
                        })
                      }else if(res_json.retCode === 1 && res_json.nopswdflag == 0){
                          this.get_loading().dismiss();
                          PushLogin.push_login_destination('TradePasswordValidate', this.props.navigator,{from:'payFee',prdcode:this.props.prdcode,money:this.state.fee,data:{feeType:this.state.feeType,fee:this.state.fee}})
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

  renderRow(row){
    return (
      <View style={{height:30,justifyContent:'center'}}>
        <Text style={{fontSize:16,color:'#000000',marginLeft:7}}>{row}</Text>
      </View>
    )
  }

  render() {
    let disabled = true;
    if(this.state.fee!=null&&this.state.fee!=''&&this.state.feeType!=null){
      disabled = false;
    }
    let month = new Date().getMonth()+1;
    if(month.toString.length ==1){
        month= '0' + month;
    }
    let date=  new Date().getFullYear() + '-'+month+'-'+new Date().getDate();
    return (
      <View style={styles.root}>
        <BackNavBar style={{backgroundColor:'#ed5565'}} component={this}>支付费用</BackNavBar>
        <View style={{flex:1}}>
          <View style={styles.input_box}>
            <View style={{flexDirection:'row',paddingHorizontal:12,height:44,borderBottomColor:'#e5e5e5',borderBottomWidth:1}}>
              <View style={{flex:1,justifyContent:'center'}}><Text style={{fontSize:16,color:'#000000'}}>支付日期：</Text></View>
              <View style={{flex:3,justifyContent:'center'}}>
                <Text style={{fontSize:16,color:'#000000'}}>{date}</Text>
              </View>
            </View>
            <View style={{flexDirection:'row',paddingHorizontal:12,height:44,borderBottomColor:'#e5e5e5',borderBottomWidth:1}}>
              <View style={{flex:1,justifyContent:'center'}}><Text style={{fontSize:16,color:'#000000'}}>费用类型：</Text></View>
              <View style={{flex:3,justifyContent:'center',}}>
                <ModalDropdown 
                  textStyle={{fontSize:14,color:'#757575',}}
                  dropdownStyle={[{ height:92,width:0.3 * full_width,backgroundColor:'#fff',}]}
                  options={this.state.feeTypeList} 
                  defaultValue="平台佣金"
                  defaultIndex={1}
                  renderRow={row=>this.renderRow(row)}
                  onSelect={(index,value)=>this.setFeeType(index,value)}
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
                  value={this.state.fee}
                  onChangeText={(value)=>this.setFee(value)}
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


export default RepaymentPayFee