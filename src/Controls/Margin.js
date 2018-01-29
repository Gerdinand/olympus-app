import React, { PureComponent } from 'react';
import { View } from 'react-native';

/**
 * Margin between two components, some white space in middle
 */
export class Margin extends PureComponent {
  render() {
    return (
      <View
        style={[
          this.props.style,
          { margin: this.props.margin },
          { marginVertical: this.props.marginVertical },
          { marginHorizontal: this.props.marginHorizontal },
        ]
        }
      />
    );
  }
}
