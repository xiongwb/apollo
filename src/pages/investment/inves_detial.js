/**
 * 产品详情
 * zgx
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
  PixelRatio,
  Dimensions,
  ScrollView,
  SegmentedControlIOS,
  Switch,
  ART,
  Platform,
  AsyncStorage,
  Alert,
} from 'react-native';
import {
  BasePage,
  BackNavBar,
  Moretxtin,
  PushLogin,
  Loading,
} from 'ApolloComponent'
import {
  EVENT_EMITTER_CONST,
  STORAGE_KEYS,
  COMMON_STYLES,
  Color,
  COMMON_CONFIG,
} from 'ApolloConstant'
import {
  PlateFormUtils,
  StringUtils
} from 'ApolloUtils';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import ScrollableTabView ,{DefaultTabBar, } from 'react-native-scrollable-tab-view';
import Modal from 'react-native-root-modal';
import ApolloAPI from 'ApolloAPI';
import Icon from 'react-native-vector-icons/FontAwesome'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import CountDownTimer from '../../components/countDownTime';

var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
var full_width = Dimensions.get('window').width;
var full_height = Dimensions.get('window').height;
    const horizontal_line = ART.Path();
    horizontal_line.moveTo(1,1);
    horizontal_line.lineTo(full_width,1);
class Invesdetial extends BasePage {
 	constructor(props) {
        super(props)
        this.state = {
          percent:'',
          iconString:'check-circle',
          iconColor:'#ed5565',
          disabled:false,
          prdImges:'',
          invmoney:'',
          prdinfoid:'',
          prdinfo:'',
          protocoltitle:'',
          protocolcontent:'',
          prdname:'',
          phoneNo:'',
          invrcdList:'',
          prdinstructionList:'',
          quota:'',
          prddays:'',
          yearprofitrate:'',
          availableSum:'',
          preMoney:'',
      };
      this.lock=false
    }

  get_loading() {
    return this.refs.loading;
  }
  //加载产品规则
  proRules(prdinfo,quota){
  if(!this.lock){ 
    let buystartdate = '';
    let buyenddate = '';
    let issuedate = '';
    if(prdinfo.buystartdate !="" &&  prdinfo.buystartdate != null){
      buystartdate = prdinfo.buystartdate.substr(0,19);
    }
    if(prdinfo.buyenddate != "" && prdinfo.buyenddate != null){
      buyenddate = prdinfo.buyenddate.substr(0,19);
    }
    if(prdinfo.issuedate != "" && prdinfo.issuedate != null){
       issuedate = prdinfo.issuedate.substr(0,19);
    }
    let buyminamt = "";
    let buyincamt = "";
    if(quota != null){
       buyminamt =quota.pelbuyminamt!=null&&quota.pelbuyminamt!=""?StringUtils.moneyFormatData2Money(quota.pelbuyminamt):'0.00';
       buyincamt =quota.pelbuyincamt!=null&&quota.pelbuyincamt!=""?StringUtils.moneyFormatData2Money(quota.pelbuyincamt):'0.00';
    }else{
       buyminamt = "0.00";
       buyincamt = "0.00";
    }
    console.log("prdinfo",prdinfo);
    let addprofit = "";
    if(prdinfo.addprofit != null && prdinfo.addprofit != ""){
       addprofit = prdinfo.addprofit + " " +"%"
    }else{
       addprofit = "0%"
    }
    let prdquota=prdinfo.prdquota!=null&&prdinfo.prdquota!=''?StringUtils.moneyFormatData2Money(prdinfo.prdquota):'0.00';
    let remainquota=prdinfo.remainquota!=null&&prdinfo.remainquota!=''?StringUtils.moneyFormatData2Money(prdinfo.remainquota):'0.00';
    return (
      <ScrollView>
         <View style={[styles.tab1View,{marginTop:15}]}>
            <Text style={styles.tab1View_text1}>产品性质:</Text>
            <Text style={styles.tab1View_text2}>{prdinfo.prdtypename}</Text>
         </View>
         <View style={styles.tab1View}>
            <Text style={styles.tab1View_text1}>产品额度:</Text>
            <Text style={styles.tab1View_text2}>{prdquota}</Text>
         </View>
         <View style={styles.tab1View}>
            <Text style={styles.tab1View_text1}>剩余额度:</Text>
            <Text style={styles.tab1View_text2}>{remainquota}</Text>
         </View>
         <View style={styles.tab1View}>
            <Text style={styles.tab1View_text1}>起投金额:</Text>
            <Text style={styles.tab1View_text2}>{buyminamt}</Text>
         </View>
         <View style={styles.tab1View}>
            <Text style={styles.tab1View_text1}>递增金额:</Text>
            <Text style={styles.tab1View_text2}>{buyincamt}</Text>
         </View>
         <View style={styles.tab1View}>
            <Text style={styles.tab1View_text1}>年化收益率:</Text>
            <Text style={styles.tab1View_text2}>{prdinfo.yearprofitrate}%</Text>
         </View>
         <View style={styles.tab1View}>
            <Text style={styles.tab1View_text1}>奖励收益率:</Text>
            <Text style={styles.tab1View_text2}>{addprofit}</Text>
         </View>
         <View style={styles.tab1View}>
            <Text style={styles.tab1View_text1}>风险级别:</Text>
            <Text style={styles.tab1View_text2}>{prdinfo.prorisklel}</Text>
         </View>
         <View style={styles.tab1View}>
            <Text style={styles.tab1View_text1}>认购开始时间:</Text>
            <Text style={styles.tab1View_text2}>{buystartdate}</Text>
         </View>
         <View style={styles.tab1View}>
            <Text style={styles.tab1View_text1}>认购结束时间:</Text>
            <Text style={styles.tab1View_text2}>{buyenddate}</Text>
         </View>
         <View style={styles.tab1View}>
            <Text style={styles.tab1View_text1}>起息日期:</Text>
            <Text style={styles.tab1View_text2}>{issuedate}</Text>
         </View>
         <View style={styles.tab1View}>
            <Text style={styles.tab1View_text1}>项目状态:</Text>
            <Text style={styles.tab1View_text2}>{prdinfo.prostatus}</Text>
         </View>
         <View style={styles.tab1View}>
            <Text style={styles.tab1View_text1}>能否转让:</Text>
            <Text style={styles.tab1View_text2}>{prdinfo.transflag}</Text>
         </View>
        <View style={styles.tab1View}>
            <Text style={styles.tab1View_text1}>兑付方式:</Text>
            <Text style={styles.tab1View_text2}>{prdinfo.paymannername}</Text>
         </View>
         <View style={styles.tab1View}>
            <Text style={styles.tab1View_text1}>能否提前还款:</Text>
            <Text style={styles.tab1View_text2}>{prdinfo.prepayflag}</Text>
         </View>
      </ScrollView>
    );
  }
}
//加载产品说明
proInstruction(prdinstructionList){
   if(!this.lock){  
     if(prdinstructionList==null ||prdinstructionList=="" ){
         return (
            <ScrollView >
              <View style={{marginLeft:10,marginRight:10,marginTop:15,height: 0.4 * full_height,justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:14,color:'gray'}}>亲，内容还没有哦！</Text>
              </View>
            </ScrollView>
         )
     }else{
        return (
        <ScrollView >
            <View>
              <View style={{marginLeft:10,marginRight:10,marginTop:15}}>
                {this.renderProInstruction(prdinstructionList)}
              </View>
              {
                this.state.prdImges.length>0 ?
                <View style={{marginTop:15,marginLeft:2,marginRight:2,alignItems:'center',justifyContent:'center',}}>
                
                  {this.renderImg()}
                </View>
                :
                null
              }
              
            </View>
        </ScrollView>
        );
     }
   }
  }
  //加载产品说明中的推荐图片
  renderImg () {
    if(!this.lock){ 
      let imageViews = [];
      //加载网络图片
      let prdImges = this.state.prdImges;
      if(prdImges.length >0){
          for (var i = 0;i < prdImges.length;i++) {
          let imgurl= prdImges[i].imgurl;
          let imageNote = prdImges[i].imggrpnote;
          imageViews.push(
            <View key={i}>
              <Text style={{marginTop:5,fontSize:14,color:'#e53343'}}>{imageNote}</Text>
              <TouchableOpacity key={i} onPress={()=>this.props.navigator.push({id: 'Agreement',params:{protocoltitle:'图片展示',protocolcontent:imgurl}})} >
                  <Image  style={{height: 0.25 * full_height,width: 0.89 * full_width,marginTop:5,resizeMode:'stretch'}} source={{uri:imgurl}} />
              </TouchableOpacity>
            </View>
          )
        }
      }
      return imageViews
    }
  }
  //加载产品说明的说明内容
  renderProInstruction(prdinstructionList){
    if(!this.lock){ 
     let proInstruction=[];
     for(let i =0;i<prdinstructionList.length;i++){
          proInstruction.push(
                  <View key={i} style={{marginTop:5}}>
                      <Text style={{fontSize:14,color:'#e53343'}}>{prdinstructionList[i].firleltitle}</Text>
                      <Text style={styles.tab2View_text1}>
                        {prdinstructionList[i].illustratecont}
                      </Text>
                  </View>
           
          )
        }
      return proInstruction;
    }
  }
  //加载产品的投资记录
  proRecord(invrcdList){
    if(!this.lock){  
    // if (this.refs.ScrollableTabView)
    //   this.setState({percent: ''})
    return (
      <ScrollView>
        <View style={{marginTop:15}}>
          {this.showRecoed(invrcdList)}
        </View>
      </ScrollView>
    )
    }
  }
  //显示投资记录
  showRecoed(invrcdList) {
    if(!this.lock){ 
      console.log("invrcdList",invrcdList);
      let recViews = [];
      for(let i=0;i < invrcdList.length; i++){
          let telNo = invrcdList[i].telno.substr(0, 3) + '****' + invrcdList[i].telno.substr(7);  
          //let invdate = invrcdList[i].invdate.substr(0,19);
          let invdate = new Date(invrcdList[i].invdate);
          let month = invdate.getMonth()+1;
          let date = invdate.getDate();
          let hours = invdate.getHours();
          let minutes = invdate.getMinutes();
          let seconds = invdate.getSeconds();
          if(month<10){
            month="0"+month;
          }
          if(date<10){
            date="0"+date;
          }
          if(hours<10){
            hours="0"+hours;
          }
          if(minutes<10){
            minutes="0"+minutes;
          }
          if(seconds<10){
            seconds="0"+seconds;
          }


          invdate = invdate.getFullYear() +"-"+ month +"-"+date + " "+ hours+":"+minutes+":"+seconds;
      // let telNo = invrcdList[i].telno.replace("(\\d{3})\\d{4}(\\d{4})", "$1****$2");
        recViews.push(  
          <View key={i} style={{marginLeft:5,marginRight:5,marginTop:5,borderBottomColor:'#ededed',borderBottomWidth:onePt}}>
              <Text style={[styles.tab3View_text1,{marginLeft:5}]}>{telNo}</Text>
              <View style={{flexDirection:'row',marginLeft:5,alignItems:'center'}}>
                <Text style={[styles.tab3View_text1,{color:'#ff5300',flex:1}]}>{invrcdList[i].invsum}元</Text>
                <Text style={[styles.tab3View_text1,{flex:2}]}>{invdate}</Text>
              </View>
          </View>
        ) 
      } 
      return recViews;
    }
  }
 componentDidMount(){
      const { prdcode} = this.state.prdinfo || this.props.data.prdinfo; //产品信息
      this.getPrdImages(prdcode);
      // this.listener = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.INVESTSUCCESS,(value)=>{
      //   //投资成功，刷新投资记录
      //   if(value == "invest"){
      //     this.refresh()
      //   }
     
      // });
  }
  componentWillUnmount(){
      //this.listener.remove();
      this.lock = true;
      //this.refs.ScrollableTabView == null;
      full_width = Dimensions.get('window').width;
      full_height = Dimensions.get('window').height;
      onePt=0;
      this.setState({
          percent:'',
          iconString:'',
          iconColor:'',
          disabled:false,
          prdImges:'',
          invmoney:'',
          prdinfoid:'',
          prdinfo:'',
          protocoltitle:'',
          protocolcontent:'',
          prdname:'',
          phoneNo:'',
          invrcdList:'',
          prdinstructionList:'',
          quota:'',
          prddays:'',
          yearprofitrate:'',
          availableSum:'',
          preMoney:'',
      })
  }
 //获取图片
 getPrdImages(prdcode){
    //获取banner图片
    ApolloAPI.APIInvest.getPrdimg({
      prdcode:prdcode,
      imggrpno:1,
    }).done((res_json, res) => {
        //console.log(res_json);
        //得到image uri
        this.setState({prdImges:res_json.list})
    })
 }
   
 
  refresh(){
       ApolloAPI.APIInvest.getInvItemDetail({
          prdcode:this.props.data.prdinfo.prdcode
        }).done((data, res) => {
          //console.log(data);
            if(data.retCode == 1){
              this.setState({
                invrcdList:data.invrcdList,
                prdinfo:data.prdinfo,
                prdinstructionList:data.prdinstructionList,
                quota:data.quota
              })
              const { prdcode} = data.prdinfo; //产品信息
              this.getPrdImages(prdcode);
            }else{
              //this.get_loading().dismiss();
              PlateFormUtils.plateFormAlert(Platform,"错误提示","获取记录失败!");
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
                    this.props.navigator.pop();
                    RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.INVESTSUCCESS, 'invest'); 
                    this.setState({
                            invmoney:'',
                          });
                    // this.refresh();
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
                    PlateFormUtils.plateFormAlert(Platform,"错误提示",data.retMsg);
                    this.setState({
                            invmoney:'',
                          });
                  }
              })
          }else if(res_json.retCode === 1 && res_json.nopswdflag == 0){
              this.get_loading().dismiss();
              PushLogin.push_login_destination('TradePasswordValidate', this.props.navigator,{from:'invest',money:money,naviParam:this.props.naviParam,data:{phoneNo:phoneNo,money:money,prdInfoID:prdinfoid,}})
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
                                              //m = (this.state.invmoney*yearprofitrate*data.prdinfo.prdmonths)/(12*100);
                                            }
                                            if(data.prdinfo.calcintmann == 2 && data.prdinfo.prddays != null){
                                              dayAndRate = data.prdinfo.prddays + "天";
                                                  //预期收益：投资金额*年收益率*天数/(360*100)，四舍五入到分
                                             // m = (this.state.invmoney*yearprofitrate*data.prdinfo.prddays)/(360*100);
                                            }
                                           // let preMoney = StringUtils.moneyFormatData2Money(m);
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

  render() {
    const { percentage,prdname,prddays,yearprofitrate,prdsta,time,prdmonths,calcintmann,addprofit} = this.state.prdinfo || this.props.data.prdinfo; //产品信息
    const invrcdList = this.state.invrcdList||this.props.data.invrcdList; //产品记录表
    const prdinfo = this.state.prdinfo || this.props.data.prdinfo;
    const prdinstructionList = this.state.prdinstructionList || this.props.data.prdinstructionList;
    const quota = this.state.quota || this.props.data.quota;
    //console.log("通过prdcode得到的data是",this.props.data);
    let disabled = '';
    let startInvest = '';
    let header_height = 0.16 * full_height;
    if(prdsta == '3'){
      disabled = true;
      startInvest ="已结束";
    }
    if(prdsta == '2'){
      disabled = true;
      startInvest ="满标";
    }
    if(prdsta == '1') {
      disabled = false;
      startInvest ="立即投资";
    }
    if(prdsta == '0'){
      disabled = false;
      startInvest = "预热中";
      header_height = 0.2 * full_height;
    }
    let dayAndRate = "";
    if(calcintmann == 1 && prdmonths != null){
      dayAndRate = prdmonths + "个月";
    }
    if(calcintmann == 2 && prddays != null){
      dayAndRate = prddays + "天";
    }
    //收益率
    let profit = "";
    if(addprofit != null){
      profit = yearprofitrate + "%"+ " + " +  addprofit + "%";
    }else{
      profit = yearprofitrate + "%";
    }
     
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
                style={[styles.btn,this.state.disabled && styles.disabled1]} >
                  <Text style={[styles.textBtn]}>
                    立即投资
                  </Text>
                </TouchableOpacity>
            </View>
             
          </View>
        </Modal>
        <BackNavBar  component={this}>投资项目</BackNavBar>
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{backgroundColor:'#ffffff',height:header_height,width:full_width,}}>
            <View style={{flexDirection:'row',marginLeft:15,marginRight:15 ,marginTop:10,paddingBottom:10,justifyContent:'flex-start',borderBottomColor:'#ededed',borderBottomWidth:onePt}}>
                <Text style={{fontSize:14,color:'#323232'}}>{prdname}</Text>
              
            </View> 
             <View style={{height:64,marginLeft:15,marginRight:15,justifyContent:'space-around',alignItems:'center',flexDirection:'row',flex:1}}>
                  <View style={{justifyContent:'center',alignItems:'center',}} >
                    <Text style={{fontSize:24,color:'#ff5300',alignSelf:'center'}}>{profit}</Text>
                    <Text style={{fontSize:10,color:'#808080',alignSelf:'center'}}>年化收益</Text>
                  </View>
                  <View style={{justifyContent:'center',alignItems:'center',}}>
                    <Text style={{fontSize:24,color:'#ed5565'}}>{dayAndRate}</Text>
                    <Text style={{fontSize:10,color:'#808080'}}>项目期限</Text>
                  </View>
                  <View style={{justifyContent:'center',alignItems:'center',}} >
                    <Text style={{fontSize:24,color:'#ff5300',alignSelf:'center'}}>{percentage}%</Text>
                    <Text style={{fontSize:10,color:'#808080',alignSelf:'center'}}>已投</Text>
                  </View>
                  
            </View> 
              {
                  prdsta == '0' ?
                   <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:15}}>
                     <Text style={{color:'#ff6068',fontWeight:'bold'}}>抢购倒计时：</Text>
                     <CountDownTimer
                      date={time}
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
                      onEnd={()=>this.refresh()}
                  />
                   </View>
                  
                  :null
              }
        </View>
        <View style={{marginTop:15,height: 0.57 * full_height,marginRight:15,marginLeft:15}}>
          <ScrollableTabView ref='ScrollableTabView'
            style={{borderColor:'#ededed',borderWidth:1,}} 
            tabBarTextStyle={{fontSize:14}}
            tabBarUnderlineStyle={{borderColor:'#ed5565',borderWidth:2,}}
            tabBarActiveTextColor="#e53343"
            tabBarInactiveTextColor="#4d4d4d"
            renderTabBar={() => <DefaultTabBar />}
            >
            <View  tabLabel='产品规则'>
              {this.proRules(prdinfo,quota)}
            </View>
            <View  tabLabel='产品介绍'>
              {this.proInstruction(prdinstructionList)}
            </View>
            <View  tabLabel='投资记录'>
              {this.proRecord(invrcdList)}
            </View>
          </ScrollableTabView>
      </View>
        <ART.Surface width={2} height={1}>
          <ART.Shape d={horizontal_line} stroke={COMMON_STYLES.MAIN_BACKGROUND_COLOR} strokeWidth={1} />
        </ART.Surface>
        <View style={styles.searchBox}>
            <View style={{flex:2,alignItems:'center'}}>
              <TextInput style={styles.inputText}  
                      onChangeText={(text)=> this.checkInvMoney(text)} value ={this.state.invmoney}
                      editable={!disabled}
                      keyboardType='numeric'    
                      placeholder='请输入投资金额'  underlineColorAndroid='rgba(0,0,0,0)'/>                             
            </View>
            <TouchableOpacity onPress={()=>this.setModalVisible(true,prdinfo)} disabled={disabled} style={[styles.touchContainer, disabled && styles.disabled]} >
              <Text style={{fontSize:14,color:'#ffffff',fontWeight:'bold'}}>{startInvest}</Text>  
            </TouchableOpacity>
        </View> 
      </ScrollView>
      <Loading ref="loading" />
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  blurContainer: {
    paddingHorizontal: 20,
  },
  img: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    height: null,
    width: null,
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    color: 'white',
  },
  blurToggle: {
    position: 'absolute',
    top: 30,
    right: 10,
    alignItems: 'flex-end',
  },
  points: {
    fontSize:16,
    alignSelf:'center',
    color:'#ed5565'
  },
  points100:{
    fontSize:14,
    alignSelf:'center',
    color:'#ed5565'
  },
  searchBox:{//搜索框  
    flex:1,
    marginTop:10,
    marginLeft:20,
    marginRight:20,  
    flexDirection: 'row',   // 水平排布 
    justifyContent:'center',
    borderRadius: 5,  // 设置圆角边    
    backgroundColor: '#fff',  
    alignItems: 'center',  
 }, 
  inputText:{
    width:0.58 * full_width,
    height:38,
    borderWidth:1,
    borderColor:'#dddddd',
    backgroundColor:'transparent',  
    fontSize:15,  
  }, 
  tab1View: {
    height:0.05 * full_height,
    justifyContent:'space-between',
    alignItems:'center',
    flexDirection:'row',
    marginLeft:10,
  },
  tab1View_text1:{
    flex:1,
    alignSelf:'center',
    fontSize:16,
    color:'#353535'
  },
  tab1View_text2:{
    flex:2,
    alignSelf:'center',
    fontSize:16,
    marginLeft:15,
    color:'#353535'
  },
  tab2View_text1:{
    lineHeight:18,
    fontSize:12,
    color:'#101010'
  },
  tab3View_text1: {
    fontSize:16,
    color:'#353535'
  },
  circleContent:{
    ...Platform.select({
    android:{
      marginTop:10,marginLeft:7
    },
    ios:{
      marginTop:13,marginLeft:5
    }
  }),
    position:'absolute',
  },
    circleContent0:{
    ...Platform.select({
    android:{
      marginTop:10,marginLeft:10
    },
    ios:{
      marginTop:13,marginLeft:9
      }
    }),
    position:'absolute',
  },
  circleContent100:{
   ...Platform.select({
      android:{
        marginTop:11,marginLeft:2
      },
      ios:{
        marginTop:13,marginLeft:4
      }
    }),
    position:'absolute',
  },
  touchContainer:{
    marginLeft:-5,
    flex:1,
    flexDirection:'row',
    backgroundColor:'#ed5565',
    justifyContent: 'center',
    alignItems: 'center',
    height:38
  },
  disabled:{
    backgroundColor:'#cccccc'
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
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
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
  textBtn: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  disabled1:{
      backgroundColor:'#a19d9e',
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
});
export default Invesdetial