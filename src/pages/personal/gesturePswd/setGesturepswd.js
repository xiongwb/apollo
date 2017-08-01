import React, { Component } from 'react'; 
 import { 
     AppRegistry, 
     StyleSheet, 
     Text, 
     View 
 } from 'react-native';  
 
 import PasswordGesture from 'react-native-gesture-password'; 
 
import {
  BasePage
} from 'ApolloComponent'

 const Password1 = ''; 
 
 
 class SetGesturePwd extends BasePage { 
     constructor(props) { 
         super(props); 
         this.state = { 
             message: '请输入您的手势密码.', 
             status: 'normal',
         } 
     } 
 
 
     onEnd(password) { 
         if ( Password1 === '' ) { 
            // The first password 
             Password1 = password; 
             this.setState({ 
                 status: 'normal', 
                 message: '请再次输入您的手势密码.' 
             }); 
         } else { 
             // The second password 
             if ( password === Password1 ) { 
                 this.setState({ 
                     status: 'right', 
                     message: '密码设置成功！',
                 }); 
                 this.props.navigator.pop();
                 
                 Password1 = ''; 
                 // your codes to close this view 
             } else { 
                 this.setState({ 
                     status: 'wrong', 
                     message:  '两次手势密码输入不一致.' 
                 }); 
             } 
         } 
     } 
 
 
     onStart() { 
         if ( Password1 === '') { 
             this.setState({ 
                 message: '请输入您的手势密码.' 
             }); 
         } else { 
             this.setState({ 
                 message: '请再次输入您的手势密码.' 
             }); 
         } 
     } 
      
     render() { 
         return ( 
                <PasswordGesture 
                    ref='pg' 
                    status={this.state.status} 
                    message={this.state.message} 
                    onStart={() => this.onStart()} 
                    onEnd={(password) => this.onEnd(password)} 
                    innerCircle={true} 
                    outerCircle={true} 
                /> 
         ); 
     } 
 } 

 export default SetGesturePwd
