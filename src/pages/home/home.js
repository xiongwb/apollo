/**
 * zgx
 *   <ART.Surface width={2} height={70}>
                <ART.Shape d={vertical_line} stroke={COMMON_STYLES.MAIN_COLOR} strokeWidth={1} />
              </ART.Surface>
              <View style={styles.my_view}>
                <TouchableOpacity onPress={() => this.toScoreSign()}>
                  <View style={{height:40,justifyContent:'center',alignItems:'center'}}>
                    <Image source={require('../../image/sign.png')} style={{width: 25,height: 25,alignSelf: 'center'}} />
                  </View>
                  <Text style={styles.my_view_text}>
                    积分签到
                  </Text>
                </TouchableOpacity>
              </View>
               <ART.Surface width={2} height={70}>
                <ART.Shape d={vertical_line} stroke={COMMON_STYLES.MAIN_COLOR} strokeWidth={1} />
              </ART.Surface>
              <View style={styles.my_view}>
                <TouchableOpacity onPress={() =>this.push_login_destination('Coupon', this.props.navigator)}>
                  <View style={{height:40,justifyContent:'center',alignItems:'center'}}>
                    <Image source={require('../../image/gift.png')} style={{width: 25,height: 25,alignSelf: 'center'}} />
                  </View>
                  <Text style={styles.my_view_text}>
                    我的礼包
                  </Text>
                </TouchableOpacity>
              </View>
               <ART.Surface width={2} height={70}>
                <ART.Shape d={vertical_line} stroke={COMMON_STYLES.MAIN_COLOR} strokeWidth={1} />
              </ART.Surface>
              <View style={styles.my_view}>
                <TouchableOpacity onPress={() => this.toInvesRecord()}>
                  <View style={{height:40,justifyContent:'center',alignItems:'center'}}>
                    <Image source={require('../../image/assignment.png')} style={{width: 26,height: 26,alignSelf: 'center'}} />
                  </View>
                  <Text style={styles.my_view_text}>
                    转让
                  </Text>
                </TouchableOpacity>
              </View>
 */
import React, { Component } from 'react'
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableHighlight, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  ScrollView, 
  ART, 
  PixelRatio, 
  Button, 
  AsyncStorage,
  Platform,
  TextInput,
  ListView,
  Alert,
  RefreshControl
} from 'react-native'
import {
  NavBar,
  BasePage,
  Line,
  Swiper,
  PushLogin,
  Loading,
} from 'ApolloComponent';
import { NavigatorUtils,PlateFormUtils, StringUtils } from 'ApolloUtils';
import { Color, COMMON_STYLES,STORAGE_KEYS, EVENT_EMITTER_CONST,COMMON_CONFIG } from 'ApolloConstant';
import SwiperNative from 'react-native-swiper';
import WhiteSpace from 'antd-mobile/lib/white-space';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import Icon from 'react-native-vector-icons/FontAwesome';
import Carousel from 'react-native-snap-carousel';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import Modal from 'react-native-root-modal';
import ApolloAPI from 'ApolloAPI';
import CountDownTimer from '../../components/countDownTime';

let full_width = Dimensions.get('window').width
let full_height = Dimensions.get('window').height
let onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
let viewWidth = full_width-15-75-10-10-20-15

let common_color = '#101010'
let common_fontsize = 10


const vertical_line = ART.Path();
vertical_line.moveTo(1, 1);
vertical_line.lineTo(1, 70);
//Image加载网络图片
// var BANNER_IMGS = [
//   'http://ac-c6scxa78.clouddn.com/f6b64dc4bf7bee56.jpg',
//   'http://ac-c6scxa78.clouddn.com/91ead58b0bb213b6.jpg',
//   'http://ac-c6scxa78.clouddn.com/d67316858f6c71f3.jpg',
//   'http://ac-c6scxa78.clouddn.com/c81c5b7be1838a1e.jpg',
//   'http://ac-c6scxa78.clouddn.com/54fe022399902788.jpg'
// ]
// //image加载本地图片
// let datas = []
// datas.push({photoUrl: '../../image/home_banner/home_banner1.png'})
// //datas.push({photoUrl: '../../image/home_banner/swiper_home_1.png'})
// let url = {
//   '../../image/home_banner/home_banner1.png': require('../../image/home_banner/home_banner1.png'),
//   '../../image/home_banner/swiper_home_1.png': require('../../image/home_banner/swiper_home_1.png')
// }

// let recomendContent = new Array();
//     recomendContent.push({id:'1',type:'活期',name:'尧都专享理财',rateTitle:'七日年化收益率',rate:'8.0',ifNew:'y'});
//     recomendContent.push({id:'2',type:'定期',name:'尧都兴业理财',rateTitle:'七日年化收益率',rate:'5.6',ifNew:'n'});
//     recomendContent.push({id:'3',type:'活期',name:'尧都p2p理财',rateTitle:'七日年化收益率',rate:'4.0',ifNew:'n'});
//     recomendContent.push({id:'4',type:'定期',name:'山西实业',rateTitle:'七日年化收益率',rate:'6.5',ifNew:'n'});
//     recomendContent.push({id:'5',type:'定期',name:'尧都E都市',rateTitle:'七日年化收益率',rate:'3.5',ifNew:'y'});
//     recomendContent.push({id:'6',type:'活期',name:'尧都重工',rateTitle:'七日年化收益率',rate:'4.5',ifNew:'y'});

@observer 
class Home extends BasePage {
   constructor(props) {
    super(props)
    this.state={
      is_login : false,
      head_hint : '登录/注册',
      recomId: null,
      firstItem:1,
      firstPrdcode:'',
      modalVisible:false,
      iconString:'check-circle',
      iconColor:'#ed5565',
      disabled:false,
      invmoney:'', // 投资金额
      bannerImges:'',
      recomSource:'',
      prdname:"",
      prddays:"",
      yearprofitrate:"",
      availableSum:"",
      preMoney:"",
      prdinfoid:"",
      phoneNo:"",
      tenantName:"",
      logoUrl:"",
      notics:"",
      noticModalVisible:false,
      startTime:'',
      isRefreshing:false,
    }
  }
  get_loading() {
    return this.refs.loading;
  }
async __commit(){ 
  let recomSource = this.state.recomSource;
  if( recomSource == null || recomSource ==""){
    PlateFormUtils.plateFormAlert(Platform,"错误提示","请等待加载投资推荐!");
  } else{
    let activeItemIndex = this.refs.carousel.state.activeItem;
    let buyminamt = recomSource[activeItemIndex].buyminamt; //起投金额
    let nowquota = recomSource[activeItemIndex].nowquota; //剩余额度
    let prdsta = recomSource[activeItemIndex].prdsta//产品是否可投
    let prdCode=recomSource[activeItemIndex].prdcode//产品的code
    let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
      let hash = JSON.parse(value);
      //1.判断登录与否
      if(!!hash && hash.retCode == 1 && hash.retMsg){
        //3.检验产品状态是否为可投
        if(prdsta=='1' || prdsta=='0'){
          //4.投资金额不能为空，并且>0
          if(this.state.invmoney!=null&&this.state.invmoney>0){
            this.get_loading().show();
            ApolloAPI.APIBorrow.sendProtocolData({
              tenantNo:COMMON_CONFIG.tenantNo,
              proType:1,
              returnType:3
            }).done((res_json, res) => {
              this.setState({protocoltitle:res_json.protocoltitle,protocolcontent:res_json.protocolcontent})
              if(res_json.retCode == 1){
                let id = recomSource[activeItemIndex].prdinfoid;
                let code = recomSource[activeItemIndex].prdcode;
                ApolloAPI.APILogin.getloginState({
                  tenantNo:COMMON_CONFIG.tenantNo
                }).done((res_json, res) => {
                  if(res_json.retCode == 1){
                    //2.判断有没有绑定银行卡和实名认证，没有跳转绑卡
                    ApolloAPI.APIcard.getIsBindList({
                      telno:hash.retMsg,
                    }).done((res_json, res)=>{
                      if(res_json.retCode === 1 && res_json.bindList.length >0){
                        //5.后台验证
                        ApolloAPI.APIInvest.validateInv({
                          phoneNo:hash.retMsg,
                          money:this.state.invmoney,
                          prdInfoID:id
                        }).done((res_json, res)=>{
                          
                          if(res_json.retCode === 1){
                            let sumInt = res_json.map.sumInt;
                            //查询投资所需要的资料
                            ApolloAPI.APIInvest.getInvItemDetail({
                              prdcode:code,
                              phoneNo:hash.retMsg,
                            }).done((data, res) => {
                              if(data.retCode == 1){
                                this.get_loading().dismiss();
                                //预期收益：投资金额*年收益率*天数/(360*100)，四舍五入到分
                                let money = data.availableSum-this.state.invmoney;
                                let availableSum = money<=0?'0.00':StringUtils.moneyFormatData2Money(money);
                                let profit = "";
                                let yearprofitrate ="";
                                if(data.prdinfo.addprofit != null){
                                  profit = data.prdinfo.yearprofitrate + "%"+ " + " +  data.prdinfo.addprofit + "%";
                                  yearprofitrate = data.prdinfo.yearprofitrate + data.prdinfo.addprofit;
                                }else{
                                  profit = data.prdinfo.yearprofitrate + "%";
                                  yearprofitrate = data.prdinfo.yearprofitrate;
                                }
                                let dayAndRate = "";
                               // let m = '';
                                if(data.prdinfo.calcintmann == 1 && data.prdinfo.prdmonths != null){
                                  dayAndRate = data.prdinfo.prdmonths + "个月";
                                      //预期收益：投资金额*年收益率*天数/(360*100)，四舍五入到分
                                 // m = (this.state.invmoney*yearprofitrate*data.prdinfo.prdmonths)/(12*100);
                                }
                                if(data.prdinfo.calcintmann == 2 && data.prdinfo.prddays != null){
                                  dayAndRate = data.prdinfo.prddays + "天";
                                      //预期收益：投资金额*年收益率*天数/(360*100)，四舍五入到分
                                 // m = (this.state.invmoney*yearprofitrate*data.prdinfo.prddays)/(360*100);
                                }
                                //let preMoney = StringUtils.moneyFormatData2Money(m);
                                this.setState({
                                  modalVisible: true,
                                  prdname:data.prdinfo.prdname,
                                  prddays:dayAndRate,
                                  yearprofitrate:profit,
                                  availableSum:availableSum,
                                  preMoney:sumInt,
                                  prdinfoid:id,
                                  phoneNo:hash.retMsg
                                });
                              }else if(data.retCode ==9){ //用户没有登录或登录超时
                                this.get_loading().dismiss();
                                PlateFormUtils.plateFormAlert(Platform,"提示","登录超时，为了安全，请重新登录!");
                                //跳转到登录页面
                                this.props.navigator.push({
                                  id:'Login',params:{}
                                });
                              }else {
                                this.get_loading().dismiss();
                                PlateFormUtils.plateFormAlert(Platform,"错误提示",data.retMsg);
                              }
                            })
                          }else if(res_json.retCode === 2){
                              let sumInt = res_json.map.sumInt;
                              this.get_loading().dismiss();
                               Alert.alert('提示', res_json.retMsg, [
                                       { text: '取消'},
                                       { text: '确认', onPress: () => {
                                          this.get_loading().show();
                                          //查询投资所需要的资料
                                          ApolloAPI.APIInvest.getInvItemDetail({
                                            prdcode:code,
                                            phoneNo:hash.retMsg,
                                          }).done((data, res) => {
                                            if(data.retCode == 1){
                                              this.get_loading().dismiss();
                                              //预期收益：投资金额*年收益率*天数/(360*100)，四舍五入到分
                                              let money = data.availableSum-this.state.invmoney;
                                              let availableSum = money<=0?'0.00':StringUtils.moneyFormatData2Money(money);
                                              let profit = "";
                                              let yearprofitrate ="";
                                              if(data.prdinfo.addprofit != null){
                                                profit = data.prdinfo.yearprofitrate + "%"+ " + " +  data.prdinfo.addprofit + "%";
                                                yearprofitrate = data.prdinfo.yearprofitrate + data.prdinfo.addprofit;
                                              }else{
                                                profit = data.prdinfo.yearprofitrate + "%";
                                                yearprofitrate = data.prdinfo.yearprofitrate;
                                              }
                                              let dayAndRate = "";
                                              //let m = '';
                                              if(data.prdinfo.calcintmann == 1 && data.prdinfo.prdmonths != null){
                                                dayAndRate = data.prdinfo.prdmonths + "个月";
                                                    //预期收益：投资金额*年收益率*天数/(360*100)，四舍五入到分
                                                //m = (this.state.invmoney*yearprofitrate*data.prdinfo.prdmonths)/(12*100);
                                              }
                                              if(data.prdinfo.calcintmann == 2 && data.prdinfo.prddays != null){
                                                dayAndRate = data.prdinfo.prddays + "天";
                                                    //预期收益：投资金额*年收益率*天数/(360*100)，四舍五入到分
                                               // m = (this.state.invmoney*yearprofitrate*data.prdinfo.prddays)/(360*100);
                                              }
                                              //let preMoney = StringUtils.moneyFormatData2Money(m);
                                              this.setState({
                                                modalVisible: true,
                                                prdname:data.prdinfo.prdname,
                                                prddays:dayAndRate,
                                                yearprofitrate:profit,
                                                availableSum:availableSum,
                                                preMoney:sumInt,
                                                prdinfoid:id,
                                                phoneNo:hash.retMsg
                                              });
                                            }else if(data.retCode ==9){ //用户没有登录或登录超时
                                              this.get_loading().dismiss();
                                              PlateFormUtils.plateFormAlert(Platform,"提示","登录超时，为了安全，请重新登录!");
                                              //跳转到登录页面
                                              this.props.navigator.push({
                                                id:'Login',params:{}
                                              });
                                            }else {
                                              this.get_loading().dismiss();
                                              PlateFormUtils.plateFormAlert(Platform,"错误提示",data.retMsg);
                                            }
                                          })
                                    }
                                }])
                          }else{
                            this.get_loading().dismiss();
                            PlateFormUtils.plateFormAlert(Platform,"错误提示",res_json.retMsg);
                          }
                        })
                      }else{
                        //未绑定银行卡
                        this.get_loading().dismiss();
                        this.props.navigator.push({id:"CardMagAddRelieve"})
                        //PlateFormUtils.plateFormAlert(Platform,'错误提示',"银行卡信息未获得!");
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
                PlateFormUtils.plateFormAlert(Platform,"错误提示",res_json.retMsg);
              }
            })
          }else{
            this.get_loading().dismiss();
            PlateFormUtils.plateFormAlert(Platform,"错误提示","请输入投资金额!");
          }
        }else{
          PlateFormUtils.plateFormAlert(Platform,"错误提示","该项产品已满标/结束，请选择其他产品!");
        }
      }else{
        this.get_loading().dismiss();
        PlateFormUtils.plateFormAlert(Platform,"错误提示","您还未登录或注册!");
        this.props.navigator.push({id:'Login',params:{}});
      }
  }
}

async  comfirmInv (){
    let prdname = this.state.prdname;
    let phoneNo = this.state.phoneNo;
    let money =  this.state.invmoney;
    let prdinfoid= this.state.prdinfoid;
    this.setState({
      modalVisible: false,
    });
    //获取个人的免密支付
     let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
          let hash = JSON.parse(value);
          //console.log(hash);
          if(!!hash && hash.retCode ==1){
              ApolloAPI.APIPersonal.getPerInfo({
                //通过参数获取个人信息
                telno:hash.retMsg
              }).done((res_json, res)=>{
                if(res_json.retCode === 1 && res_json.nopswdflag == 1){ //免密
                      ApolloAPI.APIInvest.doInvest({
                        phoneNo:phoneNo,money:money,prdInfoID:prdinfoid,
                        businessSeqNo:'',
                      }).done((data, res) => {
                        this.get_loading().dismiss();
                        if(data.retCode == 1){
                          PlateFormUtils.plateFormAlert(Platform,"正确提示","投资成功!");
                          this.setState({
                            invmoney:'',
                          });
                          this.getRecomPrd(this.refs.carousel.state.activeItem);
                        }else if(data.retCode ==9){ //用户没有登录或登录超时
                          PlateFormUtils.plateFormAlert(Platform,"提示","登录超时，为了安全，请重新登录!");
                          //跳转到登录页面
                          this.props.navigator.push({
                            id:'Login',params:{}
                          });
                          this.setState({
                            invmoney:'',
                          });
                        }else {
                          this.setState({
                            invmoney:'',
                          });
                          PlateFormUtils.plateFormAlert(Platform,"错误提示",data.retMsg);
                        }
                    })
                }else if(res_json.retCode === 1 && res_json.nopswdflag == 0){
                    this.get_loading().dismiss();
                    PushLogin.push_login_destination('TradePasswordValidate', this.props.navigator,{from:'invest',money:money,naviParam:"home",data:{phoneNo:phoneNo,money:money,prdInfoID:prdinfoid,}})
                    this.setState({
                            invmoney:'',
                          });
                }else{
                    this.get_loading().dismiss();
                    PlateFormUtils.plateFormAlert(Platform,'错误提示',"免密协议信息未获得!");
                    this.setState({
                            invmoney:'',
                          });
                }
              })
          }
  }
  request_api() {
          this.setState({
            invmoney:'',
          });
          //获取登录信息是否超时
          ApolloAPI.APILogin.getloginState({
              tenantNo:COMMON_CONFIG.tenantNo
            }).done((res_json, res) => {
                    if(res_json.retCode == 1){
                      //登录后显示
                      this.setState({is_login:true})
                    }else{
                      this.setState({is_login:false})
                  }
            })
          //获取公告
          ApolloAPI.APIHome.getNotics({
            tenantNo:COMMON_CONFIG.tenantNo
          }).done((res_json, res) => {
                    //console.log("取到的公告数据是",res_json);
                    //得到logo 信息
                  if(res_json.retCode == 1 && res_json.list.length>0){
                    //console.log("取到的推荐数据是",res_json);
                    //得到推荐数据
                    this.setState({
                      notics:res_json.list,
                      noticModalVisible:true
                    })
                  }
          })
          //获取banner图片
          ApolloAPI.APIHome.getBanner({
            tenantNo:COMMON_CONFIG.tenantNo
          }).done((res_json, res) => {
              //console.log(res_json);
              //得到image uri
              this.setState({bannerImges:res_json.list})
          })

          //获取租户名称和logo
          ApolloAPI.APIHome.getTenantName({
            tenantNo:COMMON_CONFIG.tenantNo
          }).done((res_json, res) => {
                  if(res_json.retCode == 1){
                    //console.log("取到的logo数据是",res_json);
                    //得到logo 信息
                    this.setState({
                      tenantName:res_json.shortname,
                      logoUrl:res_json.logouri,
                    })
                  }else{
                    let tips = "错误提示";
                    let showContent = "获取租户名称和logo失败";
                    PlateFormUtils.plateFormAlert(Platform,tips,showContent);
                }
          })
         
       

          //获取推荐产品信息
          this.getRecomPrd(this.state.firstItem);
     
  }
  getRecomPrd(firstItem){
       //this.get_loading().show();
       ApolloAPI.APIHome.getProducts({
            tenantNo:COMMON_CONFIG.tenantNo
          }).done((res_json, res) => {
                  if(res_json.retCode == 1){
                    //得到推荐数据
                    this.setState({
                      recomSource:res_json.list,
                      firstItem:firstItem
                    })
                    //this.get_loading().dismiss();
                    //如果预热的产品，去获取倒计时
                    // if(res_json.list[this.state.firstItem].prdsta==0){
                    //   this.getRushTime(res_json.list[firstItem].prdcode,res_json.list[firstItem].prdsta);
                    //   this.get_loading().dismiss();
                    // }else{
                    //   this.get_loading().dismiss();
                    // }
                  }else{
                    //this.get_loading().dismiss();
                    //console.log("取到的推荐数据  失败了");
                    let tips = "错误提示";
                    let showContent = "取到的推荐数据  失败了";
                    PlateFormUtils.plateFormAlert(Platform,tips,showContent);
                }
          })
  }
  componentDidMount(){
      this.request_api();
   
      this.listener1 = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.DIDDASHSUCCESS,(value)=>{
        // 接受到通知后的处理
        // console.log("我的已经登录成功")
        if(value == "Home"){
          this.request_api();
        }
     
      });

      this.listener2 = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.DIDLOGINSUCCESS,(value)=>{
          // 接受到通知后的处理
          // console.log("我的已经登录成功")
          if(value == "login"){
            this.request_api();
          }
      });

      this.listener3 = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.INVESTSUCCESS,(value)=>{     
          //投资成功，刷新投资记录
          if(value == "invest"){
            //this.getRecomPrd(this.refs.carousel.state.activeItem);
            this.getRecomPrd(this.state.firstItem);
          }
      }) 
  }

  componentWillUnmount(){
    // 移除 一定要写
    this.listener1.remove();
    this.listener2.remove();
    this.listener3.remove();
    
  }

  //显示公告
  showNotics(){
    return(
      <View>
        {this.state.noticModalVisible ?  
          <View style={{flexDirection:'row'}}>
              <Carousel
              sliderWidth={ full_width}
              itemWidth={full_width}
              firstItem={0}
              inactiveSlideScale={1}
              inactiveSlideOpacity={1}
              enableMomentum={true}
              containerCustomStyle={{backgroundColor:'#ffffcc',}}
              contentContainerCustomStyle={{backgroundColor:'transparent'}}
              showsHorizontalScrollIndicator={false}
              snapOnAndroid={true}
              removeClippedSubviews={false}
              autoplay={true}
              autoplayInterval={3000}
              autoplayDelay={3000}
            >
                {this.renderNotics()}
            </Carousel> 
            <TouchableOpacity  onPress={() => this.setState({noticModalVisible:!this.state.noticModalVisible})}>
              <Icon name='close' size={20} />
            </TouchableOpacity> 
          </View>    
            : null}
     </View>
    )
  }
  //加载公告
  renderNotics = () =>{
    let notics = [];
    let noticsList = this.state.notics;
    //console.log("noticsList",noticsList);
    if(noticsList.length >0){
        for (let i = 0;i < noticsList.length;i++) {
        notics.push(
          //需要根据不同得页面进入不同的产品页面
          <View style={{height: 0.03 * full_height,width: full_width,flexDirection:'row',marginLeft:5,alignItems:'center',}}  key={i}>
            <Image style={{height:15,width:16}} source={require('../../image/my_message1.png')} />
            <View style={{marginLeft:5,alignItems:'center',flexDirection:'row'}}>
              <Text style={{fontSize:10,color:'#FF8C00'}} >{noticsList[i].noticetitle}</Text>
              <Text style={{fontSize:10,color:'#FF8C00'}} >{noticsList[i].noticecontent}</Text>
              <Text style={{fontSize:10,color:'#FF8C00'}} >{noticsList[i].noticeobject}</Text>
            </View>
          </View>
        )
      }
    }
    return notics
  } 
  renderImg () {
    let imageViews = [];
    //加载网络图片
    let BANNER_IMGS = this.state.bannerImges;
    if(BANNER_IMGS.length >0){
        for (var i = 0;i < BANNER_IMGS.length;i++) {
        imageViews.push(
          <View key={i}>
            <TouchableOpacity key={i}>
              <Image  style={{height: 0.25 * full_height,width: full_width,resizeMode:'stretch'}} source={{uri:BANNER_IMGS[i].bannerurl}} />
            </TouchableOpacity>
          </View>
        )
      }
    }else if(BANNER_IMGS == null || BANNER_IMGS ==""){
         return(
          <View  style={{height: 0.25 * full_height,width: full_width,justifyContent:'center',alignItems:'center',backgroundColor:'#fff',}}>
              <Text style={{fontSize:12,color:'gray'}}>图片正在加载中</Text>
          </View>
        )
      }

    //加载本地图片
    //   if(datas.length >0){
    //     for (let i = 0;i < datas.length;i++) {
    //     imageViews.push(
    //       //需要根据不同得页面进入不同的产品页面
    //       <TouchableOpacity key={i}>
    //         <Image key={i} style={{height: 0.25 * full_height,width: full_width}} source={url[datas[i].photoUrl]} />
    //       </TouchableOpacity>
    //     )
    //   }
    // }
    return imageViews
  }
  //获取抢购时间
  getRushTime(prdcode,prdsta){ 
    //
    let activeItemIndex = this.refs.carousel.state.activeItem;
    if(prdcode == null){
      let recomSource = this.state.recomSource;
      prdcode = recomSource[activeItemIndex].prdcode; //起投金额   
      prdsta = recomSource[activeItemIndex].prdsta;    
    }
    if(prdsta == 0){
       ApolloAPI.APIInvest.getRushTime({
          prdcode:prdcode,
        }).done((res_json, res)=>{
          if(res_json.retCode === 1){
             this.setState({startTime:0})  
           //console.log('抢购时间',res_json.map.time);
             this.setState({
              startTime:res_json.map.time,
              firstItem:activeItemIndex
            })
          }
        })
    }else{
      //alert(123);
      this.setState({startTime:''})
    }
   
  }
  //刷新
  _onRefresh() {
    if(this.state.recomSource.length == 0){
      PlateFormUtils.plateFormAlert(Platform,"错误提示","请等待投资推荐加载完成!");
    }else{
      this.setState({isRefreshing:true});
      let activeItemIndex = this.refs.carousel.state.activeItem;
      setTimeout(() => {
          this.setState({
            firstItem:activeItemIndex,
          // loaded: this.state.loaded + 10,
            isRefreshing: false,
          // rowData: rowData,
          });
          this.getRecomPrd(activeItemIndex);
         
      }, 1000);
    }
  }
  //加载圆圈
  recomendImg = () =>{
    const recomendImgs = [];
    const recomSource = this.state.recomSource;
    //console.log('加载圆圈',recomSource);
    if(recomSource.length>0){
      //for (let i=0;i < recomendContent.length;i++){
      for (let i=0;i < recomSource.length;i++){
        let prdtype = "普通";
        if(recomSource[i].prdtype == "1"){
            prdtype = "普通"
        }else if(recomSource[i].prdtype == "2"){
            prdtype = "代销"
        }else if(recomSource[i].prdtype == "3"){
            prdtype = "转让"
        }
       // console.log("产品的标志和期限",recomSource[i].calcintmann,recomSource[i].prddays,recomSource[i].prdmonths);
        let dayAndRate = "";
        let dayAndRateFont = 20;
        if(recomSource[i].calcintmann == 1 && recomSource[i].prdmonths != null){
          if(recomSource[i].addprofit == "" || recomSource[i].addprofit == null){
            dayAndRate = recomSource[i].yearprofitrate + "%" + " " +recomSource[i].prdmonths + "个月";
          }else{
            dayAndRate = recomSource[i].yearprofitrate + "%" +"+"+ recomSource[i].addprofit + "%"+ " " +recomSource[i].prdmonths + "个月";
            dayAndRateFont = 17;
          }
        }
        if(recomSource[i].calcintmann == 2 && recomSource[i].prddays != null){
          if(recomSource[i].addprofit == "" || recomSource[i].addprofit == null){
            dayAndRate = recomSource[i].yearprofitrate + "%" + " " +recomSource[i].prddays + "天";
          }else{
            dayAndRate = recomSource[i].yearprofitrate + "%" +"+"+ recomSource[i].addprofit + "%"+ " " +recomSource[i].prddays + "天";
            dayAndRateFont = 17;
        }
        }
        let prdname = recomSource[i].prdname.substring(0,10);
      
        let remainquota =recomSource[i].remainquota!=null&&recomSource[i].remainquota!=''?StringUtils.moneyFormatData2Money(recomSource[i].remainquota):'0.00';
        //console.log("单个的",recomSource[i]);
        let startTime = recomSource[i].time;
        let height = 0.45 * full_width;
        if(startTime != '' && startTime != null){
          height = 0.54 * full_width;
        }
        recomendImgs.push(
            <View key={i} >
                <TouchableOpacity style = {{height:height,backgroundColor:'transparent',overflow: 'hidden'}} key={i} onPress={() => this.get_InvDetail(recomSource[i].prdcode)}>              
                  <Image key={i} style={{height: 0.45 * full_width,width: 0.45 * full_width,resizeMode:'stretch',backgroundColor:'transparent'}} source={require('../../image/recom_bcg.png')}>
                    <View style={styles.textRecPst1}>
                      <Text style={styles.textRecTop1}>{prdtype}</Text>
                    </View>
                    <View style={styles.textRecPst2}>
                      <Text style={{color:'#ff6068',fontSize: dayAndRateFont}}>{dayAndRate}</Text>
                    </View>
                    <View style={styles.textRecPst3}>
                      <Text  style={styles.textRecTop3}>{prdname}</Text>
                    </View>
                    <View style={styles.textRecPst4}>
                      <Text  style={styles.textRecTop4}>剩余:{remainquota}</Text>
                    </View>
                    <View style={styles.textRecPst5}>
                      <Text  style={[styles.textRecTop5, recomSource[i].prdsta > 1 && styles.textGray ]}>{recomSource[i].prdsta==1?'可投':recomSource[i].prdsta==2?'满标':recomSource[i].prdsta==3?'已结束':'预热'}</Text>
                    </View>
                     
                  </Image>
                </TouchableOpacity>
                 {
                        startTime != '' && startTime != null ?
                          <View style={styles.textRecPst6}>
                            <Text style={{color:'#ff6068',fontWeight:'bold'}}>抢购倒计时:</Text>
                            <CountDownTimer
                            date={startTime}
                            days={{plural: '天 ',singular: '天 '}}
                            hours=':'
                            mins=':'
                            segs=''
                            
                            daysStyle={styles.time}
                            hoursStyle={styles.time}
                            minsStyle={styles.time}
                            secsStyle={styles.time}
                            firstColonStyle={styles.colon}
                            secondColonStyle={styles.colon}
                            onEnd={()=>this.getRecomPrd(this.refs.carousel.state.activeItem)}
                            />
                          </View>
                      
                          :null
                      }
            </View>
            
        )
      }
      }
    
    return recomendImgs
  } 

//充值
async recharge() {
  try {
    this.get_loading().show();
    let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
    let hash = JSON.parse(value);
    if (!!hash && !!hash.retCode) {
        //手机号写进来，给后面提交时的api用
        //console.log(this.props.Personal);
        ApolloAPI.APILogin.getloginState({
          tenantNo:COMMON_CONFIG.tenantNo
        }).done((res_json, res) => {
          if(res_json.retCode == 1){
            ApolloAPI.APIcard.getIsBindList({
                //通过参数手机号获取银行卡信息
                telno: hash.retMsg,
            }).done((res_json, res) => {
                if(res_json.retCode === 1 && res_json.bindList.length >0){
                  this.get_loading().dismiss();
                  let bindList = res_json.bindList;
                  for (let j = 0; j < bindList.length; j++) {
                      //console.log("state===1的对象是", this.state)
                      if (bindList[j].mainflag == 1) {
                          this.props.navigator.push({
                              id:'Recharge',params:{
                                  is_bankcard: true,
                                  mainflag: bindList[j].mainflag,
                                  bankCardNo: bindList[j].acctno,//银行卡号
                                  openbank: bindList[j].openbank,
                                  singlelimit:bindList[j].singlelimit,
                                  phoneNo: hash.retMsg
                                }
                          });
                          //console.log("state===1的对象是", this.state)
                      } 
                  }
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
        
    } else {
        this.get_loading().dismiss();
        PlateFormUtils.plateFormAlert(Platform,"错误提示","您还未登录或注册!");
        this.props.navigator.push({id:'Login',params:{}});
    }
  
  } catch (error) {
    alert(error.stack)
  }
  
}
//提现
async toWithrowCard() {
  try {
    this.get_loading().show();
    let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
        let hash = JSON.parse(value);
        if (!!hash && !!hash.retCode) {
            // alert(this.state.phoneNo),
            //手机号写进来，给后面提交时的api用
            //console.log(this.props.Personal);
            ApolloAPI.APILogin.getloginState({
              tenantNo:COMMON_CONFIG.tenantNo
            }).done((res_json, res) => {
              if(res_json.retCode == 1){
                ApolloAPI.APIcard.getIsBindList({
                    //通过参数手机号获取银行卡信息
                    telno: hash.retMsg,
                    //telno:'18722151801',
                }).done((res_json, res) => {
                    if(res_json.retCode === 1 && res_json.bindList.length >0){
                      this.get_loading().dismiss();
                      let bindList = res_json.bindList;
                      for (let j = 0; j < bindList.length; j++) {
                         //console.log("state===1的对象是", this.state)
                          if (bindList[j].mainflag == 1) {
                             this.props.navigator.push({
                                id:'WithdrawCash',params:{
                                    is_bankcard:true,
                                    mainflag:bindList[j].mainflag,
                                    bankCardNo:bindList[j].acctno,//银行卡号
                                    openbank:bindList[j].openbank,
                                    phoneNo:hash.retMsg
                                  }
                            });
                              //console.log("state===1的对象是", this.state)
                          } 
                      }
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
            
        } else {
            this.get_loading().dismiss();
            PlateFormUtils.plateFormAlert(Platform,"错误提示","您还未登录或注册!");
            this.props.navigator.push({id:'Login',params:{}});
        }
  } catch (error) {
    alert(error.stack)
  }
    
}
//转让
async toInvesRecord(){
  try {
      this.get_loading().show();
      let value=await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
      let hash = JSON.parse(value);
      if(!!hash && hash.retCode == 1 && hash.retMsg){
        ApolloAPI.APILogin.getloginState({
          tenantNo:COMMON_CONFIG.tenantNo
        }).done((res_json, res) => {
          if(res_json.retCode == 1){
            this.get_loading().dismiss();
            this.props.navigator.push({id:'InvesRecord',params:{flag:true}})
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
  } catch (error) {
     alert(error.stack)
  }
  //1.登录验证
 
}
//还款
async toRecordsFinancing(){
  try {
      //1.登录验证
      this.get_loading().show();
      let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
      let hash = JSON.parse(value);
      if(!!hash && hash.retCode == 1 && hash.retMsg){
        ApolloAPI.APILogin.getloginState({
          tenantNo:COMMON_CONFIG.tenantNo
        }).done((res_json, res) => {
          if(res_json.retCode == 1){
            this.get_loading().dismiss();
            this.props.navigator.push({id:'FinancingRec',params:{}})
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
  } catch (error) {
    alert(error.stack)
  }

}
//签到
toScoreSign(){
  try {
      //1.登录验证
      this.get_loading().show();
      ApolloAPI.APILogin.getloginState({
            tenantNo:COMMON_CONFIG.tenantNo
          }).done((res_json, res) => {
            if(res_json.retCode == 1){
              ApolloAPI.APIHome.ScoreSign({
                tenantNo:COMMON_CONFIG.tenantNo
              }).done((res_json, res) => {
                if(res_json.retCode == 1){
                  this.get_loading().dismiss();
                  PlateFormUtils.plateFormAlert(Platform,"提示","签到成功，继续努力哦!");
                }else{
                  this.get_loading().dismiss();
                  PlateFormUtils.plateFormAlert(Platform,"提示",res_json.retMsg);
                }
              })
            }else{
              this.get_loading().dismiss();
              PlateFormUtils.plateFormAlert(Platform,"错误提示","您还未登录或注册!");
              this.props.navigator.push({id:'Login',params:{}});
            }
      })
  } catch (error) {
    alert(error.stack)
  }
 
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
  //跳转对应item的详情
  get_InvDetail(prdcode){
    this.get_loading().show();
    //this.setState({firstItem:this.refs.carousel.state.activeItem})
    //获得详情
    ApolloAPI.APIInvest.getInvItemDetail({
      prdcode:prdcode
    }).done((data, res) => {
      //console.log('投资详情',data);
        if(data.retCode == 1){
          this.get_loading().dismiss();
          //跳转投资详情
          this.props.navigator.push({ id: 'Invesdetial',params:{data:data,naviParam:"home"}, })
        }else{
          this.get_loading().dismiss();
          PlateFormUtils.plateFormAlert(Platform,"错误提示","获取详情失败!");
        }
      
    })
    
  }

agreement (){
      // icon-ok
      if(this.state.iconString==='circle-o'){
          this.setState({iconString:'check-circle',iconColor:'#ed5565',disabled:false})
      }
      if(this.state.iconString==='check-circle'){
          this.setState({iconString:'circle-o',iconColor:'#dddddd',disabled:true})
      }
  }
setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
//获取协议
toAgreement(){
    //console.log(this.state.protocolcontent);
    this.setState({modalVisible:false});
    this.props.navigator.push({id: 'Agreement',params:{protocoltitle:this.state.protocoltitle,protocolcontent:this.state.protocolcontent}})
}
//检查投资金额
checkInvMoney(text){
    this.setState({
      invmoney:text,
    });
    let result = /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,13}\.\d{0,2}$|^[1-9]\d{0,30}$/.test(text);
    if(result ==false){
      this.setState({
        invmoney:'',
      });
    }
}
render () {
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
          visible={this.state.modalVisible}>
         <View style={styles.modalView}>
          <TouchableOpacity style={{alignSelf:'flex-end',marginRight:10,marginTop:5}} onPress={() => this.setState({modalVisible:!this.state.modalVisible})}>
            <Icon name='close' size={20} />
          </TouchableOpacity> 
              <View style={styles.modalTitle}>
                  <Text style= {[styles.modalText,{fontSize:20,color:'#333333',fontWeight:'bold'}]}>确认投资</Text>    
              </View>
              <View style={{marginTop:15}}>
              <View style={styles.modalTitleDetail}>
                  <Text style= {[styles.modalText,{flex:1}]}>项目名称:</Text>    
                  <Text style= {[styles.modalText,{flex:2}]}>{this.state.prdname}</Text> 
              </View>
              <View style={[styles.modalTitleDetail,{justifyContent:'space-around'}]}>
                <View style={{flex:1,flexDirection:'row'}}>
                  <Text style= {[styles.modalText,{flex:1}]}>认购期限:</Text>    
                  <Text style= {[styles.modalText,{flex:1,color:'#e35263'}]}>{this.state.prddays}</Text> 
                </View>
                <View style={{flex:1,flexDirection:'row'}}>
                  <Text style= {[styles.modalText,{flex:1}]}>年收益率:</Text>    
                  <Text style= {[styles.modalText,{flex:1,color:'#e35263'}]}>{this.state.yearprofitrate}</Text> 
                </View>
              </View>
              <View style={[styles.modalTitleDetail,{flexDirection:'column',justifyContent:'center'}]}>
                  <Text style= {[{flex:1,fontSize:16,color:'#4d4d4d',lineHeight:28}]}>投资金额(元)</Text>    
              </View>
              <View style={{borderColor:'#e35263',borderWidth:1,justifyContent:'center',alignItems:'center',height:44,marginTop:5,marginLeft:20,marginRight:20,}}>
                  <Text style= {[styles.modalText,{fontSize:20,color:'#e35263'}]}>{StringUtils.moneyFormatData2Money(this.state.invmoney)}</Text> 
              </View>
              <View style={[styles.modalTitleDetail,{justifyContent:'space-around',alignItems:'center',height:44,marginTop:10}]}>
                <View style={{flexDirection:'row'}}>
                  <Image></Image>
                  <View style={{justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:12,color:'#4d4d4d'}}>可用余额 (元)</Text>
                    <Text style={{fontSize:16,color:'#4d4d4d'}}>{this.state.availableSum}</Text>
                  </View>
                </View>
                <View style={{flexDirection:'row'}}>
                  <Image></Image>
                  <View style={{justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:12,color:'#4d4d4d'}}>预期收益 (元)</Text>
                    <Text style={{fontSize:16,color:'#e35263'}}>{this.state.preMoney}</Text>
                  </View>
                </View>
              </View>
            </View>
        
            <View style={{ paddingTop: 26, paddingHorizontal: 30,flexDirection:'row' ,justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity style={{ height:25,width:25 }} onPress={()=>{this.agreement()}}>
                    <Icon name={this.state.iconString} size={20} color={this.state.iconColor}/>
                </TouchableOpacity>
                <Text style={{marginLeft:6}} >我已阅读</Text>
                <TouchableOpacity onPress={()=>this.toAgreement()}>
                    <Text style={{ color: '#ed5565', }}>《{this.state.protocoltitle}》</Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.btnContainer]}>
            <TouchableOpacity 
              disabled={this.state.disabled}
              onPress={() => this.comfirmInv()}
              style={[styles.btn,{width:0.6 * full_width,borderRadius:8},this.state.disabled && styles.disabled]} >
                <Text style={[styles.textBtn]}>
                  立即投资
                </Text>
              </TouchableOpacity>
          </View>
           
        </View>
      </Modal>
          {
            this.state.is_login === true ?
            <NavBar
            backgroundColor={'#ED5565'}
            width = {full_width}
            titleContent={
              <View style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'transparent'}}>
                {this.state.logoUrl ? 
                      <Image source={{uri:this.state.logoUrl}} style={styles.avatar}/>
                : null}
                 <Text style={{color: "white", fontSize: 18,marginLeft:10}}>{this.state.tenantName}</Text>
              </View>
            }
            /> :
            <NavBar
            backgroundColor={'#ED5565'}
            width = {full_width}
            titleContent={
              <View style={{flex:2,flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'transparent'}}>
                {this.state.logoUrl ? 
                      <Image source={{uri:this.state.logoUrl}} style={styles.avatar}/>
                : null}
                 <Text style={{color: "white", fontSize: 18,marginLeft:10}}>{this.state.tenantName}</Text>
              </View>
            }
            rightContent={
            <TouchableOpacity onPress={()=>this.props.navigator.push({id:'Login',params:{}})}>
                <Text style={styles.right}>
                  {this.state.head_hint}
                </Text>
            </TouchableOpacity>
            }
            />
          }
 
        {this.showNotics()}
        <ScrollView
          style={{flex:1}}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
              tintColor="#ff0000"
              title="Loading..."
              titleColor="#00ff00"
              colors={['#ff0000']}
              progressBackgroundColor="#fff"
            />
          }
          overflow={'hidden'}
          automaticallyAdjustContentInsets={false}
          >
         
          <SwiperNative
            autoplay={true}
            height={0.25 * full_height}
            showsPagination={false}
            >
            {this.renderImg()}
          </SwiperNative>

           <View style={{height: 70,backgroundColor: '#fff',flexDirection: 'row',alignItems: 'center',justifyContent:'center'}}>
            <ScrollView horizontal={true}  showsHorizontalScrollIndicator={false}  contentContainerStyle={styles.contentContainer} >
               <View style={styles.my_view}>
                <TouchableOpacity onPress={() => this.push_login_destination('CardMagAddRelieve', this.props.navigator)}>
                  <View style={{height:40,justifyContent:'center',alignItems:'center'}}>
                    <Image source={require('../../image/card.png')} style={{width: 30,height: 20,alignSelf: 'center'}} />
                  </View>
                  <Text style={styles.my_view_text}>
                    绑卡
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.my_view}>
                <TouchableOpacity onPress={() => this.recharge()}>
                  <View style={{height:40,justifyContent:'center',alignItems:'center'}}>
                    <Image source={require('../../image/recharge.png')} style={{width: 27,height: 25,alignSelf: 'center'}} />
                  </View>
                  <Text style={styles.my_view_text}>
                    充值
                  </Text>
                </TouchableOpacity>
              </View>
              <ART.Surface width={2} height={70}>
                <ART.Shape d={vertical_line} stroke={COMMON_STYLES.MAIN_COLOR} strokeWidth={1} />
              </ART.Surface>
              <View style={styles.my_view}>
                <TouchableOpacity onPress={() => this.toWithrowCard()}>
                  <View style={{height:40,justifyContent:'center',alignItems:'center'}}>
                    <Image source={require('../../image/withdraw_cash.png')} style={{width: 25,height: 25,alignSelf: 'center'}} />
                  </View>
                  <Text style={styles.my_view_text}>
                    提现
                  </Text>
                </TouchableOpacity>
              </View>
              <ART.Surface width={2} height={70}>
                <ART.Shape d={vertical_line} stroke={COMMON_STYLES.MAIN_COLOR} strokeWidth={1} />
              </ART.Surface>
              <View style={styles.my_view}>
                <TouchableOpacity onPress={() => this.push_login_destination('Totalassets2', this.props.navigator)}>
                  <View style={{height:40,justifyContent:'center',alignItems:'center'}}>
                    <Image source={require('../../image/property.png')} style={{width: 24,height: 26,alignSelf: 'center'}} />
                  </View>
                  <Text style={styles.my_view_text}>
                    我的资产
                  </Text>
                </TouchableOpacity>
              </View>
             
               <ART.Surface width={2} height={70}>
                <ART.Shape d={vertical_line} stroke={COMMON_STYLES.MAIN_COLOR} strokeWidth={1} />
              </ART.Surface>
              <View style={styles.my_view}>
                <TouchableOpacity onPress={() => this.toRecordsFinancing()}>
                  <View style={{height:40,justifyContent:'center',alignItems:'center'}}>
                    <Image source={require('../../image/withdraw_cash.png')} style={{width: 25,height: 25,alignSelf: 'center'}} />
                  </View>
                  <Text style={styles.my_view_text}>
                    还款
                  </Text>
                </TouchableOpacity>
              </View>
             
            </ScrollView>
            </View>
          
          <View style={{backgroundColor:'white',marginTop: 0.01 * full_width}}>
            <View style={{flexDirection:'row',marginLeft:12,marginTop:3}}>
              <Image source={require('../../image/hotInvest.png')} style={{width: 18,height: 18,}}/>
              <Text style={styles.textleft}>
                投资推荐
              </Text>
            </View>
           
            <View style={{marginTop:0.04 * full_width}}>
            
            {this.state.recomSource.length == 0 ? 
              <View  style={{height: 0.26 * full_height,width: full_width,justifyContent:'center',alignItems:'center',backgroundColor:'#fff',}}>
                  <Text style={{fontSize:12,color:'gray'}}>图片正在加载中</Text>
              </View>
               :
             <Carousel
              ref={'carousel'}
              firstItem={this.state.firstItem}
              sliderWidth={ full_width}
              itemWidth={0.45 * full_width}
              inactiveSlideScale={0.8}
              inactiveSlideOpacity={0.4}
              enableMomentum={false}
              containerCustomStyle={styles.slider}
              contentContainerCustomStyle={styles.sliderContainer}
              showsHorizontalScrollIndicator={false}
              snapOnAndroid={true}
              removeClippedSubviews={false}
              //onScrollViewScroll={() =>this.getRushTime()}
            >
                {this.recomendImg()}
            </Carousel>
            }
            </View>
            <View style={styles.container2}>
              
              <View>
                <View style={[styles.center,styles.item,]}>
                  <Text style={styles.font1} >
                    超高收益
                  </Text>
                </View>
              </View>
              <View style={[styles.lineLeftRight]}>
                <View style={[styles.center,styles.item, ]}>
                  <Text style={styles.font1} >
                    随时支取
                  </Text>
                </View>
              </View>
              <View >
                <View style={[styles.center,styles.item,]}>
                  <Text style={styles.font1} >
                    每日收益
                  </Text>
                </View>
              </View>
              <View style={[styles.lineLeft]}>
                <View style={[styles.center,styles.item,]}>
                  <Text style={styles.font1} >
                    复利计息
                  </Text>
                </View>
              </View>
          </View>
          <View style={[styles.btnContainer]}>
             <TextInput  style={styles.inputText} keyboardType='numeric'    onChangeText={(text)=> this.checkInvMoney(text)} value ={this.state.invmoney}
                      placeholder='请输入投资金额'  underlineColorAndroid='rgba(0,0,0,0)'/> 
            <TouchableOpacity 
              style={[styles.btn]} 
              onPress={()=>this.__commit()}
                >
              <Text  style={[styles.textBtn]}>
              立即投资
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottom}>
              <Text style={{color:'#b7b7b7',fontSize:12,marginTop:10}}>
                  我是有底线的
              </Text>
          </View>      
      </View>
    </ScrollView>
     <Loading ref="loading" />
</View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.backgroundColor
  },
  swiper: {
    height: 0.28 * full_height,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  },
  textleft: {
    fontSize: 14,
    marginLeft: 0.02 * full_width,
    color: '#808080',
    paddingTop: 4,
  },
textRecPst1: {
     ...Platform.select({
      android:{
        marginTop: 0.03 * full_width,
        
      },
      ios:{
       marginTop: 0.04 * full_width,
      }
      
    }),
    alignSelf:'center',
    position:'absolute'
  },
textRecPst2: {
      ...Platform.select({
      android:{
        marginTop: 0.11 * full_width,
      },
      ios:{
        marginTop: 0.12 * full_width,
      }
      
    }),
    alignSelf:'center',
    position:'absolute',
  },
  textRecPst3: {
     ...Platform.select({
      android:{
        marginTop: 0.2 * full_width,
      },
      ios:{
        marginTop: 0.21 * full_width,
      }
      
    }),
    alignSelf:'center',
    position:'absolute',
  },
  textRecPst4: {
      ...Platform.select({
    android:{
      marginTop: 0.28 * full_width,
    },
    ios:{
      marginTop: 0.29 * full_width,
    }
      
    }),
    alignSelf:'center',
    position:'absolute',
  },
  textRecPst5: {
      ...Platform.select({
      android:{
        marginTop: 0.35 * full_width,
      },
      ios:{
        marginTop: 0.36 * full_width,
      }
      
    }),
    alignSelf:'center',
    position:'absolute',
  },
  textRecPst6:{
     ...Platform.select({
      android:{
         marginTop:0.48 * full_width,
      },
      ios:{
         marginTop:0.49 * full_width,
      }
      
    }),
    flexDirection:'row',
    position:'absolute',
    alignSelf:'center'
  },
  textRecTop1: {
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor:'transparent'
  },
  textRecTop2: {
    fontSize: 20,
   // color: '#808080',
    color:'#ff6068'
  },
  textRecTop3: {
    fontSize: 15,
    color: '#635A60',
  },
  textRecTop4: {
    fontSize: 16,
    color: '#808080',
  },
  textRecTop5: {
    fontSize: 16,
    color: '#ff6068',
  },
  flex1: {
    flex:1,
  },
  btn:{
      width:0.25 * full_width,
      backgroundColor:'#ED5565',
      height:0.06 * full_height,
      justifyContent:'center',
      alignItems:'center',
      overflow:'hidden',
  },
  btnContainer: {
    marginHorizontal:12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'row',
    marginTop: 8,
  },
  textBtn: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  font: {
    fontSize: 18,
    color:'#FFFFFF',
    textAlign: 'center'
  },
  right:{
      fontSize:16,
      color:'#FFFFFF'
  },
   container2: {
    marginTop: 0.01 * full_height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
  },
  item: {
    marginLeft:3,
    marginRight:3,
    height: 10,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  lineLeftRight: {
    borderLeftWidth: 1 / PixelRatio.get(),
    borderRightWidth: 1 / PixelRatio.get(),
    borderColor: '#808080',
    height:10
  },
  lineLeft: {
    borderLeftWidth: 1 / PixelRatio.get(),
    borderColor: '#808080',
    height:10
  },
  lineCenter: {
    borderBottomWidth: 1 / PixelRatio.get(),
    borderColor: '#808080'
  },
  font1: {
    fontSize:10,
    color: '#808080',
  },
  inputText:{ 
    width:0.55 * full_width,
    height:0.06 * full_height,
    borderWidth:onePt,
    borderColor:'#dddddd',
    backgroundColor:'transparent',  
    fontSize:14,
    justifyContent:'center',
    alignItems:'center',
  },
   modalView: {
    marginTop: 0.2 * full_height,
    marginLeft:15,
    marginRight:15,
    borderRadius:16,
    backgroundColor:'#fff',
    height:0.6 * full_height
  },
   modalTitle: {
    marginTop:20,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    marginLeft:20,
    marginRight:20,
    borderBottomWidth:onePt,
    borderBottomColor:'#f1f1f1',
  },
  modalText: {
    fontSize:16,
    color:'#4d4d4d',
    alignSelf:'center'
  },
  modalTitleDetail: {
    marginLeft:20,
    marginRight:20,
    flexDirection:'row',
    height:28,
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
  modalbtn:{
      width:0.9 * full_width,
      borderRadius:4,
      backgroundColor:'#e35263',
      height:0.07 * full_height,
      justifyContent:'center',
      alignItems:'center',
      overflow:'hidden'
  },
  disabled:{
    backgroundColor:'#a19d9e'
  },
  slider: {
      marginBottom: 10,
  },
  sliderContainer: {
  },
  avatar: {
    borderRadius: 12,
    width: 25,
    height: 25,
    backgroundColor:'transparent'
  },
  textGray:{
    color:'#696969'
  },
  my_view_text:{
    color:common_color,
    fontSize:common_fontsize,
    paddingTop: 4,
    alignSelf: 'center'
  },
  my_view: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center'
  },
  contentContainer: {
      //margin:10,
      //backgroundColor:"#ff0000",
      width:full_width*1,
      //width:full_width
  },
  //时间文字

  time: {

    paddingHorizontal: 3,

    backgroundColor: 'rgba(85, 85, 85, 1)',

    fontSize: 12,

    color: 'white',

    marginHorizontal: 3,

    borderRadius: 2,

  },

  //冒号

  colon: {

    fontSize: 12, color: 'rgba(85, 85, 85, 1)'

  },
  bottom:{
    ...Platform.select({
      android:{
         height:0.05 * full_height,
         marginTop:0.1 * full_height,
      },
      ios:{
        height:0.1 * full_height,
        marginTop:0.2 * full_height,
      }
      
    }),
    alignItems:'center',
    borderTopColor:'#b7b7b7',
    borderTopWidth:onePt
  }
})

export default Home
