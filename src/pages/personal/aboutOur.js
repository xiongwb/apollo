/**
 * 关于
 * zqf
 * 2017/04/21
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
 // ART,
  Alert,
  AsyncStorage,
  ScrollView,
  Platform,
  PixelRatio,
} from 'react-native';

import {
  BasePage,
  PushLogin,
  BackNavBar
} from 'ApolloComponent'
import {
  EVENT_EMITTER_CONST,
  STORAGE_KEYS,
  COMMON_STYLES,
  Color
} from 'ApolloConstant'

import Icon from 'react-native-vector-icons/FontAwesome';


var full_width = Dimensions.get('window').width;
var full_height = Dimensions.get('window').height;
/*viewWidth指的是顶部文字view的宽度
  宽度=屏幕宽度-左边距-头像宽度-间距-间距-箭头宽度-右边距
 */
const onePt =1 / PixelRatio.get();
let viewWidth = full_width-15-75-10-10-20-15;

//const {Surface, Shape, Path} = ART;  

class AboutOur extends BasePage {
    constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state={
      totalassets: '17562.06',
      restMoney:'200.36',
    }
  }
 
  render() {
    return(
      <View style={styles.root}>
        <BackNavBar  component={this}>关于我们</BackNavBar>
        <View style={styles.topArea}>
            <View style={styles.topAreaContainer}>
               <Image />
               <Text style={{fontSize:16,color:'#4d4d4d',marginVertical:12}}></Text>
            </View>
           </View>

         <View style={[styles.topAreaCon,{marginTop:2}]}>
            <View style={styles.itemBox}>
                <Text style={{color:'#4d4d4d',fontSize:16,alignSelf:'center'}}> 官方网站  </Text>
                <Text style={{color:'#b3b3b3',fontSize:12,alignSelf:'center'}}>  </Text>
            </View>
            <View style={styles.itemBox}>
                <Text style={{color:'#4d4d4d',fontSize:16,alignSelf:'center'}}> 微信号  </Text>
                <Text style={{color:'#b3b3b3',fontSize:12,alignSelf:'center'}}>   </Text>
            </View>
            <View style={styles.itemBox}>
                <Text style={{color:'#4d4d4d',fontSize:16,alignSelf:'center'}}> 客服电话  </Text>
                <Text style={{color:'#b3b3b3',fontSize:12,alignSelf:'center'}}> 人工服务时间8:00-22:00  </Text>
            </View>
            <View style={styles.itemBox}>
                <Text style={{color:'#4d4d4d',fontSize:16,alignSelf:'center'}}> 给我们评分  </Text>
                <Text style={{color:'#b3b3b3',fontSize:12,alignSelf:'center'}}> </Text>
            </View>
            <View style={styles.itemBox}>
                <Text style={{color:'#4d4d4d',fontSize:16,alignSelf:'center'}}> 检查更新  </Text>
                <Text style={{color:'#b3b3b3',fontSize:12,alignSelf:'center'}}> 已是最新版本  </Text>
            </View>
         </View>
      </View>
  
    )}
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: COMMON_STYLES.MAIN_BACKGROUND_COLOR,
    width:full_width,
    height:full_height,
  },
  topArea:{
      height: 0.24 * full_height,
      width:full_width,
      backgroundColor:'#fff'
  },
   topAreaCon:{
      height: 0.71 * full_height,
      width:full_width,
      backgroundColor:'#fff'
  },
  topAreaContainer:{
      marginTop:30,
      justifyContent:'center',
      alignItems:'center'
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

export default AboutOur