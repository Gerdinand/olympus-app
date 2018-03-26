import React from 'react';
import { View, TouchableOpacity, ViewProperties, ViewStyle } from 'react-native';

interface InternalProps extends ViewProperties {
  style?: ViewStyle | ViewStyle[];
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
    ] as ViewStyle[];

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
