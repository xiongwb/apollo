import React, { Component } from 'react';  
import {  
  StyleSheet,  
  Text,  
  View,  
  TouchableOpacity,  
  Animated,
  Dimensions
} from 'react-native';  
var full_width = Dimensions.get('window').width;
var full_height = Dimensions.get('window').height;
class ListCards extends Component {  
  constructor(props) {  
    super(props);  
    this.state={  
       ...props,  
       showAnim:new Animated.Value(0),
       is_true:false,
     };  
     this.showorhide=0;  
  }  
  
  _showorhideItems(){  
    // if(typeof(this.state.name)=='undefined'||this.state.name==null){  
    //   return;  
    // }
    Animated.timing(          // Uses easing functions  
       this.state.showAnim,    // The value to drive  
       {  
         toValue: this.showorhide==0?1:0  
       }            // Configuration  
     ).start();  
     this.showorhide=this.showorhide==0?1:0; 
     this.setState({
       is_true:!this.state.is_true,
     }) ;
    this.state.onPressArrow(!this.state.is_true);
  }  
  Down_Content(){
     if(this.state.down_content){
      return (
       <View style={[styles.showitemContain,{backgroundColor:this.state.backgroundColor}]}> 
          {this.state.down_content}
        </View>
      )
    }else{
      return(
         <View style={[styles.showitemContain,{backgroundColor:this.state.backgroundColor}]}></View>
      )
    }
  }
  
  render(){  
    return(  
      <View>  
        <TouchableOpacity onPress={this._showorhideItems.bind(this)}>  
         <View style={styles.headerRows}>
            <Text style={this.state.clickStyle}>{this.state.is_true==false ? '显示更多' : '点我隐藏'}</Text>
         </View>  
        </TouchableOpacity>  
        <Animated.View  
         style={{  
           height:this.state.showAnim.interpolate({  
             inputRange: [0, 1],  
             outputRange: [0, 110]  
           }),  
           overflow:'hidden'  
         }  
        }  
        >  
       {this.Down_Content()}
        </Animated.View>  
  
      </View>  
  
    )  
  }  
}  
  
const styles=StyleSheet.create({   
  headerRows:{  
    flex:1,  
    justifyContent:'center',  
    alignItems:'center',
    marginTop:5,
  },  
  showitemContain:{  
    height:0.16 * full_height,
    justifyContent:'center',  
    alignItems:'center',  
  },
});  
  
module.exports=ListCards;  