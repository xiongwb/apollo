import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  View,
  Platform,
} from 'react-native';
import {
  EVENT_EMITTER_CONST,
  STORAGE_KEYS,
  COMMON_CONFIG,
} from 'ApolloConstant'

import {
  Loading
} from 'ApolloComponent';

import TabNavigator from 'react-native-tab-navigator';

import ApolloAPI from 'ApolloAPI';
import { PlateFormUtils } from 'ApolloUtils';
import Home from '../pages/home/home';
import Investment from '../pages/investment/investment';
import Borrow from '../pages/borrow/borrow';
import Personal from '../pages/personal/personal';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import Perinfo from '../pages/personal/perinfo';
//个人信息新建了一个界面，暂时先把我的用来调用

import KeyBoard from '../pages/home/keyboard'

import Moreinfo from '../pages/personal/moreinfo';
//为了方便测试，暂时先把更多用借钱来调用

import Login from '../pages/login'


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'Home',
    };
  }

  get_loading() {
    return this.refs.loading;
  }

  toHome(){
    this.setState({ selectedTab: 'Home' });
    //发送跳转广播
    RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.DIDDASHSUCCESS, 'Home'); 
  }

  toBorrow(){
    this.get_loading().show();
    ApolloAPI.APILogin.getloginState({
      tenantNo:COMMON_CONFIG.tenantNo
    }).done((res_json, res) => {
      if(res_json.retCode == 1){
        this.get_loading().dismiss();
        this.setState({ selectedTab: 'Borrow' });
        //发送跳转广播
        RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.DIDDASHSUCCESS, 'Borrow');
      }else{
        this.get_loading().dismiss();
        PlateFormUtils.plateFormAlert(Platform,"提示","登录超时，为了安全，请重新登录!");
        this.props.navigator.push({id:'Login',params:{}});
      }
    })
  }

  toInvest(){
    this.setState({ selectedTab: 'Invest' });
    //发送跳转广播
     RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.DIDDASHSUCCESS, 'Invest'); 
  }

  toPersonal(){
    this.get_loading().show();
    ApolloAPI.APILogin.getloginState({
      tenantNo:COMMON_CONFIG.tenantNo
    }).done((res_json, res) => {
      if(res_json.retCode == 1){
        this.get_loading().dismiss();
        this.setState({ selectedTab: 'Personal' });
        //发送跳转广播
         RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.DIDDASHSUCCESS, 'Personal'); 
      }else{
        this.get_loading().dismiss();
        PlateFormUtils.plateFormAlert(Platform,"提示","登录超时，为了安全，请重新登录!");
        this.props.navigator.push({id:'Login',params:{}});
      }
    })
  }

  componentDidMount(){
    this.listener = RCTDeviceEventEmitter.addListener(EVENT_EMITTER_CONST.DIDLOGOUTSUCCESS,(value)=>{
      // 接受到通知后的处理
      if(value == "logout"){
        this.toHome();
      }
    });
  }
  componentWillUnMount(){
    this.listener.remove();
  }
  render() {
    return (
      <View style={{flex:1}}>
      <TabNavigator
      hidesTabTouch={true}>
        <TabNavigator.Item
          title="首页"
          selected={this.state.selectedTab === 'Home'}
          selectedTitleStyle={styles.selectedTextStyle}
          titleStyle={styles.textStyle}
          renderIcon={() => <Image source={require('../image/home.png')} style={styles.iconStyle} />}
          renderSelectedIcon={() => <Image source={require('../image/home_red.png')} style={styles.iconStyle} />}
          onPress={() => this.toHome()}>
          <Home {...this.props}/>
        </TabNavigator.Item>
        <TabNavigator.Item
          title="投资"
          selected={this.state.selectedTab === 'Invest'}
          selectedTitleStyle={styles.selectedTextStyle}
          titleStyle={styles.textStyle}
          renderIcon={() => <Image source={require('../image/invest.png')} style={styles.iconStyle} />}
          renderSelectedIcon={() => <Image source={require('../image/invest_red.png')} style={styles.iconStyle} />}
          onPress={() => this.toInvest()}>
          <Investment {...this.props} />
        </TabNavigator.Item>
        <TabNavigator.Item
          title="借钱"
          selected={this.state.selectedTab === 'Borrow'}
          selectedTitleStyle={styles.selectedTextStyle}
          titleStyle={styles.textStyle}
          renderIcon={() => <Image source={require('../image/loan.png')} style={styles.iconStyle} />}
          renderSelectedIcon={() => <Image source={require('../image/loan_red.png')} style={styles.iconStyle} />}
          onPress={() => this.toBorrow()}>
          <Borrow {...this.props} />
        </TabNavigator.Item>
        <TabNavigator.Item
          title="我的"
          selected={this.state.selectedTab === 'Personal'}
          selectedTitleStyle={styles.selectedTextStyle}
          titleStyle={styles.textStyle}
          renderIcon={() => <Image source={require('../image/mine.png')} style={{ width: 20, height: 25,}} />}
          renderSelectedIcon={() => <Image source={require('../image/mine_red.png')} style={{ width: 20, height: 24,}} />}
          onPress={() => this.toPersonal()}>
         <Personal {...this.props} />
        </TabNavigator.Item>
      </TabNavigator>
      <Loading ref="loading" />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  iconStyle: {
    width: 22,
    height: 22,
  },
  textStyle: {
    color: '#999',
  },
  selectedTextStyle: {
    color: 'black',
  },
});

export default Dashboard;
