import { StyleSheet } from 'react-native';
import Colors from '../../../Constants/Colors';
// Style
export default StyleSheet.create({
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
  image: {
    flex: 1,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  lockSize: {
    marginTop: 4,
    flex: 0.5,
    width: 16,
    height: 16,
  },
  eyeSize: {
    marginTop: 8,
    marginRight: 8,
    width: 20,
    height: 20,
  },
});
