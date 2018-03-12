'use strict';

import React from 'react';
import { StackNavigator } from 'react-navigation';
import MarketView from '../Pages/Market/Market';
import MarketIndex from '../Pages/Market/partials/MarketIndex';

const MarketScreen = ({ navigation }) => (
  <MarketView navigation={navigation} />
);

const MarketIndexScreen = ({ navigation }) => (
  <MarketIndex navigation={navigation} />
);

const MarketTab = StackNavigator({
  Home: {
    screen: MarketScreen,
    path: '/',
    navigationOptions: () => ({
      title: 'Market',
    }),
  },
  MarketIndex: {
    screen: MarketIndexScreen,
    path: '/',
    navigationOptions: () => ({
      title: 'Market Index',
    }),
  },
});

export default MarketTab;
