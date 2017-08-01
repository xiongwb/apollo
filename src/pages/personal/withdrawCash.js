import React from 'react'

import {
  ART,
  Dimensions,
  Text,
  Image,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  AsyncStorage,
  TextInput,
  PixelRatio,
  ScrollView,
  Platform,
} from 'react-native'
import {
  BasePage,
  BackNavBar,
  NavigatorUtils,
  Logintxtin,
  FormProvider,
  Submit,
  Loading,
  PushLogin,
} from 'ApolloComponent'
import {
  COMMON_CONFIG,
  EVENT_EMITTER_CONST,
} from 'ApolloConstant'
import { Color } from 'ApolloConstant';
import ApolloAPI from 'ApolloAPI';
import { observable, toJS } from 'mobx';
import validate from 'mobx-form-validate';
import {PlateFormUtils,StringUtils} from "ApolloUtils";
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';

var full_height = Dimensions.get('window').height
var full_width = Dimensions.get('window').width;
const onePt =1 / PixelRatio.get();

const styles = StyleSheet.create({
  root: {
   backgroundColor: '#dddddd',//页面的布局和颜色
    flex: 1,
  },

  input_box: {
    height: 90,
    width: full_width,
    marginTop: 20,
    flexDirection: 'row',
    borderColor: '#e5e5e5',
    backgroundColor: 'white',
    borderWidth: 1,
  },

  input_money: {
    height: 45,
    width: full_width,
   // marginTop: 20,
    flexDirection: 'row',
    borderColor: '#e5e5e5',
    backgroundColor: 'white',
    borderWidth: 1,
  },

  input_Tiedcard:{
  flexDirection:'row',
  flex:1, 
  justifyContent:'center',
  backgroundColor:'#55edb5',
  marginHorizontal:12
},
 tiedcardImage:{
  flexDirection:'row',
  justifyContent:'center',
  flex:1.3,
  marginVertical:16,
},
tiedcard:{
  flexDirection:'row',
  flex:2, 
  justifyContent:'center',
  marginVertical:16,
},
withdraw_money:{
  flexDirection:'row',
  flex:0.5,
  justifyContent:'center',
  backgroundColor:'white',
  marginLeft:24,
},
withdraw_cost:{
  justifyContent:'space-between',
  flexDirection:'row',
  marginHorizontal:24,
  marginTop:5,
  marginBottom:12,
  height:32,
  alignItems:'center'
},

 input_withdraw:{
  height:44, 
  flexDirection:'row',
  marginHorizontal:12,
  justifyContent: "center",
  alignItems:'center',
  backgroundColor:'#ed5565',
   borderRadius: 4,
  },
   excelContainer: {
    //flex:1,
    backgroundColor:'#fff'
  },
});

/**
*  提现
*  zqf
*2017-3-21
*/
class WithdrawCash extends BasePage {
   // form = new widthdrawForm();
  constructor(props){
    super(props);
    this.state = {
      openbank:'中国建设银行',//银行卡类型
      bankCardNo:'',//卡号
      is_bankcard : false,
      cardType:'',//卡类型
      usableMoney:'',//可用余额,发送第二次请求时用
      withdrawMoney:'',//可提现金额:不能大于可用余额  usableMoney<withdrawMoney
      wdrawCost:'',//提现费用（提现收取的费用）
      actualAccount:'',//实际到账=:withdrawMoney-wdrawCost
      workDay:'3',//几个工作日到账
      //mainflag:'',//主卡标志
      //telno:''
      bindListSource:[],
      phoneNo:'',
      money:'',//提现金额，参数
      candrawsum:'0.00',
      supplementsummin:'',  //最低充值金额
      supplementsummax:'', //最高充值金额
      supplementfee:'',//充值费用>=1时为固定费用，<1时为费率
      supplementfeemin:'',	//充值最低费用	充值按费率计算如小于最低费用则按最低费用。
      supplementfeeMax:'',	//充值最高费用	充值按费率计算如大于最高费用则按最高费用。
      supplementtype:'',//	充值到账方式	T0-实时到账 T1-普通到账
      drawsummin:'',	//最低提现金额
      drawsummax:'',	//最高提现金额
      drawfee:'',	//提现费用	>=1时为固定费用，<1时为费率
      drawfeemin:'',//提现最低费用	提现按费率计算如小于最低费用则按最低费用。
      drawfeemax:'',//提现最高费用	提现按费率计算如大于最高费用则按最高费用。
      disabled:false
    }
  }

//当进入该页面的时候，调用这个方法，通过查询已绑卡列表的接口，来判断显示 没有绑定的  显示添加银行卡，如果绑定了就显示绑卡列表
componentWillMount() {
    //第二次请求：得-可用余额,可提现金额,--需要的数据：手机号
     ApolloAPI.APIcard.getMyAsset({
       telno:this.props.phoneNo
     }).done((res_json,res)=>{
       if(res_json.retCode===1){
        //console.log(res_json,"datadatadata")
          this.setState({
             usableMoney:res_json.acctnoEntity.availablesum,//可用余额
             //wdrawCost:res_json.avgintrate,
             //actualAccount:usableMoney-wdrawCost,实际到账
             //actualAccount:res_json.availablesum,
             candrawsum:res_json.acctnoEntity.candrawsum,//可提现金额
          })
       }else{
          let tips = "错误提示";
          let showContent = res_json.retMsg;
          PlateFormUtils.plateFormAlert(Platform,tips,showContent);
       }
     })
    //请求充值计算规则
    ApolloAPI.APIcard.getRechargeRule({
      tenantNo:COMMON_CONFIG.tenantNo
    }).done((res_json,res)=>{
      if(res_json.retCode == 1){
        this.setState({
          supplementsummin:res_json.entity.supplementsummin,  //最低充值金额
          supplementsummax:res_json.entity.supplementsummax, //最高充值金额
          supplementfee:res_json.entity.supplementfee,//充值费用>=1时为固定费用，<1时为费率
          supplementfeemin:res_json.entity.supplementfeemin,	//充值最低费用	充值按费率计算如小于最低费用则按最低费用。
          supplementfeeMax:res_json.entity.supplementfeeMax,	//充值最高费用	充值按费率计算如大于最高费用则按最高费用。
          supplementtype:res_json.entity.supplementtype,//	充值到账方式	T0-实时到账 T1-普通到账
          drawsummin:res_json.entity.drawsummin,	//最低提现金额
          drawsummax:res_json.entity.drawsummax,	//最高提现金额
          drawfee:res_json.entity.drawfee,	//提现费用	>=1时为固定费用，<1时为费率
          drawfeemin:	res_json.entity.drawfeemin,//提现最低费用	提现按费率计算如小于最低费用则按最低费用。
          drawfeemax:res_json.entity.drawfeemax,//提现最高费用	提现按费率计算如大于最高费用则按最高费用。
          })
      }else{
        let tips = "错误提示";
        let showContent = res_json.retMsg;
        PlateFormUtils.plateFormAlert(Platform,tips,showContent);
      }
  })
}
/**
 * 上面都执行后，这个是最后提交提钱到卡的动作，记录到提现表
 * 接口是/invest/withdrawals ,参数是phoneNo，money，cardNo
 */
 onsubmit_1 = async () =>{
      let phoneNo = this.props.phoneNo;//手机号
      let money = this.state.money;//提现金额
      let cardNo = this.props.bankCardNo;//银行卡号
      //let wdrawCost = this.state.wdrawCost;//提现费用
      //let actualAccount = this.state.actualAccount;//实际到账
      //将json对象合并成一个对象
      var jsonbject1= {phoneNo:phoneNo,money:money,cardNo:cardNo};
      var resultJsonObject={};
      for(var attr in jsonbject1){
        resultJsonObject[attr]=jsonbject1[attr];
      }
     // this.get_loading().show();
      if(this.state.money === ''){
        let tips = "错误提示";
        let showContent = "请输入提现金额";
        PlateFormUtils.plateFormAlert(Platform,tips,showContent);
      }else{
          this.setState({
            disabled:true
          })
          setTimeout(()=>{
            this.setState({
            disabled:false
          })
          },2000)
          PushLogin.push_login_destination('TradePasswordValidate', this.props.navigator,{from:'withdraw',money:money,data:resultJsonObject})  
          //this.get_loading().dismiss();
          // this.get_loading().show();
          // ApolloAPI.APIcard.getFee({
          //   money:money,
          //   type:1,
          //   tenantNo:COMMON_CONFIG.tenantNo
          // }).done((res_json, res) => {
          //     this.get_loading().dismiss()
          //         if(res_json.retCode == 1){
          //           let wdrawCost=res_json.feeSum;
          //           let actualAccount=money-res_json.feeSum;
          //           PushLogin.push_login_destination('TradePasswordValidate', this.props.navigator,{from:'withdraw',wdrawCost:wdrawCost,actualAccount:actualAccount,data:resultJsonObject})  
          //         }else{
          //           let tips = "错误提示";
          //           let showContent = res_json.retMsg;
          //           PlateFormUtils.plateFormAlert(Platform,tips,showContent);
          //         }
          // })
        
      }
  
  }
    
  get_loading() {
    return this.refs.loading;
  }

  moneyChange(text){
    let result = /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,13}\.\d{0,2}$|^[1-9]\d{0,30}$/.test(text);
    if(result ==false){
      this.setState({
        money:'',
        wdrawCost:'',
        actualAccount:''
      });
    }else{
      //计算费用
      let money = text;
      let fee=this.state.drawfee;
      let feeMin=this.state.drawfeemin;
      let feeMax=this.state.drawsummax;
      if(fee>1){
          if(fee>money){
              this.setState({
                money:text,
                wdrawCost:StringUtils.moneyFormatData2Money1(money),
                actualAccount:StringUtils.moneyFormatData2Money1(text-money),
              })
          }else {
              this.setState({
                money:text,
                wdrawCost:StringUtils.moneyFormatData2Money1(fee),
                actualAccount:StringUtils.moneyFormatData2Money1(text-StringUtils.moneyFormatData2Money1(fee)),
              })
          }
      }else {
          let feeSum=money*fee;
          if(feeMin!=null&&feeSum<feeMin){
              feeSum=feeMin;
          }
          if(feeMax!=null&&feeSum>feeMax){
              feeSum=feeMax;
          }
          if(feeSum>money){
              feeSum=money;
          }
          this.setState({
            money:text,
            wdrawCost:StringUtils.moneyFormatData2Money1(feeSum),
            actualAccount:StringUtils.moneyFormatData2Money1(text-StringUtils.moneyFormatData2Money1(feeSum)),
          })
      }

    }
  }

  drawAll(){
    let candrawsum= this.state.candrawsum.toString();
    
    this.setState({money:candrawsum});
    this.moneyChange(candrawsum);
  }
  render() {
      let candrawsum= this.state.candrawsum!=null&&this.state.candrawsum!=''?StringUtils.moneyFormatData2Money(this.state.candrawsum):'0.00';
      let disabled = false;
      if(candrawsum == "0.00"){
        disabled = true;
      }
      //银行卡显示后四位
      let acctno=this.props.bankCardNo;
      let acctnoSub=acctno.substr(acctno.length-4,acctno.length)
      let xhao = "";
      for(let i=0;i<acctno.length-4;i++){
        xhao+="*"
      }
      acctno = xhao + acctnoSub;
      return (
        <View style={styles.root}>
        <BackNavBar component={this}>提现</BackNavBar> 
        {
          this.props.is_bankcard == false ?
        
            <TouchableOpacity onPress={() =>  this.props.navigator.push({ id: 'Waddcard' })}>
            <View style={styles.input_box}>
              <View style={[styles.input_Tiedcard]}>
                <View style={[styles.tiedcardImage]}>
                  <Image source={require('apollo/src/image/wbank_card.png')} style={{width:80,height:50}}/>
                </View>
                <View style={[styles.tiedcard]}>
                  <Text style={{fontSize:20,color:'#4d4d4d',marginTop:12}}>请先绑定银行卡</Text>
                </View>
                <View style={{width:50,height:50,justifyContent:'center',marginVertical:16,}}>
                    <Image source={require('apollo/src/image/arrow_right.png')} style={{marginLeft:18}}/>
                </View>
              </View>
            </View>
            </TouchableOpacity>
     
                :

            <ScrollView style={styles.excelContainer} showsVerticalScrollIndicator={false}>
              <View>
                  <View style={styles.input_box}>
                    <View style={{flexDirection:'row',flex:1, justifyContent:'center',backgroundColor:'transparent',marginHorizontal:12}}>
                    <View style={{flexDirection:'row',flex:0.7, justifyContent:'center',marginVertical:16,}}>
                      <Image source={require('apollo/src/image/wbank_card.png')} style={{width:80,height:50}}/>
                    </View>
                    <View style={{flex:2, justifyContent:'center',}}>
                        <Text style={{fontSize:20,color:'#4d4d4d',marginLeft:16,marginTop:12}}>{this.props.openbank}</Text>
                        <Text style={{fontSize:16,color:'#4d4d4d',marginLeft:16,marginTop:12}}>{acctno}</Text>
                    </View>
                      
                    </View>
                  </View>
                  <View style={{flexDirection:'row',flex:1,justifyContent:'center',marginLeft:24,height:45,alignItems:'center'}}>
                      <Text style={{fontSize:16,color:'#4d4d4d',flex:3}}>可提现金额: {candrawsum}</Text>
                      <TouchableOpacity disabled={disabled} style={{flex:1}} onPress={()=>this.drawAll()}>
                        <Text style={[{fontSize:14,color:'#ed5565'},disabled ==true && {color:'#a19d9e'}]}>全部提现</Text>
                      </TouchableOpacity>
                  </View>
                  <View style={styles.input_money}>
                    <View style={[styles.withdraw_money]}>
                        <Text style={{fontSize:16,color:'#4d4d4d',marginVertical:10}}>提现金额:</Text>
                      <TextInput style={{flex:1, borderColor:'#dddddd',backgroundColor:'transparent',fontSize:15,}}
                                editable={true}
                                onChangeText={(text)=>this.moneyChange(text)}
                                //提现金额，在form上面做了判断
                                underlineColorAndroid='rgba(0,0,0,0)'
                                keyboardType='numeric'
                                value={this.state.money}
                                
                                />     
                    </View>
                  </View>
                  <View style={[styles.withdraw_cost]}>
                      <Text style={{fontSize:14,color:'#4d4d4d'}}>提现费用: {this.state.wdrawCost}</Text>
                      <View style={{height:32,width:130,flexDirection:'row',alignItems:'center'}}>
                        <Text style={{fontSize:14,color:'#4d4d4d'}}>实际到账: {this.state.actualAccount}</Text>
                      </View>
                  </View>
                <TouchableOpacity disabled={this.state.disabled} onPress={() => this.onsubmit_1()}>
                    <View style={[styles.input_withdraw,this.state.disabled ? {backgroundColor:'#a19d9e'} :{backgroundColor:'#ed5565'}]}>
                      <Text style={{fontSize:18,color:'#ffffff',}}>确认提现</Text>
                   </View>
                   </TouchableOpacity>
            </View>
          </ScrollView>
      }
       <Loading ref={'loading'} />
    </View>
    
      
    )
  }
}
  // <View style={[styles.btnContainer]}>
  //     <Submit  containerStyle={[styles.btn]} textStyle={[styles.textBtn]} onSubmit={()=>this.onsubmit_1()}>确认提现</Submit>
  //  </View>
export default WithdrawCash
