import { StyleSheet } from 'react-native';
import Colors from '../../../Constants/Colors';
// Style
export default StyleSheet.create({
  seedWordsInput: {
    borderWidth: 1,
    borderColor: Colors.inputUnderline,
    backgroundColor: Colors.seedBackground,
    paddingHorizontal: 12,
    paddingTop: 10,
    height: 64,
    fontSize: 14,
    marginBottom: 26,
  },
  mnemonicPassword: {
    marginTop: 20,
  },
  marginTop: {
    marginTop: 32,
  },
  marginBottom: {
    marginBottom: 40,
  },
  errorText: {
    color: Colors.errorText,
    alignSelf: 'center',
    marginBottom: 16,
  },
  startImportButton: {
    borderRadius: 4,
    marginTop: 80,
    paddingTop: 15,
    backgroundColor: Colors.buttonBlue,
  },
  modalStyle: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 0,
  },
  modalTitle: {
    marginTop: 18,
    fontSize: 16,
    color: Colors.activeText,
    alignSelf: 'center',
  },
  modalInnerContainer: {
    flex: 2,
    flexDirection: 'column',
    paddingHorizontal: 10,
    alignSelf: 'stretch',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  cancelButton: {
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.borderColor,
    paddingVertical: 16,
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  confirmButton: {
    borderTopWidth: 1,
    borderColor: Colors.borderColor,
    paddingVertical: 16,
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  cancelText: {
    color: Colors.inactiveText,
  },
  confirmText: {
    color: Colors.buttonBlue,
  },
  dropdown: {
    flex: 1,
    marginBottom: 8,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignContent: 'space-between',
  },
  dropdownMainText: {
    flex: 10,
    fontSize: 14,
    color: Colors.activeText,
  },
  dropdownText: {
    color: Colors.inactiveText,
    alignSelf: 'center',
  },
  dropdownListItem: {
    borderWidth: 1,
    borderColor: Colors.borderColor,
    backgroundColor: Colors.seedBackground,
    padding: 8,
  },
  dropdownIcon: {
    flex: 1,
    resizeMode: 'contain',
    alignSelf: 'center',
    height: 8,
  },
});
