import {
  PixelRatio,
  Dimensions
} from 'react-native';
var onePt = 1 / PixelRatio.get(); //小屏幕适配  得到自小的宽度
var full_width = Dimensions.get('window').width;
var full_height = Dimensions.get('window').height;
const DEFAULT_STYLES = {
  BackNavBar: {
    backgroundColor: "#ED5565",
    backTextColor: "#fff",
    titleColor: "#fff",
  },
  textInput: {
    borderColor:'#9c9c9c',
    borderRadius:8,
    borderWidth:onePt,
    height:38,
    width:0.53 * full_width,
  },
}

export default DEFAULT_STYLES
