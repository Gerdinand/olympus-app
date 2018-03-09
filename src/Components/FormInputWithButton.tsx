'use strict';
import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  FormInput, FormInputProps,
} from 'react-native-elements';



interface InternalProps extends FormInputProps {
  onButtonPress: (input: FormInput) => void,
};
export class FormInputWithButton extends React.PureComponent<InternalProps> {
  public refs: {
    input: FormInput;
  }

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
          activeOpacity={0.5}
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

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    padding: 10,
    zIndex: 200,
    right: 10,
    top: 2,
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
  },
});
