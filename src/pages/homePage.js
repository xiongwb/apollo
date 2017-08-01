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
  StatusBar,
} from 'react-native'
var full_width = Dimensions.get('window').width
var full_height = Dimensions.get('window').height
var Swiper = require('react-native-swiper');

class BtforHome extends React.Component{
  constructor(props) {
    super(props)
  }

onPress(){
  this.props.navig.replace({id: "Dashboard", params: {}})
}

render(){
  return(
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <TouchableOpacity onPress={this.onPress.bind(this)} style={{width:full_width,height:full_height}}>

      </TouchableOpacity>
    </View>
  )
}
}

class HomePage extends React.Component {
  constructor(props) {
    super(props)

  }

  showImg(){
   var imageViews=[];
   imageViews.push(
     <Image
         key={0}
         style={{width:full_width,height:full_height-20}}
         resizeMode ='stretch'
         source={require('../image/homepage1.jpg')}
         />,
     <Image
         key={1}
         style={{width:full_width,height:full_height-20}}
         resizeMode="stretch"
         source={require('../image/homepage2.jpg')}
         />,
     <Image
         key={2}
         style={{width:full_width,height:full_height-20}}
         source={require('../image/homepage3.jpg')}
         resizeMode="stretch"
         justifyContent='center'
         alignItems='center'
         ><BtforHome navig={this.props.navigator}></BtforHome></Image>
   )
   return imageViews;
 }

  like_view() {
    return(
        <Swiper
                  loop={false}
                  index={0}
                  showsPagination={false}
            >{this.showImg()}
        </Swiper>
      )
}


render(){
  return(
    <View>
      <StatusBar backgroundColor='#ff0000'
          translucent={true}
          hidden={true}
          animated={true}/>
        <View>{this.like_view()}</View>
    </View>
  )
}
}

export default HomePage
