/**
 * 充值记录
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
  ListView,
  ScrollView,
  Platform,
  AsyncStorage,
  Alert
} from 'react-native';
import {
  BasePage,
  BackNavBar,
  Moretxtin,
  Loading
} from 'ApolloComponent'
import {
  EVENT_EMITTER_CONST,
  STORAGE_KEYS,
  COMMON_STYLES,
  COMMON_CONFIG,
  Color
} from 'ApolloConstant'
import ScrollableTabView ,{DefaultTabBar, } from 'react-native-scrollable-tab-view';
import { StringUtils,PlateFormUtils } from 'ApolloUtils';
import Modal from 'react-native-root-modal';
import ApolloAPI from 'ApolloAPI';
var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
var full_width = Dimensions.get('window').width;
var full_height = Dimensions.get('window').height;

class InvAppRec extends BasePage {
 	constructor(props) {
        super(props);

        this.state = {
            totalList:[],
            foot:0,
            pageCount:0,
      };
    }
  
renderRow(rowData,sectionId) {
  console.log(rowData,'rowDatarowDatarowData')
        let returnItems = [];
        let acctno = "";
        if(rowData.acctno.length >6){
            acctno = rowData.acctno.substr(0, 6) + '******' + rowData.acctno.substr(12,rowData.acctno.length);
        }else{
            acctno = rowData.acctno;
        } 
        let supsum = rowData.supsum!=null&&rowData.supsum!=''?StringUtils.moneyFormatData2Money(rowData.supsum):'0.00';
        let supfee = rowData.supfee!=null&&rowData.supfee!=''?StringUtils.moneyFormatData2Money(rowData.supfee):'0.00';
        let supdate = rowData.supdate.substr(0,19);
       return(
          <View style={{backgroundColor:'#ffffff',marginTop:9}}>
              <View style={{marginHorizontal:8,paddingHorizontal:8,borderColor:'#dddddd',borderWidth:onePt,backgroundColor:'#ffffff',borderRadius:5,height:140}}>
                <View style={{flex:1,justifyContent:'center',borderBottomColor:'#dddddd',borderBottomWidth:1}}>
                  <Text style={{fontSize:16,fontWeight:'bold',color:'#101010'}}>银行卡号：{acctno}</Text>
                </View>
                <View style={{flex:2,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                  <View style={{justifyContent:'center'}}>
                    <Text style={{fontSize:14,color:'#4d4d4d',marginBottom:8}}>充值金额</Text>
                    <Text style={{fontSize:14,color:'#4d4d4d'}}>{supsum}元</Text>
                  </View>
                  <View style={{justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:14,color:'#4d4d4d',marginBottom:8}}>充值手续费</Text>
                    <Text style={{fontSize:14,color:'#4d4d4d'}}>{StringUtils.moneyFormatData2Money(supfee)}元</Text>
                  </View>
                  <View style={{justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:14,color:'#4d4d4d',marginBottom:8}}>充值日期</Text>
                    <Text style={{fontSize:14,color:'#4d4d4d'}}>{supdate}</Text>
                  </View>
                </View>
              </View>
          </View>
            )
     
  }

renderFooter(){
    if(this.state.foot === 1){//加载完毕
      return (
        <View style={{height:40,alignItems:'center',justifyContent:'center'}}>
            <Text style={{color:'#999999',fontSize:12}}>
                上拉加载
            </Text>
        </View>);
    }else if(this.state.foot === 2) {//加载中
      return (
        <View style={{height:40,alignItems:'center',justifyContent:'center'}}>
            <Text style={{color:'#999999',fontSize:12}}>
                加载中
            </Text>
        </View>);
    }else if(this.state.foot === 3) {//无更多数据
      return (
        <View style={{height:40,alignItems:'center',justifyContent:'center'}}>
            <Text style={{color:'#999999',fontSize:12}}>
                我是有底线的
            </Text>
        </View>);
    }
  }

  endReached(){
     if(this.state.totalList.length>8){
      this.setState({
        foot:2,
      });
      this.request_api();
    }
    
  }
  //分页请求数据

  async request_api(){

    this.get_loading().show();
    let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
    let hash = JSON.parse(value);
    //console.log(hash);
    //1.判断登录与否
    if(!!hash && hash.retCode == 1 && hash.retMsg){
      ApolloAPI.APIPersonal.getRechargeRec({
        telno:hash.retMsg,
        pageNum:this.state.pageCount
      }).done((res_json,res) => {
        //console.log("充值记录",res_json);

        this.get_loading().dismiss();
        if (res_json.retCode == '1' && res_json.supplementVOList.length>0) {
            var currentData = this.state.totalList
            for (var i = 0 ; i < res_json.supplementVOList.length; i++) {
              currentData.push(res_json.supplementVOList[i])
            }
            this.setState({
              totalList:currentData,
              foot:1,
              pageCount:this.state.pageCount+1
            })
            if(res_json.supplementVOList.length < 4){
              this.setState({foot:3})
            }
        }else if(res_json.retCode == '1' && (res_json.supplementVOList==null||res_json.supplementVOList.length==0)){
          PlateFormUtils.plateFormAlert(Platform,"提示","暂无更多数据");
          this.setState({
              foot:3
          })
        }else {
          Alert.alert('错误提示', res_json.retMsg, [{ text: '确定'}])
        }
      })
    }
      
  }
 

  componentDidMount(){
    //加载我的页面数据
    this.request_api();
  }
  
  get_loading() {
    return this.refs.loading;
  }

  render() {
    let dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.state.totalList);
    return (
      <View style={styles.container}>

        <BackNavBar  component={this}>充值记录</BackNavBar>
        {
          this.state.totalList != "" ? 
          <ListView
            dataSource={dataSource}
            enableEmptySections={true}
            renderRow={this.renderRow.bind(this)}
            onEndReached={this.endReached.bind(this)}
            renderFooter={this.renderFooter.bind(this)}
            onEndReachedThreshold={20}
          />
          :
          null
        }
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
  modalText: {
    fontSize:16,
    color:'#4d4d4d',
    alignSelf:'center'
  },
  textStyle: {
    fontSize:21,
    color:'gray'
  },
});
export default InvAppRec