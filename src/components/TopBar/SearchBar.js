import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import ElevatedView from 'react-native-elevated-view';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import Icon from '../Icon';
import styles from './styles';

const SearchBar = props => {
  return (
    <ElevatedView
      style={[styles.navGradient, {...props.style}]}
      elevation={props.elevation}>
      <View style={styles.left}>
        {props.back && !props.cancel && (
          <TouchableOpacity
            onPress={props.onBackPress}
            style={styles.touchable}>
            <Icon size={28} color={'#000000'} name="long-arrow-left" />
          </TouchableOpacity>
        )}
        {props.cancel && (
          <TouchableOpacity
            onPress={props.onBackPress}
            style={styles.touchable}>
            <Icon
              size={28}
              color={props.dark ? colors.white : colors.darkFont}
              name="times"
            />
          </TouchableOpacity>
        )}

        <View
          style={[
            styles.title,
            {
              flex: 1,
            },
          ]}>
          <TextInput
            value={props.searchText}
            placeholder={props.searchPlaceholder}
            onChangeText={props.onChangeText}
            style={styles.textInput}
            underlineColorAndroid="transparent"
            autoFocus
          />
        </View>
      </View>

      <View style={styles.right}>
        {props.right &&
          props.right.map(btn => {
            return (
              <TouchableOpacity
                onPress={() => btn.onPress()}
                key={props.right.indexOf(btn)}
                style={styles.touchable}
                disabled={props.rightDisabled}>
                {btn.icon()}
              </TouchableOpacity>
            );
          })}
      </View>
    </ElevatedView>
  );
};

export default SearchBar;
