import { AsyncStorage } from 'react-native';
import { MasterData } from '../Models';
import Config from '../Config/env';
import _ from 'lodash';

const MASTER_DATA_KEY = 'master_data_key';
const BASE_URL = Config[process.env.NODE_ENV].server + '/api';

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

export class MasterDataService {

  public static async  getMasterData(): Promise<MasterData> {

    const masterData: MasterData = JSON.parse(await AsyncStorage.getItem(MASTER_DATA_KEY));
    return masterData;
  }

  public static async  updateMasterData() {

    const masterData: MasterData = JSON.parse(await AsyncStorage.getItem(MASTER_DATA_KEY));
    const version = masterData ? masterData.version : '';

    try {
      const response = await fetch(`${BASE_URL}/authenticate/master-data/${version}`, { method: 'GET', headers });

      const { result } = await response.json() as { result: { masterData: MasterData } };
      if (_.isEmpty(result.masterData)) {
        console.log('Masterdata using version ' + version);
        return;
      }
      console.log('Masterdata updated to ' + result.masterData.version);
      AsyncStorage.setItem(MASTER_DATA_KEY, JSON.stringify(result.masterData));
    } catch (e) { console.log('Loading Masterdata', e); }

  }
}
