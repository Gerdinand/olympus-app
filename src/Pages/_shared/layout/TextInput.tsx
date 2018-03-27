import React from 'react';
import { TextInput as SytemTextInput, TextInputProperties, Platform } from 'react-native';

export class TextInput extends React.PureComponent<TextInputProperties> {

  public render() {
    const { style, ...props } = this.props;
    return (
      <SytemTextInput
        style={[Platform.OS === 'android' ? { fontFamily: 'HelveticaNeue' } : {}, style]}
        {...props}
      >
        {this.props.children}
      </SytemTextInput>
    );
  }
}
