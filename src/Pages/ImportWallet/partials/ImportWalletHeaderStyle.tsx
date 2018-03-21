import { StyleSheet } from 'react-native';
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
    borderBottomColor: '#000',
  },
  bold: {
    fontWeight: 'bold',
  },
});
