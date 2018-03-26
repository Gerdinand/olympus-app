import { AsyncStorage } from 'react-native';
import Config from '../Config/env';
import _ from 'lodash';
import { MasterData } from '../Models';

const MASTER_DATA_KEY = 'master_data_key';
const BASE_URL = Config[process.env.NODE_ENV].server + '/api';

const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

export class MasterDataService {
  private static masterDataInstance: MasterDataService;

  private masterDataCache: MasterData;
  private constructor() {
    this.masterDataCache = { supportedTokens: [], version: '' };
  }
  public static get(): MasterDataService {
    if (!this.masterDataInstance) {
      this.masterDataInstance = new MasterDataService();
    }
    return this.masterDataInstance;
  }

  public getMasterData(): MasterData {
    return this.masterDataCache;
  }

  public async  updateMasterData() {

    const masterData: MasterData = JSON.parse(await AsyncStorage.getItem(MASTER_DATA_KEY));
    const version = masterData ? masterData.version : '';

    try {
      const response = await fetch(`${BASE_URL}/authenticate/master-data/${version}`, { method: 'GET', headers });
      const { result } = await response.json() as { result: { masterData: MasterData } };
      if (_.isEmpty(result.masterData)) {
        console.log('Masterdata using version ' + version);
        this.masterDataCache = JSON.parse(await AsyncStorage.getItem(MASTER_DATA_KEY));
        return;
      }
      console.log('Masterdata updated to ' + result.masterData.version);
      this.masterDataCache = result.masterData;
      AsyncStorage.setItem(MASTER_DATA_KEY, JSON.stringify(result.masterData));
    } catch (e) { console.warn(' Error Loading Masterdata', e); }

  }
}
