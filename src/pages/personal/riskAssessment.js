/**
 * <Text style={{fontSize:12,color:'#4d4d4d',marginLeft:31,marginRight:12,marginVertical:10}}>为保障投资人购买合适的产品，根据投资人风险承受能力评估结果，将投资人风险承受能力由低到高分为保守型、稳健型、平衡型、成长型、进取型五种类型</Text>
            <Text style={{fontSize:12,color:'#4d4d4d',marginLeft:31,marginRight:12,}}>为保障投资人购买合适的产品，根据投资人风险承受能力评估结果，将投资人风险承受能力由低到高分为保守型、稳健型、平衡型、成长型、进取型五种类型</Text>
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
  Dimensions,
  ScrollView,
  SegmentedControlIOS,
  Switch,
  ART,
  PixelRatio,
  ListView,
  AsyncStorage,
  Platform
} from 'react-native';
import { Color, COMMON_CONFIG, STORAGE_KEYS } from 'ApolloConstant';
import {
  BasePage,
  BackNavBar,
  Moretxtin,
} from 'ApolloComponent'
import {
  COMMON_STYLES,
} from 'ApolloConstant'
import{PlateFormUtils} from 'ApolloUtils';
import ApolloAPI from 'ApolloAPI';

/**
 * 风险评估
 * zqf
 * 2017/04/12
 */
var full_width = Dimensions.get('window').width;
var full_height = Dimensions.get('window').height;


class RiskAssessment extends BasePage {
  constructor(props){
    super(props)
    this.state=({
      risktemptype:1,
      risktempname:"",
      risktempscore:"",
      risktempContent:"",
      riskList:"",
      risktempId:""
    })
  }

  request_api(){
      //根据租户获取模板类型、描述等
        const { perInfo } = this.props;
        if(perInfo){
            //获取风险评估模板
            ApolloAPI.APIPersonal.getRiskTemp({
              //客户类型
              risktemptype:perInfo.custype,
              //租户号
              tenantno:COMMON_CONFIG.tenantNo
              
            }).done((res_json, res)=>{
                    if(res_json.retCode === 1){
                      //收到后显示出来
                      console.log('风险评估',res_json);
                      this.setState({
                        risktempname:res_json.risktempname,
                        risktempscore:res_json.risktempscore,
                        risktemptype:res_json.risktemptype,
                        risktempContent:res_json.remarks,
                        risktempId:res_json.risktempid,
                      })
                      console.log(res_json);
                    }else{
                      PlateFormUtils.plateFormAlert(Platform,'错误提示',"风险评估模板信息未获得!");
                    }
            })
        }
  }
  //跳转到风险评估问题页面
  toRistQue(){
    //是否判断登录超时
    ApolloAPI.APILogin.getloginState({
      tenantNo:COMMON_CONFIG.tenantNo
    }).done((res_json, res) => {
            if(res_json.retCode == 1){
              //登录后请求数据
              this.props.navigator.push({ id: 'RiskTestQuestion',params:{risktempId:this.state.risktempId}})
            }else{
              //跳转登录页面
              PlateFormUtils.plateFormAlert(Platform,"错误提示","您还未登录或注册!");
              this.props.navigator.push({
                id:'Login',params:{}
              });
          }
    })
   
  }
  
  componentWillMount(){
    this.request_api();
  }
  render() {
    return (
      <View style={styles.root}>
        <BackNavBar component={this}>风险评估</BackNavBar>
          <View style={{justifyContent:'center'}}>
            <View style={styles.topView}>
              <Image style={{marginBottom:12,}} source={require('apollo/src/image/risk_assessment01.png')}/>
              <Text style={styles.topFont}>1分钟了解您的风险承受能力</Text>
              <Text style={styles.topFont}>获得更好的投资服务、更科学的资产配置建议</Text>
              <TouchableOpacity onPress={() =>  this.toRistQue()}>
                <View style={styles.topTouchable}>
                <Text style={{fontSize:18,color:'#ffffff'}}>开始评估</Text>      
                </View>
              </TouchableOpacity> 
              <View style={styles.topDown}>
                <Text style={{fontSize:12,color:'#4d4d4d'}}>
                如果不评估，您的风险承受能力将默认为
                <Text style={{color:'#ed5565'}}>安益型</Text>
                </Text>
              </View> 
            </View>
            <View style={styles.downView}>
              <View style={{flexDirection:'row',marginTop:24,marginLeft:10,marginRight:10}}>
                  <View style={{alignItems:'center'}}>
                      <Image style={{height:12,width:12,}} source={require('apollo/src/image/prompt.png')}/>
                  </View>
                  <View style={{alignItems:'center',marginLeft:3,marginRight:10}}>
                      <Text style={{fontSize:12,color:'#4d4d4d'}}>{this.state.risktempContent}</Text>
                  </View>
              </View>
            
            </View>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  root: {
    backgroundColor: '#dddddd',//页面的布局和颜色
    flex: 1,
  },
  topView:
  {
      height:full_height*0.45,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:'#ffffff'
    },
topFont:
{
    fontSize:14,
    color:'#4d4d4d'
},
topTouchable:
{
    height:44, 
    width:full_width*0.9,
    marginHorizontal:12,
    justifyContent: "center",
    alignItems:'center',
    backgroundColor:'#ed5565', 
    borderRadius: 8,marginVertical:12
},
topDown:
{
    flexDirection:'row', 
    justifyContent:'center',
    alignItems:'center'
},
downView:
{
    marginTop:6,
    backgroundColor:'#ffffff',
    height:full_height*0.5
}
});

export default RiskAssessment