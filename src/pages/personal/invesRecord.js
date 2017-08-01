/**
 * 投资记录
 * zgx
 * 
 *  {
                      recomendContent[i].prdstatus == '3' ?
                        <View style={{flex:1,flexDirection:'row',justifyContent:'space-around',}}>
                          <TouchableOpacity   
                            onPress={()=>this.getDigitalAgeement(recomendContent[i].invrcdid)}
                            style={[styles.touchContainer]}>
                                <Text style={{fontSize:10,color:'#ffffff',}}>电子合同</Text>
                          </TouchableOpacity>
                          {this.renderBtn(flag,transferflag,recomendContent[i])}
                        </View>
                        :
                        <View>
                        {
                          flag != 3 ?
                          <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',}}>
                            <TouchableOpacity  
                              disabled={true} 
                              style={[styles.touchContainer,{backgroundColor:"transparent"}]}>
                                  <Text style={{fontSize:10,color:'#ffffff',}}></Text>
                            </TouchableOpacity>
                            <TouchableOpacity   
                              disabled={true} 
                              style={[styles.touchContainer, styles.disabled]}>
                                  <Text style={{fontSize:10,color:'#ffffff',}}>未成立</Text>
                            </TouchableOpacity>
                          </View>
                          :
                          <View style={{flex:1,flexDirection:'row',justifyContent:'space-between',}}>
                            <TouchableOpacity  
                              disabled={true} 
                              style={[styles.touchContainer,{backgroundColor:"transparent"}]}>
                                  <Text style={{fontSize:10,color:'#ffffff',}}></Text>
                            </TouchableOpacity>
                            <TouchableOpacity   
                              disabled={true} 
                              style={[styles.touchContainer,{width:55}, styles.disabled]}>
                                  <Text style={{fontSize:10,color:'#ffffff',}}>不可转让</Text>
                            </TouchableOpacity>
                          </View>
                        }
                        </View>
                        
                    <View style={{alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#ED5565',borderRadius:50,height:50,width:50}}>
                      <Text style={{fontSize:12,color:'#ED5565',alignSelf:'center'}}>{cantransflag}</Text>
                    </View>
                    }
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
  Switch,
  ART,
  Platform,
  AsyncStorage,
  Alert
} from 'react-native';
import {
  BasePage,
  BackNavBar,
  Moretxtin,
  PushLogin,
  Loading
} from 'ApolloComponent'
import {
  EVENT_EMITTER_CONST,
  STORAGE_KEYS,
  COMMON_STYLES,
  COMMON_CONFIG,
  Color
} from 'ApolloConstant'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import ScrollableTabView ,{DefaultTabBar, } from 'react-native-scrollable-tab-view';
import { StringUtils,PlateFormUtils } from 'ApolloUtils';
import Modal from 'react-native-root-modal';
import ApolloAPI from 'ApolloAPI';
import Icon from 'react-native-vector-icons/FontAwesome';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
var full_width = Dimensions.get('window').width;
var full_height = Dimensions.get('window').height;

const {Surface, Shape, Path} = ART;
const horizontal_line = ART.Path();
      horizontal_line.moveTo(1,1);
      horizontal_line.lineTo(full_width,1);
const pathBig = new Path()
        .moveTo(35,1)
        .arc(0,69,25)
        .arc(0,-69,25)
        .close();
const pathSmall = new Path()
        .moveTo(30,1)
        .arc(0,59,25)
        .arc(0,-59,25)
        .close();
let recomendContent1 = new Array();
    recomendContent1.push({name:'尧都专享理财',invesMoney:'2000',gettdMoney:'300',restMoney:'1700',time:'2017年12月8日'});
    recomendContent1.push({name:'尧都兴业理财',invesMoney:'300',gettdMoney:'5.6',restMoney:'294.4',time:'2017年12月8日'});
    recomendContent1.push({name:'尧都p2p理财',invesMoney:'2005',gettdMoney:'436.0',restMoney:'1679',time:'2015年12月8日'});
    recomendContent1.push({name:'山西实业',invesMoney:'400',gettdMoney:'36.5',restMoney:'.374.5',time:'2015年12月8日'});
    recomendContent1.push({name:'尧都E都市',invesMoney:'30',gettdMoney:'0.5',restMoney:'29.5',time:'2015年12月8日'});
    recomendContent1.push({name:'尧都重工',invesMoney:'10',gettdMoney:'4.5',restMoney:'5.5',time:'2015年12月8日'});

let recomendContent2 = new Array();
    recomendContent2.push({name:'尧都专享理财',invesMoney:'2000',projMoney:'300000',percent:30,time:'2天12小时23分33秒'});
    recomendContent2.push({name:'尧都兴业理财',invesMoney:'300',projMoney:'500000',percent:40,time:'5天12小时23分33秒'});
    recomendContent2.push({name:'尧都p2p理财',invesMoney:'2005',projMoney:'436000',percent:50,time:'1天12小时23分33秒'});
    recomendContent2.push({name:'山西实业',invesMoney:'400',projMoney:'633000',percent:60,time:'2天1小时23分33秒'});
    recomendContent2.push({name:'尧都E都市',invesMoney:'30',projMoney:'500000',percent:90,time:'1天0小时23分33秒'});
    recomendContent2.push({name:'尧都重工',invesMoney:'10',projMoney:'45000',percent:20,time:'2天12小时23分33秒'});

let recomendContent3 = new Array();
    recomendContent3.push({name:'尧都专享理财',moneyRate:'20000',principal:'19000',time:'2016-12-08'});
    recomendContent3.push({name:'尧都兴业理财',moneyRate:'30000.5',principal:'30000',time:'2016-11-18'});
    recomendContent3.push({name:'尧都p2p理财',moneyRate:'52300',principal:'52000',time:'2017-01-08'});
    recomendContent3.push({name:'山西实业',moneyRate:'31000',principal:'30000',time:'2016-09-08'});
    recomendContent3.push({name:'尧都E都市',moneyRate:'20050.2',principal:'0.5',time:'2016-12-25'});

class InvesRecord extends BasePage {
 	constructor(props) {
        super(props);

        this.state = {
          percent:40,
          modalVisible: false,
          modalVisible2:false,
          dataSource1:[],
          dataSource2:[],
          dataSource3:[],
          prdinfo:'',
      };
    }
    async transfer(invrcdid,prdcode,tenantno,prdname,modalVisible) {
        //获得当前的时间
        let month = new Date().getMonth()+1;
        if(month.toString.length ==1){
            month= '0' + month;
        }
        let date=  new Date().getFullYear() + '-'+month+'-'+new Date().getDate();
        let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
        let hash = JSON.parse(value);//json转字符串
        this.setState({
          modalVisible2:modalVisible,
          invrcdid:invrcdid,
          prdcode:prdcode,
          tenantno:tenantno,
          prdname:prdname,
          cusname:hash.cusname,
          telno:hash.retMsg,
          date:date

        });
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
          this.props.navigator.push({ id: 'Invesdetial',params:{data:data,naviParam:"invest"} })
        }else{
          this.get_loading().dismiss();
          PlateFormUtils.plateFormAlert(Platform,"错误提示","获取详情失败!");
        }
      
    })
    
  }
  //打开modal 暂时不用了
  async setModalVisible(visible,prdcode) {

      let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
      let hash = JSON.parse(value);//json转字符串
      if (!!hash) {
          console.log(hash.retMsg);
          ApolloAPI.APIInvest.getInvItemDetail({
              prdcode:prdcode,
              phoneNo: hash.retMsg,
          }).done((res_json, res)=>{
          if(res_json.retCode === 1 ){
                this.setState({modalVisible: visible,prdinfo:res_json.prdinfo});
              console.log(res_json);
            }
          })
      }
  }
  get_loading() {
    return this.refs.loading;
  }

  renderBtn(flag,transferflag,recomendContentItem){
    if(flag == '1'){
      return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <TouchableOpacity   
          onPress={()=>this.transfer(recomendContentItem.invrcdid,recomendContentItem.prdcode,recomendContentItem.tenantno,recomendContentItem.prdname,true)} 
          style={[styles.touchContainer]}>
              <Text style={{fontSize:10,color:'#ffffff',}}>转让</Text>
          </TouchableOpacity>
        </View>
        
      )
    }else if(flag == '2'){
      return (
         <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <TouchableOpacity   
            disabled={true} 
            style={[styles.touchContainer, styles.disabled]}>
                <Text style={{fontSize:10,color:'#ffffff',}}>{transferflag}</Text>
          </TouchableOpacity>
        </View>
      )
    }else if(flag == '3'){
       return (
         <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <TouchableOpacity   
            disabled={true} 
            style={[styles.touchContainer,{width:55}, styles.disabled]}>
                <Text style={{fontSize:10,color:'#ffffff',}}>不可转让</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  returnItems1(){
    let returnItems1 = [];
    let recomendContent = "";
    if(this.state.dataSource2.length > 0){
      if(this.state.dataSource3.length==0){
         console.log("this.state.dataSource2",this.state.dataSource2);
         recomendContent = this.state.dataSource2;
      }else{
         console.log("this.state.dataSource3",this.state.dataSource3);
         recomendContent = this.state.dataSource3;
      }
         // for (let i=0;i<recomendContent1.length;i++){
        for (let i=0;i<recomendContent.length;i++){
          let invsum =recomendContent[i].invsum==null||recomendContent[i].invsum ==""?'0':recomendContent[i].invsum;
          let earnedsum =recomendContent[i].earnedsum==null||recomendContent[i].earnedsum ==""?'0':recomendContent[i].earnedsum;
          let toearnsum =recomendContent[i].toearnsum==null||recomendContent[i].toearnsum ==""?'0':recomendContent[i].toearnsum;
          let cantransflag = '';
          switch (recomendContent[i].cantransflag){
            case '0':
              cantransflag="不可转让";
              break;
            case '1':
              cantransflag="可转让";
              break;
          }
          let transferflag = '';
          switch (recomendContent[i].transferflag){
            case '0':
              transferflag="未转让";
              break;
            case '1':
              transferflag="已转让";
              break;
            case '2':
              transferflag='转让中'
              break;
          }
          let flag = '';
          if(recomendContent[i].cantransflag=='1'&&recomendContent[i].transferflag=='0'){
            flag = '1'
          }else if(recomendContent[i].cantransflag=='1'&&recomendContent[i].transferflag!='0'){
            flag = '2'
          }else if(recomendContent[i].cantransflag=='0'){
            flag = '3'
          }
          let  invdate = recomendContent[i].invdate.substr(0,19);
          returnItems1.push(
            <View key={i} style={styles.itemWrapper}>
                <TouchableOpacity style={styles.itemWrapper_com} onPress={() => { this.get_InvDetail(recomendContent[i].prdcode)}}>
                    <Text style={{fontSize:16,color:'#101010'}}>{recomendContent[i].prdname}</Text>
                    <Image style={{height:16,width:14}} source ={require('../../image/arrow_right.png' )}></Image>
                </TouchableOpacity>
                <View style={[{flexDirection:'row',alignItems:'center'},styles.itemWrapper_com]}>
                    <View>
                      <Text style={styles.modalText}>投资金额(元)</Text>
                      <Text style={{fontSize:16,color:'#4d4d4d',paddingTop:5,alignSelf:'center'}}>{StringUtils.moneyFormatData2Money(invsum)}</Text>
                    </View>
                    <View>
                      <Text style={styles.modalText}>预期收益率</Text>
                      <Text style={{fontSize:16,color:'#4d4d4d',paddingTop:5,alignSelf:'center'}}>{recomendContent[i].expprofit}</Text>
                    </View>
                </View>
                <View style={styles.itemButtom}>
                    <View style={{flex:1.6,justifyContent:'center',}}>
                      <Text style={{fontSize:10,color:'#4d4d4d'}}>购买日期: {invdate}</Text>
                    </View>
                    
                    <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                    {
                      recomendContent[i].prdstatus == '3' ?
                        <View style={{flex:1,flexDirection:'row',justifyContent:'space-around',}}>
                          <TouchableOpacity   
                            onPress={()=>this.getDigitalAgeement(recomendContent[i].invrcdid)}
                            style={[styles.touchContainer]}>
                                <Text style={{fontSize:10,color:'#ffffff',}}>电子合同</Text>
                          </TouchableOpacity>
                        </View>
                        :
                        null
                    }
                    </View>
                </View>

            </View>

          )

        }
        return returnItems1;
    }


  }

  getDigitalAgeement(invrcdid){
    this.get_loading().show();
    ApolloAPI.APIPersonal.getDigitalContract({
              rcdID:invrcdid,
              type:1,
            }).done((res_json, res) => {
              this.get_loading().dismiss();
              console.log("返回的投资电子合同是",res_json);
              if(res_json.retCode == 1){
                this.props.navigator.push({id: 'Agreement',params:{protocoltitle:"电子合同",protocolcontent:res_json.map.cont}})
              }else{
                PlateFormUtils.plateFormAlert(Platform,"错误提示","未获取到电子合同！");
              }
              
            })
  }
     
    
    returnItems3(){
    let returnItems3 = [];
    if(this.state.dataSource1.length > 0){
       // for (let i=0;i<recomendContent3.length;i++){
         for (let i=0;i<this.state.dataSource1.length;i++){
          let invsum =this.state.dataSource1[i].invsum==null||this.state.dataSource1[i].invsum ==""?0:this.state.dataSource1[i].invsum
          let earnedsum =this.state.dataSource1[i].earnedsum==null||this.state.dataSource1[i].earnedsum ==""?0:this.state.dataSource1[i].earnedsum
          
          if(this.state.dataSource1[i].invsum == null || this.state.dataSource1[i].invsum ==""){
            invsum="0";
          }
          if(this.state.dataSource1[i].earnedsum == null || this.state.dataSource1[i].earnedsum ==""){
            earnedsum="0";
          }

          returnItems3.push(
            <View key={i} style={{backgroundColor:'#ffffff',marginTop:9}}>
              <View style={{marginHorizontal:8,paddingHorizontal:8,borderColor:'#dddddd',borderWidth:onePt,backgroundColor:'#ffffff',borderRadius:5,height:140}}>
                <TouchableOpacity style={{marginTop:10,paddingBottom:10,justifyContent:'space-between',borderBottomColor:'#ededed',borderBottomWidth:onePt,flexDirection:'row'}} onPress={() => { this.get_InvDetail(this.state.dataSource1[i].prdcode)}}>
                    <Text style={{fontSize:16,color:'#101010'}}>{this.state.dataSource1[i].prdname}</Text>
                    <Image style={{height:16,width:14}} source ={require('../../image/arrow_right.png' )}></Image>
                </TouchableOpacity>
                <View style={{flex:2,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}} >
                  <View style={{justifyContent:'center'}}>
                    <Text style={{fontSize:14,color:'#4d4d4d',marginBottom:8}}>投资金额</Text>
                    <Text style={{fontSize:14,color:'#4d4d4d'}}>{StringUtils.moneyFormatData2Money(invsum)}</Text>
                  </View>
                  <View style={{justifyContent:'space-around'}}>
                    <Text style={{fontSize:14,color:'#4d4d4d',marginBottom:8}}>收益率</Text>
                    <Text style={{fontSize:14,color:'#4d4d4d'}}>{this.state.dataSource1[i].expprofit}</Text>
                  </View>
                  <View style={{justifyContent:'space-around'}}>
                    <Text style={{fontSize:14,color:'#4d4d4d',marginBottom:8}}>收益金额</Text>
                    <Text style={{fontSize:14,color:'#4d4d4d'}}>{StringUtils.moneyFormatData2Money(earnedsum)}</Text>
                  </View>
                </View>
                <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderTopColor:'#dddddd',borderTopWidth:1}}>
                  <Text style={{fontSize:10,color:'#4d4d4d'}}>投资日期:{this.state.dataSource1[i].invdate}</Text>
                  <Text style={{fontSize:10,color:'#4d4d4d'}}>结清日期:{this.state.dataSource1[i].winddate}</Text>
                </View> 
              </View>
            </View>
          )
        }
        return returnItems3;
    }

  }
  invescCollect(){
    return (
      <ScrollView style={{marginTop:10,height:full_height}} showsVerticalScrollIndicator={false}>
          {this.returnItems1()}
          <View style={{marginTop:30,height:0.35 * full_height,alignItems:'center',borderTopColor:'#c1c1c1',borderTopWidth:onePt}}>
            <Text style={{color:'#999999',fontSize:12}}>
                我是有底线的
            </Text>
          </View>
      </ScrollView>
    );
  }
  invesFinish(){
    return (
      <ScrollView style={{marginTop:10,height:full_height}} showsVerticalScrollIndicator={false}>
          {this.returnItems3()}
          <View style={{marginTop:30,height:0.35 * full_height,alignItems:'center',borderTopColor:'#c1c1c1',borderTopWidth:onePt}}>
            <Text style={{color:'#999999',fontSize:12}}>
                我是有底线的
            </Text>
          </View>
      </ScrollView>
    )
  }
  titleAndroid() {
      if (Platform.OS === 'android') {
          return (
          <View>
            <View style={[{marginTop:0.2 * full_height-35,marginLeft:0.4 * full_width,zIndex:1000},styles.modalTitleCom]}>
              <ART.Surface width={80} height={79}>
                <ART.Shape d={pathBig} stroke="#fff" strokeWidth={1} fill={'#fff'} />
              </ART.Surface>
            </View>
            <View style={[{marginTop:0.2 * full_height-30,marginLeft:0.415 * full_width,zIndex:1000},styles.modalTitleCom]}>
              <ART.Surface width={80} height={79}>
                <ART.Shape d={pathSmall} stroke="#fff" strokeWidth={1} fill={'#ed5565'} />
              </ART.Surface>
            </View>
            <View style={[{marginTop:0.2 * full_height -23,marginLeft:0.447 * full_width,zIndex:1000},styles.modalTitleCom]}>
              <Text style={styles.modalTitleText}>标</Text>
            </View>
          </View>
        )
     }
  }
  titleIos(){
    if(Platform.OS === 'ios'){
      return(
          <View>
            <View style={[{marginTop:-35,marginLeft:0.38 * full_width},styles.modalTitleCom]}>
              <ART.Surface width={80} height={79}>
                <ART.Shape d={pathBig} stroke="#fff" strokeWidth={1} fill={'#fff'} />
              </ART.Surface>
            </View>
            <View style={[{marginTop:-30,marginLeft:0.393 * full_width},styles.modalTitleCom]}>
              <ART.Surface width={80} height={79}>
                <ART.Shape d={pathSmall} stroke="#fff" strokeWidth={1} fill={'#ed5565'} />
              </ART.Surface>
            </View>
            <View style={[{marginTop:-17,marginLeft:0.425 * full_width},styles.modalTitleCom]}>
              <Text style={styles.modalTitleText}>标</Text>
            </View>
          </View>
        )
     }
  }
  //请求数据
  async request_api() {
    this.get_loading().show();
    let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
    let hash = JSON.parse(value);//json转字符串
      if (!!hash) {
          ApolloAPI.APIPersonal.getInvRcdList({
            telno:hash.retMsg,
          }).done((res_json, res)=>{
            this.get_loading().dismiss();
            if(res_json.retCode === 1 && res_json.invRcdVOList.length>0){
            //根据产品状态区分投资中的和已结清的
            let invRcdList1=[];
            let invRcdList2=[];
            let invRcdList3=[];
            //进行分解列表
            for(let i=0;i<res_json.invRcdVOList.length;i++){
                if(res_json.invRcdVOList[i].prdstatus == "2"){
                  //2为已结清
                  invRcdList1.push(res_json.invRcdVOList[i])
                }else{
                  //其余为投资中
                  invRcdList2.push(res_json.invRcdVOList[i]);
                }
            }
            //点击转让进来，分解投资中的可转让产品
            if(this.props.flag){
              for(let j=0;j<invRcdList2.length;j++){
                  if(invRcdList2[j].cantransflag==1){
                    invRcdList3.push(invRcdList2[j]);
                  }
              }
            }
            this.setState({
                dataSource1:invRcdList1,
                dataSource2:invRcdList2,
                dataSource3:invRcdList3
            });
            this.setState({})
            }else{
               PlateFormUtils.plateFormAlert(Platform,"提示","暂无更多数据");
            }
          })
      }
   }

  componentDidMount(){
    //加载我的页面数据
    this.request_api();

    this.listener1 = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.TRANSFERSUCCESS,(value)=>{
      if(value=="transferSuccess"){
        this.request_api();
      }
    });
    this.listener2 = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.INVESTSUCCESS,(value)=>{
      if(value=="invest"){
        this.request_api();
      }
    });
  }
  componentWillUnmount(){
    // 移除 一定要写
    this.listener1.remove();
    this.listener2.remove();
  }
  async confirmApply(){
    this.setState({modalVisible2:false});
    let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
    let hash = JSON.parse(value);
    if(!!hash && hash.retCode == 1 && hash.retMsg){
        ApolloAPI.APIPersonal.getPerInfo({
            //通过参数获取个人信息
            telno:hash.retMsg
          }).done((res_json, res)=>{
            if(res_json.retCode === 1 && res_json.nopswdflag == 1){ //免密
                ApolloAPI.APIPersonal.transApp({
                  invrcdid:this.state.invrcdid,
                  cusname: this.state.cusname,
                  telno: this.state.telno,
                  tranprdcode:this.state.prdcode,
                  tenantno:this.state.tenantno,
                  appdate:this.state.date,
                  businessSeqNo:''
                }).done((res_data_json, res) => {
                  this.get_loading().dismiss();
                  if (res_data_json.retCode == 1) {
                      let tips = "成功提示";
                      let showContent = '已提交申请';
                      RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.TRANSFERSUCCESS, 'transferSuccess'); 
                      PlateFormUtils.plateFormAlert(Platform,tips,showContent);
                  } else {
                      let tips = "错误提示";
                      let showContent = res_data_json.retMsg;
                      PlateFormUtils.plateFormAlert(Platform,tips,showContent);
                  }
              });
            }else if(res_json.retCode === 1 && res_json.nopswdflag == 0){
                  this.get_loading().dismiss();
                  PushLogin.push_login_destination('TradePasswordValidate', this.props.navigator,{from:'transferApply',data:{invrcdid:this.state.invrcdid,cusname: this.state.cusname,telno: this.state.telno,tranprdcode:this.state.prdcode,tenantno:this.state.tenantno,appdate:this.state.date}})
              }else{
                  this.get_loading().dismiss();
                  PlateFormUtils.plateFormAlert(Platform,'错误提示',"免密协议信息未获得!");
                }
              })
        }else{
          this.get_loading().dismiss();
          PlateFormUtils.plateFormAlert(Platform,"错误提示","您还未登录或注册!");
          this.props.navigator.push({id:'Login',params:{}});
        }
    
  }

  render() {
    const { prdinfo }=this.state
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
              <View style={[styles.modalView,{height:0.38 * full_height,marginTop:0.3 * full_height}]}>
                <TouchableOpacity style={{alignSelf:'flex-end',marginRight:10,marginTop:5}} onPress={() => this.setState({modalVisible2:!this.state.modalVisible2})}>
                  <Icon name='close' size={20} />
                </TouchableOpacity> 
                    <View style={[styles.modalTitle,{marginTop:5}]}>
                        <Text style= {[styles.modalText,{fontSize:20,color:'#333333',fontWeight:'bold'}]}>确认申请转让</Text>    
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
                        <Text style= {[styles.modalText,{flex:1,fontSize:16}]}>姓名:</Text>    
                        <Text style= {[styles.modalText,{flex:2,color:'#e35263',fontSize:16}]}>{this.state.cusname}</Text> 
                      </View>
                    </View>
                     <View style={[styles.modalTitleDetail,{justifyContent:'space-around'}]}>
                      <View style={{flex:1,flexDirection:'row'}}>
                        <Text style= {[styles.modalText,{flex:1,fontSize:16}]}>手机号:</Text>    
                        <Text style= {[styles.modalText,{flex:2,color:'#e35263',fontSize:16}]}>{this.state.telno}</Text> 
                      </View>
                    </View>
                     <View style={[styles.modalTitleDetail,{justifyContent:'space-around'}]}>
                      <View style={{flex:1,flexDirection:'row'}}>
                        <Text style= {[styles.modalText,{flex:1,fontSize:16}]}>申请日期:</Text>    
                        <Text style= {[styles.modalText,{flex:2,color:'#e35263',fontSize:16}]}>{this.state.date}</Text> 
                      </View>
                    </View>
                  </View>
                  <View style={[styles.btnContainer,{marginTop:15}]}>
                  <TouchableOpacity 
                    onPress={() => this.confirmApply()}
                    style={[styles.btn,this.state.disabled && styles.disabled]} >
                      <Text style={[styles.textBtn]}>
                        申请转让
                      </Text>
                    </TouchableOpacity>
                </View>
              </View>
            </Modal>

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
          {this.titleAndroid()}
         <View style={[styles.modalView]}>
          {this.titleIos()}
              <TouchableOpacity style={{alignSelf:'flex-end',marginRight:10,marginTop:5}} onPress={() => this.setState({modalVisible:!this.state.modalVisible})}>
                  <Icon name='close' size={20} />
                </TouchableOpacity> 
              <View style={[styles.modalTitle]}>
                  <Text style= {[styles.modalText,{fontSize:22}]}>{prdinfo.prdname}</Text>
              </View>
              
            <View style={{marginTop:15}}>
                <View style={styles.modalItems}>
                  <View>
                    <Text style= {styles.modalItemsText1}>产品性质</Text>
                  </View>
                  <View>
                    <Text style= {styles.modalItemsText2}>{prdinfo.prdtypename}</Text>
                  </View>
                </View>
                <View style={styles.modalItems}>
                    <Text style= {styles.modalItemsText1}>产品额度</Text>
                    <Text style= {styles.modalItemsText2}>{StringUtils.moneyFormatData2Money(prdinfo.prdquota)}元</Text>
                </View>
                <View style={styles.modalItems}>
                    <Text style= {styles.modalItemsText1}>成立日期</Text>
                    <Text style= {styles.modalItemsText2}>{prdinfo.issuedate}</Text>
                </View>
                <View style={styles.modalItems}>
                    <Text style= {styles.modalItemsText1}>到息日期</Text>
                    <Text style= {styles.modalItemsText2}>{prdinfo.winddate}</Text>
                </View>
                <View style={styles.modalItems}>
                    <Text style= {styles.modalItemsText1}>产品状态</Text>
                    <Text style= {styles.modalItemsText2}>{prdinfo.prostatus}</Text>
                </View>
              </View>


          </View>
        </Modal>
        <BackNavBar  component={this}>投资记录</BackNavBar>
        <View style={{flex:1}}>
            <ScrollableTabView
            style={{borderColor:'#ededed',borderWidth:1,backgroundColor:'#fff'}}
            tabBarTextStyle={{fontSize:16}}
            tabBarUnderlineStyle={{borderColor:'#ed5565',borderWidth:2}}
            tabBarActiveTextColor="#e53343"
            tabBarInactiveTextColor="#4d4d4d"
            renderTabBar={() => <DefaultTabBar />}>
            <View style={{backgroundColor:'#f0edf0'}} tabLabel='投资中'>
              {this.invescCollect()}
            </View>
            <View style={{backgroundColor:'#f0edf0'}} tabLabel='已结清'>
              {this.invesFinish()}
            </View>
          </ScrollableTabView>
        </View>
        <Loading ref="loading" />
     </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:Color.backgroundColor,
  },
  blurContainer: {
    paddingHorizontal: 20,
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
  itemWrapper: {
    backgroundColor:'#fff',
    marginLeft:15,
    marginRight:15,
    marginTop:10,
    borderRadius:8
  },
  itemWrapper_com:{
    marginLeft:15,
    marginRight:15,
    marginTop:10,
    paddingBottom:10,
    justifyContent:'space-between',
    borderBottomColor:'#ededed',
    borderBottomWidth:onePt,
    flexDirection:'row'
  },
  itemButtom: {
    marginLeft:15,
    marginRight:15,
    marginTop:5,
    paddingBottom:5,
    justifyContent:'space-between',
    borderBottomColor:'#ededed',
    borderBottomWidth:onePt,
    flexDirection:'row'
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
    marginLeft:50,
    marginRight:50,
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
  textStyle: {
    fontSize:21,
    color:'gray'
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
      marginTop:10,marginLeft:11
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
        marginTop:11,marginLeft:4
      },
      ios:{
        marginTop:13,marginLeft:4
      }
    }),
    position:'absolute',
  },
  touchContainer:{
        backgroundColor:'#ed5565',
        justifyContent: 'center',
        alignItems: 'center',
        //flex:1,
        width:50,
        height:20,
        borderRadius:2
    },
    disabled:{
        backgroundColor:'#cccccc'
    },
});
export default InvesRecord