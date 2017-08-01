/**
*  date:2017-03-07
*  author:zgx
*  see:利用swiper,animated,PanResponder实现3D轮播
*/
import React from 'react';

import { View, Animated, PanResponder, StyleSheet,Dimensions } from 'react-native';

/**
*  页面的样式
*/
var full_width = Dimensions.get('window').width
var full_height = Dimensions.get('window').height
const styles = StyleSheet.create({
    container :{
      alignItems:'center',
    },
    item: {
        position: 'absolute',
    },
});

export default class Swiper extends React.Component {
    state = {
        width: null,
    };
    position = new Animated.Value(0); // 当前在哪一页,移动了多远
    positionValue = 0;
    constructor(props) {
        super(props);
        this.position.addListener(v => {
            this.positionValue = v.value;
        });
    }
    onLayout = (ev) => {
        const width = ev.nativeEvent.layout.width;
        if (width !== this.state.width) {
            this.setState({
                width,
            });
        }
    };
    // 响应手势操作
    responder = PanResponder.create({
        // 要求成为响应者：
        onStartShouldSetPanResponder: (evt, gestureState) => false,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,  // 表示在滑动的时候抢走事件
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onShouldBlockNativeResponder: (evt, gestureState) => {
            // 返回一个布尔值，巨额定当前组件是否应该阻止原生组件成为js响应者
            // 默认返回true,目前暂时只支持android
            return true;
        },
        onPanResponderTerminationRequest: (evt, gestureState) => false, //是否允许被别人抢走事件

        onPanResponderGrant: (evt, gestureState) => {
            this.position.setOffset(this.positionValue);
            this.position.setValue(0);
        },
        //   onPanResponderMove: Animated.event ([
        //         null, {dx: this.value},
        //   ]),
        onPanResponderMove: (evt, { dx }) => {
            this.position.setValue(dx / -this.state.width)
        },
        // vx松手的速度
        onPanResponderRelease: (evt, { vx }) => {
            this.position.flattenOffset();
            const childrenCount = React.Children.count(this.props.children);
            // 此方法中的注释部分用于限制移动，未注释的用于循环
            // const left = Math.max(0,Math.floor(this.positionValue));
            const left = Math.floor(this.positionValue);
            // const right = Math.min(childrenCount-1, left + 1);
            const right = left + 1;
            let result;
            if (vx > 0.05) {
                result = left;
            } else if (vx < -0.05) {
                result = right;
            } else {
                result = Math.round(this.positionValue);
            }
            //循环
            if (result < 0) {
                result += childrenCount;
                this.position.setValue(this.positionValue + childrenCount);
            } else if (result >= childrenCount) {
                result -= childrenCount;
                this.position.setValue(this.positionValue - childrenCount);
            }
            Animated.spring(this.position, {
                toValue: result,
            }).start();
        },
    });

    render() {
        const { style, children } = this.props;
        const { width } = this.state;
        const r = Math.sqrt(3)/2 * width; // 调节间距
        if (!width) {
            <View style={style} onLayout={this.onLayout} />
        }

        return (
            <View
                style={[].concat(style, styles.container)}
                onLayout={this.onLayout}
                {...this.responder.panHandlers}
            >
                {
                    React.Children.map(children, (child, i) => {
                        return (
                            <Animated.View key={i} style={[styles.item, {
                                 opacity:this.position.interpolate({ inputRange: [i, i + 1],
                                            outputRange: [1, 1], }),
                                transform: [
                                    {scale:1},
                                    { perspective: 850 },
                                    // 实现的是tanslateZ (RN没有)
                                    { rotateY: '90deg' },
                                    { translateX: r },
                                    { rotateY: '-90deg' },

                                    {
                                        rotateY: this.position.interpolate({
                                            inputRange: [i, i + 1],
                                            outputRange: ['0deg', '-60deg'],
                                        })
                                    },
                                    
                                    { rotateY: '-90deg' },
                                    { translateX: r },
                                    { rotateY: '90deg' },
                                    // {
                                    //     translateX: this.position.interpolate({
                                    //         inputRange: [i, i + 1],
                                    //         outputRange: [0, -width],
                                    //     })
                                    // }
                                ]
                            }]}>
                                {child}
                            </Animated.View>
                        )
                    })}
            </View>
        )
    }
}
