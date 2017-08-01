
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PixelRatio,
  Dimensions,
  TouchableOpacity,
  Image,
  ART,
  Platform,
  ScrollView,
  WebView,
} from 'react-native';

import {
  PushLogin,
  BasePage,
  BackNavBar
} from 'ApolloComponent';
import { Color,EVENT_EMITTER_CONST,COMMON_CONFIG} from 'ApolloConstant';
import { NavBar } from 'ApolloComponent';
import SwiperNative from 'react-native-swiper';
import ApolloAPI from 'ApolloAPI';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'

var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
var full_width = Dimensions.get('window').width;
var full_height = Dimensions.get('window').height;
class Agreement extends BasePage {

  onShouldStartLoadWithRequest = (event) => {
    // Implement any custom loading logic here, don't forget to return!
    return true;
  };

  render() {
    return (
      <View style={styles.container}>
        <BackNavBar component={this}>{this.props.protocoltitle}</BackNavBar>
        {
          this.props.protocoltitle =='图片展示' ?
          <WebView
            //ref={WEBVIEW_REF}
            automaticallyAdjustContentInsets={true}
            style={{height: full_height,width: full_width,alignSelf:'center',}}
            source={{html: `<!DOCTYPE html>
            <html>
            <body>
            <style type="text/css">
              html,body,div{ 
                margin:0; 
                padding:0; 
                height:100%; 
                position:relative; 
              } 
              .wrap{ 
                width:100%; 
                height:100%; 
              }
             .top-bottom-middle{ 
                margin-top:50%; 
                width:100%
              }
            </style>
              <div class="wrap">
                  <img class="top-bottom-middle" src="${this.props.protocolcontent}"  alt="" />
              </div>
            </body>
            </html>`}}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            decelerationRate="normal"
            //contentInset={{top:0,left:0}}
            onNavigationStateChange={(title)=>{
              if(title.title != undefined) {
                this.setState({
                  height:(parseInt(title.title)+20)
                })
              }
            }}
            onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
            startInLoadingState={true}
            scalesPageToFit={true}
          />
        :
          <WebView
            //ref={WEBVIEW_REF}
            automaticallyAdjustContentInsets={false}
            style={{height: full_height,width: full_width,alignSelf:'center',}}
            source={{html:this.props.protocolcontent}}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            decelerationRate="normal"
            //onNavigationStateChange={this.onNavigationStateChange}
            onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
            startInLoadingState={true}
            scalesPageToFit={true}
          />
        }
      
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

});
export default Agreement