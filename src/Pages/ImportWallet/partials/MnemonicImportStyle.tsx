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
  passwordInput: {
    fontSize: 14,
    marginTop: 8,
    flex: 5,
    alignItems: 'center',
  },
  passwordInputContainer: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Colors.inputUnderline,
    paddingBottom: 4,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
  image: {
    flex: 1,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  lockSize: {
    width: 24,
    height: 24,
  },
  eyeSize: {
    marginTop: 8,
    marginRight: 8,
    width: 20,
    height: 20,
  },
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
