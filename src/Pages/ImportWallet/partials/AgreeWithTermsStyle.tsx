import { StyleSheet } from 'react-native';
import Colors from '../../../Constants/Colors';
// Style
export default StyleSheet.create({
  termsAgreeText: {
    fontSize: 12,
  },
  textLink: {
    color: Colors.buttonBlue,
  },
  agreementRow: {
    flex: 1,
    height: 16,
  },
  checkbox: {
    alignSelf: 'center',
    resizeMode: 'contain',
    width: 18,
    height: 18,
    maxWidth: 18,
    maxHeight: 18,
  },
  checkboxContainer: {
    marginTop: 4,
  },
});
