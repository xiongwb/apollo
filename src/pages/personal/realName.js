/*
* zgx
* 2017/03/27
*/
import React from 'react'

import {
  Dimensions,
  Text,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  PixelRatio
} from 'react-native'
import {
  BasePage,
  BackNavBar,
  NavigatorUtils,
  LabelTextInput,

} from 'ApolloComponent'
import {
  Color, 
  COMMON_STYLES,
  EVENT_EMITTER_CONST,
  STORAGE_KEYS,
} from 'ApolloConstant'
var full_height = Dimensions.get('window').height
var full_width = Dimensions.get('window').width
var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
class RealName extends BasePage {
  render() {

    return (
      <View style={styles.root}>
        <BackNavBar
          component={this}>实名认证</BackNavBar>
        <View style={styles.input_box}>
            <TouchableOpacity onPress={()=>{this.props.navigator.push({id:'RealNameAuth'})}}>
                <Text style={{fontSize:14,color:'#fff'}}>身份信息未认证</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.constainer}>
            <View style={[styles.wrapper]}>
                <Text style={styles.font}>姓名：</Text>
                <Text style={styles.font}>张三</Text>
            </View>
            <View style={[styles.wrapper]}>
                <Text style={styles.font}>性别：</Text>
                <Text style={styles.font}>男</Text>
            </View>
            <View style={[styles.wrapper,]}>
                <Text style={styles.font}>生日：</Text>
                <Text style={styles.font}>1991-03-28</Text>
            </View>
            <View style={[styles.wrapper]}>
                <Text style={styles.font}>身份证：</Text>
                <Text style={styles.font}>142653*************45662</Text>
            </View>
            <View style={[styles.wrapper]}>
                <Text style={styles.font}>推荐人：</Text>
                <Text style={styles.font}>zhangsan</Text>
            </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: Color.backgroundColor,
    flex: 1,
  },

  input_box: {
    height: 0.18 * full_height,
    marginTop: 5,
    backgroundColor: '#0198f1',
    justifyContent:'center',
    alignItems:'center'
  },
  constainer:{
    marginTop:5,
    backgroundColor:'#fff'
  },
  wrapper:{
      height:40,
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
      borderBottomColor:'#dddddd',
      borderBottomWidth:onePt,
      backgroundColor:'#fff',
      marginLeft:20,
      marginRight:20,
  },
  font: {
      color:'#4d4d4d',
      fontSize:14
  }

});

export default RealName
