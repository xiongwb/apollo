import React, { Component, PropTypes } from 'react';
import { requireNativeComponent} from 'react-native';

//var NSKeyboard = requireNativeComponent('NSKeyboard', KeyboardComponent);

class KeyboardComponent extends React.Component {
  static propTypes = {
    /**
    *
    * 定义组件需要传到原生端的属性
    * 使用React.PropTypes来进行校验
    */
    placeholder:PropTypes.string,
    size:PropTypes.array,

  };

  render() {
    console.log("自定义组件");
    return (
      <NSKeyboard {...this.props} />
    );
  }
}
export default KeyboardComponent