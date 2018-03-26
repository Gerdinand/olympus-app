import { StyleSheet } from 'react-native';
import Colors from '../../../Constants/Colors';
// Style
export default StyleSheet.create({
  seedWordsInput: {
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
  modalStyle: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 16,
  },
  modalTitle: {
    fontSize: 16,
    color: Colors.activeText,
    alignSelf: 'center',
  },
  modalInnerContainer: {
    flex: 4,
    paddingHorizontal: 10,
    alignSelf: 'stretch',
  },
  buttonRow: {
    alignSelf: 'flex-end',
  },
  modalButton: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'flex-end',
    alignItems: 'center',
    paddingVertical: 16,
    borderColor: Colors.borderColor,
    borderTopWidth: 1,
  },
  cancelButton: {
    borderRightWidth: 1,
  },
  cancelText: {
    color: Colors.inactiveText,
  },
  confirmText: {
    color: Colors.buttonBlue,
  },
  dropdown: {
    flex: 1,
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
    backgroundColor: Colors.textAreaBackground,
    padding: 8,
  },
  lastDropdownListItem: {
    marginTop: -1,
    marginBottom: 8,
  },
  dropdownIcon: {
    flex: 1,
    resizeMode: 'contain',
    alignSelf: 'center',
    height: 8,
  },
});
