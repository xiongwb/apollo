
/**
 * 常见问题
 * zqf
 * 2017/4/21
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
  AsyncStorage,
  Dimensions
} from 'react-native';
import {
  BasePage,
  BackNavBar,
  Moretxtin,
  Platform,
  Faquestiontxt
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
var full_width = Dimensions.get('window').width;
var full_height = Dimensions.get('window').height;

class Faquestions extends BasePage {
  constructor(props){
    super(props)
    this.state = ({
      
    })
  }

  remove_data() {
    ApolloAPI.APILogin.signOut(
      ).done((res_data, res) => {
        if(res_data.retCode == 1){
      }else{
          this.get_loading().dismiss();
          Alert.alert('错误提示', res_data.retMsg, [{ text: '确定'}])
        }
      }) 
  }

  
 about_outs=() =>{
   this.props.navigator.push({
     id:'AboutOur',params:{}
   })
 }
  render() {
    return (
    <View style={styles.root}>
      <BackNavBar  component={this}
       rightContent={
             <View >
                <TouchableOpacity onPress={()=>this.props.navigator.pop()}>
                 <Image source={require('apollo/src/image/search.png')}/>
                </TouchableOpacity>
              </View>
             }
      >常见问题</BackNavBar>
      <View style={styles.input_box}>
       <View style={{flexDirection:'row',height:44,borderBottomWidth:1,borderBottomColor:'#e5e5e5',justifyContent:'flex-start',alignItems:'center',}}>
          <Text style={{fontSize:12,color:'#ed5565',marginLeft:12}}>热门问题</Text>
       </View>
          <Faquestiontxt ImageLeft1={2} fontSize1={16} color1='#4d4d4d' invite_words='充值遇到问题？' borderBottomWidth1={1} 
                         ImageRight={require('apollo/src/image/gray_right.png')} onPressButton={this.about_outs}/>
          <Faquestiontxt ImageLeft1={2} fontSize1={16} color1='#4d4d4d' invite_words='提现多久可以到账？' borderBottomWidth1={1} 
                         ImageRight={require('apollo/src/image/gray_right.png')} onPressButton={this.about_outs}/>
          <Faquestiontxt ImageLeft1={2} fontSize1={16} color1='#4d4d4d' invite_words='体验金有效期是多久，能提现吗？' borderBottomWidth1={1} 
                         ImageRight={require('apollo/src/image/gray_right.png')} onPressButton={this.about_outs}/>
          <Faquestiontxt ImageLeft1={2} fontSize1={16} color1='#4d4d4d' invite_words='投资后可以撤回吗？' borderBottomWidth1={1} 
                         ImageRight={require('apollo/src/image/gray_right.png')} onPressButton={this.about_outs}/>
          <Faquestiontxt ImageLeft1={2} fontSize1={16} color1='#4d4d4d' invite_words='什么是前金币？' borderBottomWidth1={1} 
                         ImageRight={require('apollo/src/image/gray_right.png')} onPressButton={this.about_outs}/>
          <Faquestiontxt ImageLeft1={2} fontSize1={16} color1='#4d4d4d' invite_words='投资到期后资金会到那' borderBottomWidth1={1} 
                         ImageRight={require('apollo/src/image/gray_right.png')} onPressButton={this.about_outs}/>
          <Faquestiontxt ImageLeft1={2} fontSize1={16} color1='#4d4d4d' invite_words='利率是怎么计算的' borderBottomWidth1={0} 
                         ImageRight={require('apollo/src/image/gray_right.png')} onPressButton={this.about_outs}/>
          <View style={{height:full_height*0.35,borderTopColor:'#dddddd',borderTopWidth:1,}}>
             <View  style={{flexDirection:'row',justifyContent:'center',alignItems:'flex-start',marginTop:30,}}>
              <View style={{width:full_width/4.4,justifyContent:'center',alignItems:'center'}}>
                <Image source={require('apollo/src/image/person.png')}/>
                <Text style={{fontSize:14,color:'#4d4d4d',marginTop:12}}>账户问题</Text>
              </View>
              <View style={{width:full_width/4.4,justifyContent:'center',alignItems:'center'}}>
                <Image source={require('apollo/src/image/investment.png')}/>
                <Text style={{fontSize:14,color:'#4d4d4d',marginTop:12}}>投资问题</Text>
              </View>
              <View style={{width:full_width/4.4,justifyContent:'center',alignItems:'center'}}>
                <Image source={require('apollo/src/image/safe.png')}/>
                <Text style={{fontSize:14,color:'#4d4d4d',marginTop:12}}>安全问题</Text>
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

input_box:{
   borderColor:'#e5e5e5',
   backgroundColor:'#ffffff',
   marginBottom:12,
  },

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

export default Faquestions