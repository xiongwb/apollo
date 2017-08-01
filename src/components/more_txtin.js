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
 * 更多（封装公共部分）
 */
export default class Moretxtin extends React.Component {
  onTouchImage=()=>{
    return this.props.onPressButton();
  }
  render() {
    styles = StyleSheet.create({
      input: {
        borderBottomWidth: this.props.borderBottomWidth1
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
            <Image source={this.props.ImageLeft} style={{ width:25,height:25}}/>
          </View>
          <TouchableOpacity 
          style={{
            borderBottomWidth: this.props.borderBottomWidth1,
            borderBottomColor: '#e5e5e5',
            justifyContent: "center",
            flexDirection: 'row',
            marginLeft: 15,
            flex: 1
          }}
          onPress={this.onTouchImage}>
            <View
              style={{
                marginLeft:5,
                alignItems:'center',
              flexDirection:'row',
              flex: 2
            }}>
              <Text
                style={{
                fontSize: 16,
                color: '#808080'
              }}>{this.props.invite_words}
              
              </Text>
              <Text
                style={{
                fontSize: 16,
                color: '#808080',
                marginLeft:50
              }}>{this.props.invite_state}</Text>

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