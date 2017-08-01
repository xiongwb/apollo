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
  AsyncStorage,
  ListView,
  Platform,
} from 'react-native';

import ApolloAPI from 'ApolloAPI';
import { PlateFormUtils, StringUtils } from 'ApolloUtils';
import { BackNavBar,Investtextinput,Recordfinctxt,BasePage,PushLogin,Loading} from 'ApolloComponent';
import { Color, STORAGE_KEYS,COMMON_CONFIG } from 'ApolloConstant';

import Icon from 'react-native-vector-icons/FontAwesome'
var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
var full_width = Dimensions.get('window').width
var full_height = Dimensions.get('window').height

/**
 * 融资记录
 * zqf
 * 20170419
 */
export default class FinancingRec extends BasePage {

	constructor(props) {
      super(props);
      this.state = {
        totalList:[],
        foot:0,
        pageCount:0,
      };
  }

  componentDidMount() {
    this.request_api()
  }

  // componentWillUnmount() {
  //   pageCount = 1
  //   firstApi = 0
  // }

  get_loading() {
    return this.refs.loading;
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
  getDigitalAgeement(finrcdid){
    this.get_loading().show();
    ApolloAPI.APIPersonal.getDigitalContract({
              rcdID:finrcdid,
              type:2,
            }).done((res_json, res) => {
              this.get_loading().dismiss();
              console.log("返回的融资电子合同是",res_json);
              if(res_json.retCode == 1){
                this.props.navigator.push({id: 'Agreement',params:{protocoltitle:"电子合同",protocolcontent:res_json.map.cont}})
              }else{
                PlateFormUtils.plateFormAlert(Platform,"错误提示","未获取到电子合同！");
              }
              
            })
  }
  renderRow(rowData,sectionId) {
    let moneyStr = StringUtils.moneyFormatData2Money(rowData.finsum);
    var status = '';
    switch (rowData.finstatus){
      case '1':
        status="正常";
        break;
      case '2':
        status="逾期";
        break;
      case '9':
        status="结清";
        break;
    }
    //let disabled = rowData.finstatus==='9'?true:false
    let findate = rowData.findate.substr(0,10);
    let expdate = rowData.expdate.substr(0,10);
    return(
      <View style={{backgroundColor:'#ffffff',marginTop:9}}>
        <View style={{marginHorizontal:8,paddingHorizontal:8,borderColor:'#dddddd',borderWidth:onePt,backgroundColor:'#ffffff',borderRadius:5,height:140}}>
          <View style={{flex:1,justifyContent:'center',borderBottomColor:'#dddddd',borderBottomWidth:1}}>
            <Text style={{fontSize:16,fontWeight:'bold',color:'#101010'}}>{rowData.prdinfo.prdname}</Text>
          </View>
          <TouchableOpacity style={{flex:2,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}} onPress={() => this.props.navigator.push({id:'FinRcdDetail',params:{data:rowData}})}>
            <View style={{justifyContent:'center'}}>
              <Text style={{fontSize:14,color:'#4d4d4d',marginBottom:8}}>融资金额</Text>
              <Text style={{fontSize:14,color:'#4d4d4d'}}>{moneyStr}</Text>
            </View>
            <View style={{justifyContent:'space-around'}}>
              <Text style={{fontSize:14,color:'#4d4d4d',marginBottom:8}}>融资日期</Text>
              <Text style={{fontSize:14,color:'#4d4d4d'}}>{findate}</Text>
            </View>
            <View style={{alignItems:'center',justifyContent:'center',height:40,width:40,borderColor:'#ED5565',borderWidth:1,borderRadius:35}}>
              <Text style={{color:'#ED5565'}}>{status}</Text>
            </View>
          </TouchableOpacity>
          <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderTopColor:'#dddddd',borderTopWidth:1}}>
            <Text style={{fontSize:10,color:'#4d4d4d',flex:2}}>到期日期:{expdate}</Text>
            <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
              <TouchableOpacity   
              onPress={()=>this.getDigitalAgeement(rowData.finrcdid)}
              style={[styles.touchContainer]}>
                  <Text style={{fontSize:10,color:'#ffffff',}}>电子合同</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this.push_login_destination('Repayment',this.props.navigator,{prdcode:rowData.prdcode,prdinfo:rowData.prdinfo,finstatus:rowData.finstatus})} >
              <View style={{alignItems:'center',justifyContent:'center',backgroundColor:'#ED5565',width:50,height:20,borderRadius:2}}>
                <Text style={{fontSize:10,color:'#ffffff',}}>还款</Text>
              </View>
            </TouchableOpacity>
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

  async request_api(){
    let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
    let hash = JSON.parse(value);
    //console.log(hash);
    //1.判断登录与否
    if(!!hash && hash.retCode == 1 && hash.retMsg){
      this.get_loading().show();
      ApolloAPI.APIPersonal.getFinRcdList({
        telno:hash.retMsg,
        pageNum:this.state.pageCount
      }).done((res_json,res) => {
        this.get_loading().dismiss();
        if (res_json.retCode == '1' && res_json.finRcdVOList.length>0) {
            var currentData = this.state.totalList
            for (var i = 0 ; i < res_json.finRcdVOList.length; i++) {
              currentData.push(res_json.finRcdVOList[i])
            }
            this.setState({
              totalList:currentData,
              foot:1,
              pageCount:this.state.pageCount+1
            })
            if(res_json.finRcdVOList.length < 4){
              this.setState({foot:3})
            }
        }else if(res_json.retCode == '1' && (res_json.finRcdVOList==null||res_json.finRcdVOList.length==0)){
          PlateFormUtils.plateFormAlert(Platform,"提示","暂无更多数据");
          this.setState({
              foot:3
          })
        }else {
          Alert.alert('错误提示', res_json.retMsg, [{ text: '确定'}])
        }
      })
    }else{
      PlateFormUtils.plateFormAlert(Platform,"错误提示","您还未登录或注册!");
      this.props.navigator.push({
        id:'Login',params:{}
      });
    }
      
  }

  render() {
      let dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.state.totalList);
      return (
        <View style={styles.container}>
          <BackNavBar style={{backgroundColor:'#ed5565'}} component={this}>融资记录</BackNavBar>
          {
          this.state.totalList == "" ? 
          null
          :
          <ListView
          dataSource={dataSource}
          enableEmptySections={true}
          renderRow={this.renderRow.bind(this)}
          onEndReached={this.endReached.bind(this)}
          renderFooter={this.renderFooter.bind(this)}
          onEndReachedThreshold={20}
        />
        }
          <Loading ref={'loading'} />
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.backgroundColor,
  },
  textStyle: {
    fontSize:21,
    color:'gray'
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
});