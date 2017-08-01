/**
 * 融资申请记录
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
          dataSource:[],
          prdinfo:''
      };
    }
     
  

    returnItems1(dataSource){
    let recomendContent = dataSource;
    if(recomendContent.retCode == 1){
        return(
          <View style={styles.itemWrapper}>
            <View style={styles.itemBox}>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> 申请日期:  </Text>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> {recomendContent.applydate}  </Text>
            </View>
            <View style={styles.itemBox}>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> 贷款产品:  </Text>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> {recomendContent.loanprod}  </Text>
            </View>
            <View style={styles.itemBox}>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> 期望融资金额:  </Text>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> {StringUtils.moneyFormatData2Money(recomendContent.expfinsum)}  </Text>
            </View>
            <View style={styles.itemBox}>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> 融资期限:  </Text>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> {recomendContent.finterm}  </Text>
            </View>
            <View style={styles.itemBox}>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> 申请状态:  </Text>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> {recomendContent.appsta}  </Text>
            </View>
          </View>
        )
    }

  }

  //请求数据
  // request_api() {
  //   this.get_loading().show();
  //   AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN, (error, value)=>{
  //     let hash = JSON.parse(value);//json转字符串
  //      if (!!hash && !!hash.retMsg && hash.retCode==1) {
  //          console.log(hash.retMsg);
  //           ApolloAPI.APIPersonal.getInvAppRcd({
  //             telNo:hash.retMsg,
  //           }).done((res_json, res)=>{
  //               this.get_loading().dismiss();
  //               console.log("融资申请记录",res_json);
  //               this.setState({
  //                   dataSource:res_json
  //               })
  //             }
  //           )
  //       }
  //   });
  //  }

  componentDidMount(){
    //加载我的页面数据
    //this.request_api();
  }

  get_loading() {
    return this.refs.loading;
  }


  render() {
    const { prdinfo }=this.state
    return (
      <View style={styles.container}>

        <BackNavBar  component={this}>融资申请进度</BackNavBar>
        <ScrollView style={{flex:1,marginTop:10,height:full_height}} showsVerticalScrollIndicator={false}>
          {
          this.props.hasContent == true ? 
          <View>
             {this.returnItems1(this.props.dataSource)}
          </View>
          :
          <View  style={{justifyContent:'center',alignItems:'center',marginTop:10,backgroundColor:'#fff',height:0.8 * full_height}}>
              <Text style={styles.textStyle}>您还没有融资申请哦！</Text>
          </View>
         } 
        </ScrollView>
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
    // marginLeft:15,
    // marginRight:15,
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
  itemBox:{
      borderBottomColor:'#f2f2f2',
      borderBottomWidth:onePt,
      flexDirection:'row',
      
      alignItems:'center',
      height:50,
      marginLeft:15,
      marginRight:15
  }
});
export default InvAppRec