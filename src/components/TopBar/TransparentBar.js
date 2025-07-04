import React from 'react';
import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ElevatedView from 'react-native-elevated-view';
import colors from '../../themes/colors';
import Icon from '../Icon';
import styles from './styles';

const {width} = Dimensions.get('window');

const TransparentBar = props => {
  return (
    <View>
      {props.transparentStatus ? (
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.3)']}
          style={{
            height: props.statusBarHeight,
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 2000,
          }}></LinearGradient>
      ) : null}
      <ElevatedView
        style={[
          {
            position: 'absolute',
            top: props.transparentStatus ? props.statusBarHeight : 0,
            left: 0,
            zIndex: 2000,
            width: width,
            backgroundColor: 'transparent',
          },

          {...props.style},
        ]}
        elevation={0}>
        <LinearGradient
          colors={props.gradient}
          style={styles.navGradient}
          // start={props.transparent ? null : { x: 0, y: 1 }}
          // end={props.transparent ? null : { x: 1, y: 1 }}
        >
          <View style={styles.left}>
            {props.left && (
              <TouchableOpacity
                onPress={() => props.left.onPress()}
                style={styles.touchable}>
                {props.left.icon()}
              </TouchableOpacity>
            )}
            {props.back && !props.cancel && (
              <TouchableOpacity
                onPress={props.onBackPress}
                style={styles.touchable}>
                <Icon size={28} color={colors.snow} name="long-arrow-left" />
              </TouchableOpacity>
            )}
            {props.cancel && (
              <TouchableOpacity
                onPress={() => {
                  props.navigator.pop({
                    animated: true,
                  });
                  props.navigator.dismissModal({
                    animationType: 'slide-down',
                  });
                  props.navigator.dismissLightBox();
                }}
                style={styles.touchable}>
                <Icon size={28} color={colors.snow} name="times" />
              </TouchableOpacity>
            )}
            <View style={[styles.title]}>
              <Text
                numberOfLines={1}
                style={[
                  styles.titleText,
                  {
                    fontSize: props.subTitle ? 21 : 21,
                    marginBottom: props.subTitle ? -5 : 0,
                  },
                ]}>
                {props.title}
              </Text>
              {props.subTitle ? (
                <Text style={styles.subTitleText}>{props.subTitle}</Text>
              ) : null}
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
        </LinearGradient>
      </ElevatedView>
    </View>
  );
};

TransparentBar.defaultProps = {
  gradient: ['rgba(0,0,0,0.3)', 'rgba(0,0,0,0)'],
};
TransparentBar.propTypes = {};

export default TransparentBar;
