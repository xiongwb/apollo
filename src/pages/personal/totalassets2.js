/**
 * 总资产
 * zgx
 */
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableOpacity,
  Image,
  Dimensions,
  ART,
  Alert,
  AsyncStorage,
  ScrollView,
  Platform,
  PixelRatio,
} from 'react-native';

import {
  BasePage,
  PushLogin,
  BackNavBar,
  Loading
} from 'ApolloComponent'
import {
  EVENT_EMITTER_CONST,
  STORAGE_KEYS,
  COMMON_STYLES,
  Color,
  COMMON_CONFIG
} from 'ApolloConstant'
import { StringUtils } from 'ApolloUtils';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import ApolloAPI from 'ApolloAPI';

var full_width = Dimensions.get('window').width;
var full_height = Dimensions.get('window').height;
/*viewWidth指的是顶部文字view的宽度
  宽度=屏幕宽度-左边距-头像宽度-间距-间距-箭头宽度-右边距
 */
const onePt =1 / PixelRatio.get();
let viewWidth = full_width-15-75-10-10-20-15;

let common_color = '#101010';
let common_fontsize = 13;
let common_color3 = '#ff7355';
let common_fontsize3 = 20;
let common_color4 = '#808080';
let common_fontsize4 =12;



const {Surface, Shape, Path} = ART;  

class Totalassets2 extends BasePage {
    constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state={
        totalassets:'0.00',
        restMoney:'0.00',
        investedsum:'0.00',
        uncollected:'0.00',
        candrawsum:'0.00',
        cannotdrawsum:'0.00',
        arrivalsum:'0.00',
    }
  }
get_loading() {
    return this.refs.loading;
  }
 request_api=()=>{
    this.get_loading().show();
     ApolloAPI.APILogin.getloginState({
                tenantNo:COMMON_CONFIG.tenantNo
              }).done(async (res_json, res) => {
                  
                      if(res_json.retCode == 1){
                        let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
                            let hash = JSON.parse(value);
                            console.log(hash);
                            if(!!hash){
                                ApolloAPI.APIPersonal.getTotalassets2({
                                //通过参数手机号获取总资产相关信息，目前手机号
                                // telno:this.props.Personal.state.phoneNum
                                telno:hash.retMsg
                                }).done((res_json, res)=>{
                                if(res_json.retCode === 1){
                                    this.get_loading().dismiss();
                                    console.log("获取回的信息",res_json),
                                    //获取回的信息填满表格,倪
                                    this.setState({
                                        totalassets:res_json.acctnoEntity.totasset,
                                        restMoney:res_json.acctnoEntity.availablesum,
                                        investedsum:res_json.acctnoEntity.investedsum,
                                        uncollected:res_json.acctnoEntity.toearnsum,
                                        candrawsum:res_json.acctnoEntity.candrawsum,
                                        cannotdrawsum:res_json.acctnoEntity.cannotdrawsum,
                                        arrivalsum:res_json.acctnoEntity.arrivalsum,
                                    })
                                
                                }else{
                                     this.get_loading().dismiss();
                                    PlateFormUtils.plateFormAlert(Platform,'错误提示',"总资产信息未获得!");
                                }
                            })
                        }}else{
                             this.get_loading().dismiss();
                              PlateFormUtils.plateFormAlert(Platform,"错误提示","您还未登录或注册!");
                              this.props.navigator.push({
                                id:'Login',params:{}
                              });
                            }});
  }

  componentDidMount(){
    //加载我的页面数据
       this.request_api();
  }

  render() {
     const path = new Path()
            .moveTo(30,1)
            .arc(0,59,25)
            .arc(0,-59,25)
            .close();
    return(
      <View style={styles.root}>
        <BackNavBar  component={this}>总资产</BackNavBar>
        <View style={styles.topArea}>
            <View style={styles.topAreaContainer}>
                <AnimatedCircularProgress
                    size={120}
                    width={10}
                    fill={100}
                    tintColor="#ED5565"
                    rotation={0}
                    backgroundColor="#DDDDDD">
                    {
                    (fill) => (
                    <View style={styles.circleContent}>
                        <Text style={{color:'#666666',fontSize:12,alignSelf:'center'}}>
                            总资产(元)
                        </Text>
                        <Text style={{color:'#000000',fontSize:14,alignSelf:'center'}}>
                            {StringUtils.moneyFormatData2Money(this.state.totalassets)}
                        </Text>
                    </View>
                    )
                    }
                </AnimatedCircularProgress>
            </View>
            <View style={styles.topItemContainer1}>
                <View style={styles.topItemContainer}>
                    <AnimatedCircularProgress
                        size={10}
                        width={5}
                        fill={100}
                        tintColor="#F44336"
                        rotation={0}
                        backgroundColor="#FFF">
                    </AnimatedCircularProgress>
                    <View style={{marginLeft:3}}>
                        <Text style={{color:'#666666',fontSize:12,alignSelf:'center'}}>
                            可用余额
                        </Text>
                    </View>
                </View>

                 <View style={styles.topItemContainer}>
                    <AnimatedCircularProgress
                        size={10}
                        width={5}
                        fill={100}
                        tintColor="#2196F3"
                        rotation={0}
                        backgroundColor="#FFF">
                    </AnimatedCircularProgress>
                    <View style={{marginLeft:3}}>
                        <Text style={{color:'#666666',fontSize:12,alignSelf:'center'}}>
                            已投金额
                        </Text>
                    </View>
                </View>

                 <View style={styles.topItemContainer}>
                    <AnimatedCircularProgress
                        size={10}
                        width={5}
                        fill={100}
                        tintColor="#FFEB3B"
                        rotation={0}
                        backgroundColor="#FFF">
                    </AnimatedCircularProgress>
                    <View style={{marginLeft:3}}>
                        <Text style={{color:'#666666',fontSize:12,alignSelf:'center'}}>
                            待收益金额
                        </Text>
                    </View>
                </View>
            </View>
            <View style={[styles.topItemContainer1,{marginTop:10}]}>
                <View style={styles.topItemContainer}>
                    <AnimatedCircularProgress
                        size={10}
                        width={5}
                        fill={100}
                        tintColor="#4CAF50"
                        rotation={0}
                        backgroundColor="#FFF">
                    </AnimatedCircularProgress>
                    <View style={{marginLeft:3}}>
                        <Text style={{color:'#666666',fontSize:12,alignSelf:'center'}}>
                            可提金额
                        </Text>
                    </View>
                </View>

                 <View style={styles.topItemContainer}>
                    <AnimatedCircularProgress
                        size={10}
                        width={5}
                        fill={100}
                        tintColor="#FF9800"
                        rotation={0}
                        backgroundColor="#FFF">
                    </AnimatedCircularProgress>
                    <View style={{marginLeft:3}}>
                        <Text style={{color:'#666666',fontSize:12,alignSelf:'center'}}>
                            在途金额
                        </Text>
                    </View>
                </View>

                 <View style={styles.topItemContainer}>
                    <AnimatedCircularProgress
                        size={10}
                        width={5}
                        fill={100}
                        tintColor="#49bbde"
                        rotation={0}
                        backgroundColor="#FFF">
                    </AnimatedCircularProgress>
                    <View style={{marginLeft:3}}>
                        <Text style={{color:'#666666',fontSize:12,alignSelf:'center'}}>
                            已收益金额
                        </Text>
                    </View>
                </View>
            </View>
        </View>
         <ScrollView style={[styles.topArea,{marginTop:10}]} showsVerticalScrollIndicator={false}>
            <View style={styles.itemBox}>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> 可用余额:  </Text>
                <Text style={{color:'#F44336',fontSize:16,alignSelf:'center'}}> {StringUtils.moneyFormatData2Money(this.state.restMoney)}  </Text>
            </View>
            <View style={styles.itemBox}>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> 已投金额:  </Text>
                <Text style={{color:'#2196F3',fontSize:16,alignSelf:'center'}}> {StringUtils.moneyFormatData2Money(this.state.investedsum)} </Text>
            </View>
            <View style={styles.itemBox}>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> 待收益金额:  </Text>
                <Text style={{color:'#FFEB3B',fontSize:16,alignSelf:'center'}}> {StringUtils.moneyFormatData2Money(this.state.uncollected)}  </Text>
            </View>
            <View style={styles.itemBox}>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> 可提金额:  </Text>
                <Text style={{color:'#4CAF50',fontSize:16,alignSelf:'center'}}> {StringUtils.moneyFormatData2Money(this.state.candrawsum)}  </Text>
            </View>
            <View style={styles.itemBox}>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> 在途金额:  </Text>
                <Text style={{color:'#FF9800',fontSize:16,alignSelf:'center'}}> {StringUtils.moneyFormatData2Money(this.state.cannotdrawsum)} </Text>
            </View>
            <View style={styles.itemBox}>
                <Text style={{color:'#000000',fontSize:16,alignSelf:'center'}}> 已收益金额:  </Text>
                <Text style={{color:'#49bbde',fontSize:16,alignSelf:'center'}}> {StringUtils.moneyFormatData2Money(this.state.arrivalsum)}  </Text>
            </View>
         </ScrollView>

         <Loading ref="loading" />
      </View>
  
    )}
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: COMMON_STYLES.MAIN_BACKGROUND_COLOR,
    width:full_width,
    height:full_height,
  },
  circleContent:{
    backgroundColor:'transparent',
    ...Platform.select({
    android:{
      marginTop:43,marginLeft:27
    },
    ios:{
      marginTop:45,marginLeft:30
    }
  }),
    position:'absolute',
  },
  topArea:{
      height: 0.36 * full_height,
      width:full_width,
      backgroundColor:'#fff'
  },
  topAreaContainer:{
      marginTop:30,
      justifyContent:'center',
      alignItems:'center'
  },
  topItemContainer1:{
      justifyContent:'space-around',
      flexDirection:'row',
      marginTop:30
  },
  topItemContainer:{
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center'
  },
  itemBox:{
      borderBottomColor:'#f2f2f2',
      borderBottomWidth:onePt,
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
      height:50,
      marginLeft:15,
      marginRight:15
  }


});

export default Totalassets2