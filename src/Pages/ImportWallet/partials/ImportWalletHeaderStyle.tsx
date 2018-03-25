import { StyleSheet } from 'react-native';
import Colors from '../../../Constants/Colors';
// Style
export default StyleSheet.create({
  flexRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  flexColumn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  selected: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.buttonBlue,
  },
  bold: {
    fontWeight: '600',
    color: Colors.buttonBlue,
    fontSize: 16,
  },
  text: {
    fontSize: 16,
  },
});
