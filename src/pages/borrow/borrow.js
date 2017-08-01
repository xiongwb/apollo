/**
 * 借款dash
 * zgx
 */
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PixelRatio,
  Dimensions,
  TouchableOpacity,
  Image,
  ART,
  Platform
} from 'react-native';

import {
  PushLogin,
  BasePage,
  Loading
} from 'ApolloComponent';
import {
  PlateFormUtils,
} from 'ApolloUtils';
import { Color,EVENT_EMITTER_CONST,COMMON_CONFIG} from 'ApolloConstant';
import { NavBar } from 'ApolloComponent';
import SwiperNative from 'react-native-swiper';
import ApolloAPI from 'ApolloAPI';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'
var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
var full_width = Dimensions.get('window').width;
var full_height = Dimensions.get('window').height;

let datas = []
datas.push({photoUrl: '../../image/borrowAds3.png'})
let url = {
  '../../image/borrowAds3.png': require('../../image/borrowAds3.png'),
}
const {Surface, Shape, Path,} = ART;  

class Borrow extends BasePage {
  constructor(props) {
    super(props);
    this.state = {
      title:'',
      content:''
    };
  }
  request_api(){
    this.get_loading().show();
    //登录后请求数据
    ApolloAPI.APIBorrow.getFinAdvertise({
      tenantNo:COMMON_CONFIG.tenantNo
    }).done((res_json, res) => {
            this.get_loading().dismiss();
            if(res_json.retCode == 1){
              this.setState({title:res_json.model.title,content:res_json.model.content})
            }else{
              let tips = "错误提示";
              let showContent = res_json.retMsg;
              PlateFormUtils.plateFormAlert(Platform,tips,showContent);
          }
    })
      
  }
  apply(){
     this.get_loading().show();
    //检查登录状态
    ApolloAPI.APILogin.getloginState({
          tenantNo:COMMON_CONFIG.tenantNo
        }).done((res_json, res) => {
                this.get_loading().dismiss();
                if(res_json.retCode == 1){
                  //登录后请求数据
                   this.props.navigator.push({id: 'Apply'})
                }else{
                 //跳转登录页面
                  PlateFormUtils.plateFormAlert(Platform,"错误提示","您还未登录或注册!");
                  this.props.navigator.push({
                    id:'Login',params:{}
                  });
              }
    })
  }

  componentDidMount(){
    //this.request_api();
    this.listener1 = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.DIDDASHSUCCESS,(value)=>{
      // 接受到通知后的处理
      if(value == "Borrow"){
         this.request_api();
      }
    });
     
}

  get_loading() {
    return this.refs.loading;
  }

  componentWillUnmount(){
    // 移除 一定要写
    this.listener1.remove();
  }
  renderImg () {
    let imageViews = [];
    for (var i = 0;i < datas.length;i++) {
      imageViews.push(
          <Image key={i} style={{height: 0.44 * full_height,width: full_width}} source={url[datas[i].photoUrl]} />
      )
    }
    return imageViews
  }

  render() {
     const path = new Path()
        .moveTo(45,1)
        .arc(0,89,25)
        .arc(0,-89,25)
        .close();
    return (
      <View style={styles.container}>
       <NavBar
          backgroundColor={'#ED5565'}
          width = {full_width}
          titleContent={<Text style={{color: "#fff", fontSize: 18}}>借款项目</Text>}
          />
        <SwiperNative
        autoplay={false}
        height={0.44 * full_height}
        showsPagination={false}
        index={0}
      //   dot={<View style={styles.dot} />}
      //  activeDot={<View style={styles.activeDot} />}
        >
        {this.renderImg()}
        </SwiperNative>
        <View style={styles.fontContainer}>
          <View style={styles.perFontContainer}>
            <Text style={styles.perFont}>{this.state.title}</Text>
          </View>
          <View style={styles.percontFontContainer}>
            <Text style={styles.percontFont}>       {this.state.content}</Text>
          </View>
        </View>
        <View style={styles.applyContainer}>
          <TouchableOpacity onPress={() =>   this.props.navigator.push({id: 'Apply'})}>
            <ART.Surface width={90} height={90}>
              <ART.Shape d={path} stroke="#000000" fill="#ED5565" strokeWidth={0}/>
            </ART.Surface>
            <View style={styles.applyText}>
              <Text style={{fontSize:15,color:'#fff',fontWeight:'bold'}}>立 即</Text>
              <Text style={{fontSize:15,color:'#fff',marginTop:4,fontWeight:'bold'}}>申 请</Text>
            </View>
          </TouchableOpacity>
        </View>
         <Loading ref="loading" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Color.backgroundColor,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  dot: {
    backgroundColor:'#ffffff',
    width: 8, 
    height: 8,
    borderRadius: 4, 
    marginLeft: 3, 
    marginRight: 3, 
    marginTop: 3, 
    marginBottom: 3,
  },
  activeDot: {
    backgroundColor: '#dddddd', 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    marginLeft: 3, 
    marginRight: 3, 
    marginTop: 3, 
    marginBottom: 3,
  },
  fontContainer:{
    width:full_width,
    height: 0.22 * full_height,
    backgroundColor: '#fff',
  },
  perFontContainer:{
    width:full_width,
    height: 0.13 * full_height,
    justifyContent: 'center',
    alignItems:'center'
  },
  perFont:{
    color: "#757575",
    fontSize:24,
    alignItems:'center'
  },
  percontFontContainer: {
    marginLeft:13,
    marginRight:13,
  },
  percontFont:{
    color: "#757575",
    fontSize:13,
    alignItems:'center',
  },
  applyContainer: {
    flex:1,
    width:full_width,
    backgroundColor:'#fff',
    justifyContent: "center",
    alignItems:"center",
  },
  applyText: {
    position:'absolute', 
    marginTop:25,
    marginLeft:28.5,
    backgroundColor:'transparent'
  }
});

export default Borrow