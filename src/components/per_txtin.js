import React from 'react';
import {
  View,
  ART,
  TextInput,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';


const styles = StyleSheet.create({



});


/**
 * 个人信息（封装公共部分）
 */
export default class per_txtin extends React.Component {

  render() {
    styles = StyleSheet.create({
      input: {
        borderBottomWidth: this.props.borderBottomWidth1
        // borderBottomWidth:this.props.borderBottomWidth1
      },

    });
    return (
      <View style={{ borderColor: '#e5e5e5', backgroundColor: '#ffffff', }}>
        <View style={{ height: 46, flexDirection: 'row', backgroundColor: '#fff' }}>
          <View style={{ justifyContent: "center", marginLeft: 10 }}>
            <Image source={this.props.ImageLeft} style={{ width:25,height:25}}/>
          </View>
          <View style={{ borderBottomWidth: this.props.borderBottomWidth1, borderBottomColor: '#e5e5e5', flexDirection: 'row', marginLeft: 15, flex: 1 }}>
            <View style={{ flex:1.2,marginLeft:5,justifyContent:'center' }}>
              <Text style={{ fontSize: 16, color: '#808080', }}>{this.props.title_puplic}</Text>
            </View>
              <TextInput
                style={{ flex:2,marginLeft:10,justifyContent: "center",borderWidth: 1, backgroundColor: '#fff', height: 44,fontSize:16,}}
                onChangeText={this.props.onChangeText}
                //onChange={this.props.onChange}
                editable={this.props.editable}
                underlineColorAndroid='rgba(0,0,0,0)'
                placeholder={this.props.placeholder}
                borderColor='#fff'
                clearButtonMode='while-editing'
                value={this.props.value}
                >
              </TextInput>
          </View>
        </View>
      </View>

    )
  }

}


