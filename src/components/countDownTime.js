import React, {
    Component,
    PropTypes,
} from 'react';

import {
    StyleSheet,
    View,
    Text,
    Image,
} from 'react-native';

const styles = StyleSheet.create({
  cardItemTimeRemainTxt: {
    fontSize: 20,
    color: '#ee394b'
  },
  text: {
    fontSize: 30,
    color: '#FFF',
    marginLeft: 7,
  },
  container: {
    flexDirection: 'row',
  },
  //时间文字
  defaultTime: {
    paddingHorizontal: 3,
    backgroundColor: 'rgba(85, 85, 85, 1)',
    fontSize: 12,
    color: 'white',
    marginHorizontal: 3,
    borderRadius: 2,
  },
  //冒号
  defaultColon: {
    fontSize: 12, color: 'rgba(85, 85, 85, 1)'
  }
});

class CountDown extends Component {
  static displayName = 'Simple countDown';
  static propTypes = {
    date: PropTypes.number,
    days: PropTypes.objectOf(PropTypes.string),
    hours: PropTypes.string,
    mins: PropTypes.string,
    segs: PropTypes.string,
    onEnd: PropTypes.func,

    // containerStyle: PropTypes.string,
    // daysStyle: PropTypes.string,
    // hoursStyle: PropTypes.string,
    // minsStyle: PropTypes.string,
    // secsStyle: PropTypes.string,
    // firstColonStyle: PropTypes.string,
    // secondColonStyle: PropTypes.string,

  };
  static defaultProps = {
    date: new Date(),
    days: {
      plural: '天',
      singular: '天',
    },
    hours: ':',
    mins: ':',
    segs: ':',
    onEnd: () => {},

    containerStyle: styles.container,//container 的style
    daysStyle: styles.defaultTime,//天数 字体的style
    hoursStyle: styles.defaultTime,//小时 字体的style
    minsStyle: styles.defaultTime,//分钟 字体的style
    secsStyle: styles.defaultTime,//秒数 字体的style
    firstColonStyle: styles.defaultColon,//从左向右 第一个冒号 字体的style
    secondColonStyle: styles.defaultColon,//从左向右 第2个冒号 字体的style

  };
  state = {
    days: 0,
    hours: 0,
    min: 0,
    sec: 0,
    countDown:0,
    date:0,
  };
  componentDidMount() {
      
    //console.log(this.props.date);//"2017-03-29T00:00:00+00:00"\
       let date1 = this.state.date;
       this.timer = setInterval(() => {
         if (date1>0) {
            date1 = date1 -1;
            this.setState({
                date:date1,
            });  
         }  else {
            this.timer &&  clearInterval(this.timer);
            this.props.onEnd();
        }
        }, 1000);
    
  }
   
  componentWillMount() {
    const date = this.props.date;
    if (date) {
      this.setState({date:date});
    }

  }
  componentWillUnmount() {
      this.timer &&  clearInterval(this.timer);
      this.setState({date:null});
  }
  getDateData(diff) {
    //let diff = (Date.parse(new Date(endDate)) - Date.parse(new Date)) / 1000;
    if (diff <= 0) {
      return false;
    }

    const timeLeft = {
      years: 0,
      days: 0,
      hours: 0,
      min: 0,
      sec: 0,
      millisec: 0,
    };

    if (diff >= (365.25 * 86400)) {
      timeLeft.years = Math.floor(diff / (365.25 * 86400));
      diff -= timeLeft.years * 365.25 * 86400;
    }
    if (diff >= 86400) {
      timeLeft.days = Math.floor(diff / 86400);
      diff -= timeLeft.days * 86400;
    }
    if (diff >= 3600) {
      timeLeft.hours = Math.floor(diff / 3600);
      diff -= timeLeft.hours * 3600;
    }
    if (diff >= 60) {
      timeLeft.min = Math.floor(diff / 60);
      diff -= timeLeft.min * 60;
    }
    timeLeft.sec = diff;
    return timeLeft;
  }
  render() {
    //this.dajishi(this.state.date);
    let countDown = this.getDateData(this.state.date);
    let days;
    if (countDown.days === 1) {
    days = this.props.days.singular;
    } else {
    days = this.props.days.plural;
    }
    return (
        
            this.state.date == 0 ?
            null
            :
            <View style={this.props.containerStyle}>
                { (countDown.days>0) ? 
                    <Text style={this.props.hoursStyle}>{ this.leadingZeros(countDown.days*24 + countDown.hours)}</Text> 
                    : 
                    <Text style={this.props.hoursStyle}>{ this.leadingZeros(countDown.hours)}</Text>
                }
                
                <Text style={ this.props.firstColonStyle}>:</Text>
                <Text style={this.props.minsStyle}>{this.leadingZeros(countDown.min)}</Text>
                <Text style={this.props.secondColonStyle}>:</Text>
                <Text style={this.props.secsStyle}>{this.leadingZeros(countDown.sec)}</Text>
                </View>
        
    );
  }
  
  leadingZeros(num, length = null) {

    let length_ = length;
    let num_ = num;
    if (length_ === null) {
      length_ = 2;
    }
    num_ = String(num_);
    while (num_.length < length_) {
      num_ = '0' + num_;
    }
    return num_;
  }
};

export default CountDown;