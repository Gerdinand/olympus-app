import React from 'react';
import { View } from 'react-native';
import { Text } from '../../_shared/layout/Text';
import CheckBox from 'react-native-checkbox';
import styles from './AgreeWithTermsStyle';
interface InternalProps {
  toggleAgreed: () => void;
}
interface InternalState {
  termsAgreed: boolean;
}
export default class AgreeWithTerms extends React.Component<InternalProps, InternalState> {
  public constructor(props) {
    super(props);
    this.state = {
      termsAgreed: false,
    };
  }

  public render() {
    return (
      <View style={styles.agreementRow}>
        <CheckBox
          label={null}
          checked={this.state.termsAgreed}
          onChange={(termsAgreed) => {
            this.setState({ termsAgreed: !termsAgreed });
            this.props.toggleAgreed();
          }
          }
          checkedImage={require('../../../../images/checked.png')}
          uncheckedImage={require('../../../../images/unchecked.png')}
          checkboxStyle={styles.checkbox}
          containerStyle={styles.checkboxContainer}
        />
        <Text style={styles.termsAgreeText}>I have carefully read and agree to the
        <Text style={styles.textLink}> terms and conditions</Text></Text>
      </View>);
  }
}
