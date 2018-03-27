import React from 'react';
import { Text as SytemText, TextProperties, Platform } from 'react-native';

export class Text extends React.PureComponent<TextProperties> {

  public render() {
    const { style, ...props } = this.props;
    return (
      <SytemText
        numberOfLines={1}
        style={[Platform.OS === 'android' ? { fontFamily: 'HelveticaNeue' } : {}, style]}
        {...props}
      >
        {this.props.children}
      </SytemText>
    );
  }
}
