import React from 'react';
import { View, TouchableOpacity, ViewProperties } from 'react-native';

interface InternalProps extends ViewProperties {
  style?: any; // Setting it as ViewStyle creates a strange type issue
  onPress?: () => void;
  justifyContent?: string;
  alignItems?: string;
  alignSelf?: string;
}
export class Row extends React.PureComponent<InternalProps> {

  constructor(props: InternalProps) {
    super(props);
  }

  public render() {
    const { justifyContent, alignItems, alignSelf, style, onPress, children, ...props } = this.props;
    const Tag = onPress ? TouchableOpacity : View;

    const tagStyle = [style,
      { flexDirection: 'row' }, // A row is a row anyway
      justifyContent ? { justifyContent } : {},
      alignItems ? { alignItems } : {},
      alignSelf ? { alignSelf } : {},
    ];

    return (
      <Tag
        onPress={onPress ? onPress.bind(this, arguments) : {}}
        style={tagStyle}
        {...props}
      >
        {children}
      </Tag>
    );
  }
}
