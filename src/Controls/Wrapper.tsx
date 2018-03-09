import React from 'react';
import { View, ViewProperties } from 'react-native';

interface InternalProps extends ViewProperties {
  style?: any,
  padding?: number,
  paddingVertical?: number,
  paddingHorizontal?: number,

}
export class Wrapper extends React.PureComponent<InternalProps> {

  constructor(props) {
    super(props);
  }

  public render() {
    const { style, children, padding, paddingVertical, paddingHorizontal, ...props } = this.props;
    return (
      <View
        style={[
          style,
          padding ? { padding } : {},
          paddingVertical ? { paddingVertical } : {},
          paddingHorizontal ? { paddingHorizontal } : {},
        ]}
        {...props}
      >
        {children}
      </View>
    );
  }
}
