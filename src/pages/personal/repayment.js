import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ART,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  PixelRatio,
  AsyncStorage,
  ListView,
  Platform,
} from 'react-native';

import ApolloAPI from 'ApolloAPI';
import { PlateFormUtils, StringUtils } from 'ApolloUtils';
import { BackNavBar,Investtextinput,Recordfinctxt,BasePage,Loading,PushLogin} from 'ApolloComponent';
import { Color, STORAGE_KEYS, COMMON_CONFIG,EVENT_EMITTER_CONST } from 'ApolloConstant';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import Modal from 'react-native-root-modal';
import Icon from 'react-native-vector-icons/FontAwesome'

var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
var full_width = Dimensions.get('window').width
var full_height = Dimensions.get('window').height

/**
 * 融资记录
 * zqf
 * 20170419
 */
export default class Repayment extends BasePage {

	constructor(props) {
      super(props);
      this.state = {
        totalList:[],
        prepayFlag:'',
        modalVisible2:false,
        payDue:'',
        payInt:'',
        payGuaFee:'',
        payPlatCommission:'',
        payTot:'',
        prdname:'',
        map:'',
        finprepayappid:'',
        money:'',
        repayAllStatus:'',
      };
  }

  componentDidMount() {
    this.request_api();
    this.listener1 = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.REPAYSUCCESS,(value)=>{   
      if(value=="repaySuccess"){
        this.request_api();
      }
    });
    this.listener2 = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.REPAYALLSUCCESS,(value)=>{
      if(value=="repayAllSuccess"){
        this.request_api();
      }
    });
    this.listener3 = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.PAYFEESUCCESS,(value)=>{
      if(value=="payFeeSuccess"){
        this.request_api();
      }
    });
  }
  componentWillUnmount(){
    // 移除 一定要写
    this.listener1.remove();
    this.listener2.remove();
    this.listener3.remove();
  }
  
  get_loading() {
    return this.refs.loading;
  }

  renderRow(rowData,sectionId) {
    let planpaydue = rowData.planpaydue!=null && rowData.planpaydue!=""?StringUtils.moneyFormatData2Money(rowData.planpaydue):'0.00';
    let planpayint = rowData.planpayint!=null && rowData.planpayint!="" ?StringUtils.moneyFormatData2Money(rowData.planpayint):'0.00';
    let planpaycommission = rowData.planpaycommission!=null && rowData.planpaycommission!="" ?StringUtils.moneyFormatData2Money(rowData.planpaycommission):'0.00';
    //let planpaychannnelfee = rowData.planpaychannnelfee!=null && rowData.planpaychannnelfee!=""?StringUtils.moneyFormatData2Money(rowData.planpaychannnelfee):'0.00';
    let planpayguafee = rowData.planpayguafee!=null && rowData.planpayguafee!=""?StringUtils.moneyFormatData2Money(rowData.planpayguafee):'0.00';
    let planpaytotal = rowData.planpaytotal!=null && rowData.planpaytotal!=""?StringUtils.moneyFormatData2Money(rowData.planpaytotal):'0.00';
    return(
      <View style={{backgroundColor:'#ffffff',marginTop:9}}>
        <View style={{marginHorizontal:8,paddingHorizontal:8,borderColor:'#dddddd',borderWidth:onePt,backgroundColor:'#ffffff',borderRadius:5,height:180}}>
          <View style={{flex:1,flexDirection:'row',justifyContent:'space-around',alignItems:'center',borderBottomColor:'#dddddd',borderBottomWidth:1}}>
            <Text style={{flex:1,fontSize:16,fontWeight:'bold',color:'#101010'}}>期次：{rowData.payorder}</Text>
            <View style={{flexDirection:'row',flex:2,justifyContent:'flex-end',alignItems:'center'}}>
              <Text style={{fontSize:16,color:'#101010'}}>应还日期：</Text>
              <Text style={{fontSize:16,color:'#101010'}}>{rowData.planpaydate}</Text>
            </View>
          </View>
          <View style={{flex:2,flexDirection:'row',alignItems:'center',justifyContent:'center',borderBottomColor:'#dddddd',borderBottomWidth:onePt}} >
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontSize:14,color:'#ff7355',marginBottom:8}}>本期应还总额</Text>
              <Text style={{fontSize:14,color:'#ff7355'}}>{planpaytotal}</Text>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontSize:14,color:'#4d4d4d',marginBottom:8}}>应还本金</Text>
              <Text style={{fontSize:14,color:'#4d4d4d'}}>{planpaydue}</Text>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontSize:14,color:'#4d4d4d',marginBottom:8}}>应还利息</Text>
              <Text style={{fontSize:14,color:'#4d4d4d'}}>{planpayint}</Text>
            </View>
          </View>
          <View style={{flex:2,flexDirection:'row',alignItems:'center',justifyContent:'center'}} >
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontSize:14,color:'#4d4d4d',marginBottom:8}}>应还平台佣金</Text>
              <Text style={{fontSize:14,color:'#4d4d4d'}}>{planpaycommission}</Text>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontSize:14,color:'#4d4d4d',marginBottom:8}}>应还担保费</Text>
              <Text style={{fontSize:14,color:'#4d4d4d'}}>{planpayguafee}</Text>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontSize:14,color:'#4d4d4d',marginBottom:8}}></Text>
              <Text style={{fontSize:14,color:'#4d4d4d'}}></Text>
            </View>
          </View>
          <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderTopColor:'#dddddd',borderTopWidth:1}}>
            
            {
              (this.state.repayAllStatus == -1 || this.state.repayAllStatus == 2)  && (rowData.isallowpay=='1') ?
                <View style={{alignItems:'center',justifyContent:'center',borderColor:'#ED5565',borderWidth:1,borderRadius:2,height:25}}>
                  <Text style={{color:'#ED5565',fontSize:14,marginHorizontal:5}}>{rowData.paystatusname}</Text>
                </View>
                :
               (this.state.repayAllStatus == 4 || this.state.repayAllStatus == 1 || this.state.repayAllStatus == 3) && (rowData.isallowpay=='1' || rowData.isallowpay=='0')?
                <View style={{alignItems:'center',justifyContent:'center',borderColor:'#a19d9e',borderWidth:1,borderRadius:2,height:25}}>
                  <Text style={{color:'#a19d9e',fontSize:14,marginHorizontal:5}}>{rowData.paystatusname}</Text>
                </View>
                :
                null
            }
            

            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
              {
                this.state.repayAllStatus == 4  && (rowData.isallowpay=='1' || rowData.isallowpay=='0') ?
                  <TouchableOpacity style={{marginRight:10}} disabled={true}>
                    <View style={{alignItems:'center',justifyContent:'center',backgroundColor:'#a19d9e',width:50,height:20,borderRadius:2}}>
                      <Text style={{fontSize:10,color:'#ffffff',}}>审批中</Text>
                    </View>
                  </TouchableOpacity>
                  :
                  this.state.repayAllStatus == 3 && (rowData.isallowpay=='1' || rowData.isallowpay=='0') ?
                  <TouchableOpacity style={{marginRight:10}} disabled={true}>
                    <View style={{alignItems:'center',justifyContent:'center',backgroundColor:'#a19d9e',width:50,height:20,borderRadius:2}}>
                      <Text style={{fontSize:10,color:'#ffffff',}}>已结清</Text>
                    </View>
                  </TouchableOpacity>
                  :
                  this.state.repayAllStatus == 1 && (rowData.isallowpay=='1' || rowData.isallowpay=='0') ?
                  <TouchableOpacity style={{marginRight:10}} disabled={true}>
                    <View style={{alignItems:'center',justifyContent:'center',backgroundColor:'#a19d9e',width:50,height:20,borderRadius:2}}>
                      <Text style={{fontSize:10,color:'#ffffff',}}>已审核</Text>
                    </View>
                  </TouchableOpacity>
                  :
                  this.state.repayAllStatus !=0 && this.state.repayAllStatus != 3 && rowData.isallowpay == '1' ?
                  <TouchableOpacity style={{marginRight:10}} disabled={false} onPress={()=>this.reply(rowData)}>
                    <View style={{alignItems:'center',justifyContent:'center',backgroundColor:'#ED5565',width:50,height:20,borderRadius:2}}>
                      <Text style={{fontSize:10,color:'#ffffff',}}>还款</Text>
                    </View>
                  </TouchableOpacity>
                  :
                  this.state.repayAllStatus !=0 && this.state.repayAllStatus != 3 && rowData.isallowpay == '0' ?
                  <TouchableOpacity style={{marginRight:10}} disabled={true} onPress={()=>this.reply(rowData)}>
                    <View style={{alignItems:'center',justifyContent:'center',backgroundColor:'#a19d9e',width:50,height:20,borderRadius:2}}>
                      <Text style={{fontSize:10,color:'#ffffff',}}>不可还款</Text>
                    </View>
                  </TouchableOpacity>
                  :
                  null
              }
              
              
              {
                rowData.paystatus == 4 ?
                <TouchableOpacity onPress={()=>this.payPenalty(rowData)}>
                  <View style={{alignItems:'center',justifyContent:'center',backgroundColor:'#ED5565',width:50,height:20,borderRadius:2}}>
                    <Text style={{fontSize:10,color:'#ffffff',}}>罚息</Text>
                  </View>
                </TouchableOpacity>
                :
                null
              }
             
            </View>
          </View> 
        </View>
      </View>
    )
  }

  async request_api(){
    //提前结清状态
    ApolloAPI.APIPersonal.getPrePayStatus({
          prdCode:this.props.prdcode
        }).done(async(res_json, res)=>{
        let retCode = res_json.retCode;
        let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
        let hash = JSON.parse(value);
        
        //this.get_loading().show();
        //console.log(hash);
          //1.判断登录与否
          if(!!hash && hash.retCode == 1 && hash.retMsg){
            // this.get_loading().show();
            ApolloAPI.APIPersonal.getFinPayPlan({
              prdcode:this.props.prdcode
            }).done((res_json,res) => {
              if (res_json.retCode == '1' && res_json.list.length>0) {
                //this.get_loading().dismiss();
                this.setState({
                  repayAllStatus:retCode,
                  totalList:res_json.list,
                  prepayFlag:res_json.prepayflag
                })
              }else if(res_json.retCode == '1' && (res_json.list==null||res_json.list.length==0)){
                //this.get_loading().dismiss();
                PlateFormUtils.plateFormAlert(Platform,"提示","暂无数据");
              }else {
                //this.get_loading().dismiss();
                Alert.alert('错误提示', res_json.retMsg, [{ text: '确定'}])
              }
            })
          }else{
            //this.get_loading().dismiss();
            PlateFormUtils.plateFormAlert(Platform,"错误提示","您还未登录或注册!");
            this.props.navigator.push({
              id:'Login',params:{}
            });
          }
      })
  }
  payPenalty(rowData){
    PushLogin.push_login_destination('RepaymentPayPenalty',this.props.navigator,{prdcode:this.props.prdcode,finpayrcdid:rowData.finpayrcdid})
  }
  payFee(rowData){ 
    let finpayrcdid = null;
    if(rowData!=null){
     finpayrcdid= rowData.finpayrcdid;
    }
    PushLogin.push_login_destination('RepaymentPayFee',this.props.navigator,{prdcode:this.props.prdcode,finpayrcdid:finpayrcdid})
  }

  async reply(rowData){
    let planPayDue = rowData.planpaydue!=null && rowData.planpaydue!=""?rowData.planpaydue:0;
    let planPayInt = rowData.planpayint!=null && rowData.planpayint!=""?rowData.planpayint:0;
    let planpaytotal = rowData.planpaytotal!=null && rowData.planpaytotal!=null?rowData.planpaytotal:0;
    let planpaycommission = rowData.planpaycommission!=null && rowData.planpaycommission!="" ?rowData.planpaycommission:0;
    //let planpaychannnelfee = rowData.planpaychannnelfee!=null && rowData.planpaychannnelfee!=""?rowData.planpaychannnelfee:0;
    let planpayguafee = rowData.planpayguafee!=null && rowData.planpayguafee!=""?rowData.planpayguafee:0;
    let money = planPayDue + planPayInt;
    let moneyStr = StringUtils.moneyFormatData2Money(planpaytotal)
    Alert.alert('提示', '应还款总额：'+moneyStr, [
    { text: '取消'},
    { text: '确认', onPress: async() => {
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
                      //查询个人是否设置了免密
                      ApolloAPI.APIPersonal.getPerInfo({
                        //通过参数获取个人信息
                        telno:hash.retMsg
                      }).done((res_json, res)=>{
                        if(res_json.retCode === 1 && res_json.nopswdflag == 1){ //免密
                              ApolloAPI.APIPersonal.finPay({
                                finpayrcdid:rowData.finpayrcdid,
                                businessSeqNo:"",
                                //businessSeqNo2:"",
                                // businessSeqNo3:"",
                                //businessSeqNo4:"",
                              }).done((res_json,res) => {
                                this.get_loading().dismiss();
                                if (res_json.retCode == '1') {
                                  PlateFormUtils.plateFormAlert(Platform,"提示","还款成功");
                                  RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.REPAYSUCCESS, 'repaySuccess'); 
                                }else {
                                  PlateFormUtils.plateFormAlert(Platform,"错误提示",res_json.retMsg);
                                }
                              })
                          }else if(res_json.retCode === 1 && res_json.nopswdflag == 0){
                              this.get_loading().dismiss();
                              PushLogin.push_login_destination('TradePasswordValidate', this.props.navigator,{from:'repay',money:planpaytotal,planpaycommission:planpaycommission,planpayguafee:planpayguafee,finpayrcdid:rowData.finpayrcdid})
                          }else{
                              this.get_loading().dismiss();
                              PlateFormUtils.plateFormAlert(Platform,'错误提示',"免密协议信息未获得!");
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
    }
  ])
    
  }
  async confirmApply(){
    this.get_loading().show();
    let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
    let hash = JSON.parse(value);
    if(!!hash && hash.retCode == 1 && hash.retMsg){
        //查询个人是否设置了免密
        ApolloAPI.APIPersonal.getPerInfo({
          //通过参数获取个人信息
          telno:hash.retMsg
        }).done((res_json, res)=>{
          this.setState({
            modalVisible2:false,
          })
          if(res_json.retCode === 1 && res_json.nopswdflag == 1){ //免密
            ApolloAPI.APIPersonal.finPrePay({
              finprepayappid:this.state.finprepayappid,
              businessSeqNo:'',
              //businessSeqNo2:'',
              //businessSeqNo4:'',
            }).done((res_json,res) => {
              this.get_loading().dismiss();
              if (res_json.retCode == '1') {
                  RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.REPAYALLSUCCESS, 'repayAllSuccess'); 
                  this.props.navigator.pop();
                  PlateFormUtils.plateFormAlert(Platform,"提示","结清成功");
              }else {
                  PlateFormUtils.plateFormAlert(Platform,"提示",res_json.retMsg);
              }
            })
          }else if(res_json.retCode === 1 && res_json.nopswdflag == 0){
                this.get_loading().dismiss();
                PushLogin.push_login_destination('TradePasswordValidate', this.props.navigator,{from:'repayAll',money:this.state.money,data:{finprepayappid:this.state.finprepayappid,map:this.state.map}})
            }else{
                this.get_loading().dismiss();
                PlateFormUtils.plateFormAlert(Platform,'错误提示',"免密协议信息未获得!");
            }
          })
     } else{
        this.get_loading().dismiss();
        PlateFormUtils.plateFormAlert(Platform,"错误提示","您还未登录或注册!");
        this.props.navigator.push({id:'Login',params:{}});
      }
  }
  async replyAll(){
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
                //3.判断是否已申请提前结清
                ApolloAPI.APIPersonal.getPrePayStatus({
                  prdCode:this.props.prdcode
                }).done((res_json, res)=>{
                  //提前结清，审核通过
                  if(res_json.retCode === 1){
                    this.get_loading().dismiss();
                    
                    let money = res_json.map.payDue + res_json.map.payInt;
                    this.setState({
                      modalVisible2:true,
                      payDue:res_json.map.payDue,
                      payInt:res_json.map.payInt,
                      payGuaFee:res_json.map.payGuaFee,
                      payPlatCommission:res_json.map.payPlatCommission,
                      payTot:res_json.map.payTot,
                      prdname:this.props.prdinfo.prdname,
                      map:res_json.map,
                      finprepayappid:res_json.map.finprepayappid,
                      money:money
                    })
                  }else if(res_json.retCode === -1){//未申请
                      this.get_loading().dismiss();
                      //PlateFormUtils.plateFormAlert(Platform,'提示',"未申请");
                      PushLogin.push_login_destination('RepayAllApply', this.props.navigator,{prdinfo:this.props.prdinfo,data:res_json.map,AppalyFrom:res_json.retCode})
                  }else if(res_json.retCode === 4){//申请还未审批
                      this.get_loading().dismiss();
                      PushLogin.push_login_destination('RepayAllApply', this.props.navigator,{prdinfo:this.props.prdinfo,data:res_json.map,AppalyFrom:res_json.retCode})
                  }else if(res_json.retCode === 3){//已结清
                      this.get_loading().dismiss();
                      PlateFormUtils.plateFormAlert(Platform,'提示',"已结清");
                      //PushLogin.push_login_destination('RepayAllApply', this.props.navigator,{prdinfo:this.props.prdinfo})
                  }else if(res_json.retCode === 2){
                      this.get_loading().dismiss();
                    Alert.alert('提示', "申请被驳回!",
                    [
                      { text: '取消'},
                      { text: '重新申请', onPress: () => {
                        PushLogin.push_login_destination('RepayAllApply', this.props.navigator,{prdinfo:this.props.prdinfo,data:res_json.map,AppalyFrom:res_json.retCode})
                      }
                      }
                    ])
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
    if (this.state.totalList==null||this.state.totalList.length <= 0) {
      return (
          <View style={styles.container}>
            <BackNavBar style={{backgroundColor:'#ed5565'}} component={this}>还款记录</BackNavBar>
          </View>
        )
    }else{
      let list = this.state.totalList;
      // let num = 0;
      // for(let i in list){
      //   if(list[i].isallowpay=='1'){//可还款
      //     num = num + 1;
      //   }
      // }
      let dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.state.totalList);
      return (
        <View style={styles.container}>
          <Modal   
            style={{
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.2)'}}
            animationType={"fade"}
            transparent={true}
            visible={this.state.modalVisible2}>
            <View style={[styles.modalView,{height:0.45 * full_height,marginTop:0.28 * full_height}]}>
              <TouchableOpacity style={{alignSelf:'flex-end',marginRight:10,marginTop:5}} onPress={() => this.setState({modalVisible2:!this.state.modalVisible2})}>
                <Icon name='close' size={20} />
              </TouchableOpacity> 
                  <View style={[styles.modalTitle,{marginTop:5}]}>
                      <Text style= {[styles.modalText,{fontSize:20,color:'#333333',fontWeight:'bold'}]}>确认提前结清</Text>    
                  </View>
                  <View style={{marginTop:15}}>
                    
                  <View style={[styles.modalTitleDetail,{marginLeft:30,marginRight:30}]}>
                    <View style={{flex:1,flexDirection:'row'}}>
                      <Text style= {[styles.modalText,{flex:1,fontSize:16}]}>项目名称:</Text>    
                      <Text style= {[styles.modalText,{flex:2,fontSize:16}]}>{this.state.prdname}</Text> 
                    </View>
                  </View>
                  <View style={[styles.modalTitleDetail,{justifyContent:'space-around'}]}>
                    <View style={{flex:1,flexDirection:'row'}}>
                      <Text style= {[styles.modalText,{flex:1,fontSize:16}]}>提前还款本金:</Text>    
                      <Text style= {[styles.modalText,{flex:1,color:'#e35263',fontSize:16}]}>{this.state.payDue}</Text> 
                    </View>
                  </View>
                  <View style={[styles.modalTitleDetail,{justifyContent:'space-around'}]}>
                    <View style={{flex:1,flexDirection:'row'}}>
                      <Text style= {[styles.modalText,{flex:1,fontSize:16}]}>提前还款利息:</Text>    
                      <Text style= {[styles.modalText,{flex:1,color:'#e35263',fontSize:16}]}>{this.state.payInt}</Text> 
                    </View>
                  </View>
                  <View style={[styles.modalTitleDetail,{justifyContent:'space-around'}]}>
                    <View style={{flex:1,flexDirection:'row'}}>
                      <Text style= {[styles.modalText,{flex:1,fontSize:16}]}>提前还款担保费:</Text>    
                      <Text style= {[styles.modalText,{flex:1,color:'#e35263',fontSize:16}]}>{this.state.payGuaFee}</Text> 
                    </View>
                  </View>
                  <View style={[styles.modalTitleDetail,{justifyContent:'space-around'}]}>
                    <View style={{flex:1,flexDirection:'row'}}>
                      <Text style= {[styles.modalText,{flex:1,fontSize:16}]}>提前还款平台佣金:</Text>    
                      <Text style= {[styles.modalText,{flex:1,color:'#e35263',fontSize:16}]}>{this.state.payPlatCommission}</Text> 
                    </View>
                  </View>
                  <View style={[styles.modalTitleDetail,{justifyContent:'space-around'}]}>
                    <View style={{flex:1,flexDirection:'row'}}>
                      <Text style= {[styles.modalText,{flex:1,fontSize:16}]}>提前还款总额:</Text>    
                      <Text style= {[styles.modalText,{flex:1,color:'#e35263',fontSize:16}]}>{this.state.payTot}</Text> 
                    </View>
                  </View>
                </View>
                <View style={[styles.btnContainer,{marginTop:15}]}>
                <TouchableOpacity 
                  onPress={() => this.confirmApply()}
                  style={[styles.btn]} >
                    <Text style={[styles.textBtn]}>
                      提前结清
                    </Text>
                  </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <BackNavBar 
            style={{backgroundColor:'#ed5565'}} 
            component={this}
            rightContent={
                <View>
             {
            
              this.state.prepayFlag==1 && this.props.finstatus != 9 ?
              <View style={{flexDirection:'row',alignItems:'center',}}>
                <TouchableOpacity style={{borderColor:'#fff',borderRadius:4,borderWidth:onePt,width:65,height:30,alignItems:'center',justifyContent:'center'}} onPress={()=>this.replyAll()}>
                  <Text style={{fontSize:14,color:'#FFFFFF'}}>提前结清</Text>
                </TouchableOpacity>
              </View>
              :
              null
              
              
             } 
             </View>
              
            }
            >
            还款记录
          </BackNavBar>
          
          <ListView
          dataSource={dataSource}
          renderRow={this.renderRow.bind(this)}
          />
          <Loading ref={'loading'} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.backgroundColor,
  },
  textStyle: {
    fontSize:21,
    color:'gray'
  },
  modalView: {
    marginTop: 0.2 * full_height,
    marginLeft:15,
    marginRight:15,
    borderRadius:16,
    backgroundColor:'#fff',
    height:0.65 * full_height
  },
  modalTitle: {
    marginTop:55,
    marginLeft:50,
    marginRight:50
  },
  modalText: {
    fontSize:14,
    color:'#4d4d4d',
    alignSelf:'center'
  },
  modalTitleDetail: {
    marginLeft:30,
    marginRight:30,
    flexDirection:'row',
    height:24,
  },
  modalItems: {
    marginLeft:50,
    marginRight:50,
    flexDirection:'row',
    justifyContent:'space-between',
    height:40,
    alignItems:'center',
    borderTopColor:'#e5e5e5',
    borderTopWidth:onePt
  },
  modalItemsText1: {
    fontSize:14,
    color:'#4d4d4d',
  },
  modalItemsText2: {
    fontSize:14,
    color:'#f66111',
  },
  modalTitleText:{
    fontSize:34,
    color:'#fff',
    fontWeight:'bold'
  },
  modalTitleCom: {
    position:'absolute',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'transparent',
  },
  btn:{
    width:0.6 * full_width,
    borderRadius:8,
    backgroundColor:'#ED5565',
    height:0.07 * full_height,
    justifyContent:'center',
    alignItems:'center',
    overflow:'hidden'
  },
  textBtn: {
    fontSize:18,
    color:'#fff'
  },
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
});