import {
  StyleSheet,
} from 'react-native';
import Colors from '../../../Constants/Colors';

export default StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.modal,
  },
  modal: {
    marginHorizontal: 16,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
});
