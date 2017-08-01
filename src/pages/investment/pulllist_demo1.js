import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    ListView,
    Dimensions,
    Image
} from 'react-native';
import Header from '../header';

import {PullList} from 'react-native-pull';
import icon_up from '../../images/icon_up.png';
import icon_down from '../../images/icon_down.png';

// const URL = 'http://localhost:7070/api/apartment/list.ajax';
import LIST_DATA_JSON from './apartment-list-data.json';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

let pageNo = 0;

export default class ApartmentListDemo extends Component {

    constructor(props) {
        super(props);
        this.dataSource = [];
        this.state = {
            list: (new ListView.DataSource({
                rowHasChanged: (r1, r2) => r1 !== r2
            })).cloneWithRows(this.dataSource),
            hasNext: true
        };

    }

    onPullRelease(resolve) {
        this._fetchData(true, resolve);
    }
    _fetchData(initFlag, callback) {
      var that = this;

      setTimeout(function(){

        callback();


        if (initFlag) {
            that.dataSource = LIST_DATA_JSON.dataList;
        } else {
            for (var j = 0; j < LIST_DATA_JSON.dataList.length; j++) {
                that.dataSource.push(LIST_DATA_JSON.dataList[j]);
            }
        }

        that.setState({
            list: that.state.list.cloneWithRows(that.dataSource),
            hasNext: LIST_DATA_JSON.hasNext
        });

      },3000);

    }

    _fetchData2(initFlag, callback) {
        let params = {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json' //记得加上这行，不然bodyParser.json() 会识别不了
            },
            body: JSON.stringify({cityName: "sanya", pageNum: pageNo})
        };

        //let URL = 'http://www.baidu.com/';
        fetch(URL, params).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                console.error('服务器繁忙，请稍后再试；\r\nCode:' + response.status);
            }
        }).then((data) => {
            console.log(data);
            callback();

            if (initFlag) {
                this.dataSource = data.dataList;
            } else {
                for (var j = 0; j < data.dataList.length; j++) {
                    this.dataSource.push(data.dataList[j]);
                }
            }

            this.setState({
                list: this.state.list.cloneWithRows(this.dataSource),
                hasNext: data.hasNext
            });

        }).catch((err) => {
            console.error(err);
            callback();
        });

    }

    topIndicatorRender(pulling, pullok, pullrelease) {
        if (pulling) {
            return (
                <View style={styles.pullViewHeader}>
                    <Image source={icon_down} style={styles.pullViewHeaderIcon}/>
                    <Text>
                        下拉刷新
                    </Text>
                </View>
            );
        }

        if (pullrelease) {
            return (
                <View style={styles.pullViewHeader}>
                    <ActivityIndicator
                        style={{
                        marginRight: 10
                    }}
                        size="small"
                        color="gray"/>
                    <Text>
                        数据加载中...
                    </Text>
                </View>
            );
        }
        if (pullok) {
            return (
                <View style={styles.pullViewHeader}>
                    <Image source={icon_up} style={styles.pullViewHeaderIcon}/>
                    <Text>
                        释放更新
                    </Text>
                </View>
            );
        }

    }

    render() {
        return (
            <View style={styles.container}>
                <PullList
                    enableEmptySections={true}
                    style={styles.pullListView}
                    contentContainerStyle={styles.pullListViewCont}
                    onPullRelease={this.onPullRelease.bind(this)}
                    topIndicatorRender={this.topIndicatorRender.bind(this)}
                    dataSource={this.state.list}
                    pageSize={5}
                    initialListSize={5}
                    renderRow={this.renderRow.bind(this)}
                    onEndReached={this.loadMore.bind(this)}
                    renderFooter={this.renderFooter.bind(this)}
                    onEndReachedThreshold={60}/>
            </View>
        );
    }

    renderRow(item, sectionID, rowID, highlightRow) {
        return (
            <View style={styles.rowItem}>
                <Image
                    source={{
                    uri: item.faceUrl
                }}
                    style={styles.rowItemImg}/>
                <Text style={styles.rowItemText}>{item.name}</Text>
            </View>
        );
    }

    renderFooter() {
        if (!this.state.hasNext) {
            return <Text >没有更多数据了</Text>;
        }
        return (
            <View style={styles.footerView}>
                <ActivityIndicator
                    style={{
                    marginRight: 10
                }}/>
                <Text style={{}}>数据加载中...</Text>
            </View>
        );
    }

    loadMore() {
        if (!this.state.hasNext) {
            return;
        }

        pageNo++;
        this._fetchData(false, function() {});
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffffff'
    },
    pullViewHeader: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    pullViewHeaderIcon: {
        width: 32,
        height: 32,
        marginRight: 20
    },
    pullListView: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 30
    },
    pullListViewCont: {
        backgroundColor: '#ccc'
    },
    rowItem: {
        margin: 10,
        height: 250,
        backgroundColor: '#fafafa',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    rowItemText: {
        height: 20
    },
    rowItemImg: {
        flex: 1,
        height: 200,
        width: DEVICE_WIDTH - 20
    },
    footerView: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
json数据结构如下

{
  "bizCode": 0,
  "errMsg": "ok",
  "dataList": [
    {
      "id": 101,
      "name": "三亚月亮湾海景度假公寓 联系电话18789839515",
      "priceDescp": "1000-3000",
      "areaName": "三亚",
      "faceUrl": "http://laowantong2016.b0.upaiyun.com/201611/f2989988-e5a9-4a94-aae7-c40e1fcb7636.jpg"
    },
    {
      "id": 103,
      "name": "三亚海棠福湾沙滩海景度假村15338998638（微信）",
      "priceDescp": "1200-5000",
      "areaName": "三亚",
      "faceUrl": "http://laowantong2016.b0.upaiyun.com/201611/f2989988-e5a9-4a94-aae7-c40e1fcb7636.jpg"
    },
    {
      "id": 102,
      "name": "三亚名门海岸大酒店（高端）15338998638",
      "priceDescp": "4500-5000",
      "areaName": "三亚",
      "faceUrl": "http://static.yanglao.com.cn/uploads/resthome/40527/14729867151696212412.jpg"
    },
    {
      "id": 100,
      "name": "三亚阳光明海度假别墅公寓电话15595793361",
      "priceDescp": "1500-2800",
      "areaName": "三亚",
      "faceUrl": "http://static.yanglao.com.cn/uploads/resthome/41303/1447255370900918098.jpg"
    },
    {
      "id": 99,
      "name": "三亚京程海景养生度假公寓13519857598",
      "priceDescp": "1800-3200",
      "areaName": "三亚",
      "faceUrl": "http://static.yanglao.com.cn/uploads/resthome/42405/14519876072068174284.jpg"
    },
    {
      "id": 98,
      "name": "海南千里养老院(康复护理型） 电话18389263698 15338948543",
      "priceDescp": "2000-5800",
      "areaName": "三亚",
      "faceUrl": "http://static.yanglao.com.cn/uploads/resthome/226452/1481639306592138443.jpg"
    },
    {
      "id": 97,
      "name": "三亚白鹭海之家老年公寓(15508906065) 18708983066",
      "priceDescp": "1680-2680",
      "areaName": "三亚",
      "faceUrl": "http://static.yanglao.com.cn/uploads/resthome/226499/1463703461801726.jpg"
    },
    {
      "id": 96,
      "name": "海之行候鸟公寓 电话 13898109188 18117702976",
      "priceDescp": "1100-2300",
      "areaName": "三亚",
      "faceUrl": "http://static.yanglao.com.cn/uploads/resthome/226772/14697866852072576283.jpg"
    },
    {
      "id": 95,
      "name": "清水湾逸庭精品酒店 13637636345",
      "priceDescp": "5000-10000",
      "areaName": "三亚",
      "faceUrl": "http://static.yanglao.com.cn/uploads/resthome/227015/14759167641685913452.jpg"
    },
    {
      "id": 94,
      "name": "三亚麒麟公寓",
      "priceDescp": "1560-2500",
      "areaName": "三亚",
      "faceUrl": "http://static.yanglao.com.cn/uploads/resthome/227142/14783482791354405422.jpg"
    }
  ],
  "totalPages": 8,
  "totalElements": 75,
  "hasNext": true,
  "last": false
}



this.dataSource = [
          {
            id: 0,
            percent: 10,
            title_words:'感恩专享标-企业借款',
            wanYuan:'52.2',
            revenue:'10',
            numDay:'365',
            startInvest:'立即投资',
            startYuan:'500',
            disabled:false,
            end_Words:'尧都银行专项账户资金监管',
          },
          {
            id: 1,
            percent: 20,
            title_words:'感恩专享标-企业借款',
            wanYuan:'52.2',
            revenue:'10',
            numDay:'365',
            startInvest:'立即投资',
            startYuan:'500',
            disabled:false,
            end_Words:'尧都银行专项账户资金监管',
          },
          {
            id: 2,
            percent: 30,
            title_words:'感恩专享标-企业借款',
            wanYuan:'52.2',
            revenue:'10',
            numDay:'365',
            startInvest:'立即投资',
            startYuan:'500',
            disabled:false,
            end_Words:'尧都银行专项账户资金监管',
          },
          {
            id: 3,
            percent: 40,
            title_words:'感恩专享标-企业借款',
            wanYuan:'52.2',
            revenue:'10',
            numDay:'365',
            startInvest:'立即投资',
            startYuan:'500',
            disabled:false,
            end_Words:'尧都银行专项账户资金监管',
          },
          {
            id: 4,
            percent: 50,
            title_words:'感恩专享标-企业借款',
            wanYuan:'52.2',
            revenue:'10',
            numDay:'365',
            startInvest:'已结束',
            startYuan:'500',
            disabled:true,
            end_Words:'尧都银行专项账户资金监管',
          },
        ];