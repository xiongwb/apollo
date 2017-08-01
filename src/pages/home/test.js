
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  NavBar,
  BasePage,
  Line,
} from 'ApolloComponent';

import { APILogin } from 'ApolloAPI';
import { NavigatorUtils } from 'ApolloUtils';
import {Size, Color} from 'ApolloConstant';

import { observable, autorun } from 'mobx';

class Test extends BasePage {
  componentWillMount() {
//  监听网络状态
    this.netStatus();
  }

  onBack() {
// 重写返回方法
    this.props.navigator.pop();
  }

  testMobx() {
    const value = observable(0);

    autorun(() => {
      console.log(`Value is: ${value.get()}`);
    });

    value.set(2);
    value.set(8);
    value.set(-3);
  }

  testStorageSave() {
    storage.save({
      key: 'loginState',  // 注意:请不要在key中使用_下划线符号!
      rawData: {
        from: 'some other site',
        userid: 'some userid',
        token: 'some token',
      },
    });
  }

  testStorageGet() {
    storage.load({
      key: 'loginState',

      // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
      autoSync: true,

      // syncInBackground(默认为true)意味着如果数据过期，
      // 在调用sync方法的同时先返回已经过期的数据。
      // 设置为false的话，则始终强制返回sync方法提供的最新数据(当然会需要更多等待时间)。
      syncInBackground: true,

      // 你还可以给sync方法传递额外的参数
      syncParams: {
        extraFetchOptions: {
            // 各种参数
        },
        someFlag: true,
      },
    }).then((ret) => {
        // 如果找到数据，则在then方法中返回
        // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
        // 你只能在then这个方法内继续处理ret数据
        // 而不能在then以外处理
        // 也没有办法“变成”同步返回
        // 你也可以使用“看似”同步的async/await语法

      console.log(ret);
      this.setState({ user: ret });
    }).catch((err) => {
  //  如果没有找到数据且没有sync方法，
  //  或者有其他异常，则在catch中返回
      console.warn(err.message);
      switch (err.name) {
        case 'NotFoundError':
              // TODO;
          break;
        case 'ExpiredError':
              // TODO
          break;
        default: break;
      }
    });
  }

  testFetch() {
    APILogin.signIn({
      phone: 15388155118,
      pwd: '123456',
      classes: 'T',
    }).done((res) => {
      if (res.retCode === 1) {
        console.log(res);
      }
    }).fail();
  }

  testNavigatorUtils() {
    NavigatorUtils.popToRoute(
      this.props.navigator,
      { id: 'Dashboard' },
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar
          component={this}
          titleContent={<Text style={{ color: 'white', fontSize: 20 }}>测试</Text>}
        />
        <Text onPress={() => this.testMobx()}>测试mobx</Text>
        <Text onPress={() => this.testStorageSave()}>测试storage.save</Text>
        <Text onPress={() => this.testStorageGet()}>测试storage.get</Text>
        <Text onPress={() => this.testFetch()}>测试fetch请求</Text>
        <Text onPress={() => this.testNavigatorUtils()}>测试NavigatorUtils</Text>
        <Text>{'屏幕宽度' + Size.SCREENWIDTH}</Text>
        <Text>{'屏幕高度' + Size.SCREENHEIGHT}</Text>
        <Line />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.backgroundColor,
  },
});

export default Test;
