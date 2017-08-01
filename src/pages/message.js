import React from 'react'
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ListView,
  Alert,
} from 'react-native'
/*消息提醒的第一步骤的页面
      张乐   2016-10-27*/
import {
  BasePage,
  BackNavBar,
} from 'AresComponent'
import {
  COMMON_STYLES,
} from 'AresConstant'
import Icon from 'react-native-vector-icons/FontAwesome'
import Button from 'antd-mobile/lib/button'
import List from 'antd-mobile/lib/list';
import { createForm } from 'rc-form'
import  Toast from 'antd-mobile/lib/toast';
import TextareaItem from 'antd-mobile/lib/textarea-item'
import Card from 'antd-mobile/lib/card'
import ImagePicker  from 'antd-mobile/lib/image-picker';
var full_height = Dimensions.get('window').height
const styles = StyleSheet.create({
 root: {
    backgroundColor: COMMON_STYLES.MAIN_BACKGROUND_COLOR,//页面的布局和颜色
    flex: 1,
  },
  title_box: {
    height: full_height/4,
    justifyContent: "center",
    alignItems:'center',
  },
   title_box1: {
    height: full_height/16,
    justifyContent: "center",
    alignItems:'center',

  },
  title_box2: {
     marginTop: 12,
    justifyContent: "center",
    alignItems:'center',
   height:20,
  },
  //页面中文字的颜色和大小
  title_text: {
    fontSize: 16,
    color: "#1056B4",
  },
  z_text: {
    fontSize: 14,
    color: "#1056B4",
  },
  p_text: {
    fontSize: 14,
    color: "#000",
     marginHorizontal: 16,
  },
  biao_text: {
    fontSize: 18,
    color: "#000",
  },
  time_text: {
    fontSize: 12,
    color: "#000",
  },

  next_btn: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  next_btn1: {
    marginTop: 18,

  }
});
var responseData = {'星期一 12:12':  [{wee:'星期一 12:12',week:'转账成功',date:'10月1日', count:'200.22',one:'付款方式:',two:'中国民生银行',stree:'对方账户:',ror:'时光那个(张三)123****2121',five:'转账说明:',nixt:'转账',}],
}
 class xizhi extends BasePage {
 constructor(props){
    super(props);
    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged:(s1,s2) => s1 !== s2
    });
    this.state = {
      dataSource: ds.cloneWithRowsAndSections(responseData),
    }
  }


  render() {
  	const  getFieldProps  = this.props.form;
  	const Brief = List.Item.Brief;
    return(
    	<View style={styles.root}>
    	  <BackNavBar component={this}  >消息提醒</BackNavBar>
        <TouchableOpacity onLongPress={() => this.props.navigator.push({id: "Check", params: {}})}>
        	<ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind()}
            renderSectionHeader={this.renderHeaderfunction.bind()}
          />
        </TouchableOpacity >
      </View>
    );
  }

renderHeaderfunction(sectionData,sectionId){
     return(
            <View style={styles.title_box2}>
              <Text style={{marginLeft:15,fontSize:15}}>{sectionId}</Text>
            </View>
  )
 }
  renderRow(rowData,sectionId) {
    return (
          <View style={{ height:300}}>
            <Card style={styles.next_btn} >
              <View style={{marginHorizontal: 16 }}>
                <Text style={styles.biao_text}>{rowData.week} </Text>
                <Text style={styles.time_text}>{rowData.date}</Text>
                <View style={styles.title_box1}>
                  <Text style={styles.biao_text}>{rowData.count+"元"}</Text>
                </View>
              </View>
              <Card.Body >
                <View style={{marginHorizontal: 16 }}>
                  <Text style={styles.next_btn1}>
                    <Text style={styles.p_text}>{rowData.one}</Text>
                    <Text style={styles.z_text}>{rowData.two}</Text>
                  </Text>
                  <Text style={styles.next_btn1}>
                    <Text style={styles.p_text}>{rowData.stree}</Text>
                    <Text style={styles.z_text}>{rowData.ror}</Text>
                  </Text>
                  <Text style={styles.next_btn1}>
                    <Text style={styles.p_text}>{rowData.five}</Text>
                    <Text style={styles.z_text}>{rowData.nixt}</Text>
                  </Text>
                </View>
                <List style={styles.next_btn1}/>
              </Card.Body>
              <View style={styles.next_btn1}>
                <Card.Footer content={<Text style={{color: "#000",height:20}}>查看详情</Text>}  extra="＞"/>
              </View>
            </Card>
          </View>
    )
  }

}
export default createForm()(xizhi)
