import React, { PureComponent } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

export class Wrapper extends PureComponent {
  static propTypes = {
    padding: PropTypes.number,
    style: View.propTypes.style,
    paddingVertical: PropTypes.number,
    paddingHorizontal: PropTypes.number,
    children: PropTypes.node,
    viewProps: View.propTypes,
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={[
          this.props.style,
          this.props.padding ? { padding: this.props.padding } : {},
          this.props.paddingVertical ? { paddingVertical: this.props.paddingVertical } : {},
          this.props.paddingHorizontal ? { paddingHorizontal: this.props.paddingHorizontal } : {},
        ]}
        {...this.props.viewProps}
      >
        {this.props.children}
      </View>
    );
  }
}
