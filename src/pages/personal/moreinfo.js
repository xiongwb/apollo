
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  AsyncStorage,
  Platform
} from 'react-native';
import {
  BasePage,
  BackNavBar,
  Moretxtin,
} from 'ApolloComponent'
import {
  Color,
  COMMON_STYLES,
  EVENT_EMITTER_CONST,
  STORAGE_KEYS,
} from 'ApolloConstant'
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import ApolloAPI from 'ApolloAPI';
import { PlateFormUtils } from 'ApolloUtils';

/**
 * 更多
 */

class Moreinfo extends BasePage {
  constructor(props){
    super(props)
    this.state = ({
      is_login:false
    })
  }

 about_outs=() =>{
   this.props.navigator.push({
     id:'AboutOur',params:{}
   })
 }
 fa_questions=()=>{
   this.props.navigator.push({
     id:'Faquestions',params:{}
   })
 }
 none(){
  let tips = "提示";
  let showContent = "已经是最新版本了!";
  PlateFormUtils.plateFormAlert(Platform,tips,showContent);
 }
  render() {
    return (
    <View style={styles.root}>
      <BackNavBar  component={this}>更多</BackNavBar>
      <View style={styles.input_box}>
          <Moretxtin ImageLeft={require('apollo/src/image/invite.png')} invite_words='邀请好友' borderBottomWidth1={1} ImageRight={require('apollo/src/image/arrow_right.png')} onPressButton={this.none.bind(this)}/>
          <Moretxtin ImageLeft={require('apollo/src/image/activity.png')}  invite_words='热门活动' borderBottomWidth1={0} ImageRight={require('apollo/src/image/arrow_right.png')} onPressButton={this.none.bind(this)} />
      </View>
      <View style={styles.input_box}>
        <Moretxtin ImageLeft={require('apollo/src/image/about_us.png')} invite_words='关于我们' borderBottomWidth1={1} ImageRight={require('apollo/src/image/arrow_right.png')} onPressButton={this.about_outs.bind(this)}/>
        <Moretxtin ImageLeft={require('apollo/src/image/guide.png')}  invite_words='新手指引' borderBottomWidth1={1} ImageRight={require('apollo/src/image/arrow_right.png')} onPressButton={this.none.bind(this)}/>
     
        <Moretxtin ImageLeft={require('apollo/src/image/problem.png')}  invite_words='常见问题' borderBottomWidth1={1} ImageRight={require('apollo/src/image/arrow_right.png')}  onPressButton={this.fa_questions.bind(this)}/>
        
        <Moretxtin ImageLeft={require('apollo/src/image/custom_service.png')} invite_words='客服电话' borderBottomWidth1={1} ImageRight={require('apollo/src/image/arrow_right.png')} onPressButton={this.none.bind(this)}/>
        <Moretxtin ImageLeft={require('apollo/src/image/score.png')}  invite_words='欢迎评分' borderBottomWidth1={0} ImageRight={require('apollo/src/image/arrow_right.png')} onPressButton={this.none.bind(this)}/>
     
      </View>
      
      <View style={styles.input_box}>
        <Moretxtin ImageLeft={require('apollo/src/image/version.png')} invite_words='当前版本' borderBottomWidth1={0} onPressButton={this.none.bind(this)}/>
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

input_box:{
  // <Moretxtin  invite_words='退出登录' borderBottomWidth1={0}/>
   borderColor:'#e5e5e5',
   backgroundColor:'#ffffff',
  marginBottom:12,
  },

// input_box_two:{
//    borderWidth:1,
//    borderColor:'#e5e5e5',
//    backgroundColor:'#ffffff',
//   },


  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.backgroundColor,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default Moreinfo