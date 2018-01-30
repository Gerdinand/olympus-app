import React from 'react';
import { Text as SytemText } from 'react-native';
import PropTypes from 'prop-types';

export class Text extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    return (
      <SytemText numberOfLines={1} {...this.props}>
        {this.props.children}
      </SytemText>
    );
  }
}
