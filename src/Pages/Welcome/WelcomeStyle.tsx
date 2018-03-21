import { StyleSheet } from 'react-native';
// Style
export default StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    marginBottom: 50,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 10,
    justifyContent: 'space-around',
    alignItems: 'stretch',
  },
  titleContainer: {
    flex: 2,
  },
  title: {
    color: '#4A4A4A',
    fontSize: 30,
    textAlign: 'left',
  },
  bottomLine: {
    marginTop: 10,
    backgroundColor: '#5589FF',
    width: 50,
    height: 3,
  },
  button1: {
    paddingTop: 15,
    backgroundColor: '#5589FF',
  },
  button2: {
    marginTop: 15,
    backgroundColor: 'transparent',
  },
});
