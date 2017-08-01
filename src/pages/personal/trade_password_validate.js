
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
  NativeModules,
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
  NSKeyboardIOS,
  //NSKeyboardAndroid,
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

//var NSKeyboardManager = NativeModules.NSKeyboard;
var full_height = Dimensions.get('window').height;
var full_width = Dimensions.get('window').width;
var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
//单期还款验密
class TradePasswordValidate extends BasePage {
   constructor(props){
    super(props);
      this.state = {
        disabled:true,
        password:'',
      };
  }

  get_loading() {
    return this.refs.loading;
  }

  setPassword(text){
    this.setState({password:text})
    if(text.length==6){
      this.setState({disabled:false})
    }
  }

  submit(){
      let password = '';
      password = this.state.password;
      this.commit(password);
  }

  commit(password){
    try {
        //投资验密
        if(this.props.from == 'invest'){
            this.get_loading().show();
            if(password == ''|| password == null){
              this.get_loading().dismiss();
              Alert.alert('错误提示','交易密码不能为空！')
            }else{
              ApolloAPI.APIPersonal.validateTranPswd({
                busiType:'T01',
                transPswd:this.state.password,
                money:this.props.money
              }).done((res_json,res) => {
                if (res_json.retCode == '1') {
                  ApolloAPI.APIInvest.doInvest({
                      ...this.props.data,
                      businessSeqNo:res_json.map.businessSeqNo
                    }).done((data, res) => {
                      this.get_loading().dismiss();
                      if(data.retCode == 1){
                        PlateFormUtils.plateFormAlert(Platform,"正确提示","投资成功!");
                        if(this.props.naviParam == 'home'){  //首页立即投资
                          this.props.navigator.popToTop();
                        }else if(this.props.naviParam == 'invest'){
                          this.props.navigator.popN(2);
                        }else if(this.props.naviParam == ''){
                          this.props.navigator.pop();
                        }
                        RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.INVESTSUCCESS, 'invest'); 
                        //this.props.navigator.pop();
                      }else if(data.retCode ==9){ //用户没有登录或登录超时
                        PlateFormUtils.plateFormAlert(Platform,"提示","登录超时，为了安全，请重新登录!");
                        //跳转到登录页面
                        this.props.navigator.push({
                          id:'Login',params:{}
                        });
                      }else {
                      PlateFormUtils.plateFormAlert(Platform,"错误提示",data.retMsg);
                      
                        if(this.props.naviParam == 'home'){  //首页立即投资
                          this.props.navigator.push({
                          id:'Dashboard',params:{}
                          });
                        }else if(this.props.naviParam == 'invest'){
                          this.props.navigator.pop();
                        }else if(this.props.naviParam == 'investDetail'){
                          RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.INVESTSUCCESS, 'invest'); 
                          this.props.navigator.pop();
                        }
                      }
                  })
                }else{
                  this.get_loading().dismiss();
                  PlateFormUtils.plateFormAlert(Platform,"错误提示",'交易密码不正确！');
                }
              })
            }

        }

        //免密支付
        if(this.props.from == 'noPswdPay'){
            this.get_loading().show();
            let busiType='';
            if(this.props.ifNoPswd == true){
              busiType='B04';//签协议
            }else{
              busiType='B05';//撤销协议
            }
              ApolloAPI.APIPersonal.validateTranPswd({
                busiType:busiType,
                transPswd:this.state.password,
                money:0
              }).done((res_json,res) => {
                if (res_json.retCode == '1') {
                  ApolloAPI.APIPersonal.signFreeAgreement({
                    telno:this.props.telno,
                    busiTradeType:busiType,
                    businessSeqNo:res_json.map.businessSeqNo
                  }).done((res_json,res) => {
                    this.get_loading().dismiss();
                    if (res_json.retCode == '1') {
                      PlateFormUtils.plateFormAlert(Platform,"提示","设置成功");
                      RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.NPSWDPAYSUCCESS, 'npPswdPaySuccess');
                      this.props.navigator.popN(2);
                    }else {
                      PlateFormUtils.plateFormAlert(Platform,"提示","设置失败");
                      this.props.navigator.popN(2);
                    }
                  })
                }else{
                  this.get_loading().dismiss();
                  Alert.alert('错误提示','交易密码不正确！')
                }
            })
        }

        //支付费用验密
        if(this.props.from == 'payFee'){
          this.get_loading().show();
          if(password == ''|| password == null){
            this.get_loading().dismiss();
            Alert.alert('错误提示','交易密码不能为空！')
          }else{
            ApolloAPI.APIPersonal.validateTranPswd({
              busiType:'T04',
              transPswd:this.state.password,
              money:this.props.money
            }).done((res_json,res) => {
              if (res_json.retCode == '1') {
                ApolloAPI.APIPersonal.finFee({
                  ...this.props.data,
                  businessSeqNo:res_json.map.businessSeqNo
                }).done((res_json,res) => {
                  this.get_loading().dismiss();
                  if (res_json.retCode == '1') {
                    PlateFormUtils.plateFormAlert(Platform,"提示","支付成功");
                    RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.PAYFEESUCCESS, 'payFeeSuccess'); 
                    this.props.navigator.popN(2);
                  }else {
                    Alert.alert('错误提示', res_json.retMsg)
                    this.props.navigator.popN(2);
                  }
                })
              }else{
                this.get_loading().dismiss();
                Alert.alert('错误提示','交易密码不正确！')
              }
            })
          }

        }


        //支付罚息验密
        if(this.props.from == 'payPenalty'){
            this.get_loading().show();
            if(password == ''|| password == null){
              this.get_loading().dismiss();
              Alert.alert('错误提示','交易密码不能为空！')
            }else{
              ApolloAPI.APIPersonal.validateTranPswd({
                busiType:'T04',
                transPswd:this.state.password,
                money:this.props.money
              }).done((res_json,res) => {
                if (res_json.retCode == '1') {
                  ApolloAPI.APIPersonal.savePenalty({
                    ...this.props.data,
                    businessSeqNo:res_json.map.businessSeqNo
                  }).done((res_json,res) => {
                    this.get_loading().dismiss();
                    if (res_json.retCode == '1') {
                      PlateFormUtils.plateFormAlert(Platform,"提示","支付成功");
                      RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.PAYPENALTYSUCCESS, 'payPenaltyIntSuccess'); 
                      this.props.navigator.popN(2);
                    }else {
                      Alert.alert('错误提示', res_json.retMsg)
                      this.props.navigator.popN(2);
                    }
                  })
                }else{
                  this.get_loading().dismiss();
                  Alert.alert('错误提示','交易密码不正确！')
                }
              })
            }
        }


        //充值验密
        if(this.props.from == 'recharge'){
            this.get_loading().show();
            if(password == ''|| password == null){
              this.get_loading().dismiss();
              Alert.alert('错误提示','交易密码不能为空！')
            }else{
              //if(this.props.rechangeCost == null || this.props.rechangeCost ==""){
                    ApolloAPI.APIPersonal.validateTranPswd({
                      busiType:'R01',
                      transPswd:password,
                      money:this.props.money
                    }).done((res_json,res) => {
                      if (res_json.retCode == '1') {
                        ApolloAPI.APIcard.getRecharge({
                          ...this.props.data,
                          businessSeqNo:res_json.map.businessSeqNo
                        }).done((res_json, res) => {
                          this.get_loading().dismiss();
                          if(res_json.retCode == 1){
                            let tips = "正确提示";
                            let showContent = res_json.retMsg;
                            RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.RECHARGESUCCESS, 'rechargeSuccess'); 
                            PlateFormUtils.plateFormAlert(Platform,tips,showContent);
                            this.props.navigator.popN(2);
                          
                          }else{
                            let tips = "错误提示";
                            let showContent = res_json.retMsg;
                            PlateFormUtils.plateFormAlert(Platform,tips,showContent);
                            this.props.navigator.popN(2);
                          }
                        })
                      }else{
                        this.get_loading().dismiss();
                        Alert.alert('错误提示','交易密码不正确！')
                      }
                    })
                // }else{
                //     ApolloAPI.APIPersonal.validateTranPswd({  //实际到账接口
                //     busiType:'R01',
                //     transPswd:password,
                //     money:this.props.actualAccount,
                //   }).done((res_json,res) => {
                //     if (res_json.retCode == '1') {
                //       let businessSeqNo1 = res_json.map.businessSeqNo;
                //       ApolloAPI.APIPersonal.validateTranPswd({  //手续费接口
                //           busiType:'T99',
                //           transPswd:password,
                //           money:this.props.rechangeCost,
                //         }).done((res_json,res) => {
                //           if (res_json.retCode == '1') {
                //               ApolloAPI.APIcard.getRecharge({
                //                 ...this.props.data,
                //                 businessSeqNo2:res_json.map.businessSeqNo,
                //                 businessSeqNo1:businessSeqNo1,
                //               }).done((res_json, res) => {
                //                 this.get_loading().dismiss();
                //                 if(res_json.retCode == 1){
                //                   let tips = "正确提示";
                //                   let showContent = res_json.retMsg;
                //                   PlateFormUtils.plateFormAlert(Platform,tips,showContent);
                //                   //发送广播，我的界面实时更新
                //                   RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.RECHARGESUCCESS, 'rechargeSuccess'); 
                //                   this.props.navigator.popN(2);
                //                   //提交成功，把界面pop出去
                //                 }else{
                //                   let tips = "错误提示";
                //                   let showContent = res_json.retMsg;
                //                   PlateFormUtils.plateFormAlert(Platform,tips,showContent);
                //                   this.props.navigator.popN(2);
                //                 }
                //               })
                //             }else{
                //               this.get_loading().dismiss();
                //               Alert.alert('错误提示','交易密码不正确！')
                //             }
                        
                //           })
                //     }else{
                //       this.get_loading().dismiss();
                //       Alert.alert('错误提示','交易密码不正确！')
                //     }
                //   })
                // }
            }
        }


        //还款验密
        if(this.props.from == 'repay'){
            this.get_loading().show();
            if(password == ''|| password == null){
              this.get_loading().dismiss();
              Alert.alert('错误提示','交易密码不能为空！')
            }else{
              let businessSeqNo1 = "";
              let businessSeqNo2 = "";
            // let businessSeqNo3 = "";
              let businessSeqNo4 = "";
              console.log(this.props.actpaycommission,this.props.actpaychannnelfee,this.props.actpayguafee)

              let money =  this.props.money !=0 ? this.props.money : 1;
              let actpaycommission =  this.props.planpaycommission !=0 ? this.props.planpaycommission : 1;
              //let actpaychannnelfee =  this.props.planpaychannnelfee !=0 ? this.props.planpaychannnelfee : 1;
              let actpayguafee =  this.props.planpayguafee !=0 ? this.props.planpayguafee : 1;
              //验密本金+利息
              ApolloAPI.APIPersonal.validateTranPswd({
                busiType:'T04',
                transPswd:this.state.password,
                money:money
              }).done((res_json,res) => {
                 if (res_json.retCode == '1') {
                   businessSeqNo = res_json.map.businessSeqNo;
                //   //验密佣金
                //   ApolloAPI.APIPersonal.validateTranPswd({
                //       busiType:'T99',
                //       transPswd:this.state.password,
                //       money:actpaycommission
                //     }).done((res_json,res) => {
                //       if (res_json.retCode == '1') {
                //           businessSeqNo2 = res_json.map.businessSeqNo;
                          //验密实际归还渠道费用
                          // ApolloAPI.APIPersonal.validateTranPswd({
                          //   busiType:'T99',
                          //   transPswd:this.state.password,
                          //   money:actpaychannnelfee
                          // }).done((res_json,res) => {
                            //if (res_json.retCode == '1') {
                            // businessSeqNo3 = res_json.map.businessSeqNo;
                              //验密实际归还担保费用
                              // ApolloAPI.APIPersonal.validateTranPswd({
                              //   busiType:'T99',
                              //   transPswd:this.state.password,
                              //   money:actpayguafee
                              // }).done((res_json,res) => {
                              //   if (res_json.retCode == '1') {
                              //     businessSeqNo4 = res_json.map.businessSeqNo;
                                      //进行还款
                                      ApolloAPI.APIPersonal.finPay({
                                        finpayrcdid:this.props.finpayrcdid,
                                        businessSeqNo:businessSeqNo,
                                      //  businessSeqNo2:businessSeqNo2,
                                      // businessSeqNo3:businessSeqNo3,
                                       // businessSeqNo4:businessSeqNo4,
                                      }).done((res_json,res) => {
                                        this.get_loading().dismiss();
                                        if (res_json.retCode == '1') {
                                          PlateFormUtils.plateFormAlert(Platform,"提示","还款成功");
                                          RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.REPAYSUCCESS, 'repaySuccess'); 
                                          this.props.navigator.pop();
                                        }else {
                                          PlateFormUtils.plateFormAlert(Platform,"错误提示",res_json.retMsg);
                                          this.props.navigator.pop();
                                        }
                                      })
                              //   }else{
                              //     this.get_loading().dismiss();
                              //     Alert.alert('错误提示','应还担保费验密不正确！')
                              //   }
                              // })
                          //   }else{
                          //     this.get_loading().dismiss();
                          //     Alert.alert('错误提示','应还渠道费用验密不正确！')
                          //   }
                          // })
              //         }else{
              //           this.get_loading().dismiss();
              //           Alert.alert('错误提示','应还平台佣金验密不正确！')
                      // }
                    // })
                }else{
                  this.get_loading().dismiss();
                  Alert.alert('错误提示','验密不正确！')
                }
              })
            }
        }


        //提前结清验密
        if(this.props.from == 'repayAll'){
            this.get_loading().show();
            let businessSeqNo1 = '';
            let businessSeqNo2 = '';
            let businessSeqNo4 = '';
            //let money = this.props.data.map.payDue + this.props.data.map.payInt;
            let money = this.props.data.map.payTot;
            money = money !=0 ? money : 1;
            let payGuaFee = this.props.data.map.payGuaFee !=0 ? this.props.data.map.payGuaFee : 1;
            let payPlatCommission = this.props.data.map.payPlatCommission !=0 ? this.props.data.map.payPlatCommission : 1;
            
            
            if(password == ''|| password == null){
              this.get_loading().dismiss();
              Alert.alert('错误提示','交易密码不能为空！')
            }else{
              ApolloAPI.APIPersonal.validateTranPswd({
                busiType:'T04',
                transPswd:password,
                money:money
              }).done((res_json,res) => {
                if (res_json.retCode == '1') {
                  businessSeqNo=res_json.map.businessSeqNo; 
                 //验密平台佣金
                  // ApolloAPI.APIPersonal.validateTranPswd({
                  //     busiType:'T99',
                  //     transPswd:this.state.password,
                  //     money:payPlatCommission
                  //   }).done((res_json,res) => {
                  //     if (res_json.retCode == '1') {
                  //         businessSeqNo2 = res_json.map.businessSeqNo;
                  //           //验密担保费
                  //           ApolloAPI.APIPersonal.validateTranPswd({
                  //               busiType:'T99',
                  //               transPswd:this.state.password,
                  //               money:payGuaFee
                  //             }).done((res_json,res) => {
                  //               if (res_json.retCode == '1') {
                  //                   businessSeqNo4 = res_json.map.businessSeqNo;
                                      ApolloAPI.APIPersonal.finPrePay({
                                        finprepayappid:this.props.data.finprepayappid,
                                        businessSeqNo:businessSeqNo,
                                        //businessSeqNo2:businessSeqNo2,
                                        //businessSeqNo4:businessSeqNo4,
                                      }).done((res_json,res) => {
                                        this.get_loading().dismiss();
                                        if (res_json.retCode == '1') {
                                          PlateFormUtils.plateFormAlert(Platform,"提示","结清成功");
                                          RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.REPAYALLSUCCESS, 'repayAllSuccess'); 
                                          this.props.navigator.popN(2);
                                        }else {
                                          PlateFormUtils.plateFormAlert(Platform,"提示",res_json.retMsg);
                                          this.props.navigator.popN(2);
                                        }
                                      })
                    //             }else{
                    //               this.get_loading().dismiss();
                    //               Alert.alert('错误提示','应还平台佣金验密不正确！')
                    //             }
                    //           })
                    //     }else{
                    //       this.get_loading().dismiss();
                    //       Alert.alert('错误提示','应还担保费验密不正确！')
                    //     }
                    // })
                }else{
                  this.get_loading().dismiss();
                  Alert.alert('错误提示','交易密码不正确！')
                }
              })
            }
        }


        //转让验密
        if(this.props.from == 'transferApply'){
              this.get_loading().show();
              if(password == ''|| password == null){
                this.get_loading().dismiss();
                Alert.alert('错误提示','交易密码不能为空！')
              }else{
                ApolloAPI.APIPersonal.validateTranPswd({
                  busiType:'T06',
                  transPswd:password,
                  money:0
                }).done((res_json,res) => {
                  if (res_json.retCode == '1') {
                    ApolloAPI.APIPersonal.transApp({
                      ...this.props.data,
                      businessSeqNo:res_json.map.businessSeqNo
                    }).done((res_data_json, res) => {
                      this.get_loading().dismiss();
                      if (res_data_json.retCode == 1) {
                          let tips = "成功提示";
                          let showContent = '已提交申请';
                          RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.TRANSFERSUCCESS, 'transferSuccess'); 
                          PlateFormUtils.plateFormAlert(Platform,tips,showContent);
                          this.props.navigator.pop();
                      } else {
                          let tips = "错误提示";
                          let showContent = res_data_json.retMsg;
                          PlateFormUtils.plateFormAlert(Platform,tips,showContent);
                          this.props.navigator.pop();
                      }
                    });
                  }else{
                    this.get_loading().dismiss();
                    Alert.alert('错误提示','交易密码不正确！')
                  }
                })
              }
        }
              


        //提现
        if(this.props.from == 'withdraw'){
            this.get_loading().show();
            if(password == ''|| password == null){
              this.get_loading().dismiss();
              Alert.alert('错误提示','交易密码不能为空！')
            }else{
                //if(this.props.wdrawCost == null || this.props.wdrawCost ==""){
                  //实际金额小于等于5万时用w07类型，大于时用w01 去掉了
                  let busiType = 'W01';
                  // if(this.props.actualAccount >50000){
                  //   busiType='W01'
                  // }else{
                  //   busiType='W07'
                  // }
                  ApolloAPI.APIPersonal.validateTranPswd({
                      busiType:busiType,
                      transPswd:password,
                      money:this.props.money,
                    }).done((res_json,res) => {
                      if (res_json.retCode == '1') {
                        ApolloAPI.APIcard.commitDrawals({
                          ...this.props.data,
                          businessSeqNo:res_json.map.businessSeqNo
                        }).done((res_json, res) => {
                          this.get_loading().dismiss();
                          if(res_json.retCode == 1){
                            let tips = "正确提示";
                            let showContent = res_json.retMsg;
                            PlateFormUtils.plateFormAlert(Platform,tips,showContent);
                            //发送广播，我的界面实时更新
                            RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.WITHDRAWSUCCESS, 'withdraw'); 
                            this.props.navigator.popN(2);
                            //提交成功，把界面pop出去
                          }else{
                            let tips = "错误提示";
                            let showContent = res_json.retMsg;
                            PlateFormUtils.plateFormAlert(Platform,tips,showContent);
                            this.props.navigator.popN(2);
                          }
                        })
                      }else{
                        this.get_loading().dismiss();
                        Alert.alert('错误提示','交易密码不正确！')
                      }
                    })
            //     }else{
            //         let busiType = 'W01';
            //         // if(this.props.actualAccount >50000){
            //         //   busiType='W01'
            //         // }else{
            //         //   busiType='W07'
            //         // }
            //         ApolloAPI.APIPersonal.validateTranPswd({  //实际到账接口
            //           busiType:busiType,
            //           transPswd:password,
            //           money:this.props.actualAccount,
            //         }).done((res_json,res) => {
            //           let businessSeqNo1 = res_json.map.businessSeqNo;
            //           if (res_json.retCode == '1') {
            //             ApolloAPI.APIPersonal.validateTranPswd({  //手续费接口
            //                 busiType:'T99',
            //                 transPswd:password,
            //                 money:this.props.wdrawCost,
            //               }).done((res_json,res) => {
            //                 if (res_json.retCode == '1') {
            //                     ApolloAPI.APIcard.commitDrawals({
            //                       ...this.props.data,
            //                       businessSeqNo2:res_json.map.businessSeqNo,
            //                       businessSeqNo1:businessSeqNo1,
            //                     }).done((res_json, res) => {
            //                       this.get_loading().dismiss();
            //                       if(res_json.retCode == 1){
            //                         let tips = "正确提示";
            //                         let showContent = res_json.retMsg;
            //                         PlateFormUtils.plateFormAlert(Platform,tips,showContent);
            //                         //发送广播，我的界面实时更新
            //                         RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.WITHDRAWSUCCESS, 'withdraw'); 
            //                         this.props.navigator.popN(2);
            //                         //提交成功，把界面pop出去
            //                       }else{
            //                         let tips = "错误提示";
            //                         let showContent = res_json.retMsg;
            //                         PlateFormUtils.plateFormAlert(Platform,tips,showContent);
            //                         this.props.navigator.popN(2);
            //                       }
            //                     })
            //                   }else{
            //                     this.get_loading().dismiss();
            //                     Alert.alert('错误提示','交易密码不正确！')
            //                   }
                          
            //                 })
            //           }else{
            //             this.get_loading().dismiss();
            //             Alert.alert('错误提示','交易密码不正确！')
            //           }
            //         })
            //     }

             }
        }
      

      
    } catch (error) {
      alert(error.stack)
    }
    
  }
  render() {
    return (
      <View style={styles.root}>
        <BackNavBar  
          style={{backgroundColor:'#ed5565'}}
          component={this}
          rightContent={
                <TouchableOpacity onPress={()=>this.props.navigator.push({id:'TradePassword'})}>
                  <Text style={{fontSize:16,color:'#FFFFFF'}}>忘记密码</Text>
                </TouchableOpacity>
              }>验证交易密码</BackNavBar>
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
                    onChangeText={(value)=>this.setPassword(value)}
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


export default TradePasswordValidate