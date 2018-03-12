import React from 'react';
import { Text as SytemText, TextProperties } from 'react-native';

export class Text extends React.PureComponent<TextProperties> {

  public render() {
    return (
      <SytemText numberOfLines={1} {...this.props}>
        {this.props.children}
      </SytemText>
    );
  }
}
