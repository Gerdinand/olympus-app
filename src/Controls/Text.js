import React from 'react';
import { Text as SytemText } from 'react-native';

export class Text extends React.PureComponent {
  render() {
    return (
      <SytemText numberOfLines={1} {...this.props}>
        {this.props.children}
      </SytemText>
    );
  }
}
