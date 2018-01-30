import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { FullRow } from './';
import PropTypes from 'prop-types';

export class Hr extends PureComponent {
  static propTypes = {
    color: PropTypes.string,
  };

  render() {
    return (
      <FullRow>
        <View style={[style.hr, this.props.color ? { borderBottomColor: this.props.color } : {}]} />
      </FullRow >
    );
  }
}
const style = StyleSheet.create({
  hr: {
    alignSelf: 'stretch',
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
  },
});
