import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { FormInput, FormInputProps } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

interface InternalState {
  passwordVisibility: boolean;
}

export class PasswordInput extends React.PureComponent<FormInputProps, InternalState> {

  constructor(props) {
    super(props);
    this.state = {
      passwordVisibility: false,
    };
  }

  public render() {
    return (
      <View>
        <FormInput
          inputStyle={{ width: '100%', paddingRight: 20 }}
          secureTextEntry={!this.state.passwordVisibility}
          placeholder="Type in your password"
          {...this.props}
        />
        <TouchableOpacity
          style={{ position: 'absolute', right: 10, padding: 10 }}
          activeOpacity={0.5}
          onPress={() => {
            this.setState({ passwordVisibility: !this.state.passwordVisibility });
          }}
        >
          <Icon
            style={{ fontSize: 20, color: this.state.passwordVisibility ? '#58f' : '#ccc' }}
            name={this.state.passwordVisibility ? 'md-eye' : 'md-eye-off'}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
