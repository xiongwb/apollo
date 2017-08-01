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
import { BackNavBar,Investtextinput,Recordfinctxt,BasePage,Loading,PushLogin} from 'ApolloComponent';
import { Color, STORAGE_KEYS, COMMON_CONFIG } from 'ApolloConstant';

import Icon from 'react-native-vector-icons/FontAwesome'
var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
var full_width = Dimensions.get('window').width
var full_height = Dimensions.get('window').height

/**
 * 融资记录
 * zqf
 * 20170419
 */
export default class Coupon extends BasePage {

  constructor(props) {
      super(props);
      this.state = {
        totalList:[],
      };
  }

  componentDidMount() {
    this.request_api()
  }

  get_loading() {
    return this.refs.loading;
  }

  renderRow(rowData,sectionId) {
    let planpaydue = rowData.planpaydue!=null?StringUtils.moneyFormatData2Money(rowData.planpaydue):'0.00';
    let planpayint = rowData.planpayint!=null?StringUtils.moneyFormatData2Money(rowData.planpayint):'0.00';
    return(
      <View style={{marginTop:9}}>
        <View style={{marginHorizontal:8,paddingHorizontal:8,borderColor:'#ED5565',borderWidth:onePt,backgroundColor:'#ffffff',borderRadius:5,height:140}}>
          <View style={{flex:1,justifyContent:'center',borderBottomColor:'#dddddd',borderBottomWidth:1}}>
            <Text style={{fontSize:16,fontWeight:'bold',color:'#101010'}}>{rowData.giftname}</Text>
          </View>
          <View style={{flex:2,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}} >
            <View style={{alignItems:'center',justifyContent:'center'}}>
              <Text style={{fontSize:14,color:'#4d4d4d',marginBottom:8}}>类型</Text>
              <Text style={{fontSize:14,color:'#4d4d4d'}}>{rowData.gifttype}</Text>
            </View>
            <View style={{alignItems:'center',justifyContent:'center'}}>
              <Text style={{fontSize:14,color:'#4d4d4d',marginBottom:8}}>礼物数量</Text>
              <Text style={{fontSize:14,color:'#4d4d4d'}}>{rowData.giftnum}</Text>
            </View>
            <View style={{alignItems:'center',justifyContent:'center'}}>
              <Text style={{fontSize:14,color:'#4d4d4d',marginBottom:8}}>已使用数量</Text>
              <Text style={{fontSize:14,color:'#4d4d4d'}}>{rowData.usednum}</Text>
            </View>
            <View style={{alignItems:'center',justifyContent:'center'}}>
              <Text style={{fontSize:14,color:'#4d4d4d',marginBottom:8}}>单位价值</Text>
              <Text style={{fontSize:14,color:'#4d4d4d'}}>{rowData.unitvalue}</Text>
            </View>
          </View>
          <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderTopColor:'#dddddd',borderTopWidth:1}}>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
              <Text style={{fontSize:14,color:'#4d4d4d'}}>获赠日期：</Text>
              <Text style={{fontSize:14,color:'#4d4d4d'}}>{rowData.getdate}</Text>
            </View>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
              
              <Text style={{fontSize:14,color:'#4d4d4d'}}>{rowData.getflag}</Text>
            </View>
          </View> 
        </View>
      </View>
    )
  }

  async request_api(){
    let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
    let hash = JSON.parse(value);
    //console.log(hash);
    //1.判断登录与否
    if(!!hash && hash.retCode == 1 && hash.retMsg){
      this.get_loading().show();
      ApolloAPI.APIPersonal.getMygiftList({
        telno:hash.retMsg
      }).done((res_json,res) => {
        if (res_json.retCode == '1' && res_json.list!=null) {
          this.get_loading().dismiss();
          this.setState({
            totalList:res_json.list,
          })
        }else {
          this.get_loading().dismiss();
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
    if (this.state.totalList==null||this.state.totalList.length <= 0) {
      return (
        <View style={styles.container}>
          <BackNavBar  component={this}>我的礼包</BackNavBar>
          <View style={{justifyContent:'center',marginHorizontal:20,marginTop:20}}>
           <TouchableOpacity onPress={() => this.props.navigator.push({id:'Hiscoupon',params:{}})}>
            <View style={{justifyContent:'center',alignItems:'center',flexDirection:'row',marginHorizontal:20,marginBottom:10}}>
                <Text style={{fontSize:14, color:'#999999'}}>如要查看已过期或已使用礼包，请点击-</Text>
                <Text style={{fontSize:14, color:'#5677fc'}}>历史记录</Text>  
            </View>
           </TouchableOpacity>
            <View style={{borderRadius:8,height:full_height*0.26,justifyContent:'center',alignItems:'center',backgroundColor:'#eaeaea'}}> 
                 <Image style={{marginBottom:12}}  source={require('apollo/src/image/no_coupon.png')} />
                <Text style={{fontSize:14,color:'#999999'}}>您还没有可用的礼包</Text>
            </View>
          </View>
          <Loading ref={'loading'} />
        </View>
      )
    }else{
      let list = this.state.totalList;
      let num = 0;
      for(let i in list){
        if(list[i].isallowpay=='1'){//可还款
          num = num + 1;
        }
      }
      let dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.state.totalList);
      return (
        <View style={styles.container}>
          <BackNavBar style={{backgroundColor:'#ed5565'}} component={this}>我的礼包</BackNavBar>
          <ListView
          dataSource={dataSource}
          renderRow={this.renderRow.bind(this)}
          />
          <Loading ref={'loading'} />
        </View>
      );
    }
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

});