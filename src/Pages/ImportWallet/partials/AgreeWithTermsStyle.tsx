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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 16,
  },
  checkbox: {
    alignSelf: 'center',
    resizeMode: 'contain',
    width: 16,
    height: 16,
    maxWidth: 16,
    maxHeight: 16,
  },
  checkboxContainer: {
    marginTop: 4,
  },
});
