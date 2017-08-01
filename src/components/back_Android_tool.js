//  BackAndroidTool  
//  功能: "安卓手机上的返回键"  
//  Created by 小广 on 2016-05-10 下午.  
//  Copyright © 2016年  All rights reserved.  
/* 
使用: 参考链接:http://reactnative.cn/post/480 
 1.在首页/homepage页(只需要在全局都存在的页面调用一次监听即可) 
 componentDidMount(){ 
    // 添加返回键监听 
    BackAndroidTool.addBackAndroidListener(this.props.navigator); 
 } 
 
 componentWillUnmount(){ 
    // 移除返回键监听 
    BackAndroidTool.removeBackAndroidListener(); 
 } 
  说明：BackAndroid在iOS平台下是一个空实现， 
  所以理论上不做这个Platform.OS === 'android'判断也是安全的。 
 
  2. 某些类自定义返回键操作(即点击返回键弹出一个alert之类的操作) 
  在所需类的初始化方法里调用BackAndroidTool.customHandleBack 
  栗子: 
  constructor(props) { 
    super(props); 
        BackAndroidTool.customHandleBack(this.props.navigator,() => { 
            Alert.alert('提示','您还未保存记录,确定要返回么?', 
                        [{text:'取消',onPress:() => {}}, 
                         {text:'确定',onPress:() => { this.props.navigator.pop(); }} 
                        ]); 
                    // 一定要 return true; 原因上面的参考链接里有 
              return true; 
        }); 
  } 
 
  3.某些页面需要禁用返回键 
  在nav进行push的时候,设置属性ignoreBack为true 即可 
  this.props.navigator.push({ 
    component: 所需要禁用的类, 
    ignoreBack:true, 
  }); 
 
*/  
  
'use strict';  
import React,{  
  Platform,  
  Navigator,  
  BackAndroid,  
  ToastAndroid,  
  NativeModules,  
} from 'react-native';  
  
// 类  
var NativeCommonTools = NativeModules.CommonTools;  
  
export default {  
  // 监听返回键事件  
  addBackAndroidListener(navigator) {  
    if (Platform.OS === 'android') {  
      BackAndroid.addEventListener('hardwareBackPress',() => {  
         return this.onBackAndroid(navigator);  
      });  
    }  
  },  
  
  // 移除监听  
  removeBackAndroidListener() {  
    if (Platform.OS === 'android') {  
      BackAndroid.removeEventListener('hardwareBackPress', () => {  
      });  
    }  
  },  
  
  // 判断是返回上一页还是退出程序  
  onBackAndroid(navigator) {  
    if (!navigator) return false;  
    const routers = navigator.getCurrentRoutes();  
    // 当前页面不为root页面时的处理  
    if (routers.length > 1) {  
      const top = routers[routers.length - 1];  
      if (top.ignoreBack || top.component.ignoreBack) {  
          // 路由或组件上决定这个界面忽略back键  
          return true;  
      }  
      const handleBack = top.handleBack || top.component.handleBack;  
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
         //最近2秒内按过back键，可以退出应用。  
         NativeCommonTools.onBackPressed();  
         return true;  
        }  
      this.lastBackPressed = Date.now();  
      ToastAndroid.show('再按一次退出应用',ToastAndroid.SHORT);  
      return true;  
  },  
  
  // 自定义返回按钮事件  
  customHandleBack(navigator, handleBack) {  
    if (navigator) {  
      let routes = navigator.getCurrentRoutes(); //nav是导航器对象  
      let lastRoute = routes[routes.length - 1]; // 当前页面对应的route对象  
        lastRoute.handleBack = handleBack;  
    }  
    },  
  
}  