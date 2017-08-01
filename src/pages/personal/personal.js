/**
 * 我的
 * zgx
 *  <ART.Surface width={2} height={150}>
              <ART.Shape d={vertical_line} stroke={COMMON_STYLES.MAIN_BACKGROUND_COLOR} strokeWidth={1} />
            </ART.Surface>
            <View style={{flex:1,alignItems:'center'}}>
              <TouchableOpacity onPress={() =>this.push_login_destination('Coupon', this.props.navigator)}>
                <Image source={require('../../image/value_voucher.png')} style={{width:35,height:26,alignSelf:'center'}}/>
                <Text style={styles.my_view_text}>我的礼包</Text>
              </TouchableOpacity>
            </View>
             <View style={{justifyContent:'center',alignItems:'center'}}>
                 <TouchableOpacity style={{flex:1,width:0.95 * full_width,height:35,backgroundColor:'#ED5565',borderRadius:8,justifyContent: "center",alignItems:'center',}} 
                 onPress={()=>this.props.navigator.push({id:"Moreinfo"})}
                 >
                      <Text style={{fontSize:16,color:'#fff',alignSelf:'center'}}>更多</Text>
                </TouchableOpacity>
            </View>
 */
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableOpacity,
  Image,
  Dimensions,
  ART,
  Alert,
  AsyncStorage,
  ScrollView,
  Platform,
  PixelRatio,
  NativeModules
} from 'react-native';
import {
  PushLogin,
  Loading,
  BasePage
} from 'ApolloComponent'
import {
  EVENT_EMITTER_CONST,
  STORAGE_KEYS,
  COMMON_STYLES,
  COMMON_CONFIG,
  Color
} from 'ApolloConstant'
import {
  PlateFormUtils
} from 'ApolloUtils';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import Icon from 'react-native-vector-icons/FontAwesome';
import List from 'antd-mobile/lib/list';
import WhiteSpace from 'antd-mobile/lib/white-space';
import Button from 'antd-mobile/lib/button';
import CusButton from '../../components/button';
import ListCards from '../../components/listCard'; 
import ImagePicker from 'react-native-image-crop-picker';
import ApolloAPI from 'ApolloAPI';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import Toast, {DURATION} from 'react-native-easy-toast';
var full_width = Dimensions.get('window').width;
var full_height = Dimensions.get('window').height;
/*viewWidth指的是顶部文字view的宽度
  宽度=屏幕宽度-左边距-头像宽度-间距-间距-箭头宽度-右边距
 */
const onePt =1 / PixelRatio.get();
let viewWidth = full_width-15-75-10-10-20-15;
let common_color = '#101010';
let common_fontsize = 13;
let common_color3 = '#ff7355';
let common_fontsize3 = 20;
let common_color4 = '#808080';
let common_fontsize4 =12;
 
                            
const availablesum = observable("0.00");//可用余额
const investedsum = observable("0.00");
const toearnsum = observable("0.00");
const payfee = observable("0.00");
const borrowedsum = observable("0.00");
const arrivalsum = observable("0.00");
const nextpaydate = observable("0.00");
const nextpaydue = observable("0.00");
const nextpayint = observable("0.00");
const cannotdrawsum = observable("0.00");
const candrawsum =observable("0.00");
const accuborsum = observable("0.00");
const accuearnsum = observable("0.00");
const accuinvsum = observable("0.00");
const accupayfee = observable("0.00");
const avgintrate = observable("0.00");
const avgprofitrate = observable("0.00");
const welcome_words = observable("您好，请您登录");
const totasset = observable("0.00");
const phoneNum = observable("");
const invbacksum = observable("0.00"); //已收回投资
const earnedsum = observable("0.00"); //已收益金额
const accupayint = observable("0.00");

const {Surface, Shape, Path} = ART;  
class Personal extends BasePage {
    constructor(props) {
    super(props);
    // const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.dataSource = [1];
    this.state={
      is_bankcard : false,
      cardno:'',
      height:0.12 * full_height,
      avatarSource:null,
      images:null,
      perData:"",
    }
  }
   
  componentDidMount(){
    //this.setState({ perData:false,})
    //this.request_api();
    //监听点击我的按钮
    this.listener1 = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.DIDDASHSUCCESS,(value)=>{
      if(value == "Personal"){
        welcome_words.set('加载中');
        phoneNum.set('加载中') ;
        this.setState({ 
          perData:false,
          height:0.12 * full_height,
      })
        this.request_api();
        
      }
     
    });
    //监听提现
    this.listener2 = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.WITHDRAWSUCCESS,(value)=>{
      if(value=="withdraw"){
        welcome_words.set('加载中'),
        phoneNum.set('加载中'),
        this.setState({ perData:false,})
        this.request_api();
      }
    });
    //监听充值
    this.listener3 = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.RECHARGESUCCESS,(value)=>{
      if(value=="rechargeSuccess"){
        welcome_words.set('加载中'),
        phoneNum.set('加载中'),
        this.setState({ perData:false,})
        this.request_api();
      }
    });
    //监听转让
    this.listener4 = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.TRANSFERSUCCESS,(value)=>{
      if(value=="transferSuccess"){
        welcome_words.set('加载中'),
        phoneNum.set('加载中'),
        this.setState({ perData:false,})
        this.request_api();
      }
    });
    //监听还款
    this.listener5 = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.REPAYSUCCESS,(value)=>{
      if(value=="repaySuccess"){
        welcome_words.set('加载中'),
        phoneNum.set('加载中'),
        this.setState({ perData:false,})
        this.request_api();
      }
    });
    //监听提前结清
    this.listener6 = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.REPAYALLSUCCESS,(value)=>{
      if(value=="repayAllSuccess"){
        welcome_words.set('加载中'),
        phoneNum.set('加载中'),
        this.setState({ perData:false,})
        this.request_api();
      }
    });
    //监听支付费用
    this.listener7 = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.PAYFEESUCCESS,(value)=>{
      if(value=="payFeeSuccess"){
        welcome_words.set('加载中'),
        phoneNum.set('加载中'),
        this.setState({ perData:false,})
        this.request_api();
      }
    });
    //监听罚息
    this.listener8 = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.PAYPENALTYSUCCESS,(value)=>{
      if(value=="payPenaltyIntSuccess"){
        welcome_words.set('加载中'),
        phoneNum.set('加载中'),
        this.setState({ perData:false,})
        this.request_api();
      }
    });
     //监听投资
    this.listener9 = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.INVESTSUCCESS,(value)=>{
      if(value=="invest"){
        welcome_words.set('加载中'),
        phoneNum.set('加载中'),
        this.setState({ perData:false,})
        this.request_api();
      }
    });
  }
  componentWillUnmount(){
    // 移除 一定要写
    this.listener1.remove();
    this.listener2.remove();
    this.listener3.remove();
    this.listener4.remove();
    this.listener5.remove();
    this.listener6.remove();
    this.listener7.remove();
    this.listener8.remove();
    this.listener9.remove();
    availablesum.set("0.00");
    investedsum.set("0.00");
    toearnsum.set("0.00");
    payfee.set("0.00");
    borrowedsum.set("0.00");
    arrivalsum.set("0.00");
    nextpaydate.set("0.00");
    nextpaydue.set("0.00");
    nextpayint.set("0.00");
    cannotdrawsum.set("0.00");
    candrawsum.set("0.00");
    accuborsum.set("0.00");
    accuearnsum.set("0.00");
    accuinvsum.set("0.00");
    accupayfee.set("0.00");
    avgintrate.set("0.00");
    avgprofitrate.set("0.00");
    welcome_words.set("0.00");
    totasset.set("0.00");
    phoneNum.set("0.00");
    invbacksum.set("0.00");
    earnedsum.set("0.00");
    accupayint.set("0.00");
  }
  get_loading() {
    return this.refs.loading;
  }
 
  async request_api() {
    this.get_loading().show();
    //获取登录信息
    let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
    let hash = JSON.parse(value);
    //console.log(hash);
    if(!!hash && hash.retCode == 1 && !!hash.retMsg){
          ApolloAPI.APIPersonal.getMycenter({
                      phoneNo:hash.retMsg,
                    }).done((data, res) => {
                        this.get_loading().dismiss();
                      if(data.retCode == 1){
                          console.log("返回的data是",data);
                          //获取到 我的 的信息
                          availablesum.set(data.acctnoReturnVo.availablesum);
                          investedsum.set(data.acctnoReturnVo.investedsum);
                          toearnsum.set(data.acctnoReturnVo.toearnsum);
                          payfee.set(data.acctnoReturnVo.payfee);
                          borrowedsum.set(data.acctnoReturnVo.borrowedsum);
                          arrivalsum.set(data.acctnoReturnVo.arrivalsum);
                          nextpaydate.set(data.acctnoReturnVo.nextpaydate);
                          nextpaydue.set(data.acctnoReturnVo.nextpaydue);
                          nextpayint.set(data.acctnoReturnVo.nextpayint);
                          cannotdrawsum.set(data.acctnoReturnVo.cannotdrawsum);
                          candrawsum.set(data.acctnoReturnVo.candrawsum);
                          accuborsum.set(data.acctnoReturnVo.accuborsum);
                          accuearnsum.set(data.acctnoReturnVo.accuearnsum);
                          accuinvsum.set(data.acctnoReturnVo.accuinvsum);
                          accupayfee.set(data.acctnoReturnVo.accupayfee);
                          avgintrate.set(data.acctnoReturnVo.avgintrate);
                          avgprofitrate.set(data.acctnoReturnVo.avgprofitrate);
                          invbacksum.set(data.acctnoReturnVo.invbacksum);
                          earnedsum.set(data.acctnoReturnVo.earnedsum);
                          accupayint.set(data.acctnoReturnVo.accupayint);
                          totasset.set(data.acctnoReturnVo.totasset); 


                          welcome_words.set(data.nickname);
                          phoneNum.set(data.loginno);
                          
                          this.setState({
                            perData:true
                          })

                          this.setState({});
                      }else if(data.retCode ==9){ //用户没有登录或登录超时
                          PlateFormUtils.plateFormAlert(Platform,"提示","登录超时，为了安全，请重新登录!");
                          //跳转到登录页面
                          this.props.navigator.push({
                            id:'Login',params:{}
                          });
                      }else {
                        PlateFormUtils.plateFormAlert(Platform,"错误提示",data.retMsg);
                      }
                    })
          }else{
              this.get_loading().dismiss();
              PlateFormUtils.plateFormAlert(Platform,"错误提示","您还未登录或注册!");
              this.props.navigator.push({
                id:'Login',params:{}
              });
          }
    //异步获取头像
    let value1 = await AsyncStorage.getItem(STORAGE_KEYS.PORTRAIT_IMG);
    let image = JSON.parse(value1);
    // let image = value;
    //  console.log('received  image',image);
    if(!!image){
          this.setState({
            avatarSource: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
            images: null
          });
    }
  }
 
  withdrawMoney =async (enableCallBack) => { 
    let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
    let hash = JSON.parse(value)
      if(!!hash && !! hash.retCode){
        console.log(hash.retMsg,"phonephone")
        //手机号写进来，给后面提交时的api用
      ApolloAPI.APIcard.getIsBindList({
        //通过参数手机号获取银行卡信息
        telno:hash.retMsg,
        //telno:'18722151801',
        }).done((res_json, res)=>{
          console.log(res_json,"res_json")
          if(res_json.retCode === 1){
            let mainflag='';
            //绑定了银行卡，通过该属性显示,只显示主卡,需要的数据：bankType，银行卡号，
            let bindListSou = res_json.bindList;
            if(bindListSou.length==0){
              //没有绑定的  显示添加银行卡
              //this.setState({is_bankcard:false})
              enableCallBack();
              //this.get_loading().dismiss();
              PlateFormUtils.plateFormAlert(Platform,'错误提示',"您尚未绑卡!");
              this.props.navigator.push({id:"CardMagAddRelieve"})
            }else{
              for(let j=0;j<bindListSou.length;j++){
                if(bindListSou[j].mainflag==1){
                  // this.setState({
                  //   is_bankcard:true,
                  //   mainflag:bindListSou[j].mainflag,
                  //   bankCardNo:bindListSou[j].acctno,//银行卡号
                  //   openbank:bindListSou[j].openbank,
                  // })
                  enableCallBack();
                  PushLogin.push_login_destination('WithdrawCash', this.props.navigator,{
                    is_bankcard:true,
                    mainflag:bindListSou[j].mainflag,
                    bankCardNo:bindListSou[j].acctno,//银行卡号
                    openbank:bindListSou[j].openbank,
                    phoneNo:hash.retMsg
                  })
                
                }
              }
            }
          }else{
              enableCallBack();
            PlateFormUtils.plateFormAlert(Platform,'错误提示',"银行卡信息未获得!");
          }
        })
      }else{
      //没有绑定的  显示添加银行卡
      //this.setState({is_bankcard:false})
      PushLogin.push_login_destination('WithdrawCash', this.props.navigator,{is_bankcard:false})
    }
  }
  doRecharge =async (enableCallBack) => { 
    let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
    let hash = JSON.parse(value);
    if (!!hash && !!hash.retCode) {
        //手机号写进来，给后面提交时的api用
        console.log(this.props.Personal);
        ApolloAPI.APIcard.getIsBindList({
            //通过参数手机号获取银行卡信息
            telno: hash.retMsg,
        }).done((res_json, res) => {
            if (res_json.retCode === 1) {
                //绑定了银行卡，通过该属性显示,只显示主卡,需要的数据：bankType，银行卡号，
                let bindListSou = res_json.bindList;
                if (bindListSou.length == 0) {
                    //没有绑定的  显示添加银行卡
                    enableCallBack();
                    this.get_loading().dismiss();
                  PlateFormUtils.plateFormAlert(Platform,'错误提示',"您尚未绑卡!");
                  this.props.navigator.push({id:"CardMagAddRelieve"})

                } else {
                    enableCallBack();
                    for (let j = 0; j < bindListSou.length; j++) {
                        //console.log("state===1的对象是", this.state)
                        if (bindListSou[j].mainflag == 1) {
                            this.props.navigator.push({
                                id:'Recharge',params:{
                                    is_bankcard: true,
                                    mainflag: bindListSou[j].mainflag,
                                    bankCardNo: bindListSou[j].acctno,//银行卡号
                                    openbank: bindListSou[j].openbank,
                                    singlelimit:bindListSou[j].singlelimit,
                                    phoneNo: hash.retMsg}
                            });
                        }
                    }
                }
            } else {
                enableCallBack();
                this.props.navigator.push({
                    id:'Login',params:{}
                });
            }
        })
    } else {
        //没有绑定的  显示添加银行卡
        //this.setState({is_bankcard:false})
        enableCallBack();
        PushLogin.push_login_destination('Recharge', this.props.navigator,{is_bankcard:false})
    }
    
  }
  //加载点击显示和隐藏
  _renderRows(){
   return(
    <View>
     <View style={{flex:1, marginTop:8,justifyContent:'space-between',flexDirection:'row'}}>
        <View style={styles.my_view_text_5}>
            <View style={{height:23}}>
                <Text style={styles.my_view_text_3}>{investedsum.get()}</Text>
            </View>
            <Text style={styles.my_view_text_4}>已投金额</Text>
        </View>
        <View style={styles.my_view_text_5}>
            <View style={{height:23}}>
                <Text style={styles.my_view_text_3}>{toearnsum.get()}</Text>
            </View>
            <Text style={styles.my_view_text_4}>待收益金额</Text>
        </View>
        <View style={styles.my_view_text_5}>
            <View style={{height:23}}>
                <Text style={styles.my_view_text_3}>{availablesum.get()}</Text>
            </View>
            <Text style={styles.my_view_text_4}>可用余额</Text>
        </View>
    </View>
    <ListCards
    down_content={
      <View style={{flex:1,width:full_width,marginTop:8,}} >
          <ScrollView style={{flex:1,width: full_width,}} showsHorizontalScrollIndicator={false} horizontal={true}>
            <View style={{justifyContent:'space-between',flexDirection:'row',width:full_width}}>
                <View style={styles.my_view_text_5}>
                    <View style={{height:23}}>
                        <Text style={styles.my_view_text_3}>{invbacksum.get()}</Text>
                    </View>
                    <Text style={styles.my_view_text_4}>已收回金额</Text>
                </View>
                <View style={styles.my_view_text_5}>
                    <View style={{height:23}}>
                        <Text style={styles.my_view_text_3}>{earnedsum.get()}</Text>
                    </View>
                    <Text style={styles.my_view_text_4}>已收益金额</Text>
                </View>
                <View style={styles.my_view_text_5}>
                    <View style={{height:23}}>
                        <Text style={styles.my_view_text_3}>{candrawsum.get()}</Text>
                    </View>
                    <Text style={styles.my_view_text_4}>可提金额</Text>
                </View>
            </View>
            <View style={{justifyContent:'space-between',flexDirection:'row',width:full_width}}>
                <View style={styles.my_view_text_5}>
                    <View style={{height:23}}>
                        <Text style={styles.my_view_text_3}>{cannotdrawsum.get()}</Text>
                    </View>
                    <Text style={styles.my_view_text_4}>在途金额</Text>
                </View>
                <View style={styles.my_view_text_5}>
                    <View style={{height:23}}>
                        <Text style={styles.my_view_text_3}>{accuinvsum.get()}</Text>
                    </View>
                    <Text style={styles.my_view_text_4}>累计投资金额</Text>
                </View>
                 <View style={styles.my_view_text_5}>
                    <View style={{height:23}}>
                        <Text style={styles.my_view_text_3}>{accuearnsum.get()}</Text>
                    </View>
                    <Text style={styles.my_view_text_4}>累计收益金额</Text>
                </View>
            </View>
          </ScrollView>
          <ScrollView style={{flex:1,width:1.3 * full_width,marginTop:8,}} showsHorizontalScrollIndicator={false} horizontal={true}>
            <View style={{justifyContent:'space-between',flexDirection:'row',width:full_width}}>
                <View style={styles.my_view_text_5}>
                    <View style={{height:23}}>
                        <Text style={styles.my_view_text_3}>{borrowedsum.get()}</Text>
                    </View>
                    <Text style={styles.my_view_text_4}>已融资金额</Text>
                </View>
                <View style={styles.my_view_text_5}>
                    <View style={{height:23}}>
                        <Text style={styles.my_view_text_3}>{payfee.get()}</Text>
                    </View>
                    <Text style={styles.my_view_text_4}>已付手续费</Text>
                </View>
                <View style={styles.my_view_text_5}>
                    <View style={{height:23}}>
                        <Text style={styles.my_view_text_3}>{accuborsum.get()}</Text>
                    </View>
                    <Text style={styles.my_view_text_4}>累计融资金额</Text>
                </View>
            </View>
            <View style={{justifyContent:'space-between',flexDirection:'row',width:full_width}}>
                <View style={styles.my_view_text_5}>
                    <View style={{height:23}}>
                        <Text style={styles.my_view_text_3}>{accupayfee.get()}</Text>
                    </View>
                    <Text style={styles.my_view_text_4}>累计支付手续费</Text>
                </View>
                <View style={styles.my_view_text_5}>
                    <View style={{height:23}}>
                        <Text style={styles.my_view_text_3}>{accupayint.get()}</Text>
                    </View>
                    <Text style={styles.my_view_text_4}>累计支付利息</Text>
                </View>
                <View style={styles.my_view_text_5}>
                    <View style={{height:23}}>
                        <Text style={styles.my_view_text_3}></Text>
                    </View>
                    <Text style={styles.my_view_text_4}></Text>
                </View>
            </View>
          </ScrollView>
      </View>
    }
    clickStyle={{fontSize:10,color:'#909090'}}
    onPressArrow={this.onPressArrow}
     />
    </View>
   )
 }
  onPressArrow=(callback)=>{
    if(callback == true){
      this.setState({
        height:0.32 * full_height,
      })

      let showContent = "向右滑动显示更多内容哦!";
      this.refs.toast.show(showContent,DURATION.LENGTH_SHORT);
    }else{
      this.setState({
        height:0.12 * full_height,
      })
    }
    
  }
  
  pickSingle(cropit, circular) {
    this.get_loading().show();
      //检查登录状态
    ApolloAPI.APILogin.getloginState({
          tenantNo:COMMON_CONFIG.tenantNo
        }).done((res_json, res) => {
                this.get_loading().dismiss();
                if(res_json.retCode == 1){
                  //登录后请求数据
                     ImagePicker.openPicker({
                        cropping: cropit,
                        cropperCircleOverlay: circular,
                        compressImageMaxWidth: 640,
                        compressImageMaxHeight: 480,
                        compressImageQuality: 1,
                        compressVideoPreset: 'MediumQuality',
                      }).then( async image => {
                        // console.log('received cropped image', JSON.stringify(image));
                        //存储图片位置到本地
                        await AsyncStorage.setItem(STORAGE_KEYS.PORTRAIT_IMG,JSON.stringify(image));
                        this.setState({
                          avatarSource:  {uri: image.path, width: image.width, height: image.height, mime: image.mime},
                          images: null
                        });
                      })
                }else{
                 //跳转登录页面
                  PlateFormUtils.plateFormAlert(Platform,"错误提示","您还未登录或注册!");
                  this.props.navigator.push({
                    id:'Login',params:{}
                  });
              }
    })
       
  }
  //公共的pushlogin
  push_login_destination(destination,navigator,data){
      this.get_loading().show();
        ApolloAPI.APILogin.getloginState({
              tenantNo:COMMON_CONFIG.tenantNo
            }).done((res_json, res) => {
                    this.get_loading().dismiss();
                    if(res_json.retCode == 1){
                        navigator.push({id: destination, params:data})
                    }else{
                    //跳转登录页面
                      PlateFormUtils.plateFormAlert(Platform,"错误提示","您还未登录或注册!");
                      navigator.push({
                        id:'Login',params:{}
                      });
                  }
        })
  }
  //转让申请记录查询
  async toAssignAppRec(){
    this.get_loading().show()
    let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
    let hash = JSON.parse(value);//json转字符串
      if (!!hash && !!hash.retMsg && hash.retCode==1) {
          //console.log("转让申请的手机号是",hash.retMsg);
          ApolloAPI.APIPersonal.getAssignRec({
            telNo:hash.retMsg,
          }).done((res_json, res)=>{
              this.get_loading().dismiss()
            if(res_json.retCode == 1){
                this.push_login_destination('AssignAppRec', this.props.navigator,{dataSource:res_json,hasContent:true})
            }else{
                this.push_login_destination('AssignAppRec', this.props.navigator,{hasContent:false})
            }
            
            })}
  }
  //融资申请记录查询
  async toInvAppRec(){
    this.get_loading().show()
    let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
    let hash = JSON.parse(value);//json转字符串
      if (!!hash && !!hash.retMsg && hash.retCode==1) {
          //console.log("转让申请的手机号是",hash.retMsg);
          ApolloAPI.APIPersonal.getInvAppRcd({
            telNo:hash.retMsg,
          }).done((res_json, res)=>{
              this.get_loading().dismiss()
            if(res_json.retCode == 1){
                this.push_login_destination('InvAppRec', this.props.navigator,{dataSource:res_json,hasContent:true})
            }else{
                this.push_login_destination('InvAppRec', this.props.navigator,{hasContent:false})
            }
            
            })}
  }

  render() {
    const vertical_line = ART.Path();
    vertical_line.moveTo(1,1);
    vertical_line.lineTo(1,150);
    const vertical_line_2 = ART.Path();
    vertical_line_2.moveTo(1,1);
    vertical_line_2.lineTo(1,55);
    const vertical_line_3 = ART.Path();
    vertical_line_3.moveTo(1,1);
    vertical_line_3.lineTo(1,50);
    const horizontal_line = ART.Path();
    horizontal_line.moveTo(1,1);
    horizontal_line.lineTo(full_width,1);
    const horizontal_line_2 = ART.Path();
    horizontal_line_2.moveTo(1,1);
    horizontal_line_2.lineTo(full_width,1);
     const path = new Path()
            .moveTo(30,1)
            .arc(0,59,25)
            .arc(0,-59,25)
            .close();

    let dataSource=(new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})).cloneWithRows([1]);
    return(
      <View style={styles.root}>
        <View style={[styles.head,{height: 0.315 * full_height}]}>
          <Image style={[styles.perHead]} source={require('../../image/bg_pic.png')}>
            <View style={[styles.head_view,]}>
              <Text style={{fontSize:15,color:'white',marginTop:15}}>{welcome_words.get()}</Text>
            </View>
            <TouchableOpacity style={{alignItems:'flex-end',marginRight:25,marginTop:-16}} onPress={() => PushLogin.push_login_destination('MyMessage', this.props.navigator)}>
                  <Image style={{height:25,width:20}} source={require('../../image/remind.png')} />
              </TouchableOpacity>   
          </Image>
          <View style={styles.portraitView}>
           <TouchableOpacity onPress={() => this.pickSingle(true, true)}>
              <View style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
              { this.state.avatarSource === null ? <Text style={{fontSize:10}}>选择头像</Text> :
                <Image style={styles.avatar} source={this.state.avatarSource} />
              }
              </View>
            </TouchableOpacity>
          </View>
          <View style={{marginTop:40,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
              <Text style={{fontSize:15,}}>{phoneNum.get()}</Text>
          </View>
          <View style={{justifyContent:'space-between',flexDirection:'row',height:0.07 * full_height, backgroundColor: 'white',}}>
            <View style={{flex:1,alignItems:'center',justifyContent:'flex-start',marginLeft:0.08 * full_width,flexDirection:'row'}}>
              <TouchableOpacity 
                onPress={() => this.push_login_destination('Totalassets2', this.props.navigator)}>
                <View style={styles.my_view_text_5}>
                  <Text style={styles.my_view_text_3}>{totasset.get()}</Text>
                  <Text style={styles.my_view_text_4}>总资产 (元)</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{flex:1,alignItems:'center',flexDirection:'row',justifyContent:'space-around',}}>
              <CusButton text="提现"  onPressButton={this.withdrawMoney} ></CusButton>
              <CusButton text="充值"  onPressButton={this.doRecharge}></CusButton>
            </View>
        </View> 
        </View>
        <WhiteSpace size='md' />
        <View style={[styles.head,{height:this.state.height}]}>
          {
            this.state.perData == false ? 
            null :
            <ListView   dataSource={dataSource} showsVerticalScrollIndicator={false}
                      renderRow={() =>this._renderRows()} />
          }
          
        </View>
         
        <ScrollView showsVerticalScrollIndicator={false}>
          <WhiteSpace size='md' />
          <View style={{height:85,backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}}>
            <View style={{flex:1,alignItems:'center'}}>
              <TouchableOpacity onPress={() => this.push_login_destination('Perinfo', this.props.navigator)}>
                <Image source={require('../../image/information.png')} style={{width:26,height:27,alignSelf:'center'}}/>
                <Text style={styles.my_view_text}>我的信息</Text>
              </TouchableOpacity>
            </View>
            <ART.Surface width={2} height={150}>
              <ART.Shape d={vertical_line} stroke={COMMON_STYLES.MAIN_BACKGROUND_COLOR} strokeWidth={1} />
            </ART.Surface>
             <View style={{flex:1,alignItems:'center'}}>
              <TouchableOpacity
              onPress={() => this.push_login_destination('TradePassword', this.props.navigator)}>
                <Image source={require('../../image/password.png')} style={{width:23,height:27,alignSelf:'center'}}/>
                <Text style={styles.my_view_text}>资金交易密码</Text>
              </TouchableOpacity>
            </View>
            <ART.Surface width={2} height={150}>
              <ART.Shape d={vertical_line} stroke={COMMON_STYLES.MAIN_BACKGROUND_COLOR} strokeWidth={1} />
            </ART.Surface>
            <View style={{flex:1,alignItems:'center'}}>
              <TouchableOpacity onPress={() => this.push_login_destination('InvesRecord', this.props.navigator)}>
                <Image source={require('../../image/financing_record.png')} style={{width:24,height:24,alignSelf:'center'}}/>
                <Text style={styles.my_view_text}>投资记录</Text>
              </TouchableOpacity>
            </View>
          </View>
          <ART.Surface width={2} height={1}>
              <ART.Shape d={horizontal_line} stroke={COMMON_STYLES.MAIN_BACKGROUND_COLOR} strokeWidth={1} />
          </ART.Surface>
          <View style={{height:85,backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}}>
            <View style={{flex:1,alignItems:'center'}}>
              <TouchableOpacity onPress={() => this.toAssignAppRec() }>
                <Image source={require('../../image/query01.png')} style={{width:24,height:24,alignSelf:'center'}}/>
                <Text style={styles.my_view_text}>转让申请进度查询</Text>
              </TouchableOpacity>
            </View>
            <ART.Surface width={2} height={150}>
              <ART.Shape d={vertical_line} stroke={COMMON_STYLES.MAIN_BACKGROUND_COLOR} strokeWidth={1} />
            </ART.Surface>
            <View style={{flex:1,alignItems:'center'}}>
                <TouchableOpacity onPress={() => this.toInvAppRec() }>
                  <Image source={require('../../image/query02.png')} style={{width:24,height:24,alignSelf:'center'}}/>
                  <Text style={styles.my_view_text}>融资申请进度查询</Text>
                </TouchableOpacity>
              </View>
            <ART.Surface width={2} height={150}>
              <ART.Shape d={vertical_line} stroke={COMMON_STYLES.MAIN_BACKGROUND_COLOR} strokeWidth={1} />
            </ART.Surface>
            <View style={{flex:1,alignItems:'center'}}>
              <TouchableOpacity onPress={() => this.push_login_destination('FinancingRec', this.props.navigator)}>
                <Image source={require('../../image/self_invest.png')} style={{width:24,height:24,alignSelf:'center'}}/>
                <Text style={styles.my_view_text}>融资记录</Text>
              </TouchableOpacity>
            </View>
          </View>
          <ART.Surface width={2} height={1}>
            <ART.Shape d={horizontal_line} stroke={COMMON_STYLES.MAIN_BACKGROUND_COLOR} strokeWidth={1} />
          </ART.Surface>
          <View style={{height:85,backgroundColor:'#fff',flexDirection:'row',alignItems:'center'}}>
            <View style={{flex:1,alignItems:'center'}}>
              <TouchableOpacity onPress={() => this.push_login_destination('RechargeRec', this.props.navigator)}>
                <Image source={require('../../image/recharge_record.png')} style={{width:20,height:28,alignSelf:'center'}}/>
                <Text style={styles.my_view_text}>充值记录</Text>
              </TouchableOpacity>
            </View>
            <ART.Surface width={2} height={150}>
              <ART.Shape d={vertical_line} stroke={COMMON_STYLES.MAIN_BACKGROUND_COLOR} strokeWidth={1} />
            </ART.Surface>
            <View style={{flex:1,alignItems:'center'}}>
              <TouchableOpacity onPress={()=>this.push_login_destination('WithdrawRec', this.props.navigator)}>
                <Image source={require('../../image/intention_solicitation.png')} style={{width:24,height:28,alignSelf:'center'}}/>
                <Text style={styles.my_view_text}>提现记录</Text>
              </TouchableOpacity>
            </View>
            <ART.Surface width={2} height={150}>
              <ART.Shape d={vertical_line} stroke={COMMON_STYLES.MAIN_BACKGROUND_COLOR} strokeWidth={1} />
            </ART.Surface>
            <View style={{flex:1,alignItems:'center'}}>
              <TouchableOpacity onPress={() =>this.push_login_destination('Moreinfo', this.props.navigator)}>
                <Image source={require('../../image/more.png')} style={{width:28,height:28,alignSelf:'center'}}/>
                <Text style={styles.my_view_text}>更多</Text>
              </TouchableOpacity>
            </View>
          </View>
          <WhiteSpace size='md' />
           
          <View style={{height:0.13 * full_height,marginTop:0.05 * full_height,alignItems:'center',borderTopColor:'#b7b7b7',borderTopWidth:onePt}}>
              <Text style={{color:'#b7b7b7',fontSize:12,marginTop:10}}>
                  我是有底线的
              </Text>
          </View>
        </ScrollView>
        <Loading ref="loading" />
        <Toast ref="toast" position="bottom"/>
      </View>
  
    )}
}
const styles = StyleSheet.create({
  root: {
    backgroundColor: COMMON_STYLES.MAIN_BACKGROUND_COLOR,
    width:full_width,
    height:full_height,
    //marginTop:(Platform.Version >= 21)? 30:0,
//    flex: 1
  },
  head_view: {
   // height:75,
    backgroundColor:'transparent',
    flexDirection:'row',
    justifyContent: 'center',
    alignItems:'center',
    marginTop:10,
  },
  line:{
    position: "absolute",
    right: 50,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  noti_image: {
    position: "absolute",
    right: 20,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  card_view:{
    margin:15,
    backgroundColor:'#dae2e6',
    borderRadius:8,
    height:110,
  },
  card_arrow:{
    position: "absolute",
    right: 5,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  my_view:{
    flex:1,
    flexDirection:'row',
    marginLeft:15,
  },
  my_view_text:{
    color:common_color,
    fontSize:common_fontsize,
    marginTop:10,
    alignSelf:'center'
  },
  my_view_text_2:{
    color:common_color,
    fontSize:common_fontsize,
    marginLeft:10,
  },
  my_view_text_3:{
    color: common_color3,
    fontSize:common_fontsize3,
    alignSelf:'center',
  },
  my_view_text_4:{
    color: common_color4,
    fontSize:common_fontsize4,
    marginTop: 5,
  },
  my_view_text_5:{
    flex:1,
    alignItems:'center',
    justifyContent :'center'
  },
  perHead: {
    backgroundColor: '#fff',
    width:full_width,
    ...Platform.select({
      android:{
        height: (Platform.Version >= 21)?0.125 * full_height +5:0.15 * full_height - 10,
      },
      ios:{
        height: 0.125 * full_height+20,
      }
    }),
    
  },
  head: {
    backgroundColor: 'white',
  },
  portraitView:{
     ...Platform.select({
      android:{
        marginTop: 0.125 * full_height - 25,
      },
      ios:{
        marginTop: 0.125 * full_height - 10,
      }
    }),
      position:'absolute',
      left:0.42 * full_width,
      backgroundColor:'transparent'
  },
  avatarContainer: {
    borderColor: '#fff',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 30,
    width: 60,
    height: 60,
  }
});
export default Personal