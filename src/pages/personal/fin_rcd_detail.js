import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ART,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  PixelRatio,
  AsyncStorage,
  ListView,
  Platform,
} from 'react-native';

import { StringUtils } from 'ApolloUtils';
import { BackNavBar,BasePage} from 'ApolloComponent';
import { Color } from 'ApolloConstant';
import Icon from 'react-native-vector-icons/FontAwesome'

/**
 * 融资记录详情
 * xiongwb
 * 20170506
 */
export default class FinRcdDetail extends BasePage {

	constructor(props) {
      super(props);
      this.state = {
        
      };
  }

  render() {
    const { data } = this.props;
    let finsum = StringUtils.moneyFormatData2Money(data.finsum);
    let paidfee = StringUtils.moneyFormatData2Money(data.paidfee);
    let topayfee = StringUtils.moneyFormatData2Money(data.topayfee);
    let paidint = StringUtils.moneyFormatData2Money(data.paidint);
    let topayint = StringUtils.moneyFormatData2Money(data.topayint);
    let nextpaysum = StringUtils.moneyFormatData2Money(data.nextpaysum);
    var finstatus = '';
    switch (data.finstatus){
      case '1':
        finstatus="正常";
        break;
      case '2':
        finstatus="逾期";
        break;
      case '9':
        finstatus="结清";
        break;
    }
    return(
      <View style={styles.root}>
        <BackNavBar style={{backgroundColor:'#ed5565'}} component={this}>融资详情</BackNavBar>
        <View style={styles.contentView}>
          <Text style={styles.nameText}>{data.prdinfo.prdname}</Text>
          <Text style={styles.itemText}>融资日期：{data.findate}</Text>
          <Text style={styles.itemText}>到期日期：{data.expdate}</Text>
          <Text style={styles.itemText}>融资金额：{finsum}</Text>
          <Text style={styles.itemText}>融资状态：{finstatus}</Text>
          <Text style={styles.itemText}>已支付手续费：{paidfee}</Text>
          <Text style={styles.itemText}>已支付利息：{paidint}</Text>
          <View style={styles.checkView}>
            <View style={styles.checkItemView}>
              {data.canprepayflag=='1'?<Icon name='check-square-o' size={14}/>:<Icon name='square-o' size={14}/>}
              <Text style={[styles.itemText,{marginLeft:5}]}>可提前还款</Text>
            </View>
            <View style={styles.checkItemView}>
              {data.prepayflag=='1'?<Icon name='check-square-o' size={14}/>:<Icon name='square-o' size={14}/>}
              <Text style={[styles.itemText,{marginLeft:5}]}>已提前还款</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root:{
    flex: 1,
    backgroundColor:Color.backgroundColor,
  },
  contentView:{
    paddingHorizontal:15,
  },
  nameText:{
    fontSize:16,
    fontWeight:'bold',
    color:'#101010',
    marginVertical:10,
  },
  itemText:{
    fontSize:14,
    color:'#4d4d4d',
    marginBottom:5,
  },
  checkItemView:{
    flexDirection:'row',
    alignItems:'center',
    marginRight:15,
  },
  checkView:{
    flexDirection:'row',
    alignItems:'center',
  }

});