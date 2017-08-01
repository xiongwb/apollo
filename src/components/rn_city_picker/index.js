
import React, { PropTypes } from 'react';
import {
  View,
  Text,
  Modal,
  Dimensions,
  Picker,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native';
import BaseComponent from './baseComponent';
import webRegionAPI from './webRegionAPI';
import webRegionAPIForBindCard from './webRegionAPIForBindCard';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const isIos = Platform.OS === 'ios';

export default class ChinaRegionWheelPicker extends BaseComponent {

  constructor(props) {
    super(props);
    this._bind(
      'open',
      'close',
      '_handleProvinceChange',
      '_handleCityChange',
      '_handleAreaChange',
      '_handleSubmit',
      '_handleCancel',
    );
    this.state = {
      isVisible: this.props.isVisible,
      isDisabled:this.props.isDisabled,
      provinces: [],
      citys: [],
      areas: [],
      provincesName: [],
      citysName: [],
      areasName: [],
      selectedProvinceName: this.props.selectedProvince,
      selectedCityName: this.props.selectedCity,
      selectedAreaName: this.props.selectedArea,
      selectedProvinceCode:this.props.selectedProvinceCode,
      selectedCityCode:this.props.selectedCityCode,
      selectedAreaCode:this.props.selectedAreaCode,
      transparent: true,
      dataPicker:this.props.dataPicker,
    };
  }
  //获取所有省份的code
  _filterAllProvincesCode() {
    return this._regionAllData.map((item) => {
        return item.code;
    });
  }
  //获取所有省份的name
  _filterAllProvincesName() {
  return this._regionAllData.map((item) => {
        return item.name;
    });
  }
  //获取选中省份的object
  _filterProvincesCode(provinceName) {
     const provinceCode = this._regionAllData.find((item) => {
       if(item.name === provinceName){
          return item.code;
       }
    });
    return provinceCode;
  }
  //获取选中省份对应的所有城市code
  _filterCitysCode(provinceName) {
    const provinceData = this._regionAllData.find(item => item.name === provinceName);
      return provinceData.cell.map(item => item.code);
  }
  //获取选中省份对应的所有城市name
  _filterCitysName(provinceName) {
    const provinceData = this._regionAllData.find(item => item.name === provinceName);
      return provinceData.cell.map(item => item.name);
  }
  //获取选中的省份对应选中的城市object
   _filterCityCode(provinceName, cityName) {
    const provinceData = this._regionAllData.find(item => item.name === provinceName);
    const cityCode = provinceData.cell.find((item) => {
       if(item.name === cityName){
          return item.code;
       }
    });
      return cityCode;
  }
  //获取选中省份城市对应的所有区的code
   _filterAreasCode(provinceName, cityName) {
    const provinceData = this._regionAllData.find(item => item.name === provinceName);
    const cityData = provinceData.cell.find(item => item.name === cityName);
      return cityData.cell.map(item => item.code);
  }
  //获取选中省份城市对应的所有区的name
  _filterAreasName(provinceName, cityName) {
    const provinceData = this._regionAllData.find(item => item.name === provinceName);
    const cityData = provinceData.cell.find(item => item.name === cityName);
      return cityData.cell.map(item => item.name);
  }
  //获取选中省份城市对应的选中区的Object
  _filterAreaCode(provinceName, cityName, areaName) {
    const provinceData = this._regionAllData.find(item => item.name === provinceName);
    const cityData = provinceData.cell.find(item => item.name === cityName);
    const areaCode = cityData.cell.find((item) => {
       if(item.name === areaName){
          return item.code;
       }
    });
      return areaCode;
  }
 
  componentDidMount() {
    let dataPickerAPI = "";
    if(this.props.dataPicker == 'normal'){
      dataPickerAPI = webRegionAPI;
    }else if (this.props.dataPicker == 'bindCard'){
      dataPickerAPI = webRegionAPIForBindCard;
    }
    dataPickerAPI().then((area) => {
      // console.log('area', area);
      this._regionAllData = area;

      //获取json数据中省的数据
      const provincesCode = this._filterAllProvincesCode();
      // console.log('provincesCode', provincesCode);
      const provincesName = this._filterAllProvincesName();
      // console.log('provincesName', provincesName);

      //获取json中城市的数据
      const citysCode = this._filterCitysCode(this.state.selectedProvinceName);
      // console.log('citysCode', citysCode);
      const citysName = this._filterCitysName(this.state.selectedProvinceName);
      // console.log('citysName', citysName);

      //获得json中镇/区的数据
      const areasCode = this._filterAreasCode(this.state.selectedProvinceName, this.state.selectedCityName);
      // console.log('areasCode', areasCode);
      const areasName = this._filterAreasName(this.state.selectedProvinceName, this.state.selectedCityName);
      // console.log('areasName', areasName);

      this.setState({
        provincesCode:provincesCode,
        citysCode:citysCode,
        areasCode:areasCode,
        provincesName:provincesName,
        citysName:citysName,
        areasName:areasName,
      });
    });
  }
  componentWillReceiveProps(props) {
    if (props.isVisible !== this.props.isVisible) {
      if (props.isVisible) {
        this.open();
      } else {
        this.close();
      }
    }
  }

  close() {
    this.setState({ isVisible: false });
  }
  open() {
    console.log('openopen');
    this.setState({ isVisible: true });
  }

  _handleProvinceChange(provinceName) {
    const provinceCode = this._filterProvincesCode(provinceName);
    const citysName = this._filterCitysName(provinceName);
    const citysCode = this._filterCitysCode(provinceName);
    const areasName = this._filterAreasName(provinceName, citysName[0]);
    const areasCode = this._filterAreasCode(provinceName, citysName[0]);
    console.log("provinceCode",provinceCode.code);
    this.setState({
      selectedProvinceName: provinceName,
      selectedCityName: citysName[0],
      selectedAreaName: areasName[0],
      selectedProvinceCode:provinceCode.code,
      selectedCityCode: citysCode[0],
      selectedAreaCode: areasCode[0],
      citysName:citysName,
      citysCode:citysCode,
      areasName:areasName,
      areasCode:areasCode,
    });
  }
  _handleCityChange(cityName) {
      const citysCode = this._filterCityCode(this.state.selectedProvinceName,this.state.selectedCityName);
      const areasName = this._filterAreasName(this.state.selectedProvinceName, cityName);
      const areasCode = this._filterAreasCode(this.state.selectedProvinceName, cityName);
      console.log("citysCode",citysCode.code);
      this.setState({
        selectedCityName: cityName,
        selectedAreaName: areasName[0],
        selectedCityCode:citysCode.code,
        selectedAreaCode:areasCode[0],
        areasName:areasName,
        areasCode:areasCode
      });
  }
  _handleAreaChange(areaName) {
    const areasCode = this._filterAreaCode(this.state.selectedProvinceName, this.state.selectedCityName,areaName);
    console.log("areasCode",areasCode.code);
    this.setState({
      selectedAreaName: areaName,
      selectedAreaCode: areasCode.code,
    });
  }

  _handleCancel() {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
    this.close();
  }
  _handleSubmit() {
    if (this.props.onSubmit) {
      this.props.onSubmit({
        provinceName: this.state.selectedProvinceName,
        cityName: this.state.selectedCityName,
        areaName: this.state.selectedAreaName,
        provinceCode: this.state.selectedProvinceCode,
        cityCode: this.state.selectedCityCode,
        areaCode: this.state.selectedAreaCode,
      });
    }
    this.close();
  }

  renderPicker() {
    const { navBtnColor } = this.props;
    return (
      <View style={styles.overlayStyle}>
        <View style={[styles.pickerContainer, isIos ? {} : { marginTop: windowHeight - 80 - this.props.androidPickerHeight }]}>
          <View style={styles.navWrap}>
            <TouchableOpacity
              style={[styles.navBtn, { borderColor: navBtnColor }]}
              activeOpacity={0.85}
              onPress={this._handleCancel}
            >
              <Text style={[styles.text, { color: navBtnColor }]}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navBtn, { backgroundColor: navBtnColor, borderColor: navBtnColor }]}
              activeOpacity={0.85}
              onPress={this._handleSubmit}
            >
              <Text style={[styles.text, { color: 'white' }]}>确认</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pickerWrap}>

            <Picker
              style={styles.pickerItem}
              onValueChange={this._handleProvinceChange}
              selectedValue={this.state.selectedProvinceName}
            >
              {this.state.provincesName.map((province, index) => {
                return (
                    <Picker.Item value={province} label={province} key={index} /> 
                );
              })}
            </Picker>

            <Picker
              style={styles.pickerItem}
              onValueChange={this._handleCityChange}
              selectedValue={this.state.selectedCityName}
            >
              {this.state.citysName.map((city, index) => {
                return (
                    <Picker.Item value={city} label={city} key={index} />
                );
              })}
            </Picker>

            {
              this.props.isShowArea &&

              <Picker
                style={styles.pickerItem}
                onValueChange={this._handleAreaChange}
                selectedValue={this.state.selectedAreaName}
              >
                {this.state.areasName.map((area, index) => {
                  return (
                    <Picker.Item value={area} label={area} key={index} />
                  );
                })}
              </Picker>
            }

          </View>
        </View>
      </View>
    );
  }

  render() {
    const modal = (
      <Modal
        transparent={this.state.transparent}
        visible={this.state.isVisible}
        onRequestClose={this.close}
        animationType={this.props.animationType}
      >
        {this.renderPicker()}
      </Modal>
    );

    return (
      <View>
        {modal}
        <TouchableOpacity  onPress={this.open}>
          {this.props.children}
        </TouchableOpacity>
      </View>
    );
  }
}
ChinaRegionWheelPicker.propTypes = {
  isVisible: PropTypes.bool,
  isDisabled:PropTypes.bool,
  isCode: PropTypes.bool,
  isShowArea: PropTypes.bool,
  selectedProvince: PropTypes.string,
  selectedCity: PropTypes.string,
  selectedArea: PropTypes.string,
  navBtnColor: PropTypes.string,
  animationType: PropTypes.string,
  transparent: PropTypes.bool,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  androidPickerHeight: PropTypes.number,
  dataPicker:PropTypes.string,
};

ChinaRegionWheelPicker.defaultProps = {
  isVisible: false,
  isDisabled:true,
  isCode: false,
  isShowArea: true,
  selectedProvince: '北京市',
  selectedCity: '市辖区',
  selectedArea: '东城区',
  navBtnColor: 'blue',
  animationType: 'slide',
  transparent: true,
  onSubmit: () => {},
  onCancel: () => {},
  androidPickerHeight: 50,
  dataPicker:'normal'
};

const styles = StyleSheet.create({
  overlayStyle: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    left: 0,
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  pickerContainer: {
    flex: 1,
    marginTop: windowHeight * 3 / 5,
    backgroundColor: '#FFF'
  },
  navWrap: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#ccc'
  },
  navBtn: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 4
  },
  text: {
    fontSize: 18,
  },
  pickerWrap: {
    flexDirection: 'row'
  },
  pickerItem: {
    flex: 1
  }
});
