import React from 'react';
import { View, ViewProperties } from 'react-native';

interface InternalProps extends ViewProperties {
  style?: any; // Setting it as ViewStyle creates a strange type issue
  justifyContent?: string;
  alignItems?: string;
  alignSelf?: string;
}
export class Column extends React.PureComponent<InternalProps> {

  constructor(props: InternalProps) {
    super(props);
  }

  public render() {
    const { justifyContent, alignItems, alignSelf, style, children, ...props } = this.props;

    const tagStyle = [style,
      { flexDirection: 'column' }, // A row is a row anyway
      justifyContent ? { justifyContent } : {},
      alignItems ? { alignItems } : {},
      alignSelf ? { alignSelf } : {},
    ];

    return (
      <View
        style={tagStyle}
        {...props}
      >
        {children}
      </View>
    );
  }
}
