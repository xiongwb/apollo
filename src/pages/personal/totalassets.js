
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

} from 'react-native';
import { Color } from 'ApolloConstant';
import {
  BasePage,
  BackNavBar,
  Moretxtin,
} from 'ApolloComponent'
import {
  COMMON_STYLES,
} from 'ApolloConstant'

import ScrollableTabView ,{DefaultTabBar, } from 'react-native-scrollable-tab-view';

/**
 * 总资产
 * zqf
 * 20170324
 */
var full_width = Dimensions.get('window').width;
var full_height = Dimensions.get('window').height;

class Totalassets extends BasePage {
          // <View style={{backgroundColor:'#ffe04a',height:35,width:full_width,justifyContent:'center',alignItems:'center'}}>
          //     <Text style={{fontSize:14,color:'#f65921',marginLeft:16,marginVertical:8}}>新用户首月转入立享高至10%的年化率收益</Text>
          // </View>
          
constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      //dataSource: ds.cloneWithRows(['row 1hj12655552', 'row 2'])
      dataSource: ds.cloneWithRows(['新用户首月转入立享高至10%的年化率收益'])
    };
   this._renderRow = this._renderRow.bind(this);
   //首先我们加一个分割线：
    //记得使用方法之前绑定
   // this._renderSeparator = this._renderSeparator.bind(this);
}
/**
 * ListView 的内容方法
 * @param {*} rowData 
 */
_renderRow(rowData) {
    return (
      <View style={{backgroundColor:'#ffe04a',height:35,width:full_width,justifyContent:'center',alignItems:'center'}}>
              <Text style={{fontSize:14,color:'#f65921',marginLeft:16,marginVertical:8}}>{rowData}</Text>
      </View>
    );
  }
   proRecord(){
    return (
      <ScrollView>
         <View style={[styles.tab1View,{marginTop:20,justifyContent:'space-around'}]}>
            <Text style={styles.tab3View_text1}>yi85****l</Text>
            <Text style={styles.tab3View_text1}>2000元</Text>
            <Text style={styles.tab3View_text1}>2017/04/20 15:12</Text>
         </View>
      </ScrollView>
    )
  }
    proInstruction(){
    return (
       <ScrollView>
         <View >
            <Text style={{marginLeft:10,marginTop:20,fontSize:14,color:'#e53343'}}>项目描述:</Text>
            <Text style={styles.tab2View_text1}>
            致力于成为向物流行业提供综合金融解决方案的互联网金融服务平台。
            高效融资: 解决快递公司包括物流货运车辆融资在内的需求，提供便捷高效的融资通道。
            安心理财: 帮助投资用户财富升值，获得稳定、较高的收益，从而提供安心、便捷、稳健的理财选择。
            多重安全保障
            多年金融领域专家经验总结应用投融资服务，层层尽职筛选优质项目；新华网-互联网经济权威媒体监督，实地调研、评估、报告平台安全情况；
            平安银行安全监管手段，为用户设立专项资金账户，资金流向公开透明；新华金典闭环风控系统科学项目安全把控，365天 7x24小时实时追踪。
            </Text>
         </View>
         <View >
            <Text style={{marginLeft:10,marginTop:20,fontSize:14,color:'#e53343'}}>企业信息:</Text>
            <Text style={styles.tab2View_text1}>
            建德市东润运输有限公司 / 奚**
            </Text>
         </View>
         <View >
            <Text style={{marginLeft:10,marginTop:20,fontSize:14,color:'#e53343'}}>担保详情:</Text>
            <Text style={styles.tab2View_text1}>
            桐庐鼎安汽车销售服务有限公司是一家专业从事汽车销售、购车按揭、上牌服务、车辆保险、代客年检的综合性汽车销售公司。
            是南京依维柯特别授权的全国快递物流行业用车渠道经销商（即一点对全国），同时福田欧曼、欧马可、跃进小箱货的全国代理商。
            </Text>
         </View>
         
      </ScrollView>
    );
  }

   proRules(){
    return (
      <ScrollView>
         <View style={[styles.tab1View,{marginTop:20}]}>
            <Text style={styles.tab1View_text1}>合同类型:</Text>
            <Text style={styles.tab1View_text2}>四方合同</Text>
         </View>
         <View style={styles.tab1View}>
            <Text style={styles.tab1View_text1}>起投金额:</Text>
            <Text style={styles.tab1View_text2}>100元</Text>
         </View>
         <View style={styles.tab1View}>
            <Text style={styles.tab1View_text1}>递增金额:</Text>
            <Text style={styles.tab1View_text2}>100元</Text>
         </View>
         <View style={styles.tab1View}>
            <Text style={styles.tab1View_text1}>剩余可投:</Text>
            <Text style={styles.tab1View_text2}>396050</Text>
         </View>
         <View style={styles.tab1View}>
            <Text style={styles.tab1View_text1}>还款方式:</Text>
            <Text style={styles.tab1View_text2}>到期还本付息</Text>
         </View>
         <View style={styles.tab1View}>
            <Text style={styles.tab1View_text1}>项目状态:</Text>
            <Text style={styles.tab1View_text2}>筹款中</Text>
         </View>
         <View style={styles.tab1View}>
            <Text style={styles.tab1View_text1}>发布时间:</Text>
            <Text style={styles.tab1View_text2}>2017-04-12  17:00:00</Text>
         </View>
         <View style={styles.tab1View}>
            <Text style={styles.tab1View_text1}>销售时间:</Text>
            <Text style={styles.tab1View_text2}>2017-04-12  17:00:00</Text>
         </View>
         <View style={styles.tab1View}>
            <Text style={styles.tab1View_text1}>起息时间:</Text>
            <Text style={styles.tab1View_text2}>2017-04-12  17:00:00</Text>
         </View>
      </ScrollView>
    );
  }
  render() {
    return (
    <View style={styles.root}>
      <BackNavBar  component={this}>总资产</BackNavBar>
      <View style={{justifyContent:'center',}}>
         <ListView 
         dataSource={this.state.dataSource}
         renderRow={this._renderRow}        
        />
         
       
        <View style={{height:full_height/3.5,backgroundColor:'#ed5565',}}>
           <View style={{marginTop:8,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>         
            <View style={[styles.lineHorMid]}></View>
            <Text style={{fontSize:14,color:'#ffffff',marginHorizontal:8}}>7日年化率 (%)</Text>
            <View style={[styles.lineHorMid]}></View>
           </View>

          <View style={{justifyContent:'center',alignItems:'center',marginVertical:6,}}>
            <Text style={{fontSize:30,color:'#ffffff'}}>3.8+6.2 (加息)</Text>
            <Text style={{fontSize:12,color:'#ffffff'}}>加息上限高至2015元</Text>
          </View>

          <View style={{justifyContent:'center',flexDirection:'row',alignItems:'center',marginVertical:16,marginHorizontal:8}}>
            <View style={[styles.itemMoney]}>
              <Text style={[styles.txtitem]}>昨日收益 (元)</Text>
              <Text style={{fontSize:20,color:'#ffffff'}}>12.05</Text>
            </View>
          
              <View style={[styles.lineLeftRight]}>
                <View style={[styles.itemMoney]}>
                  <Text style={[styles.txtitem]}>累计收益 (元)</Text>
                  <Text style={{fontSize:20,color:'#ffffff'}}>32.05</Text>
                </View>
              </View>
           <View style={[styles.itemMoney]}>
                <Text style={[styles.txtitem]}>总金额 (元)</Text>
                <Text style={{fontSize:20,color:'#ffffff'}}>32.05</Text>
            </View>
          </View>
        </View>
        
        <View style={{height:full_height*0.11,backgroundColor:'#ffffff',justifyContent:'center'}}>
          <View style={{marginHorizontal:24,}}>
          <Text style={{fontSize:14,color:'#4c4c4c'}}>请输入投资金额</Text>
           <Text style={{fontSize:14,color:'#4c4c4c',marginVertical:8}}>投资200元，30天最高可赚0.83+0.82元</Text>
           <View style={[styles.lineProcess]}></View>          
          </View>
        </View>
        
          <View style={{marginTop:10,height: 0.354 * full_height,marginRight:15,marginLeft:15,backgroundColor:'#ffffff'}}>
               <ScrollableTabView 
               style={{borderColor:'#ededed',borderWidth:1,}} 
               tabBarTextStyle={{fontSize:14}}
               tabBarUnderlineStyle={{borderColor:'#ed5565',borderWidth:2,}}
               tabBarActiveTextColor="#e53343"
               tabBarInactiveTextColor="#4d4d4d"
               renderTabBar={() => <DefaultTabBar />}>
                <View  tabLabel='产品概况'>
                  {this.proRules()}
                </View>
                <View  tabLabel='产品介绍'>
                  {this.proInstruction()}
                </View>
                <View  tabLabel='加息规则'>
                  {this.proRecord()}
                </View>
              </ScrollableTabView>
            </View>
            <View style={{flexDirection:'row',height:full_height*0.09,width:full_width,justifyContent:'center',alignItems:'center'}}>
              <View style={{width:full_width/2,height:full_height*0.09,justifyContent:'center',alignItems:'center',backgroundColor:'#ed5565',}}>
                <Text style={{fontSize:18,color:'#ffffff',}}>转入</Text>
              </View>
              <View style={{width:full_width/2,height:full_height*0.09,justifyContent:'center',alignItems:'center',backgroundColor:'#ffe04a',}}>
                <Text style={{fontSize:18,color:'#ffffff'}}>转出</Text>
              </View>
            </View>


      </View>
        
    </View>
      
     
    );
  }
}

const styles = StyleSheet.create({

   root: {
    backgroundColor: '#dddddd',//页面的布局和颜色
    flex: 1,  
  },
  txtitem:{
    fontSize:14,
    color:'#ffffff'
  },
  itemMoney:{
  marginHorizontal:16,
  height:54,
  justifyContent:'center',
  alignItems:'center',
  },
   tab1View: {
    height:0.05 * full_height,
    justifyContent:'space-between',
    alignItems:'center',
    flexDirection:'row'
  },
  tab1View_text1:{
    flex:1,
    alignSelf:'center',
    fontSize:16,
    color:'#353535'
  },
  tab1View_text2:{
    flex:2,
    alignSelf:'center',
    fontSize:16,
    color:'#353535'
  },
  tab2View_text1:{
    lineHeight:18,
    fontSize:10,
    color:'#101010'
  },
  tab3View_text1: {
    fontSize:16,
    color:'#353535'
  },
lineLeftRight: {
    borderLeftWidth: 1 / PixelRatio.get(),
    borderRightWidth: 1 / PixelRatio.get(),
    borderColor: '#ffe3e7',
    height:54
  },
  
  lineHorMid: {
    borderWidth:1/PixelRatio.get(),
    borderColor: '#ffe3e7',
    width:36,
   // height:10
  },
 
   lineProcess: {
     //投资进度线v1,no
    borderWidth:1/PixelRatio.get(),
    borderColor: '#ffe3e7',
    width:full_width*0.8,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#ed5565',
    //marginHorizontal:
    height:5,
    
  },


});

export default Totalassets