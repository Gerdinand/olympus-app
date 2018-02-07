'use strict';
import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  FormInput,
} from 'react-native-elements';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    color: 'rgb(85,137,255)',
    zIndex: 200,
    right: 20,
    top: 12,
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
  },
});

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
      <View>
        <FormInput
          ref="input"
          {...props}
        />
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => {
            this.props.onButtonPress && this.props.onButtonPress(this.refs.input);
          }}
        >
          {children}
        </TouchableOpacity>
      </View>
    );
  }
}
