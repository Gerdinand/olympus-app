'use strict';

import React from 'react';
import {
  ScrollView,
} from 'react-native';
import {
  List,
  ListItem,
} from 'react-native-elements';

const list = [
  {
    title: 'Bitcoin Index',
    value: '18,903',
  },
  {
    title: 'Kyber Index',
    value: '2,817',
  },
];

interface InternalProps {
  navigation;
}

export default class MarketIndexView extends React.Component<InternalProps> {

  public constructor(props: InternalProps) {
    super(props);
  }

  public render() {
    return (
      <ScrollView style={{ backgroundColor: '#F5F5F5' }}>
        <List>
          {
            list.map((l, i) => (
              <ListItem
                key={i}
                title={l.title}
                rightTitle={l.value}
              />
            ))
          }
        </List>
      </ScrollView>
    );
  }
}

