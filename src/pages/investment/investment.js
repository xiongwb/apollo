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
  ListView,
  AsyncStorage,
  Animated,
  Platform
} from 'react-native';

import { 
  Color, 
  COMMON_CONFIG,
  EVENT_EMITTER_CONST,
  STORAGE_KEYS
} from 'ApolloConstant';

import {
  PlateFormUtils,
  StringUtils
} from 'ApolloUtils';

import {PullList} from 'react-native-pull';
import { NavBar,Investtextinput,BasePage, Loading,PushLogin} from 'ApolloComponent';
import SwiperNative from 'react-native-swiper';
import  SideMenu from 'react-native-side-menu';
import  Menu  from './choseCondition.js';
import Modal from 'react-native-root-modal';
import Icon from 'react-native-vector-icons/FontAwesome'
import ApolloAPI from 'ApolloAPI';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';//广播视频接收器
import EmpInvList from './empty_investList';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';

var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
var full_width = Dimensions.get('window').width
var full_height = Dimensions.get('window').height

var expfinrate = observable(1);
var finterm=observable(1);
var proType=observable(1);

let datas = []
datas.push({name: '鲁花5S压榨一级花生油',price: 152.90,photoUrl: '../../image/inv_banner.png'})
let url = {
  '../../image/inv_banner.png': require('../../image/inv_banner.png'),
}
let pageNo = 0;
@observer
export default class Investment extends BasePage {

	constructor(props) {
        super(props);
        this.dataSource = [];
        this.state = {
          cardno:'',
          isOpen: false,
          selectedItem: [],
          modalVisible:false,
          iconString:'check-circle',
          iconColor:'#ed5565',
          disabled:false,          
          firstLoad:true,
          nomore:true,
          loaded:false,
          invmoney:'',
          prdname:'',
          yearprofitrate:'',
          prddays:'',
          preMoney:'',
          availableSum:'',
          prdinfoid:'',
          phoneNo:'',
          list: (new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})).cloneWithRows(this.dataSource),
      };
        
        //this.renderHeader = this.renderHeader.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.topIndicatorRender = this.topIndicatorRender.bind(this);
    }
  //设置modal可见性并给modal赋值
  async setModalVisible(visible,prdinfo) {
    let prdsta = prdinfo.prdsta//产品是否可投
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
              let id = prdinfo.prdinfoid;
              let code = prdinfo.prdcode;
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
                        if(res_json.retCode === 1){ //通过风险评估
                          let sumInt = res_json.map.sumInt;
                          //查询投资所需要的资料
                          ApolloAPI.APIInvest.getInvItemDetail({
                            prdcode:code,
                            phoneNo:hash.retMsg,
                          }).done((data, res) => {
                            if(data.retCode == 1){
                              this.get_loading().dismiss();
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
                               // m = (this.state.invmoney*yearprofitrate*data.prdinfo.prdmonths)/(12*100);
                              }
                              if(data.prdinfo.calcintmann == 2 && data.prdinfo.prddays != null){
                                dayAndRate = data.prdinfo.prddays + "天";
                                    //预期收益：投资金额*年收益率*天数/(360*100)，四舍五入到分
                                //m = (this.state.invmoney*yearprofitrate*data.prdinfo.prddays)/(360*100);
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
                        }else if(res_json.retCode === 2){    //风险评估为警告的时候
                            let sumInt = res_json.map.sumInt;
                            this.get_loading().dismiss();
                              Alert.alert('提示', res_json.retMsg, [
                                      { text: '取消'},
                                      { text: '确认', onPress: () => {
                                      //确认之后进行投资
                                        //查询投资所需要的资料
                                        this.get_loading().show();
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
                                    }
                                  }])
                        }else {
                          this.get_loading().dismiss();
                          PlateFormUtils.plateFormAlert(Platform,"错误提示",res_json.retMsg);
                        }
                      })
                    }else{
                      //未绑定银行卡
                      this.get_loading().dismiss();
                      this.props.navigator.push({id:"CardMagAddRelieve"})
                      //PlateFormUtils.plateFormAlert(Platform,'错误提示',"信息未获得!");
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
  
  toAgreement(){
    this.setState({modalVisible:false});
    this.props.navigator.push({id: 'Agreement',params:{protocoltitle:this.state.protocoltitle,protocolcontent:this.state.protocolcontent}})
  }
  
  async comfirmInv (){
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
                    let PullList = this.refs.pullList;
                    if (PullList.scroll.scrollProperties.offset > 0) {      // 不在顶部
                        // 一键置顶
                        PullList.scrollTo({y:0});
                    }else {     // 在顶部
                        pageNo=1;
                        // 加载最新数据
                        this._loadData(true,function(){});
                    }
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

  //加载投资页面的banner
  renderImg () {
    let imageViews = [];
    for (var i = 0;i < datas.length;i++) {
      imageViews.push(
      //  <TouchableOpacity key={i} onPress={() => PushLogin.push_login_destination('Bill', this.props.navigator, {my_center: this})}>
          <Image key={i} style={{height: 0.15 * full_height,width: full_width}} source={url[datas[i].photoUrl]} />
     //   </TouchableOpacity>

      )
    }
    return imageViews
  }

  onPullRelease(resolve) {
    //do something
    setTimeout(() => {
        pageNo=1,
        this._loadData(true,resolve);
    }, 2000);
  }

  topIndicatorRender(pulling, pullok, pullrelease) {
        //console.log("下拉刷新",[pulling, pullok, pullrelease])
        return(
                <View style={{flexDirection:'row',height:30,width:full_width,alignItems:'center',justifyContent:'center'}}>
                  <View style={{height:25,width:25,alignItems:'center'}}>
                    <ActivityIndicator size="small" color="gray" />
                  </View>
                  <View>
                    {
                      pulling == true ?
                      <View style={{height:25,width:60,alignItems:'center'}}>
                        <Text style={{color:'#101010'}}>下拉刷新......</Text> 
                      </View>
                      : 
                      null
                    }
                  </View>
                 <View>
                    {
                      pullok == true ?
                      <View style={{height:25,width:60,alignItems:'center'}}>
                        <Text style={{color:'#101010'}}>松开刷新......</Text> 
                      </View>
                      :
                      null
                    }
                 </View>
                 <View>
                  {
                      pullrelease == true ? 
                      <View style={{height:25,width:60,alignItems:'center'}}>
                        <Text style={{color:'#101010'}}>努力刷新中......</Text>
                      </View>
                      : 
                      null
                  }
                 </View>
                </View>
           )
        
  }
  //跳转对应item的详情
  get_InvDetail(prdcode){
    this.get_loading().show();
    //获得详情
    ApolloAPI.APIInvest.getInvItemDetail({
      prdcode:prdcode
    }).done((data, res) => {
      this.get_loading().dismiss();
      //console.log(data);
        if(data.retCode == 1){
          //跳转投资详情
          this.props.navigator.push({ id: 'Invesdetial',params:{data:data,naviParam:'home'} })
        }else{
            PlateFormUtils.plateFormAlert(Platform,"错误提示","获取详情失败!");
        }
      
    })
    
  }

  //加载头部
  renderHeader(){
     return(
            <View>
              {this.renderImg()}
            </View>   
      );
  }
  onChangeText(text){
    this.setState({invmoney:text});
    let result = /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,13}\.\d{0,2}$|^[1-9]\d{0,30}$/.test(text);
    if(result ==false){
      this.setState({
        invmoney:'',
      });
    }
  }
  //渲染每一个item
  renderRow(item, sectionID, rowID, highlightRow) {
      //获得产品的id、是否可转让标识、是否可投资（3已经结束，1可投资，2满标,0预热中）
      let disabled = '';
      let startInvest = '';
      let startTime = 0;
      if(item.prdsta == '3'){
        disabled = true;
        startInvest ="已结束";
      }else if(item.prdsta == '2'){
        disabled = true;
        startInvest ="满标";
      }else if(item.prdsta == '1'){
        disabled = false;
        startInvest ="立即投资";
      }else if(item.prdsta == '0'){
        disabled = false;
        startInvest = "预热中";
        startTime = item.time;
        //console.log('每个item的是',[item.prdname,item.time]);
      }
      let dayAndRate = "";
      if(item.calcintmann == 1 && item.prdmonths != null){
          dayAndRate = item.prdmonths + "个月";
      }
      if(item.calcintmann == 2 && item.prddays != null){
          dayAndRate = item.prddays + "天";
      }
      let yearprofitrate = "";
      if(item.addprofit == "" || item.addprofit == null){
        yearprofitrate = item.yearprofitrate + "%"
      }else{
        yearprofitrate = item.yearprofitrate + "%"+"+"+item.addprofit+"%"
      }
      let height = 0.24 * full_height;
      let width = 0.95 * full_width;
      return (     
        <View style={[{backgroundColor:'#ffffff',marginTop:8,justifyContent:'center',alignItems:'center'},{height:height,width:width}]}>
          <Investtextinput 
            disabled={disabled}
            percent={item.percentage} 
            prdname={item.prdname}  
            prdquota={item.prdquota}  
            yearprofitrate={yearprofitrate}
            prddays={dayAndRate}  
            startInvest={startInvest} 
            startYuan={item.buyminamt}
            startTime={startTime}
            height={height}
            width={width}
            //onCountTimeEnd={()=>this.setState({startTime:''})}
            //onEndEditing={(text)=>this.checkText(text,item.buyminamt)}
            onChangeText={(text)=>this.onChangeText(text)}
            end_Words={item.remainquota}
            onCommit={(text)=>this.setModalVisible(true,item)}
            onPressDetail={() => this.get_InvDetail(item.prdcode)}/>
        </View> 
      );
    }
  //渲染尾部
  renderFooter() {
      if(!this.state.nomore == true) {
          return(
              <View style={{height:0.1* full_height,width:0.8 * full_width,alignItems:'center',marginTop:20,borderTopColor:'#b7b7b7',borderTopWidth:onePt}}>
                  <Text style={{color:'#b7b7b7',fontSize:12,marginTop:10}}>
                      没有更多数据了
                  </Text>
              </View>          
          );
           
      }
      return (
        <View style={styles.footerView}>
              <ActivityIndicator
                style={{
                alignItems:'center',
                justifyContent:'center'
              }}/>
              <Text style={{color:'#b7b7b7',fontSize:12,marginTop:10}}>
                  数据正在加载中...
              </Text>
        </View>
      );
    }
    //渲染加载更多
    loadMore() {
      if(!this.state.nomore){
        return;
      }
      pageNo++;
      this._loadData(false,function(){});
    }
  
    _loadData(initFlag, callback){
      
      //进入投资页面加载list
      ApolloAPI.APIInvest.getInvList({
          //设置查询条件
          expFinRate:expfinrate.get(), //预期收益率
          finTerm:finterm.get(),
          proType:proType.get(),
          //其他条件
          tenantNo:COMMON_CONFIG.tenantNo,
          pageIndex:pageNo,
        }).fail((res_json, res) => {
            console.error('服务器繁忙，请稍后再试；\r\nCode:' + res_json.status);
        }).done((data, res) => {
            //console.log(data);
            callback();
            if(data.retCode == 1){
              if(initFlag){
                this.dataSource = data.list;
              } else {
                for (var j= 0; j< data.list.length; j++){
                  this.dataSource.push(data.list[j]);
                }
              }
              this.setState({
                list:this.state.list.cloneWithRows(this.dataSource),
                nomore:data.hasNext,
                loaded:true,
              })
            }else{
              callback();
              let tips = "错误提示";
              let showContent = "没有收到数据！";
              PlateFormUtils.plateFormAlert(Platform,tips,showContent);
            }
        })
  }

  componentDidMount(){
  //this._loadData(true,function(){});
  this.listener1 = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.DIDDASHSUCCESS,(value)=>{
    // 接受到通知后的处理
    // console.log("我的已经登录成功")
    if(value == "Invest"){
        let PullList = this.refs.pullList;

        if (PullList.scroll.scrollProperties.offset > 0) {      // 不在顶部
            // 一键置顶
            PullList.scrollTo({y:0});
        }else {     // 在顶部

            // 执行下拉刷新动画
            PullList.state.pullPan = new Animated.ValueXY({x: 0, y: this.topIndicatorHeight * -1});
            pageNo=1;
            // 加载最新数据
            this._loadData(true,function(){});

            // 关闭动画
            setTimeout(() => {
                PullList.resetDefaultXYHandler();
            },1000);
        }
      }
  })
  this.listener2 = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.INVESTSUCCESS,(value)=>{     
      //投资成功，刷新投资记录
      if(value == "invest"){
        let PullList = this.refs.pullList;

        if (PullList.scroll.scrollProperties.offset > 0) {      // 不在顶部
            // 一键置顶
            PullList.scrollTo({y:0});
        }else {     // 在顶部
            pageNo=1;
            // 加载最新数据
            this._loadData(true,function(){});
        }
      }
    })
  }

  componentWillUnmount(){
    // 移除 一定要写
    this.listener1.remove();
    this.listener2.remove();
    // this.timer1 &&  clearTimeout(this.timer1);
    // this.timer2 &&  clearTimeout(this.timer2);
    // this.timer3 &&  clearTimeout(this.timer3);
  }

  
  toggle() {
    this.setState({
        isOpen: !this.state.isOpen,
    });
  }

  updateMenuState(isOpen) {
      this.setState({ isOpen: isOpen });
  }

  //选择条件并确认后
  onMenuItemSelected = (item) => {
      //将条件赋值
      this.setState({
          isOpen: false,
          selectedItem: item,
      });
      expfinrate.set(item[0].id1),
      finterm.set(item[1].id2),
      proType.set(item[2].id3)
      //进行查询
     
      let PullList = this.refs.pullList;

      if (PullList.scroll.scrollProperties.offset > 0) {      // 不在顶部
          // 一键置顶
          PullList.scrollTo({y:0});
      }else {     // 在顶部

          // 执行下拉刷新动画
          PullList.state.pullPan = new Animated.ValueXY({x: 0, y: this.topIndicatorHeight * -1});
          pageNo=1;
          // 加载最新数据
          this._loadData(true,function(){});

          // 关闭动画
          setTimeout(() => {
              PullList.resetDefaultXYHandler();
          },1000);
      }

      // alert([
      //       ("group1 = " + item[0].id1),
      //       ("group2 = " + item[1].id2),
      //       ("group3 = " + item[2].id3),
      // ]);
  }
  //是否同意条款
  agreement (){
      // icon-ok
      if(this.state.iconString==='circle-o'){
          this.setState({iconString:'check-circle',iconColor:'#ed5565',disabled:false})
      }
      if(this.state.iconString==='check-circle'){
          this.setState({iconString:'circle-o',iconColor:'#dddddd',disabled:true})
      }
  }
  //得到Loading页面的方法
  get_loading() {
    return this.refs.loading;
  }

  //组件加载的第一个方法
  render() {
    const horizontal_line_1 = ART.Path();
    horizontal_line_1.moveTo(10,1);
    horizontal_line_1.lineTo(full_width/2 - 10,1);
    const menu = <Menu onItemSelected={this.onMenuItemSelected}/>;
      
    return (
    <SideMenu 
      menu={menu}
      menuPosition='right'
      openMenuOffset={0.75 * full_width}
      isOpen={this.state.isOpen} 
      onChange={(isOpen) => this.updateMenuState(isOpen) } 
      onItemSelected={this.onMenuItemSelected} >
        
      <View style={[styles.container]}>
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
              style={[styles.btn,this.state.disabled && styles.disabled]} >
                <Text style={[styles.textBtn]}>
                  立即投资
                </Text>
              </TouchableOpacity>
          </View>
           
        </View>
      </Modal>
       <NavBar
          backgroundColor={'#ED5565'}
          width = {full_width}
          titleContent={<Text style={{color: "white", fontSize: 18}}>投资项目</Text>}

          rightContent={

            <TouchableOpacity onPress={() => this.toggle()}>
              <Image source={require('apollo/src/image/invest_select.png')} style={{width:20,height:19,marginLeft:10}}/>
            </TouchableOpacity>
          }
          />
        {
          this.state.list == null ? 
          <EmpInvList />
          :
          <PullList
                ref = "pullList"
                style={{flex:1,width:full_width}} 
                contentContainerStyle={{alignItems:'center',justifyContent:'center'}}
                enableEmptySections={true}
                onPullRelease={this.onPullRelease.bind(this)}
                topIndicatorRender={this.topIndicatorRender} 
                topIndicatorHeight={35}
                renderHeader={this.renderHeader.bind(this)}
                dataSource={this.state.list}
                pageSize={5}
                initialListSize={5}
                renderRow={this.renderRow.bind(this)}
                onEndReached={this.loadMore.bind(this)}
                renderFooter={this.renderFooter.bind(this)}
                onEndReachedThreshold={40}  
                {...ListView.props} 
              />  

        }
      <Loading ref="loading" />
      </View>
  </SideMenu>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.backgroundColor,
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
  modalTitleCom: {
    position:'absolute',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'transparent',
  },
  btn:{
    width:0.6 * full_width,
    borderRadius:8,
    backgroundColor:'#e35263',
    height:0.06 * full_height,
    justifyContent:'center',
    alignItems:'center',
    overflow:'hidden'  
  },
  disabled:{
    width:0.6 * full_width,
    borderRadius:8,
    backgroundColor:'#a19d9e',
    height:0.06 * full_height,
    justifyContent:'center',
    alignItems:'center',
    overflow:'hidden'  
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
  pullViewHeader: {
      width:full_width,
      height:30,
  },
  pullViewHeaderIcon: {
      width: 32,
      height: 25,
      alignItems: 'center',
      justifyContent: 'center'
  },
  footerView: {
      height: 80,
      alignItems: 'center',
      justifyContent: 'center'
  }
});