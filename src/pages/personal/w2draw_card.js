import React from 'react'

import {
  Dimensions,
  Text,
  Image,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  AsyncStorage,
  TextInput
} from 'react-native'
import {
  BasePage,
  BackNavBar,
  NavigatorUtils,
  Logintxtin,

} from 'ApolloComponent'
import {
  EVENT_EMITTER_CONST,
  STORAGE_KEYS,
} from 'ApolloConstant'


var full_height = Dimensions.get('window').height
var full_width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  root: {
   backgroundColor: '#dddddd',//页面的布局和颜色
    flex: 1,
  },

  input_box: {
    height: 90,
   width: full_width,
  //  marginHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    // borderColor: 'red',
    borderColor: '#e5e5e5',
    //backgroundColor: '#ffffff',
    backgroundColor: 'white',
    borderWidth: 1,
  //  borderRadius: 2,
  },

  input_money: {
    height: 45,
   width: full_width,
    marginTop: 20,
    flexDirection: 'row',
    borderColor: '#e5e5e5',
    backgroundColor: 'white',
    borderWidth: 1,
  },

  // input_withdraw:{
  // // <Moretxtin  invite_words='退出登录' borderBottomWidth1={0}/>
  //  borderColor:'#e5e5e5',
  //  backgroundColor:'#ffffff',
  // marginBottom:12,
  // },

});

/**
*  提现绑卡页面
*  zqf
*2017-3-21
*/
class W2drawcard extends BasePage {
  render() {

    return (
      <View style={styles.root}>
        <BackNavBar
          component={this}>提现</BackNavBar>
        <View style={styles.input_box}>

          <View style={{flexDirection:'row',flex:1, justifyContent:'center',backgroundColor:'#55edb5',marginHorizontal:12}}>
           <View style={{flexDirection:'row',flex:0.7, justifyContent:'center',marginVertical:16,}}>
             <Image source={require('apollo/src/image/wbank_card.png')} style={{width:80,height:50}}/>
           </View>
           <View style={{flex:2, justifyContent:'center',}}>
              <Text style={{fontSize:20,color:'#4d4d4d',marginLeft:16,marginTop:12}}>中国建设银行</Text>
              <Text style={{fontSize:16,color:'#4d4d4d',marginLeft:16,marginTop:12}}>6227 0008 4090 6708 005</Text>
           </View>
            <View style={{width:50,height:50,justifyContent:'center',marginVertical:16,}}>
               <TouchableOpacity onPress={() =>  this.props.navigator.push({ id: 'Waddcard' })}>
                  <Image source={require('apollo/src/image/arrow_right.png')} style={{backgroundColor:'transparent', marginLeft:18}}/>
                </TouchableOpacity>
            </View>
          </View>
        </View>
         <View style={{justifyContent:'center',marginLeft:24,marginTop:12,height:full_height*0.01,}}>
            <Text style={{fontSize:14,color:'#4d4d4d'}}>可用余额:  10000元</Text>
          </View>
        <View style={styles.input_money}>
        
          <View style={{flexDirection:'row',flex:0.5,justifyContent:'center',backgroundColor:'white',marginLeft:24,}}>
              <Text style={{fontSize:16,color:'#4d4d4d',marginVertical:10}}>提现金额:</Text>
             <TextInput style={{flex:1, borderColor:'#dddddd',backgroundColor:'transparent',fontSize:15,}}  
                           // keyboardType='web-search'    
                            placeholder='最多提现10000元'  underlineColorAndroid='rgba(0,0,0,0)'/>     
          </View>

        </View>
        
        <View style={{justifyContent:'space-between',flexDirection:'row',marginHorizontal:24,marginTop:12,height:32,}}>
            <Text style={{fontSize:14,color:'#4d4d4d'}}>提现费用:  3元</Text>
            <Text style={{fontSize:14,color:'#4d4d4d'}}>实际到账:  9997元</Text>
          </View>
        
         <View style={{height:44, flexDirection:'row',marginHorizontal:12,justifyContent: "center",alignItems:'center',backgroundColor:'#ed5565', borderRadius: 4,}}>
              <Text style={{fontSize:18,color:'#ffffff',}}>确认提现</Text>
        </View>
        <View style={{justifyContent:'center',marginLeft:24,marginTop:12,height:full_height*0.01,}}>
            <Text style={{fontSize:14,color:'#4d4d4d'}}>*  3个工作日内到账</Text>
        </View>
      </View>
      
    )
  }
}

export default W2drawcard
