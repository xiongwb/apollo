/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TextInput,
} from 'react-native';

import {
  NSKeyboardIOS
} from 'ApolloComponent';

import { NativeModules } from 'react-native';
//var NSKeyboardManager = NativeModules.NSKeyboard
class Keyboard extends Component {
  
   constructor(props) {
    super(props)
    this.state={
      textField:'',
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <NSKeyboardIOS style={{marginLeft:20,width:375,height:100,backgroundColor:'red'}}
                     placeholder={'输入密码'}
                     size={[300,50]}
         />
        <Text onPress={()=>{
          //获取输入的内容 
          NSKeyboardManager.getTextField((error,text)=>{
                if(error){
                  console.error(error);
                }else{
                  // console.log(text)
                  this.setState({textField:text})
                }
              })
        }}>获取</Text>
        <Text>{this.state.textField}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
export default Keyboard;
