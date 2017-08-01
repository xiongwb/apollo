import React from 'react';
import {
    Alert,
    ToastAndroid,
    Platform
} from 'react-native';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
/**
*  两个不同平台的共用的工具
*  by zgx
*/
export default class PlateFormUtils  extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
  static plateFormAlert(Platform,tips,showContent){
     dismissKeyboard();  //隐藏键盘
     if (Platform.OS === 'android') {
          return  __ANDROID__ && ToastAndroid.show((showContent), ToastAndroid.SHORT);
        }else{
          return  Alert.alert(tips, showContent, [{ text: '确定' }])
        }
  }
}
