/**
 * 筛选条件
 * zgx
 */
import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  PixelRatio,
  Dimensions,
  ScrollView,
  Platform
} from 'react-native';
import {Color} from 'ApolloConstant';
import {BasePage, BackNavBar, Moretxtin} from 'ApolloComponent'
//const {BlurView, VibrancyView} = require('react-native-blur');

var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
var full_width = Dimensions
  .get('window')
  .width;
var full_height = Dimensions
  .get('window')
  .height;
const commonColor = '#eb9700';

class ChoseCondition extends BasePage {
  static propTypes = {
    onItemSelected: React.PropTypes.func.isRequired,
  }; // 注意这里有分号

  constructor() {
    super()
    this.state = {
      blurBlurType: 'dark',
      commonColor:'#eb9700',
      id1:1,
      group1:1,
      id2:1,
      group2:2,
      id3:1,
      group3:3,
    }
  }
  commit = () => {
    let pressValue = []; 
    pressValue.push(
      {id1:this.state.id1,group1:this.state.group1},
      {id2:this.state.id2,group2:this.state.group2},
      {id3:this.state.id3,group3:this.state.group3},
    );
    return this.props.onItemSelected(pressValue);
    
  }
  reset = () => {
    return(
     this.setState({
      id1:1,
      group1:1,
      id2:1,
      group2:2,
      id3:1,
      group3:3,
    })
    )
  }
  onPressCond1(group,id) {
     if(group===1){
        this.setState({
          id1:id,
          group1:group,
        });
      }
      if(group===2){
        this.setState({
          id2:id,
          group2:group,
        });
      }
      if(group===3){
        this.setState({
          id3:id,
          group3:group,
        });
      }  
  }

  render() {

    return (
      <Image
        source={require('../../image/slider.png')}

        resizeMode='cover'
        style={styles.img}>
              <Text style={styles.welcome}>筛选条件</Text>
              <ScrollView scrollsToTop={false}  style={{ height: 0.5 * full_height }}>
                <View style={styles.conItems}>
                  <Text style={styles.conTitle}>预期收益率:</Text>
                  <View style={styles.conDetail}>
                    <TouchableOpacity  style={[styles.touchStyle,this.state.id1  === 1 && this.state.group1 ===1  && {borderColor:this.state.commonColor}]} onPress={() =>{this.onPressCond1(1,1)}}>
                      <Text style={[styles.conFont,this.state.id1  === 1 && this.state.group1===1  && {color:this.state.commonColor}]} >全部</Text>  
                    </TouchableOpacity>
                    <TouchableOpacity  style={[styles.touchStyle,this.state.id1  === 2 && this.state.group1===1  && {borderColor:this.state.commonColor}]} onPress={() =>{this.onPressCond1(1,2)}}>
                      <Text style={[styles.conFont,this.state.id1  === 2 && this.state.group1===1 && {color:this.state.commonColor}]} >6%以下</Text>  
                    </TouchableOpacity>
                    <TouchableOpacity  style={[styles.touchStyle,this.state.id1  === 3 && this.state.group1===1  && {borderColor:this.state.commonColor}]} onPress={() =>{this.onPressCond1(1,3)}}>
                      <Text style={[styles.conFont,this.state.id1  === 3 && this.state.group1===1  && {color:this.state.commonColor}]} >6%－7%</Text>  
                    </TouchableOpacity>
                  </View>
                  <View style={styles.conDetail}>
                    <TouchableOpacity  style={[styles.touchStyle,this.state.id1  === 4 && this.state.group1===1  && {borderColor:this.state.commonColor}]} onPress={() =>{this.onPressCond1(1,4)}}>
                      <Text style={[styles.conFont,this.state.id1  === 4 && this.state.group1===1  && {color:this.state.commonColor}]} >7%－8%</Text>  
                    </TouchableOpacity>
                    <TouchableOpacity  style={[styles.touchStyle,this.state.id1  === 5 && this.state.group1===1 && {borderColor:this.state.commonColor}]} onPress={() =>{this.onPressCond1(1,5)}}>
                      <Text style={[styles.conFont,this.state.id1  === 5 && this.state.group1===1  && {color:this.state.commonColor}]} >8%以上</Text>  
                    </TouchableOpacity>
                    <TouchableOpacity  style={[styles.touchStyle,{borderColor:'transparent'}]}>
                      <Text style={[styles.conFont]} ></Text>  
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.conItems}>
                  <Text style={styles.conTitle}>投资期限:</Text>
                  <View style={styles.conDetail}>
                    <TouchableOpacity  style={[styles.touchStyle,this.state.id2 === 1 && this.state.group2===2 && {borderColor:this.state.commonColor}]} onPress={() =>{this.onPressCond1(2,1)}}>
                      <Text style={[styles.conFont,this.state.id2  === 1 && this.state.group2===2 && {color:this.state.commonColor}]} >全部</Text>  
                    </TouchableOpacity>
                    <TouchableOpacity  style={[styles.touchStyle,{width:0.2 * full_width},this.state.id2  === 2 && this.state.group2===2 && {borderColor:this.state.commonColor}]} onPress={() =>{this.onPressCond1(2,2)}}>
                      <Text style={[styles.conFont,this.state.id2  === 2 && this.state.group2===2 && {color:this.state.commonColor}]} >90-180天</Text>  
                    </TouchableOpacity>
                    <TouchableOpacity  style={[styles.touchStyle,{width:0.23 * full_width},this.state.id2  === 3 && this.state.group2===2 && {borderColor:this.state.commonColor}]} onPress={() =>{this.onPressCond1(2,3)}}>
                      <Text style={[styles.conFont,this.state.id2  === 3 && this.state.group2===2 && {color:this.state.commonColor}]} >180-360天</Text>  
                    </TouchableOpacity>
                  </View>
                  <View style={styles.conDetail}>
                    <TouchableOpacity  style={[styles.touchStyle,{width:0.25 * full_width},this.state.id2  === 4 && this.state.group2===2 && {borderColor:this.state.commonColor}]} onPress={() =>{this.onPressCond1(2,4)}}>
                      <Text style={[styles.conFont,this.state.id2  === 4 && this.state.group2===2 && {color:this.state.commonColor}]} >360天及以上</Text>  
                    </TouchableOpacity>
                    <TouchableOpacity  style={[styles.touchStyle,{borderColor:'transparent'}]}>
                      <Text style={[styles.conFont]} ></Text>  
                    </TouchableOpacity>
                    <TouchableOpacity  style={[styles.touchStyle,{borderColor:'transparent'}]}>
                      <Text style={[styles.conFont]} ></Text>  
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.conItems}>
                  <Text style={styles.conTitle}>项目类型:</Text>
                  <View style={styles.conDetail}>
                    <TouchableOpacity  style={[styles.touchStyle,this.state.id3 === 1 && this.state.group3===3 && {borderColor:this.state.commonColor}]} onPress={() =>{this.onPressCond1(3,1)}}>
                      <Text style={[styles.conFont,this.state.id3 === 1 && this.state.group3===3 && {color:this.state.commonColor}]}  >全部</Text>  
                    </TouchableOpacity>
                    <TouchableOpacity  style={[styles.touchStyle,{width:0.2 * full_width},this.state.id3  === 2 && this.state.group3===3 && {borderColor:this.state.commonColor}]} onPress={() =>{this.onPressCond1(3,2)}}>
                      <Text style={[styles.conFont,this.state.id3  === 2 && this.state.group3===3 && {color:this.state.commonColor}]} >普通</Text>  
                    </TouchableOpacity>
                    <TouchableOpacity  style={[styles.touchStyle,{width:0.2 * full_width},this.state.id3  === 3 && this.state.group3===3 && {borderColor:this.state.commonColor}]} onPress={() =>{this.onPressCond1(3,3)}}>
                      <Text style={[styles.conFont,this.state.id3  === 3 && this.state.group3===3 && {color:this.state.commonColor}]} >代销</Text>  
                    </TouchableOpacity>
                  </View>
                  <View style={styles.conDetail}>
                    <TouchableOpacity  style={[styles.touchStyle,{width:0.2 * full_width},this.state.id3  === 4 && this.state.group3===3 && {borderColor:this.state.commonColor}]} onPress={() =>{this.onPressCond1(3,4)}}>
                      <Text style={[styles.conFont,this.state.id3  === 4 && this.state.group3 ===3 && {color:this.state.commonColor}]} >转让</Text>  
                    </TouchableOpacity>
                    <TouchableOpacity  style={[styles.touchStyle,{borderColor:'transparent'}]}>
                      <Text style={[styles.conFont]} ></Text>  
                    </TouchableOpacity>
                    <TouchableOpacity  style={[styles.touchStyle,{borderColor:'transparent'}]}>
                      <Text style={[styles.conFont]} ></Text>  
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.btnContainer]}>
                    <TouchableOpacity 
                    onPress={this.commit.bind(this)}
                    style={[styles.btn]} >
                      <Text style={[styles.textBtn]}>
                        确定
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.btnContainer]}>
                    <TouchableOpacity 
                    onPress={this.reset.bind(this)}
                    style={[styles.btn]} >
                      <Text style={[styles.textBtn]}>
                        重置
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{height:60,alignItems:'center',justifyContent:'center'}}>
                      <Text style={{color:'#fff',fontSize:12,marginTop:10}}>
                          我是有底线的
                      </Text>
                  </View>

                </View>

              </ScrollView>
      </Image>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
    android:{
      paddingTop:(Platform.Version >= 21)?10:0,
    },
    ios:{
      paddingTop: 20,
    }
    }),
    flex: 1,
    height:full_height,
    backgroundColor: 'transparent',
  },
  img: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    height: null,
    width: null,
  },
  welcome: {
    marginTop:20,
    fontSize: 16,
    marginLeft: 15,
    color: '#fff'
  },
  blurToggle: {
    position: 'absolute',
    top: 30,
    right: 10,
    alignItems: 'flex-end'
  },
  conTitle: {
    marginTop:10,
    fontSize: 14,
    marginLeft: 15,
    color: '#fff'
  },
  conItems: {
    marginLeft:10,
    marginRight:10,
  },
  touchStyle: {
    marginTop:10,
    backgroundColor:'transparent',
    borderColor:'#fff',
    borderRadius:4,
    borderWidth:onePt,
    width:0.17 * full_width,
    justifyContent: 'center',
    alignItems: 'center',
    height:32
  },
  conDetail: {
    flexDirection:'row',
    justifyContent:'space-around'
  },
  conFont: {
    fontSize:14,
    color:'#ffffff',
    fontWeight:'bold'
  },
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  btn:{
    width:0.5 * full_width,
    borderRadius:8,
    backgroundColor:'#fff',
    height:0.05 * full_height,
    justifyContent:'center',
    alignItems:'center',
    overflow:'hidden'
  },
  textBtn:{
    color:'#333333',
    fontSize:16
  }
});
export default ChoseCondition