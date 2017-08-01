/**
 * 我的风险评估记录
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
  Switch,
  ART,
  Platform,
  AsyncStorage
} from 'react-native';
import {
  BasePage,
  NavBar,
  PushLogin,
} from 'ApolloComponent'
import {
  EVENT_EMITTER_CONST,
  STORAGE_KEYS,
  COMMON_STYLES,
  COMMON_CONFIG,
  Color,
} from 'ApolloConstant'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import ScrollableTabView ,{DefaultTabBar, } from 'react-native-scrollable-tab-view';
import { StringUtils,PlateFormUtils } from 'ApolloUtils';
import Modal from 'react-native-root-modal';
import ApolloAPI from 'ApolloAPI';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import Icon from 'react-native-vector-icons/FontAwesome';

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
class MyRiskList extends BasePage {
 	constructor(props) {
        super(props);
      
        this.state = {
            percent:40,
            modalVisible: false,
            dataSource:[],
      };
    }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  returnItems1(){
    let returnItems1 = [];
    let recomendContent = this.state.dataSource;
    if(recomendContent.length == 0){    
        return(
          <View  style={{justifyContent:'center',alignItems:'center',marginTop:10,backgroundColor:'#fff',height:0.8 * full_height}}>
              <Text style={styles.textStyle}>您还没有评估记录哦！</Text>
          </View>
        )
    }else{
        for (let i=0;i<recomendContent.length;i++){
          returnItems1.push(

            <View key={i} style={{marginHorizontal:10,paddingHorizontal:8,paddingTop:5,paddingBottom:5,backgroundColor:'#fff',borderRadius:4}}>
              <TouchableOpacity onPress={()=>this.props.navigator.push({id:'MyRiskDetail',params:{riskrcdid:recomendContent[i].riskrcdid}})}>
                <View style={{flexDirection:'row',alignItems:'center',height:80,borderTopColor:'#e5e5e5',borderTopWidth:onePt,borderBottomColor:'#e5e5e5',borderBottomWidth:onePt}}>
                  <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize:14,color:'#4d4d4d',marginBottom:20}}>评估日期</Text>
                    <Text style={{fontSize:14,color:'#4d4d4d'}}>{recomendContent[i].evadate}</Text>
                  </View>
                  <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize:14,color:'#4d4d4d',marginBottom:20}}>得分</Text>
                    <Text style={{fontSize:14,color:'#4d4d4d'}}>{recomendContent[i].score}</Text>
                  </View>
                  <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize:14,color:'#4d4d4d',marginBottom:20}}>等级</Text>
                    <Text style={{fontSize:14,color:'#4d4d4d'}}>{recomendContent[i].riskgrade}</Text>
                  </View>
                  <Image style={{height:16,width:14}} source ={require('../../image/arrow_right.png' )}></Image>
                </View>
              </TouchableOpacity>
            </View>
            
          )
         
        }
      return returnItems1;
    }
  
    
  }
   
  invescCollect(){
    return (
      <ScrollView style={{marginTop:10,height:full_height}} showsVerticalScrollIndicator={false}>
          {this.returnItems1()}
          <View style={{height:150,alignItems:'center',justifyContent:'center'}}>
              <Text style={{color:'#010101',fontSize:12,marginTop:10}}>
                  我是有底线的
              </Text>
          </View>
      </ScrollView>
    );
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

    let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
    let hash = JSON.parse(value);//json转字符串
    console.log(hash);
    if (!!hash) {
      if (!!hash) {      
          console.log(hash.retMsg);      
          ApolloAPI.APIPersonal.getRiskList({
            telno:hash.retMsg,
          }).done((res_json, res)=>{
            if(res_json.retCode === 1 && res_json.myRiskRcdVOList.length>0){
              console.log("res_json.myRiskRcdVOList",res_json.myRiskRcdVOList);
              this.setState({
                  dataSource:res_json.myRiskRcdVOList,
              })               
            }else{
              PlateFormUtils.plateFormAlert(Platform,'错误提示',"风险列表信息未获得!");
            }
          })
      }
    }
   }

  componentDidMount(){
      this.request_api();
      this.listener = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.RISKTESTQTSUCCESS,(value)=>{
      // 接受到通知后的处理
      if(value == 'riskTestQT'){
           this.request_api();
      }
     });
  }

  componentWillUnmount(){
    // 移除 一定要写
    this.listener.remove();
  }



  render() {
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
          {this.titleAndroid()}
         <View style={styles.modalView}>
          {this.titleIos()}
          <TouchableOpacity onPress={() => {this.setModalVisible(!this.state.modalVisible)}}>
              <View style={styles.modalTitle}>
                  <Text style= {[styles.modalText,{fontSize:22}]}>尧都专享理财</Text>    
              </View>
              <View style={{marginTop:15}}>
              <View style={styles.modalTitleDetail}>
                  <Text style= {[styles.modalText,{flex:1}]}>标的总额</Text>    
                  <Text style= {[styles.modalText,{flex:2}]}>5000000</Text> 
              </View>
              <View style={styles.modalTitleDetail}>
                  <Text style= {[styles.modalText,{flex:1}]}>年收益率</Text>    
                  <Text style= {[styles.modalText,{flex:2}]}>7%</Text> 
              </View>
              <View style={styles.modalTitleDetail}>
                  <Text style= {[styles.modalText,{flex:1}]}>还款期限</Text>    
                  <Text style= {[styles.modalText,{flex:2}]}>3个月</Text> 
              </View>
              <View style={{position:'absolute',marginTop:12,marginHorizontal:0.67 * full_width}}>
                  <AnimatedCircularProgress
                      size={44}
                      width={3 * onePt}
                      fill={this.state.percent}
                      tintColor="#ED5565"
                      rotation={0}
                      backgroundColor="#DDDDDD"
                      >
                      {
                      (fill) => (
                      <View style={{position:'absolute',marginTop:13,marginLeft:7}}>
                        <Text style={styles.points}>
                            { this.state.percent}%
                        </Text>
                      </View>
                      )
                      }
                  </AnimatedCircularProgress>
              </View>
            </View>
            <View style={{marginTop:15}}> 
                <View style={styles.modalItems}>
                  <View>
                    <Text style= {styles.modalItemsText1}>项目状态</Text> 
                  </View>
                  <View>  
                    <Text style= {styles.modalItemsText2}>还款中</Text> 
                  </View> 
                </View>
                <View style={styles.modalItems}>
                    <Text style= {styles.modalItemsText1}>起投金额</Text>    
                    <Text style= {styles.modalItemsText2}>50元</Text> 
                </View>
                <View style={styles.modalItems}>
                    <Text style= {styles.modalItemsText1}>合作方式</Text>    
                    <Text style= {styles.modalItemsText2}>四方合同</Text> 
                </View>
                <View style={styles.modalItems}>
                    <Text style= {styles.modalItemsText1}>起息时间</Text>    
                    <Text style= {styles.modalItemsText2}>还款中</Text> 
                </View>
                <View style={styles.modalItems}>
                    <Text style= {styles.modalItemsText1}>结算时间</Text>    
                    <Text style= {styles.modalItemsText2}>已到期</Text> 
                </View>
              </View>
            </TouchableOpacity>
              
              
          </View>
        </Modal>
        <NavBar
            backgroundColor='#ed5565'
            leftContent={
              <View >
                <TouchableOpacity onPress={()=>this.props.navigator.pop()}>
                  <Icon style={{marginRight: 15}} name="angle-left" size={22} color={"#fff"} />
                </TouchableOpacity>
              </View> 
            }
            titleContent={
              <View style={styles.title}>
                <Text style={{fontSize:18,color:'#fff'}}>风险评估记录</Text>
              </View>
            }
            rightContent={
             <View >
                <TouchableOpacity onPress={()=>PushLogin.push_login_destination('RiskAssessment', this.props.navigator)}>
                  <Text style={{fontSize:16,color:'#fff'}}>新增评估</Text>
                </TouchableOpacity>
              </View>
             }
            />
        <View style={{flex:1}}>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{backgroundColor:'#f0edf0'}} >
              {this.invescCollect()}
            </View>
          </ScrollView>
        </View>
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
    width:0.13 * full_width,
    borderRadius:2,
    backgroundColor:'#ED5565',
    height:0.03 * full_height,
    justifyContent:'center',
    alignItems:'center',
    overflow:'hidden'
  },
  textBtn: {
    fontSize:10,
    color:'#fff'
  },
  itemWrapper: {
    backgroundColor:'#fff',
    paddingLeft:15,
    paddingRight:15,
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
});
export default MyRiskList