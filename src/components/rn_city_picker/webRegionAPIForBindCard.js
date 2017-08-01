import cityCode_bindcard from './cityCode_bindcard';
const REGION_URL = 'https://raw.githubusercontent.com/beefe/react-native-picker/master/example/PickerTest/area.json';

const fetchRegionData = () => {
  return new Promise((resolve, reject) => {
    resolve(cityCode_bindcard);
  })
};

export default fetchRegionData;
