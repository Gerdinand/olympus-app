import React, { PureComponent } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

export class Row extends PureComponent {
  static propTypes = {
    justifyContent: PropTypes.any,
    style: PropTypes.any,
    alignItems: PropTypes.any,
    alignSelf: PropTypes.any,
    viewProps: PropTypes.any,
    children: PropTypes.any,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={[
          this.props.style,
          { flexDirection: 'row' }, // A row is a row anyway
          this.props.justifyContent ? { justifyContent: this.props.justifyContent } : {},
          this.props.alignItems ? { alignItems: this.props.alignItems } : {},
          this.props.alignSelf ? { alignSelf: this.props.alignSelf } : {},
        ]}
        {...this.props.viewProps}
      >
        {this.props.children}
      </View>
    );
  }
}
