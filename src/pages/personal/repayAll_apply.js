
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

class RepayAllApply extends BasePage {
   constructor(props){
    super(props);
      this.state = {
        disabled:true,
        payDue:'',
        payInt:'',
        payGuaFee:'',
        payPlatCommission:'',
        payTot :'',
        editable:true,
      };
  }

  get_loading() {
    return this.refs.loading;
  }

  setPayDue(value){
    this.setState({
      payDue:value,
      disabled:value!=null&&value.length>0&&value>=0
              &&this.state.payInt!=null&&this.state.payInt.length>0&&this.state.payInt>=0
              &&this.state.payGuaFee!=null&&this.state.payGuaFee.length>0&&this.state.payGuaFee>=0
              &&this.state.payPlatCommission!=null&&this.state.payPlatCommission.length>0&&this.state.payPlatCommission>=0
              &&this.state.payTot!=null&&this.state.payTot.length>0&&this.state.payTot>=0
              ?false:true
    })
  }

  setPayInt(value){
    this.setState({
      payInt:value,
      disabled:value!=null&&value.length>0&&value>=0
              &&this.state.payDue!=null&&this.state.payDue.length>0&&this.state.payDue>=0
              &&this.state.payGuaFee!=null&&this.state.payGuaFee.length>0&&this.state.payGuaFee>=0
              &&this.state.payPlatCommission!=null&&this.state.payPlatCommission.length>0&&this.state.payPlatCommission>=0
              &&this.state.payTot!=null&&this.state.payTot.length>0&&this.state.payTot>=0
              ?false:true
    })
  }
  setPayGuanFee(value){
    this.setState({
      payGuaFee:value,
      disabled:value!=null&&value.length>0&&value>=0
              &&this.state.payDue!=null&&this.state.payDue.length>0&&this.state.payDue>=0
              &&this.state.payInt!=null&&this.state.payInt.length>0&&this.state.payInt>=0
              &&this.state.payPlatCommission!=null&&this.state.payPlatCommission.length>0&&this.state.payPlatCommission>=0
              &&this.state.payTot!=null&&this.state.payTot.length>0&&this.state.payTot>=0
              ?false:true
    })
  }
  setPayCommission(value){
    this.setState({
      payPlatCommission:value,
      disabled:value!=null&&value.length>0&&value>=0
              &&this.state.payDue!=null&&this.state.payDue.length>0&&this.state.payDue>=0
              &&this.state.payInt!=null&&this.state.payInt.length>0&&this.state.payInt>=0
              &&this.state.payGuaFee!=null&&this.state.payGuaFee.length>0&&this.state.payGuaFee>=0
              &&this.state.payTot!=null&&this.state.payTot.length>0&&this.state.payTot>=0
              ?false:true
    })
  }
  setPayTot(value){
    this.setState({
      payTot:value,
      disabled:value!=null&&value.length>0&&value>=0
              &&this.state.payDue!=null&&this.state.payDue.length>0&&this.state.payDue>=0
              &&this.state.payInt!=null&&this.state.payInt.length>0&&this.state.payInt>=0
              &&this.state.payGuaFee!=null&&this.state.payGuaFee.length>0&&this.state.payGuaFee>=0
              &&this.state.payPlatCommission!=null&&this.state.payPlatCommission.length>0&&this.state.payPlatCommission>=0
              ?false:true
    })
  }
  componentWillMount(){
    //console.log("this.props.data",this.props.data)
    const {payDue,payInt,payGuaFee,payPlatCommission,payTot} = this.props.data;//提前还款本金,提前还款利息,提前还款担保费,提前还款平台佣金,提前还款总额
    this.setState({
      payDue:payDue+'',
      payInt:payInt+'',
      payGuaFee:payGuaFee+'',
      payPlatCommission:payPlatCommission+'',
      payTot:payTot+''
    })
    if(payDue>=0 || payInt>=0 || payGuaFee>=0 || payPlatCommission>= 0 || payTot>=0){
      this.setState({disabled:false})
    }
    //审批中
    if(this.props.AppalyFrom == 0){
      this.setState({
        editable:false
      })
    }
  }
  submit(){
    this.get_loading().show();
    ApolloAPI.APILogin.getloginState({
      tenantNo:COMMON_CONFIG.tenantNo
    }).done((res_json, res) => {
        if(res_json.retCode == 1){
          //Alert.alert(this.props.prdinfo.prdCode)
          ApolloAPI.APIPersonal.finPrePayApp({
            prdCode:this.props.prdinfo.prdcode,
            payDue:this.state.payDue,
            payInt:this.state.payInt,
            payGuaFee:this.state.payGuaFee,
            payPlatCommission:this.state.payPlatCommission,
            payTot:this.state.payTot
          }).done((res_json, res) => {
              if(res_json.retCode == 1){
                this.get_loading().dismiss();
                PlateFormUtils.plateFormAlert(Platform,"提示","已提交申请");
                this.props.navigator.pop();
              }else{
                this.get_loading().dismiss();
                Alert.alert('错误提示',res_json.retMsg)
              }
          })
        }else{
          this.get_loading().dismiss();
          PlateFormUtils.plateFormAlert(Platform,"提示","登录超时，为了安全，请重新登录!");
          this.props.navigator.push({
            id:'Login',params:{}
          });
        }
    })
  }

  render() {
    
    return (
      <View style={styles.root}>
        <BackNavBar style={{backgroundColor:'#ed5565'}} component={this}>提前还款申请</BackNavBar>
        <View style={{flex:1}}>
          <View style={styles.input_box}>
            <View style={{justifyContent:'center',paddingHorizontal:12,height:40,borderBottomColor:'#e5e5e5',borderBottomWidth:1}}>
              <Text style={{fontSize:16,color:'#000000'}}>{this.props.prdinfo.prdname}</Text>
            </View>
            <View style={{flexDirection:'row',paddingHorizontal:12,height:44,borderBottomColor:'#e5e5e5',borderBottomWidth:1}}>
              <View style={{flex:1,justifyContent:'center'}}><Text style={{fontSize:16,color:'#000000'}}>提前还款本金：</Text></View>
              <View style={{flex:1,justifyContent:'center'}}>
                <TextInput 
                  style={{height:44}}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  placeholder='请输入提前还款本金'
                  keyboardType='numeric'
                  editable={false}
                  value={this.state.payDue}
                  onChangeText={value=>this.setPayDue(value)}
                />
              </View>
            </View>
            <View style={{flexDirection:'row',paddingHorizontal:12,height:44,borderBottomColor:'#e5e5e5',borderBottomWidth:1}}>
              <View style={{flex:1,justifyContent:'center'}}><Text style={{fontSize:16,color:'#000000'}}>提前还款利息：</Text></View>
              <View style={{flex:1,justifyContent:'center'}}>
                <TextInput 
                  style={{height:44}}
                  editable={this.state.editable}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  placeholder='请输入提前还款利息'
                  keyboardType='numeric'
                  value={this.state.payInt}
                  onChangeText={value=>this.setPayInt(value)}
                  />
              </View>
            </View>
            <View style={{flexDirection:'row',paddingHorizontal:12,height:44,borderBottomColor:'#e5e5e5',borderBottomWidth:1}}>
              <View style={{flex:1,justifyContent:'center'}}><Text style={{fontSize:16,color:'#000000'}}>提前还款担保费：</Text></View>
              <View style={{flex:1,justifyContent:'center'}}>
                <TextInput 
                  style={{height:44}}
                  editable={this.state.editable}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  placeholder='请输入提前还款担保费'
                  keyboardType='numeric'
                  value={this.state.payGuaFee}
                  onChangeText={value=>this.setPayGuanFee(value)}
                  />
              </View>
            </View>
            <View style={{flexDirection:'row',paddingHorizontal:12,height:44,borderBottomColor:'#e5e5e5',borderBottomWidth:1}}>
              <View style={{flex:1,justifyContent:'center'}}><Text style={{fontSize:16,color:'#000000'}}>提前还款平台佣金：</Text></View>
              <View style={{flex:1,justifyContent:'center'}}>
                <TextInput 
                  style={{height:44}}
                  editable={this.state.editable}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  placeholder='请输入提前还款平台佣金'
                  keyboardType='numeric'
                  value={this.state.payPlatCommission}
                  onChangeText={value=>this.setPayCommission(value)}
                  />
              </View>
            </View>
            <View style={{flexDirection:'row',paddingHorizontal:12,height:44,borderBottomColor:'#e5e5e5',borderBottomWidth:1}}>
              <View style={{flex:1,justifyContent:'center'}}><Text style={{fontSize:16,color:'#000000'}}>提前还款总额：</Text></View>
              <View style={{flex:1,justifyContent:'center'}}>
                <TextInput 
                  style={{height:44}}
                  editable={this.state.editable}
                  underlineColorAndroid='rgba(0,0,0,0)'
                  placeholder='请输入提前还款总额'
                  keyboardType='numeric'
                  value={this.state.payTot}
                  onChangeText={value=>this.setPayTot(value)}
                  />
              </View>
            </View>
          </View>
          <View style={{justifyContent: 'center',alignItems: 'center',marginTop: 15}}>
          {
            this.props.AppalyFrom == -1 ?
            <View>
              <TouchableOpacity onPress={()=>this.submit()} disabled={this.state.disabled} style={[styles.submitBtn,{backgroundColor:this.state.disabled?'#a19d9e':'#ED5565'}]}>
                <Text style={styles.btnText}>申请</Text>
              </TouchableOpacity>    
            </View>
            :
            this.props.AppalyFrom == 4 ?
            <View>
              <TouchableOpacity disabled={true} style={[styles.submitBtn,{backgroundColor:'#a19d9e'}]}>
                <Text style={styles.btnText}>审批中</Text>
              </TouchableOpacity>    
            </View>
            :
            this.props.AppalyFrom == 2 ?
            <View>
              <TouchableOpacity onPress={()=>this.submit()} disabled={this.state.disabled} style={[styles.submitBtn,{backgroundColor:this.state.disabled?'#a19d9e':'#ED5565'}]}>
                <Text style={styles.btnText}>重新申请</Text>
              </TouchableOpacity>    
            </View>
            :
            null
          }
            
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


export default RepayAllApply