import { StyleSheet } from 'react-native';
import Colors from '../../../Constants/Colors';
// Style
export default StyleSheet.create({
  seedWordsInput: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.gray,
    padding: 8,
    height: 64,
    fontSize: 14,
    marginBottom: 8,
  },
  passwordInput: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.gray,
    padding: 8,
    height: 32,
    fontSize: 14,
    marginBottom: 8,
  },
  marginTop: {
    marginTop: 32,
  },
  marginBottom: {
    marginBottom: 80,
  },
  errorText: {
    color: 'red',
    alignSelf: 'center',
    marginBottom: 16,
  },
  startImportButton: {
    paddingTop: 15,
    backgroundColor: '#5589FF',
  },
  modalTitle: {
    fontSize: 16,
  },
});
