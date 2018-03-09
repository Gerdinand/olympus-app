'use strict';

import React from 'react';
import {
  ScrollView,
} from 'react-native';
import {
  List,
  ListItem,
} from 'react-native-elements';
import PropTypes from 'prop-types';

const list = [
  {
    icon: require('../../images/index.png'),
    title: 'Index',
  },
  {
    icon: require('../../images/lending.png'),
    title: 'Lending',
  },
  {
    icon: require('../../images/future.png'),
    title: 'Futures',
  },
  {
    icon: require('../../images/option.png'),
    title: 'Options',
  },
];

interface InternalProps {
  navigation: any; // Navigation Object
}

export default class MarketView extends React.Component<InternalProps> {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  }

  public render() {
    const { navigation } = this.props;

    return (
      <ScrollView style={{ backgroundColor: '#F5F5F5' }}>
        <List>
          {
            list.map((l, i) => (
              <ListItem
                key={i}
                avatar={l.icon}
                title={l.title}
                onPress={() => {
                  if (i == 0) {
                    navigation.navigate('MarketIndex');
                  }
                }}
              />
            ))
          }
        </List>
      </ScrollView>
    );
  }
}

