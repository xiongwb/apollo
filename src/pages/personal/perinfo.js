/**
 * 个人信息
 */
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  ScrollView,
  PixelRatio,
  AsyncStorage,
  Platform,
  BackAndroid
} from 'react-native';
import { Color } from 'ApolloConstant';
import {
  BasePage,
  BackNavBar,
  NavBar,
  Pertxtin,
  Moretxtin,
  FormProvider,
  Submit,
  Loading,
  PushLogin,
} from 'ApolloComponent'
import {
  COMMON_STYLES,
  EVENT_EMITTER_CONST,
  STORAGE_KEYS,
  COMMON_CONFIG
} from 'ApolloConstant'
import { PlateFormUtils,NavigatorUtils } from 'ApolloUtils';
import Icon from 'react-native-vector-icons/FontAwesome'
import ApolloAPI from 'ApolloAPI';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import ModalDropdown from 'react-native-modal-dropdown';
import { observable, toJS } from 'mobx';
import validate from 'mobx-form-validate';

const DEMO_OPTIONS = ['1年以下', '1-3年','3年以上'];
var full_width = Dimensions.get('window').width;
var full_height = Dimensions.get('window').height;
var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
let borderBottomWidth2 = 0;

class Perinfo extends BasePage {

  constructor(props){
    super(props)
    this.state={
      nickname:'',
      res_nickname:'',
      certificate:'',
      loginno:'',
      cusType:1,
      realName:'',
      weNum:'',
      res_weNum:'',
      qqNum:'',
      res_qqNum:'',
      eMail:'',
      res_eMail:'',
      monthMoney:'',
      res_monthMoney:'',
      riskgrade:'',
      invexp:'',
      address:'',
      accuscore:'',
      invitecode:'',
      is_login:false,
      selectedValue:'请选择'
    }
  }

  on_Press=()=>{
    PushLogin.push_login_destination('InvsExp', this.props.navigator)
  }
  riskAssess=()=>{
    if(this.state.riskgrade == null || this.state.riskgrade == ""){
      PushLogin.push_login_destination('RiskAssessment', this.props.navigator,{perInfo:this.state.perInfoAll})
    }else{
      PushLogin.push_login_destination('MyRiskList', this.props.navigator)
    }
  }
  
  addressBorrow = () =>{
    PushLogin.push_login_destination('Address', this.props.navigator)
  }

  async request_api(){
        this.get_loading().show();
        //登录后请求数据
        let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
        let hash = JSON.parse(value);
        //console.log(hash);
        if(!!hash && hash.retCode ==1){
            ApolloAPI.APIPersonal.getPerInfo({
              //通过参数获取个人信息
              telno:hash.retMsg
            }).done((res_json, res)=>{
              //this.get_loading().dismiss();
              if(res_json.retCode === 1){
                //获取回的信息填满表格
                this.setState({
                    perInfoAll:res_json,
                    is_login:true,
                    nickname:res_json.nickname,
                    res_nickname:res_json.nickname,
                    certificate:res_json.certno,
                    loginno:res_json.loginno,
                    cusType:res_json.custype,
                    realName:res_json.cusname,
                    weNum:res_json.wechat,
                    res_weNum:res_json.wechat,
                    qqNum:res_json.qq,
                    res_qqNum:res_json.qq,
                    eMail:res_json.email,
                    res_eMail:res_json.email,
                    monthMoney:res_json.income,
                    res_monthMoney:res_json.income,
                    riskgrade:res_json.riskgradename,
                    invexp:res_json.invexp-2,
                    res_invexp:res_json.invexp-2,
                    address:res_json.address,
                    res_address:res_json.address,
                    accuscore:res_json.accuscore,
                    autoinvflag:res_json.autoinvflag,
                    autoinvsummin:res_json.autoinvsummin,
                    res_autoinvsummin:res_json.autoinvsummin,
                    autoinvsummax:res_json.autoinvsummax,
                    res_autoinvsummax:res_json.autoinvsummax,
                    invitecode:res_json.invitecode,

                })
                if(DEMO_OPTIONS[res_json.invexp-2]){
                  this.setState({
                    selectedValue:DEMO_OPTIONS[res_json.invexp-2]
                  })
                }

                this.get_loading().dismiss();
              }else{
                this.get_loading().dismiss();
                this.setState({is_login:false})
                PlateFormUtils.plateFormAlert(Platform,'错误提示',"个人信息未获得!");
              }
            })
        }
                
  }

  //保存修改的信息
  savePertxt(){
   // alert(123);
    //判断能够修改的值是否改变
    if(this.state.nickname == this.state.res_nickname && 
      this.state.weNum == this.state.res_weNum &&
      this.state.qqNum == this.state.res_qqNum && 
      this.state.eMail == this.state.res_eMail &&
      this.state.monthMoney == this.state.res_monthMoney &&
      this.state.invexp == this.state.res_invexp &&
      this.state.address == this.state.res_address &&
      this.state.autoinvsummin == this.state.res_autoinvsummin &&
      this.state.autoinvsummax == this.state.res_autoinvsummax
      ){
        this.props.navigator.pop();
    }else{
      this.get_loading().show();
      if(parseFloat(this.state.autoinvsummin)>parseFloat(this.state.autoinvsummax)){
        this.get_loading().dismiss();
        PlateFormUtils.plateFormAlert(Platform,'错误提示',"最小金额不能大于最大金额!");
      }else{

          ApolloAPI.APILogin.getloginState({
              tenantNo:COMMON_CONFIG.tenantNo
            }).done((res_json, res) => {
                    if(res_json.retCode == 1){
                      //登录后请求数据
                      let perInfo = this.state.perInfoAll;
                      if(perInfo){
                        //修改的信息
                        perInfo.nickname = this.state.nickname;
                        perInfo.wechat = this.state.weNum;
                        perInfo.qq = this.state.qqNum;
                        perInfo.email = this.state.eMail;
                        perInfo.income = this.state.monthMoney;
                        perInfo.invexp = this.state.invexp;
                        perInfo.address = this.state.address;
                        perInfo.autoinvsummin = this.state.autoinvsummin;
                        perInfo.autoinvsummax = this.state.autoinvsummax;
                        //console.log(perInfo);
                        //发送修改的信息
                        ApolloAPI.APIPersonal.savePerInfo( perInfo ).done((res_json, res)=>{
                          this.get_loading().dismiss();
                          if(res_json.retCode === 1){
                            //保存信息
                            PlateFormUtils.plateFormAlert(Platform,'成功提示',"保存成功!");
                            //this.props.navigator.pop();
                          }else{
                            PlateFormUtils.plateFormAlert(Platform,'错误提示',"保存失败!");
                          }
                        })
                      }
                    }else{
                    //跳转登录页面
                      PlateFormUtils.plateFormAlert(Platform,"错误提示","您还未登录或注册!");
                      this.props.navigator.push({
                        id:'Login',params:{}
                      });
                  }
            })
        }

    }
  }

  remove_data() {
    try {
        this.get_loading().show();
        ApolloAPI.APILogin.signOut(
          ).done(async(res_data, res) => {
            if(res_data.retCode == 1){
                await AsyncStorage.removeItem(STORAGE_KEYS.SIGN_TOKEN);
                //跳转首页
                this.props.navigator.popToTop();
                RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.DIDLOGOUTSUCCESS, 'logout'); 
                this.get_loading().dismiss();
            }else{
                this.get_loading().dismiss();
                PlateFormUtils.plateFormAlert(Platform,"错误提示",res_data.retMsg);
            }
          }) 
    } catch (error) {
      alert(error.stack);
    }
   
  }
 //得到Loading页面的方法
  get_loading() {
    return this.refs.loading;
  }
  componentDidMount(){
    // let routers = this.props.navigator.getCurrentRoutes();
    // // console.log("打出的router",routers);
    // // // 添加返回键监听 
    // if (Platform.OS === 'android' && routers[routers.length - 1].id == 'Perinfo') {
    //   console.log("打出的router",routers);
    //   BackAndroid.addEventListener('hardwareBackPress', this.savePertxt.bind(this));
    // }
    this.request_api();
    this.listener1 = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.RISKTESTQTSUCCESS,(value)=>{
      // 接受到通知后的处理
      if(value == 'riskTestQT'){
        this.request_api();
      }
    });
    //处理免密协议
    this.listener2 = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.NPSWDPAYSUCCESS,(value)=>{
      // 接受到通知后的处理
      if(value == 'npPswdPaySuccess'){
        this.request_api();
      }
    });
    //处理自动投资
    this.listener3 = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.AUTOINVESTSUCCESS,(value)=>{
      // 接受到通知后的处理
      if(value == 'autoInvestSuccess'){
        this.request_api();
      }
    });
    
  }

  componentWillUnmount(){
    // 移除 一定要写
    this.listener1.remove();
    this.listener2.remove();
    this.listener3.remove();
    //移除对返回键的监听
    // if (Platform.OS === 'android') {
    //   BackAndroid.removeEventListener('hardwareBackPress', this.savePertxt.bind(this));
    // }
    borderBottomWidth2=0;
  }
  checkInvMin(text){
        this.setState({
            autoinvsummin:text,
        });
        let result = /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,13}\.\d{0,2}$|^[1-9]\d{0,30}$/.test(text);
        if(result ==false){
            this.setState({
                autoinvsummin:'',
            });
        }
    }
  checkInvMax(text){
        this.setState({
            autoinvsummax:text,
        });
        let result = /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,13}\.\d{0,2}$|^[1-9]\d{0,30}$/.test(text);
        if(result ==false){
            this.setState({
                autoinvsummax:'',
            });
        }
  }
  selectedValue(index,value){
    let idx = parseInt(index)  + 2;
    this.setState({invexp: idx})
  }
  render() {
    if(this.state.autoinvflag == 1){
      borderBottomWidth2 = 1
    }
    return (
       
    <View style={styles.root}>
        <NavBar
        backgroundColor='#ed5565'
        leftContent={
          <View >
            <TouchableOpacity onPress={()=>this.savePertxt()}>
              <Icon style={{marginRight: 15}} name="angle-left" size={22} color={'#fff'} />
            </TouchableOpacity>
          </View>
        }
        titleContent={
          <View style={styles.title}>
            <Text style={{fontSize:18,color:'#fff'}}>我的信息</Text>
          </View>
        }
        />
       <ScrollView style={styles.excelContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.input_box}>
              <Pertxtin ImageLeft={require('apollo/src/image/account.png')}  borderBottomWidth1={1} title_puplic='昵称:' onChangeText={(value) =>this.setState({nickname:value})} editable={true} value = {this.state.nickname}/>        
              <Pertxtin ImageLeft={require('apollo/src/image/phone_number.png')}  borderBottomWidth1={1} title_puplic='手机号:' editable={false} placeholder={this.state.loginno} />
              <Pertxtin ImageLeft={require('apollo/src/image/certificate_number.png')}  borderBottomWidth1={1} title_puplic='证件号码:' editable={false}  placeholder={this.state.certificate}  /> 
              <Pertxtin ImageLeft={require('apollo/src/image/name.png')}  borderBottomWidth1={1} title_puplic='用户类型:' editable={false} placeholder={this.state.cusType == 1 ? "个人" : "企业"}  /> 
              <Pertxtin ImageLeft={require('apollo/src/image/name.png')}  borderBottomWidth1={1} title_puplic='真实姓名:' editable={false}  placeholder={this.state.realName} /> 
              <Pertxtin ImageLeft={require('apollo/src/image/wechat.png')}  borderBottomWidth1={1} title_puplic='微信号:' placeholder='非必填项' editable={true} onChangeText={(value) =>this.setState({weNum:value})}  value = {this.state.weNum}/> 
              <Pertxtin ImageLeft={require('apollo/src/image/qq.png')}  borderBottomWidth1={1} title_puplic='QQ号:' placeholder='非必填项' editable={true}  onChangeText={(value) =>this.setState({qqNum:value})} value = {this.state.qqNum}/> 
              <Pertxtin ImageLeft={require('apollo/src/image/postbox.png')}  borderBottomWidth1={1} title_puplic='邮箱:' placeholder='非必填项' editable={true} onChangeText={(value) =>this.setState({eMail:value})} value = {this.state.eMail}/>
              <Pertxtin ImageLeft={require('apollo/src/image/money.png')}  borderBottomWidth1={1} title_puplic='月收入:' placeholder='非必填项' editable={true} onChangeText={(value) =>this.setState({monthMoney:value})} value = {this.state.monthMoney}/>  
              <Pertxtin ImageLeft={require('apollo/src/image/prehome.png')}  borderBottomWidth1={1} title_puplic='居住地址:' placeholder='非必填项' editable={true} onChangeText={(value) =>this.setState({address:value})} value = {this.state.address}/>
              <View style={{flexDirection:'row',height:46,backgroundColor:'#fff'}}>
                  <View style={{ justifyContent: "center", marginLeft: 10 }}>
                    <Image source={require('apollo/src/image/investment_experience.png')} style={{ width:25,height:25}}/>
                  </View>
                  <View style={{marginLeft:20,flex:1.5,justifyContent:'center',borderBottomWidth: 1, borderBottomColor: '#e5e5e5'}}>
                      <Text style={{fontSize: 16, color: '#808080',}}>互联网投资经验:</Text>
                  </View>
                  <View style={{ flex: 2, justifyContent:'center',borderBottomWidth: 1, borderBottomColor: '#e5e5e5'}}>
                       <ModalDropdown 
                        textStyle={{
                            fontSize:14,
                            color:'#101010',
                            textAlign:'center',
                            alignSelf:'center',
                            }}
                        dropdownStyle={[{ width:0.53 * full_width,backgroundColor:'#fff',alignItems:'center'}]}
                        options={DEMO_OPTIONS} 
                        defaultValue={this.state.selectedValue}
                        //defaultIndex={parseInt(this.state.invexp)}
                        onSelect={(idx, value) => this.selectedValue(idx,value)}
                        />
                  </View>
              </View>
            <Pertxtin ImageLeft={require('apollo/src/image/money.png')}  borderBottomWidth1={1} title_puplic='我的积分:'  editable={false} placeholder = {this.state.accuscore}/>
            <Pertxtin ImageLeft={require('apollo/src/image/phone_number.png')}  borderBottomWidth1={borderBottomWidth2} title_puplic='我的邀请码:'  editable={false} placeholder = {this.state.invitecode}/>
            {
              this.state.autoinvflag == 1 ?
              <View>
                 <Pertxtin ImageLeft={require('apollo/src/image/money.png')}  borderBottomWidth1={1} title_puplic='最小金额:'  editable={true} onChangeText={(value) =>this.checkInvMin(value)} value = {this.state.autoinvsummin}/>
                 <Pertxtin ImageLeft={require('apollo/src/image/money.png')}  borderBottomWidth1={0} title_puplic='最大金额:'  editable={true} onChangeText={(value) =>this.checkInvMax(value)} value = {this.state.autoinvsummax}/>
              </View>
              :
              null
            }
        
        </View>
         <View style={styles.input_box}>
           <Moretxtin ImageLeft={require('apollo/src/image/bank_card.png')} invite_words='银行卡管理' borderBottomWidth1={1}
            ImageRight={require('apollo/src/image/arrow_right.png')} onPressButton={()=>PushLogin.push_login_destination('CardMagAddRelieve', this.props.navigator)} />          
           
           <Moretxtin ImageLeft={require('apollo/src/image/risk_assessment.png')}  borderBottomWidth1={0} invite_words='风险评估等级:' invite_state={this.state.riskgrade == null ? " " : this.state.riskgrade}
           ImageRight={require('apollo/src/image/arrow_right.png')} onPressButton={this.riskAssess}/> 
        </View>
        <View style={styles.input_box}>
          <Moretxtin ImageLeft={require('apollo/src/image/login_password.png')} invite_words='修改登录密码' borderBottomWidth1={1}
            ImageRight={require('apollo/src/image/arrow_right.png')} onPressButton={()=>PushLogin.push_login_destination('ChangePwd', this.props.navigator)} />
          <Moretxtin ImageLeft={require('apollo/src/image/investment_experience.png')} invite_words='免密协议' borderBottomWidth1={0}
            ImageRight={require('apollo/src/image/arrow_right.png')} onPressButton={()=> PushLogin.push_login_destination('NoPswdPay', this.props.navigator,{perInfo:this.state.perInfoAll})} />
        </View>
        <View style={styles.input_box}>
        
          <Moretxtin ImageLeft={require('apollo/src/image/bank_card.png')} invite_words='投资意向征集' borderBottomWidth1={0}
            ImageRight={require('apollo/src/image/arrow_right.png')} onPressButton={()=>PushLogin.push_login_destination('InvestCollect', this.props.navigator)} />
        </View>
       <View style={{justifyContent: "center",alignItems:'center',marginTop:15}} >
          {
            this.state.is_login === true ? 
                <TouchableOpacity style={{flex:1,width:0.95 * full_width,height:35,backgroundColor:'#ED5565',borderRadius:8,justifyContent: "center",alignItems:'center',}} 
                 onPress={()=>{this.remove_data()}}
                 >
                      <Text style={{fontSize:16,color:'#fff',alignSelf:'center'}}>退出登录</Text>
                </TouchableOpacity>
            :
            null
          }
        </View>
        <View style={{height:0.1 * full_height,marginTop:0.05 * full_height,alignItems:'center',borderTopColor:'#b7b7b7',borderTopWidth:onePt}}>
            <Text style={{color:'#b7b7b7',fontSize:12,marginTop:10}}>
                我是有底线的
            </Text>
        </View>  
      </ScrollView>
       <Loading ref="loading" />        
    </View>
      
     
    );
  }
}

const styles = StyleSheet.create({

   root: {
   
    backgroundColor: '#dddddd',//页面的布局和颜色
    flex: 1,
  },
 excelContainer: {
    height: 0.6 * full_height,
    marginTop:10,
  },
input_box:{
  borderColor:'#e5e5e5',
  backgroundColor:'#ffffff',
  marginBottom:10,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.backgroundColor,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default Perinfo