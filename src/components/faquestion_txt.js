import React from 'react';
import {
  View,
  ART,
  TextInput,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

const styles = StyleSheet.create({});

/**
 * 常见问题（封装公共部分）
 */
export default class Faquestiontxt extends React.Component {
  onTouchImage=()=>{
    return this.props.onPressButton();
  }
  render() {
    styles = StyleSheet.create({
      input: {
        borderBottomWidth: this.props.borderBottomWidth1,
        marginLeft:this.props.marginLeft1,
        fontSize:this.props.fontSize1,
      }
    });
    return (

      <View
        style={{
        borderColor: '#e5e5e5',
        backgroundColor: '#ffffff'
      }}>

        <View
          style={{
          height: 46,
          flexDirection: 'row',
          backgroundColor: '#fff'
        }}>

          <View
            style={{
            justifyContent: "center",
            marginLeft: 10
          }}>
          <Image source={this.props.ImageLeft}/>
          </View>
          <TouchableOpacity 
          style={{
            borderBottomWidth: this.props.borderBottomWidth1,
            borderBottomColor: '#e5e5e5',
            justifyContent: "center",
            flexDirection: 'row',
            marginLeft: this.props.marginLeft1,
            flex: 1
          }}
          onPress={this.onTouchImage}>
            <View
              style={{
              justifyContent: "center",
              flex: 2
            }}>
              <Text
                style={{
                fontSize: this.props.fontSize1,
                color: this.props.color1
              }}>{this.props.invite_words}</Text>

            </View>

            <View
              style={{
              flex: 0.2,
              justifyContent: "center",
            }}>
              
                <Image source={this.props.ImageRight}/>
              
            </View>
          </TouchableOpacity>
        </View>

      </View>

    )
  }

}