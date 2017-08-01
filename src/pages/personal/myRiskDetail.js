import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ART,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  PixelRatio,
  AsyncStorage,
  ListView,
  Platform,
} from 'react-native';

import ApolloAPI from 'ApolloAPI';
import { PlateFormUtils, StringUtils } from 'ApolloUtils';
import { BackNavBar,Investtextinput,Recordfinctxt,BasePage,Loading,PushLogin} from 'ApolloComponent';
import { Color, STORAGE_KEYS, COMMON_CONFIG } from 'ApolloConstant';

import Icon from 'react-native-vector-icons/FontAwesome'
var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
var full_width = Dimensions.get('window').width
var full_height = Dimensions.get('window').height

/**
 * 融资记录
 * zqf
 * 20170419
 */
export default class MyRiskDetail extends BasePage {

	constructor(props) {
      super(props);
      this.state = {
        
      };
  }

  componentDidMount(){
    this.get_loading().show();
    ApolloAPI.APIPersonal.riskDet({
      riskrcdid:this.props.riskrcdid,
    }).done((res_json, res)=>{
      if(res_json.retCode == 1 && res_json.riskrcddet!=null){
        this.get_loading().dismiss();
        this.setState({riskrcddet:res_json.riskrcddet})
      }else{
        this.get_loading().dismiss();
        Alert.alert('错误提示',res_json.retMsg)
      }
    })
  }

  get_loading() {
    return this.refs.loading;
  }

  renderRow(rowData) {
    return(
      <View style={{backgroundColor:'#ffffff',marginTop:9}}>
        <View style={{marginHorizontal:8,paddingHorizontal:8,borderColor:'#dddddd',borderWidth:onePt,backgroundColor:'#ffffff',borderRadius:5}}>
          <View style={{height:30,justifyContent:'center',borderBottomColor:'#dddddd',borderBottomWidth:1}}>
            <Text style={{fontSize:16,fontWeight:'bold',color:'#101010'}}>{rowData.sn+'、'+rowData.quename}</Text>
          </View>
          <View style={{flex:2,flexDirection:'row',justifyContent:'space-between'}} >
            <View style={{alignItems:'center',justifyContent:'flex-start',paddingTop:5,paddingBottom:5}}>
              <Text style={{fontSize:14,color:'#4d4d4d',marginBottom:8}}>选项</Text>
              <Text style={{fontSize:14,color:'#4d4d4d'}}>{rowData.answopt}</Text>
            </View>
            <View style={{justifyContent:'flex-start',paddingTop:5,width:full_width/2}}>
              <Text style={{fontSize:14,color:'#4d4d4d',marginBottom:8}}>答案</Text>
              <Text style={{fontSize:14,color:'#4d4d4d'}}>{rowData.answer}</Text>
            </View>
            <View style={{alignItems:'center',justifyContent:'flex-start',paddingTop:10}}>
              <Text style={{fontSize:14,color:'#4d4d4d',marginBottom:8}}>得分</Text>
              <Text style={{fontSize:14,color:'#4d4d4d'}}>{rowData.score}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  render() {
    if(this.state.riskrcddet==null){
      return (
        <View style={styles.container}>
          <BackNavBar style={{backgroundColor:'#ed5565'}} component={this}>
            评估详情
          </BackNavBar>
          <Loading ref={'loading'} />
        </View>
      )
    }else{
      let dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.state.riskrcddet);
      return (
        <View style={styles.container}>
          <BackNavBar style={{backgroundColor:'#ed5565'}} component={this}>
            评估详情
          </BackNavBar>
          <ListView
          dataSource={dataSource}
          renderRow={this.renderRow.bind(this)}
          />
          <Loading ref={'loading'} />
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.backgroundColor,
  },
  textStyle: {
    fontSize:21,
    color:'gray'
  },

});