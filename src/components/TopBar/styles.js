import {StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../themes/index';

const styles = StyleSheet.create({
  navGradient: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  main: {},
  title: {
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
    flex: 1,
  },
  titleText: {
    // fontWeight: 'bold',
    paddingVertical: 0,
  },
  subTitleText: {
    fontSize: 17,
    fontFamily: Fonts.type.netflixSansMedium,
    color: Colors.defaultTextColor,
    marginVertical: 0,
    paddingVertical: 0,
  },
  right: {
    flexDirection: 'row',
    //  paddingLeft: 10
  },
  left: {
    flexDirection: 'row',
    flex: 1,
  },
  touchable: {
    height: 56,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 18,
  },
  menuText: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    fontSize: 16,
    color: '#424242',
  },
  searchBar: {
    marginHorizontal: 20,
  },
});

export default styles;
