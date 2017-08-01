import React from 'react';

import {
  NetInfo,
  Alert,
  View,
} from 'react-native';

/**
*  页面组件的父类，所有页面组件都需要继承这个组件
*  网络状态监听
*/
class BasePage extends React.Component {
  constructor(props) {
    super(props);
    this.__onBack = this.onBack.bind(this);
    this.state = {
    };
  }

  netStatus() {
    NetInfo.isConnected.fetch().done(
        (isConnected) => {
          if (isConnected === false) {
            Alert.alert('未连接网络');
          }
        },
    )
    NetInfo.fetch().done(
      (connectionInfo) => { console.log('网络状态信息' + connectionInfo); },
    );
  }

  onBack() {
    if (this.props.navigator.getCurrentRoutes().length !== 1) {
      this.props.navigator.pop();
      return true;
    }

    return false;
  }

}

export default BasePage
