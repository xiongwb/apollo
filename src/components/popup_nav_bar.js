import React from 'react'

import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Platform,
} from 'react-native'

const styles = StyleSheet.create({
    root: {
      ...Platform.select({
        android:{
          height: 47,
        },
        ios:{
          paddingTop: 10,
          height: 64,
        }
      }),
      backgroundColor: '#fff',
      paddingHorizontal: 5,
      justifyContent: "center",
      alignItems: "center",
    },

    left: {
      position: "absolute",
      left: 10,
      top: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
    },

    right: {
      position: "absolute",
      right: 10,
      top: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
    },

    title: {
    },

    text: {
      fontSize: 20,
    },

})

export default class PopupNavbar extends React.Component {
  constructor(props) {
    super(props)
  }

  render_left() {
    if(this.props.leftContent){
      return (
        <View style={styles.left}>
          {this.props.leftContent}
        </View>
      )
    }else{
      return(
        <View style={styles.left}></View>
      )
    }

  }

  render_title() {
    if(this.props.titleContent){
      return(
        <View style={styles.title}>
          {this.props.titleContent}
        </View>
      )
    }else{
      return(
        <View style={styles.title}>
        </View>
      )
    }
  }

  render_right() {
    if(this.props.rightContent){
      return(
        <View style={styles.right}>
          {this.props.rightContent}
        </View>
      )
    }else{
      return(
        <View style={styles.right}>
        </View>
      )
    }
  }



  render() {
    return (
      <View style={styles.root}>
        {this.render_left()}     
        {this.render_title()}
        {this.render_right()}
      </View>
    )
  }
}

// 
// 