import React, { PureComponent } from 'react';
import { View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

export class Margin extends PureComponent {
  static propTypes = {
    style: ViewPropTypes.style,
    margin: PropTypes.number,
    marginVertical: PropTypes.number,
    marginHorizontal: PropTypes.number,
  };

  render() {
    return (
      <View
        style={[
          this.props.style,
          { margin: this.props.margin },
          { marginVertical: this.props.marginVertical },
          { marginHorizontal: this.props.marginHorizontal },
        ]}
      />
    );
  }
}
