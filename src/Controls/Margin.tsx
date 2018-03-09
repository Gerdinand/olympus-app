import React, { PureComponent } from 'react';
import { View, ViewProperties } from 'react-native';

interface InternalProps extends ViewProperties {
  margin: number,
  marginVertical: number,
  marginHorizontal: number;
}

export class Margin extends PureComponent<InternalProps> {

  public render() {
    const { margin, marginVertical, marginHorizontal, style, ...props } = this.props;
    return (
      <View
        {...props}
        style={[
          style,
          { margin: this.props.margin },
          { marginVertical: this.props.marginVertical },
          { marginHorizontal: this.props.marginHorizontal },
        ]}
      />
    );
  }
}
