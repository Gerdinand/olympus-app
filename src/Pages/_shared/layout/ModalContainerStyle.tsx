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
    paddingHorizontal: 16,
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    shadowColor: 'black',
    shadowOffset: { width: 4, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 0.4,
  },
});
