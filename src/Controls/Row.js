import React, { PureComponent } from 'react';
import { View, ViewPropTypes, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

export class Row extends PureComponent {
  static propTypes = {
    justifyContent: PropTypes.string,
    style: ViewPropTypes.style,
    alignItems: PropTypes.string,
    alignSelf: PropTypes.string,
    viewProps: ViewPropTypes,
    children: PropTypes.node,
    onPress: PropTypes.func,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const Tag = this.props.onPress ? TouchableOpacity : View;
    return (
      <Tag
        onPress={this.props.onPress ? this.props.onPress.bind(this, arguments) : {}}
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
      </Tag>
    );
  }
}
