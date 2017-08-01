/**
zgx
*/

import React from 'react'

import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  AsyncStorage,
} from 'react-native'

import {
  STORAGE_KEYS,
} from 'ApolloConstant'

var full_width = Dimensions.get('window').width
var full_height = Dimensions.get('window').height

var TimerMixin = require('react-timer-mixin');

class Loading extends React.Component {
  //mixins: [TimerMixin],
  constructor(props) {
    super(props)
    var timer = null
  }

runToHomePage(){
  this.props.navigator.replace({id: "HomePage",params:{}})
}

runToDashBoard(){
  this.props.navigator.replace({id: "Dashboard",params:{}})
}

async  select(){

      let text = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_USE);
        if(text !== "UNFIRST_USE"){
          await AsyncStorage.setItem(STORAGE_KEYS.FIRST_USE,"UNFIRST_USE");
          this.timer = setTimeout(
              () => {this.runToHomePage()},
              800
            );

        }else if (text === "UNFIRST_USE") {
          this.timer = setTimeout(
              () => {this.runToDashBoard()},
             800
           );
        }
  }

  componentDidMount() {
    this.select()
  }
  componentWillUnmount() {
      this.timer &&  clearTimeout(this.timer);
  }
  render(){
    return(
      <View>
        <Image
         style={{width:full_width,height:full_height-20}}
         resizeMode="stretch"
         source={require('../image/loading.png')}/>
      </View>
    )
  }


}

export default Loading
