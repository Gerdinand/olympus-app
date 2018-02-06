'use strict';
import React from 'react';
import {
  View,
  TouchableOpacity,
} from 'react-native';
import {
  FormInput,
} from 'react-native-elements';
import PropTypes from 'prop-types';

export class FormInputWithButton extends React.PureComponent {
  static propTypes = {
    style: View.propTypes.style,
    viewProps: PropTypes.any,
    children: PropTypes.node,
    onButtonPress: PropTypes.func,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { children, ...props } = this.props;
    return (
      <View >
        <TouchableOpacity
          style={{
            zIndex: 200,
          }}
          onPress={() => {
            this.props.onButtonPress && this.props.onButtonPress(this.refs.input);
          }}
        >
          {children}
        </TouchableOpacity>
        <FormInput
          ref="input"
          {...props}
        />
      </View>
    );
  }
}
