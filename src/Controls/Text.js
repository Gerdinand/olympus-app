import React from 'react';
import { Text as SytemText } from 'react-native';

export class Text extends React.PureComponent {
  propTypes: {
    children:React.PropTypes.any,
  }

  render() {
    return (
      <SytemText numberOfLines={1} {...this.props}>
        {this.props.children}
      </SytemText>
    );
  }
}
