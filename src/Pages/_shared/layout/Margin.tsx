import React, { PureComponent } from 'react';
import { View, ViewProperties } from 'react-native';

interface InternalProps extends ViewProperties {
  margin?: number;
  marginVertical?: number;
  marginHorizontal?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
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
          { marginBottom: this.props.marginBottom },
          { marginTop: this.props.marginTop },
          { marginLeft: this.props.marginLeft },
          { marginRight: this.props.marginRight },
        ]}
      />
    );
  }
}
