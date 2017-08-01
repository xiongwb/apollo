
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  ScrollView,
  SegmentedControlIOS,
  Switch,
  ART,
  PixelRatio,
  ListView,
  AsyncStorage,
  Platform,
  Alert
} from 'react-native';
import { Color, COMMON_CONFIG, STORAGE_KEYS } from 'ApolloConstant';
import {
  BasePage,
  BackNavBar,
  Moretxtin,
  Loading,
} from 'ApolloComponent'
import {
  COMMON_STYLES,
  EVENT_EMITTER_CONST
} from 'ApolloConstant'
import CheckboxList from '../../components/rn_checkboxList/index';
import{PlateFormUtils} from 'ApolloUtils';
import ApolloAPI from 'ApolloAPI';
import SwiperNative from 'react-native-swiper';
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter';
/**
 * 风险评估测试题1
 * zqf
 * 2017/04/12
 */
var full_width = Dimensions.get('window').width;
var full_height = Dimensions.get('window').height;
var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度

const score = "";

class RiskTestQuestion extends BasePage {
  constructor(props){
    super(props)
    this.state={
      riskQuesList:[],
      totalCount:'',
    }
  }

  componentDidMount(){
    this.request_api();
  }

  get_loading() {
    return this.refs.loading;
  }

  request_api(){
    //获取风险评估题目
    this.get_loading().show();
    ApolloAPI.APIPersonal.getRiskTempDet({
      risktempid:this.props.risktempId,
    }).done((res_json, res)=>{
      this.get_loading().dismiss();
      if(res_json.retCode === 1){
        let questionList = [];
        for(let i in res_json.riskTempDetVOList){
          let obj = res_json.riskTempDetVOList[i];
          obj['index'] = i
          questionList.push(obj)
        }
        this.setState({
          riskQuesList:res_json.riskTempDetVOList,
          totalCount:res_json.riskTempDetVOList.length
        })
      }else{
         PlateFormUtils.plateFormAlert(Platform,'错误提示',"风险评估题目信息未获得!");
      }
    })
  }

  setAnswer(index,option,score,answer){
    let obj = {};
    let idx = 'option'+index;
    obj[idx]= option;
    let idx1 = 'score'+index;
    obj[idx1] = score;
    let idx2 = 'answer'+index;
    obj[idx2] = answer
    this.setState(obj)
  }

  renderAnswer(list,index){
    let anwserList = [];
    for(let i in list){
      let idx = 'option'+index;
      if(this.state[idx]==list[i].riskanswertype){
        anwserList.push(
          <TouchableOpacity style={{marginBottom:5}} key={index+'_'+i} onPress={()=>this.setAnswer(index,list[i].riskanswertype,list[i].riskanswerscore,list[i].riskanswername)}>
              <Text style={{fontSize:14,color:'#ed5565'}}>{list[i].riskanswertype+' '+list[i].riskanswername}</Text>
          </TouchableOpacity>
        )
      }else{
        anwserList.push(
          <TouchableOpacity style={{marginBottom:5}} key={index+'_'+i} onPress={()=>this.setAnswer(index,list[i].riskanswertype,list[i].riskanswerscore,list[i].riskanswername)}>
              <Text style={{fontSize:14,color:'#4D4D4D'}}>{list[i].riskanswertype+' '+list[i].riskanswername}</Text>
          </TouchableOpacity>
        )
      }
    }
    return anwserList
  }

  renderRow(rowData,sectionId){
    let question = (parseInt(rowData.index)+1)+'、'+rowData.riskquestionname;
    return(
      <View style={{paddingHorizontal:10,backgroundColor:'#fff',borderBottomColor:'#dddddd',borderBottomWidth:1}}>
        <View style={{marginTop:5,marginBottom:5}}>
          <Text style={{fontSize:16,color:'#000000'}}>{question}</Text>
        </View>
        <View style={{marginLeft:15}}>
          {this.renderAnswer(rowData.list,rowData.index)}
        </View>
      </View>
    )
  }

  async submit(){
    let count = 0;
    let flag = true;
    let newRiskEvaDetVOList = [];
    for(let i=0;i<this.state.riskQuesList.length;i++){
      let idx = 'option'+i;
      let option = this.state[idx]
      let idx1 = 'score'+i;
      let score = parseInt(this.state[idx1]);
      let idx2 = 'answer'+i;
      let answer = this.state[idx2]
      if(option==null){
        flag = false;
        let listView = this.refs.listView
        let y = 127*i;
        listView.scrollTo({x: 0, y: y, animated: true})
        PlateFormUtils.plateFormAlert(Platform,'提示',"请回答第"+(i+1)+"题!");
        break;
      }else{
        count = count + score;
        newRiskEvaDetVOList.push({
          sn:this.state.riskQuesList[i].sn,
          quename:this.state.riskQuesList[i].riskquestionname,
          answopt:option,
          answer:answer,
          score:score
        })
      }
    }
    if(flag){
      let month = new Date().getMonth()+1;
      if(month.toString.length ==1){
          month= '0' + month;
      }
      let date=  new Date().getFullYear() + '-'+month+'-'+new Date().getDate();
      let value = await AsyncStorage.getItem(STORAGE_KEYS.SIGN_TOKEN);
        let hash = JSON.parse(value);
        if(!!hash && hash.retCode == 1 && hash.retMsg){
          this.get_loading().show();
          ApolloAPI.APILogin.getloginState({
            tenantNo:COMMON_CONFIG.tenantNo
          }).done((res_json, res) => {
            if(res_json.retCode == 1){
              ApolloAPI.APIPersonal.saveRiskRcd({
                tenantno:COMMON_CONFIG.tenantNo,
                telno:hash.retMsg,
                evadate:date,
                risktempid:this.props.risktempId,
                score:count,
                newRiskEvaDetVOListStr:JSON.stringify(newRiskEvaDetVOList)
              }).done((res_json, res)=>{
                this.get_loading().dismiss();
                if(res_json.retCode === 1){
                  RCTDeviceEventEmitter.emit(EVENT_EMITTER_CONST.RISKTESTQTSUCCESS, 'riskTestQT'); 
                  PlateFormUtils.plateFormAlert(Platform,'提示',"提交成功");
                  this.props.navigator.popN(2);
                }else{
                  Alert.alert('错误提示',res_json.retMsg);
                }
              })
            }else{
              this.get_loading().dismiss();
              PlateFormUtils.plateFormAlert(Platform,"提示","登录超时，为了安全，请重新登录!");
              this.props.navigator.push({id:'Login',params:{}});
            }
          })
        }else{
          PlateFormUtils.plateFormAlert(Platform,"错误提示","您还未登录或注册!");
          this.props.navigator.push({id:'Login',params:{}});
        }
    }
  }

  render() {
    if(this.state.riskQuesList!=null&&this.state.riskQuesList.length>0){
      let dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(this.state.riskQuesList);
      return (
        <View style={styles.root}>
          <BackNavBar 
            component={this}
            rightContent={
              <TouchableOpacity onPress={()=>this.submit()}>
                <Text style={{fontSize:16,color:'#FFFFFF'}}>提交</Text>
              </TouchableOpacity>
            }
          >
            风险评估
          </BackNavBar>
          <View style={{height:full_height*0.11,backgroundColor:'#ffffff'}}>
            <View style={{marginHorizontal:18,marginVertical:24,flexDirection:'row',}}>
              <Text style={{fontSize:12,color:'#4d4d4d'}}>根据评估结果，您的风险承受能力将属于以下五种类型：安益型、保守型、稳健型、积极型、激进型。
              </Text>
            </View>
          </View>
          <View style={{height:full_height*0.05,backgroundColor:'#ffffff',justifyContent:'center',alignItems:'flex-end'}}>
            <Text style={{fontSize:14,color:'#808080',marginRight:12,marginTop:16}}>共{this.state.totalCount}道题</Text>
          </View>
          <ListView
            ref={'listView'}
            dataSource={dataSource}
            renderRow={this.renderRow.bind(this)}
          />
          <Loading ref={'loading'} />
        </View>
      );
    }else{
      return (
        <View style={styles.root}>
          <BackNavBar component={this}>风险评估</BackNavBar>
          <View style={{height:full_height*0.11,backgroundColor:'#ffffff'}}>
            <View style={{marginHorizontal:18,marginVertical:24,flexDirection:'row',}}>
              <Text style={{fontSize:12,color:'#4d4d4d'}}>根据评估结果，您的风险承受能力将属于以下五种类型：安益型、保守型、稳健型、积极型、激进型。
              </Text>
            </View>
          </View>
          <Loading ref={'loading'} />
        </View>
      );
    }
    
  }
}

const styles = StyleSheet.create({

  root: {
    backgroundColor: '#dddddd',//页面的布局和颜色
    flex: 1,
  },
  
});

export default RiskTestQuestion