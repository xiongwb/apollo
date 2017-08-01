/**
zgx
*/
import React from 'react'

import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  StatusBar,
  ART,
  Alert,
  TouchableOpacity,
  Platform,
  TextInput,
  ListView,
} from 'react-native'

import {
  COMMON_STYLES,
  COMMON_CONFIG
} from 'ApolloConstant'
import {
  BasePage,Loading,BackNavBar
} from 'ApolloComponent'

import Icon from 'react-native-vector-icons/FontAwesome'

import _ from 'lodash';
//import data from '../constants/city.json'
import WhiteSpace from 'antd-mobile/lib/white-space'
import WingBlank from 'antd-mobile/lib/wing-blank'
import ApolloAPI from 'ApolloAPI';

const {Surface, Shape, Path} = ART;

const full_width = Dimensions.get('window').width
const full_height = Dimensions.get('window').height

const common_color='#abaeb3'
const select_color='#cd9e6a'


const {width,height} = Dimensions.get('window')
const SECTIONHEIGHT = 30,ROWHEIGHT = 40
//这是利用lodash的range和数组的map画出26个英文字母
const letters = _
    .range('A'.charCodeAt(0), 'Z'.charCodeAt(0) + 1)
    .map(n => String.fromCharCode(n).substr(0))
    _.pull(letters)
const city=[]//城市的数组
const totalheight=[];//每个字母对应的城市和字母的总高度
const that = null


const styles = StyleSheet.create({
  root: {
    backgroundColor: COMMON_STYLES.MAIN_BACKGROUND_COLOR,
    //flex: 1,
    height: full_height,
    width: full_width
  },
  text: {
    fontSize: 30,
    color: "#000",
  },
  head_img:{
    backgroundColor: 'white',
    ...Platform.select({
      android:{
        height:(Platform.Version >= 21)?74:54,
        paddingTop:(Platform.Version >= 21)?20:0,
      },
      ios:{
        height: 74,
        paddingTop:20,
      }
    })
  },
  segment_text:{
    fontSize:17,
  },
  contentContainer: {
      width: width,
      backgroundColor: 'white',
  },
  letters: {
      position: 'absolute',
      height: height-150,
      top: 0,
      bottom: 0,
      right: 10,
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
  },
  letter: {
      height: height*0.03,
      width: width*3/50,
      justifyContent: 'center',
      alignItems: 'center',

  },
  letterText: {
      textAlign: 'center',
      fontSize: height*1.1/50,
      color:'rgb(40,169,185)'
  },
  rowdata:{
      borderBottomColor:'#faf0e6',
      borderBottomWidth:0.5
  },
  body_body:{
    height:150,
    backgroundColor:'#fff',
    borderColor:'#dddddd',
    borderTopWidth:1,
    borderBottomWidth:1,
    borderLeftWidth:1,
    borderRightWidth:1,
    alignItems:'center',
    justifyContent: 'center',
  },
  body_head:{
    flexDirection:'row',
    flex:1,
    alignItems:'center',
    borderColor:'#dddddd',
    borderBottomWidth:1,
  },
  body_in:{
    flex:1,
    height:50,
    alignItems:'center',
    borderLeftWidth:1,
    borderRightWidth:1,
    borderColor:'#dddddd',
    justifyContent: 'center',
  },
  rowdatatext:{
      color:'gray',
  }
})

class AccountOpen extends BasePage {

  constructor(props) {
    super(props)
    var getSectionData = (dataBlob, sectionID) => {
    return dataBlob[sectionID];
    };
    var getRowData = (dataBlob, sectionID, rowID) => {
    return dataBlob[rowID];
    };
    this.state = {
      is_around_selected:true,
      is_like_selected:false,
      around_text_color : select_color,
      like_text_color : common_color,
      around_line_color: select_color,
      like_line_color: '#fff',
      current_page:0,
      text:null,

    dataSource:new ListView.DataSource({
       getRowData: getRowData,
       getSectionHeaderData: getSectionData,
       rowHasChanged: (row1, row2) => row1 !== row2,
       sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
       }),
  }
  that = this

  }
  get_loading() {
    return this.refs.loading;
  }
  componentDidMount () {
    this.get_loading().show();
    //把银行放到对应的字母中
    ApolloAPI.APIcard.getAccountBankList({
        cityCode:this.props.accountBank.state.cityCode,
        bankcode:this.props.accountBank.state.bankcode
    }).done((res_json, res) => {
       city =[];
        
        if (res_json.retCode === 1) {
          for(let i = 0;i<res_json.list.length;i++){
              let eachName =[];
              let eachCode = [];
              eachName.push(res_json.list[i].branchname);
              eachCode.push(res_json.list[i].interbankno);
                 
              let _city={}
              _city.index = "";
              _city.name = eachName;
              _city.code = eachCode;
              city.push(_city);
              
          }

            let dataBlob = {};
            let sectionIDs = [];
            let rowIDs = [];
            //console.log('取到的银行为：',city);
            for(let ii = 0;ii<city.length;ii++){
                var sectionName = 'Section ' + ii;
                sectionIDs.push(sectionName)
               // dataBlob[sectionName] = letters[ii]
                rowIDs[ii] = [];

                for(let j = 0;j<city[ii].name.length;j++){
                    var rowName = ii + '-' + j;
                    rowIDs[ii].push(rowName)
                    dataBlob[rowName] = city[ii].name[j] + "-" + city[ii].code[j]
                }
                //计算每个字母和下面城市的总高度，递增放到数组中
                // var eachheight = this.props.sectionHeight+this.props.rowHeight*newcity.length
                var eachheight = SECTIONHEIGHT+ROWHEIGHT*city[ii].name.length
                totalheight.push(eachheight)
            }
            this.setState({
                    dataSource:this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs)
                })
            this.get_loading().dismiss();


        }})
  }
  renderRow(rowData,rowId){
      let rowName = rowData.split("-");
      return (
          <TouchableOpacity
              onPress = {() => {that.selectedLocation(rowData)}}
              key={rowId}
              style={{height:ROWHEIGHT,justifyContent:'center',paddingLeft:20,paddingRight:30}}
           >
           <View style={styles.rowdata}><Text style={styles.rowdatatext}>{rowName[0]}</Text></View>

          </TouchableOpacity>
      )
  }
  selectedLocation(rowData){
    let rowName = rowData.split("-");
    this.props.accountBank.state.branchname = rowName[0];
    this.props.accountBank.state.interbankno = rowName[1];
    this.props.navigator.pop();
  }
  setBankName(bankname,bankcode){
    this.props.accountBank.state.branchname = bankname;
    this.props.accountBank.state.interbankno = bankcode;
    this.props.navigator.pop();
  }
  renderSectionHeader = (sectionData, sectionID) => {
      return (
      <View style={{height:SECTIONHEIGHT,justifyContent:'center',paddingLeft:5}}>
          <Text  style={{color:'rgb(40,169,185)',fontWeight:'bold'}}>
          {sectionData}
          </Text>
      </View>
      )
  }
  // render ringht index Letters
  renderLetters(letter, index) {
      return (
          <TouchableOpacity key={index} activeOpacity={0.6} onPress={()=>{this.scrollTo(index)}}>
              <View style={styles.letter}>
                  <Text style={styles.letterText}>{letter}</Text>
              </View>
          </TouchableOpacity>
      )
  }
/*      //回调改变显示的城市
  changedata=(cityname)=>{
      this.props.changeCity(cityname)
  }
*/
  //touch right indexLetters, scroll the left
  scrollTo=(index)=>{
      let position=0;
      for(let i = 0;i<index;i++){
          position += totalheight[i]
      }
      this._listView.scrollTo({
          y:position
      })
  }


  financial_overview(){
    return(
      <View style={{height: Dimensions.get('window').height,marginBottom:100}}>
          <ListView
          contentContainerStyle={styles.contentContainer}
          ref={listView => this._listView = listView}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderSectionHeader={this.renderSectionHeader}
          enableEmptySections={true}
          initialListSize={500}
          />
      </View>
      )
  }


  render() {
    return(
      <View style={styles.root}>
        <BackNavBar  style={{backgroundColor:'#ed5565'}} component={this}>选择开户行</BackNavBar>
      <View>
        <WhiteSpace size='md' />
        <View style={{width:full_width,height:full_height,marginBottom:200}}>
            {this.financial_overview()}
        </View>
      </View>
      <Loading ref="loading"/>
    </View>
  )
  }
}

export default AccountOpen