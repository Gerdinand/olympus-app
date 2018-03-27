import { StyleSheet } from 'react-native';
import Colors from '../../../Constants/Colors';
// Style
export default StyleSheet.create({
  keystoreInput: {
    borderWidth: 1,
    borderColor: Colors.inputUnderline,
    backgroundColor: Colors.textAreaBackground,
    paddingHorizontal: 12,
    paddingTop: 10,
    height: 64,
    fontSize: 14,
  },
  startImportButton: {
    borderRadius: 4,
    paddingTop: 15,
    backgroundColor: Colors.buttonBlue,
  },
  passwordDisclaimer: {
    color: Colors.attentionDisclaimerText,
  },
});