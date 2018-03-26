import React from 'react';
import { Text as SytemText, TextProperties } from 'react-native';

export class Text extends React.PureComponent<TextProperties> {

  public render() {
    const { style, ...props } = this.props;
    return (
      <SytemText
        numberOfLines={1}
        style={[{ fontFamily: 'System' }, style]}
        {...props}
      >
        {this.props.children}
      </SytemText>
    );
  }
}
