/**
 * 交易记录
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

import { StringUtils } from 'ApolloUtils';
import WhiteSpace from 'antd-mobile/lib/white-space';

var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
var full_width = Dimensions.get('window').width;
var full_height = Dimensions.get('window').height;

let transacContent = new Array();
    transacContent.push({ImageSource:'../../image/guide.png',type:'invsSuc',typeName:'认投成功',money:'-50',restMoney:'112333',time:'2017-03-27 14:32:52'});
    transacContent.push({ImageSource:'../../image/score.png',type:'chargeSuc',typeName:'充值成功',money:'+50',restMoney:'123128.0',time:'2017-03-27 14:32:52'});
    transacContent.push({ImageSource:'../../image/phone_number.png',type:'appMoney',typeName:'申请提现',money:'-50',restMoney:'81121.0',time:'2017-03-27 14:32:52'});
    transacContent.push({ImageSource:'../../image/invite.png',type:'withDrawMoneySuc',typeName:'提现成功',money:'-50',restMoney:'811.0',time:'2017-03-27 14:32:52'});
    transacContent.push({ImageSource:'../../image/invite.png',type:'returnSuc',money:'+50',typeName:'还款成功',restMoney:'82111.0',time:'2017-03-27 14:32:52'});
let url = {
  '../../image/guide.png': require('../../image/guide.png'),
  '../../image/score.png': require('../../image/score.png'),
  '../../image/phone_number.png': require('../../image/phone_number.png'),
  '../../image/invite.png': require('../../image/invite.png'),
  '../../image/invite.png': require('../../image/invite.png')
}
class TransactionRec extends BasePage {
  reDetails(){
    let tansacRec = [];
    for (let i=0;i < transacContent.length;i++){
      let moneyFontColor ='';
      if(transacContent[i].type=='invsSuc'){
        moneyFontColor='#fe6564'
      }else if (transacContent[i].type == 'chargeSuc') {
        moneyFontColor='#ffcb00'
      }else if (transacContent[i].type == 'appMoney') {
        moneyFontColor='#989898'
      }else if (transacContent[i].type == 'withDrawMoneySuc'){
        moneyFontColor='#33cb98'
      }else if (transacContent[i].type == 'returnSuc'){
        moneyFontColor='#ffcb00'
      }

      tansacRec.push(
          <View key={i} style={styles.detialWrapper}>
              <View style={{flex:1 / 2}}>
              <Image key={i} style={styles.imageStyle} source={url[transacContent[i].ImageSource]}></Image>
              </View>
              <View style={{flex:5}}>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                  <View style={{flexDirection:'row',justifyContent:'flex-start',paddingLeft:3}}>
                    <Text style={{fontSize:16,color:'#101010'}}>{transacContent[i].typeName}</Text>
                  </View>
                  <View style={{flexDirection:'row',justifyContent:'flex-end',paddingRight:3}}>
                    <Text style={{fontSize:16,color:moneyFontColor}}>{transacContent[i].money}元</Text>
                  </View>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:8}}>
                  <View style={{flexDirection:'row',justifyContent:'flex-start',paddingLeft:3}}>
                    <Text style={{fontSize:12,color:'#808080'}}>余额:{StringUtils.moneyFormatData2Money(transacContent[i].restMoney)}元</Text>
                  </View>
                  <View style={{flexDirection:'row',justifyContent:'flex-end',paddingRight:3}}>
                    <Text style={{fontSize:12,color:'#808080'}}>{transacContent[i].time}</Text>
                  </View>
                </View>
              </View>
          </View>
           
      )
    }
    return tansacRec;
  }
  render() {
    return (
    <View style={styles.container}>
      <BackNavBar  component={this}>交易记录</BackNavBar>
      <View style={{width:full_width,height:0.12 * full_height,alignItems:'center',justifyContent:'center',backgroundColor:'#fff'}}>
        <Text style={{fontSize:14,color:'#808080',}}>累计交易总额</Text>
        <Text style={{fontSize:24,color:'#101010',paddingTop:5}}>{StringUtils.moneyFormatData2Money(35255605.3)}</Text>
      </View>
      <WhiteSpace size='md' />
      <ScrollView showsVerticalScrollIndicator={false} style={{flex:1,backgroundColor:'#fff'}}>
        {this.reDetails()}
      </ScrollView>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.backgroundColor,
  },
  detialWrapper: {
   marginLeft:10,
   marginRight:10,
   height:0.11 * full_height,
   alignItems:'center',
   borderBottomColor:'#e5e5e5',
   borderBottomWidth:onePt,
   flexDirection:'row'
  },
  imageStyle: {
    height: 24,
    width: 24,
    alignSelf:'center'
  },
});

export default TransactionRec