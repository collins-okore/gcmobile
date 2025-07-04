import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import ElevatedView from 'react-native-elevated-view';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import styles from './styles';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import Icon from '../Icon';

const DefaultBar = ({
  style,
  right,
  left,
  back,
  cancel,
  dark,
  onBackPress,
  elevation,
  popup,
  rightDisabled,
  title,
  subTitle,
  titleColor,
}) => {
  const color = dark ? colors.white : colors.darkFont;
  return (
    <ElevatedView
      style={[
        styles.navGradient,
        {backgroundColor: colors.primary},
        {...style},
      ]}
      elevation={elevation}>
      <View style={styles.left}>
        {back && !cancel && (
          <TouchableOpacity onPress={onBackPress} style={styles.touchable}>
            <Icon size={28} color={color} name="long-arrow-left" />
          </TouchableOpacity>
        )}
        {cancel && (
          <TouchableOpacity onPress={onBackPress} style={styles.touchable}>
            <Icon size={28} color={color} name="times" />
          </TouchableOpacity>
        )}
        {left && (
          <TouchableOpacity
            onPress={() => left.onPress()}
            style={styles.touchable}>
            {left.icon()}
          </TouchableOpacity>
        )}
        <View style={[styles.title]}>
          <Text
            numberOfLines={1}
            style={[
              styles.titleText,
              {
                fontSize: subTitle ? 18 : 20,
                marginBottom: subTitle ? -5 : 0,
                marginLeft: 10,
                color: dark ? colors.white : titleColor,
                fontFamily: fonts.bold,
              },
            ]}>
            {title}
          </Text>
          {subTitle ? (
            <Text style={styles.subTitleText}>{subTitle}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.right}>
        {right &&
          right.map(btn => {
            return (
              <TouchableOpacity
                onPress={() => btn.onPress()}
                key={right.indexOf(btn)}
                style={styles.touchable}
                disabled={rightDisabled}>
                {btn.icon()}
              </TouchableOpacity>
            );
          })}
        {popup && (
          <Menu style={{marginTop: 2, marginRight: 2}}>
            <MenuTrigger
              customStyles={{
                marginTop: -2,
                marginRight: -2,
              }}>
              <View style={styles.touchable}>
                <Icon size={27} color={colors.darkFont} name="ellipsis-v" />
              </View>
            </MenuTrigger>
            <MenuOptions>
              {popup.map(option => {
                return (
                  <MenuOption
                    key={popup.indexOf(option)}
                    value={option.label}
                    onSelect={option.onPress}>
                    <Text style={styles.menuText}> {option.label}</Text>
                  </MenuOption>
                );
              })}
            </MenuOptions>
          </Menu>
        )}
      </View>
    </ElevatedView>
  );
};

export default DefaultBar;
