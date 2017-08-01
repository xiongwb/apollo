
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
 * 优惠券
 * zqf
 * 20170329
 */
var full_width = Dimensions.get('window').width;
var full_height = Dimensions.get('window').height;


class Hiscoupon extends BasePage {
  render() {
    return (
      <View style={styles.root}>
        <BackNavBar component={this}>历史礼包</BackNavBar>
        <View style={{ justifyContent: 'center', }}>
          <View style={{ flexDirection: 'row',height: full_height * 0.07, width: full_width, 
            backgroundColor: '#ffffff', marginBottom: 10,justifyContent:'flex-start',alignItems:'center'}}>
            <Text style={{ marginLeft: 12, fontSize: 16, color: '#101010', }}>历史记录--</Text>
            <Text style={{ fontSize: 16, color: '#5677fc', }}>礼包</Text>
          </View>
          <View style={{ borderRadius: 8, height: full_height * 0.26,  marginHorizontal: 12 }}> 
            <Image source={require('apollo/src/image/coupon_red.png')} />
          </View>
          <View style={{ borderRadius: 8, height: full_height * 0.26,  marginHorizontal: 12 }}>
            <Image source={require('apollo/src/image/coupon_grey.png')} >
            </Image>
          </View>
          <View style={{ borderRadius: 8, height: full_height * 0.26,  marginHorizontal: 12 }}>
            <Image source={require('apollo/src/image/coupon_blue.png')} >
            </Image>
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

});

export default Hiscoupon