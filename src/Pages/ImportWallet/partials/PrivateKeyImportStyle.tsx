import { StyleSheet } from 'react-native';
import Colors from '../../../Constants/Colors';
// Style
export default StyleSheet.create({
  privateKeyInput: {
    borderWidth: 1,
    borderColor: Colors.inputUnderline,
    backgroundColor: Colors.textAreaBackground,
    paddingHorizontal: 12,
    paddingTop: 10,
    height: 64,
    fontSize: 14,
    marginBottom: 26,
  },
  startImportButton: {
    borderRadius: 4,
    marginTop: 80,
    paddingTop: 15,
    backgroundColor: Colors.buttonBlue,
  },
});
