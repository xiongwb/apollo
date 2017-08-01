/**
 * 转让申请记录
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
import { StringUtils,PlateFormUtils } from 'ApolloUtils';
import ApolloAPI from 'ApolloAPI';
var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
var full_width = Dimensions.get('window').width;
var full_height = Dimensions.get('window').height;

class AssignAppRec extends BasePage {
 	constructor(props) {
        super(props);

        this.state = {
          dataSource:[],
          prdinfo:''
      };
    }
    
    returnItems(dataSource){
      let recomendContent = dataSource;
      console.log("转让记录是",recomendContent);
      // var appstatus = '';
      // switch (recomendContent.appstatus){
      //   case '0':
      //     appstatus="未审核";
      //     break;
      //   case '1':
      //     appstatus="已审核发布";
      //     break;
      //   case '2':
      //     appstatus="已驳回";
      //     break;
      //   case '3':
      //     appstatus="已成立";
      //     break;
      //   case '4':
      //     appstatus="已流标";
      //     break;
      // }      
      return(
        <View style={styles.itemWrapper}>
            <View style={styles.itemBox}>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> 申请日期:  </Text>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> {recomendContent.appdate}  </Text>
            </View>
            <View style={styles.itemBox}>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> 产品名称:  </Text>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> {recomendContent.tranprdname}  </Text>
            </View>
            <View style={styles.itemBox}>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> 申请状态:  </Text>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> {recomendContent.appstatus}  </Text>
            </View>
            <View style={styles.itemBox}>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> 审核意见:  </Text>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> {recomendContent.chknote}  </Text>
            </View>
            <View style={styles.itemBox}>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> 发布日期:  </Text>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> {recomendContent.issuedate}  </Text>
            </View>
            <View style={styles.itemBox}>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> 成立日期:  </Text>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> {recomendContent.transeffdate}  </Text>
            </View>
        </View>
      )

  }

  //请求数据
  async request_api() {
    this.get_loading().show()
    let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
      let hash = JSON.parse(value);//json转字符串
        if (!!hash && !!hash.retMsg && hash.retCode==1) {
           //console.log("转让申请的手机号是",hash.retMsg);
            ApolloAPI.APIPersonal.getAssignRec({
              telNo:hash.retMsg,
            }).done((res_json, res)=>{
              this.get_loading().dismiss()
              //console.log("转让申请记录为",res_json);
                this.setState({
                    dataSource:res_json
                })
              })}
  }

  componentDidMount(){
    //加载我的页面数据
    //this.request_api();
  }

  get_loading() {
    return this.refs.loading;
  }

  render() {
    return (
      <View style={styles.container}>
        <BackNavBar  component={this}>转让申请进度</BackNavBar>
        <ScrollView style={{flex:1,marginTop:10,height:full_height}} showsVerticalScrollIndicator={false}>
         {
          this.props.hasContent == true ? 
          <View>
             {this.returnItems(this.props.dataSource)}
          </View>
          :
          <View  style={{justifyContent:'center',alignItems:'center',marginTop:10,backgroundColor:'#fff',height:0.8 * full_height}}>
              <Text style={styles.textStyle}>您还没有转让申请哦！</Text>
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
  modalText: {
    fontSize:14,
    color:'#4d4d4d',
    alignSelf:'center'
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
    disabled:{
        backgroundColor:'#cccccc'
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
export default AssignAppRec