
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

} from 'react-native';
import { Color } from 'ApolloConstant';
import {
  BasePage,
  BackNavBar,
  Moretxtin,
} from 'ApolloComponent'
import {
  COMMON_STYLES,
} from 'ApolloConstant'



/**
 * 风险评估测试题1
 * zqf
 * 2017/04/12
 */
var full_width = Dimensions.get('window').width;
var full_height = Dimensions.get('window').height;


class RiskTestSubmit extends BasePage {
  render() {
    return (
      <View style={styles.root}>
        <BackNavBar component={this}>风险评估</BackNavBar>
          <View style={{height:full_height*0.11,backgroundColor:'#ffffff'}}>
            <View style={{marginHorizontal:18,marginVertical:24,flexDirection:'row',}}>
              <Text style={{fontSize:12,color:'#4d4d4d'}}>根据评估结果，您的风险承受能力将属于以下五种类型：保守型、稳健型、平衡型、成长型、进取型。
               <Text style={{fontSize:12,color:'#ed5565'}}> 您今年还可评估3次</Text>
              </Text>
            </View>
            </View>
            <View style={{height:full_height*0.36,width:full_width,marginVertical:2,backgroundColor:'#ffffff'}}>
              <Text style={{fontSize:16,color:'#101010',marginLeft:12,marginVertical:24}}>15.您目前的就业状况如何?</Text>
              <View style={{marginLeft:12,}}>
                <Text style={{fontSize:16,color:'#808080',}}>固定职业，收入稳定，变化不大</Text>
                <Text style={{fontSize:16,color:'#808080',marginVertical:12}}>固定职业，以佣金收入为主</Text>
                <Text style={{fontSize:16,color:'#808080',}}>创业者或企业主</Text>
                <Text style={{fontSize:16,color:'#808080',marginVertical:12}}>自由职业</Text>
              </View>
            </View>
            <View style={{height:full_height*0.45,backgroundColor:'#ffffff',}}>
              <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:16}}>
                <Text style={{fontSize:14,color:'#ed5565'}}>上一题</Text>
                <Text style={{fontSize:14,color:'#808080',marginRight:12,}}>1/15</Text>
              </View>
            <TouchableOpacity onPress={() =>  this.props.navigator.push({ id: 'RiskTestQuestion' })}>
                <View style={styles.topTouchable}>
                <Text style={{fontSize:18,color:'#ffffff'}}>提交</Text>      
                </View>
              </TouchableOpacity> 
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
});

export default RiskTestSubmit