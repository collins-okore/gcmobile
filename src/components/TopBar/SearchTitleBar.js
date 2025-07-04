import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import ElevatedView from 'react-native-elevated-view';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import Icon from '../Icon';

const SearchTitleBar = props => {
  return (
    <ElevatedView
      style={[styles.navGradient, {...props.style}]}
      elevation={props.elevation}>
      <TouchableOpacity onPress={props.onBackPress} style={styles.touchable}>
        <Icon
          size={28}
          color={props.dark ? colors.white : colors.darkFont}
          name="long-arrow-left"
        />
      </TouchableOpacity>
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <TouchableOpacity
            onPress={props.onPressSearchBar}
            style={styles.rightSection}>
            <Text numberOfLines={1} style={styles.searchText}>
              {props.title}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ElevatedView>
  );
};

const styles = StyleSheet.create({
  navGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.pageBlue,
  },
  container: {
    paddingRight: 10,
    paddingVertical: 5,
    flex: 1,
    height: 56,
  },
  touchable: {
    height: 56,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    paddingLeft: 5,
    paddingRight: 15,
    marginHorizontal: 0.5,
    marginVertical: 0.5,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: colors.pageBlue,
    backgroundColor: colors.white,
  },
  searchText: {
    marginLeft: 10,
    paddingVertical: 15,
    color: colors.darkFont,
    fontSize: 15,
  },
  rightSection: {
    flex: 1,
  },
  leftSection: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchTitleBar;
