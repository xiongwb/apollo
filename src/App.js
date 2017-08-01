/**
     {this.renderStatusBar()} */
import React from 'react';
import {
  Navigator,
  View,
  NetInfo,
  ToastAndroid,
  Platform,
  BackAndroid,
  NativeModules,
  AsyncStorage,
  StatusBar,
  Alert,
  AppState,
} from 'react-native';
import {
  COMMON_STYLES,
  EVENT_EMITTER_CONST,
  STORAGE_KEYS,
  COMMON_CONFIG
} from 'ApolloConstant'
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import ROUTE_MAP from 'ApolloRouteMap';
import './storage';
import ErrorPage from 'ApolloUtils';
import { BackAndroidTool } from 'ApolloComponent';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
import ApolloAPI from 'ApolloAPI';
export const STATUS_BAR_HIDDEN = (Platform.OS === 'ios' ? false : true)
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.PushFromRight = Object.assign({}, Navigator.SceneConfigs.PushFromRight, { gestures: {} });
  }

  componentDidMount() {
    
    NetInfo.isConnected.addEventListener(
      'change',
       this._handleConnectivityChange,
    );
    //监听内存报警事件
    AppState.addEventListener('memoryWarning', function(){
      console.log("内存报警....");
    });
  }

  componentWillMount() {
    
    // 添加返回键监听 
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
        'change',
        this._handleConnectivityChange,
      );
    //移除对返回键的监听
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
    AppState.removeEventListener('memoryWarning', function(){
      console.log("内存报警....");
    });
  }

  _handleConnectivityChange(isConnected) {
    if(isConnected == false){
      __ANDROID__ && ToastAndroid.show(('网络已断开'), ToastAndroid.SHORT);
    }
  }
 
  // 判断是返回上一页还是退出程序  
  onBackAndroid = () => {  
    const  navigator  = this.refs.navigator;
    if (!navigator) return false;  
    const routers = navigator.getCurrentRoutes();  
    // 当前页面不为root页面时的处理  
    if (routers.length > 1) {  
      const top = routers[routers.length - 1];
      if (top.ignoreBack ) {  
          // 路由或组件上决定这个界面忽略back键  
          return true;  
      }  
      const handleBack = top.handleBack;  
      if (handleBack) {  
          // 路由或组件上决定这个界面自行处理back键  
          return handleBack();  
      }  
      // 默认行为： 退出当前界面。  
      navigator.pop();  
      return true;  
     } 
     
      // 当前页面为root页面时的处理  
    if (this.lastBackPressed && (this.lastBackPressed + 2000 >= Date.now())) {  
         //最近2秒内按过back键，可以退出应用并退出登录 
           ApolloAPI.APILogin.signOut(
            ).done((res_data, res) => {
              if(res_data.retCode == 1){
                  //退出后移除sign_tocken标志
                  AsyncStorage.removeItem(STORAGE_KEYS.SIGN_TOKEN, (error, value)=>{})
            }else{
                Alert.alert('错误提示', res_data.retMsg, [{ text: '确定'}])
              }
            }) 
         return false;  
        }  
      this.lastBackPressed = Date.now();  
      ToastAndroid.show('再按一次退出应用',ToastAndroid.SHORT);  
     // await saveData();
     // BackAndroid.exitApp();
      return true; 
     
  }

  configScene = (route, routeStack) => {
    if (route.config_scene_type == null) {
      return this.PushFromRight;
    }
    return route.config_scene_type;
  };

  onWillFocus = () => {
    dismissKeyboard();
  };

  renderScene = (route, navigator) => {
    const id = route.id;
    const routeItem = ROUTE_MAP[id];
   
    if (routeItem) {
    
      Component = routeItem.component;
      routeParams = {};
      // 合并默认参数
      Object.assign(routeParams, routeItem.params || {}, route.params || {});
      // const routes = navigator.getCurrentRoutes();
      // for (let i = 0; i < routes.length; i++) {
        
      //   if (id === routes[i].id) {
        
      //     return;
        
      //   }
      
      // }
      return (
          <View style={{ flex: 1 }}>
            <StatusBar
              backgroundColor='transparent'
              translucent={true}
              hidden={false}
              animated={true}      
            />
            <Component navigator={navigator} {...routeParams} />
          </View>
        );


    } else {
      Component = ErrorPage.component;
      routeParams = { data: { message: `当前页面没有找到：${id}` } };
    }
    
      
    
  };

  render() {
    return (
       <View style={{flex: 1}}>
          <StatusBar
              barStyle='light-content'
              hidden={STATUS_BAR_HIDDEN}
              backgroundColor='transparent'
              translucent={true}
              animated={true}      
          />
          <Navigator
            ref="navigator"
            initialRoute={{
              id: 'Loading',
              params: {},
              statusBarHidden: true
            }}
            onWillFocus={this.onWillFocus}
            configureScene={this.configScene}
            renderScene={this.renderScene}
          />
        </View>
    );
  }
}
