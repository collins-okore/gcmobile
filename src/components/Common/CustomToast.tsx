import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from './Icon';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import {SafeAreaView} from 'react-native-safe-area-context';

interface CustomToastProps {
  text1?: string;
  text2?: string;
  hide?: () => void;
  type?: 'success' | 'error' | 'warning' | 'info' | 'default';
}

const CustomToast: React.FC<CustomToastProps> = ({
  text1,
  text2,
  hide,
  type = 'default',
}) => {
  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          iconColor: '#7EDEB8',
          iconName: 'check-double',
          backgroundColor: '#7EDEB8',
        };
      case 'error':
        return {
          iconColor: '#F4AB9D',
          iconName: 'ban',
          backgroundColor: '#F4AB9D',
        };
      case 'warning':
        return {
          iconColor: '#FFC884',
          iconName: 'exclamation-triangle',
          backgroundColor: '#FFC884',
        };
      case 'info':
        return {
          iconColor: '#A2BCFE',
          iconName: 'info-circle',
          backgroundColor: '#A2BCFE',
        };
      default:
        return {
          iconColor: '#9E9E9E',
          iconName: 'bell',
          backgroundColor: '#9E9E9E',
        };
    }
  };

  const config = getToastConfig();

  return (
    <SafeAreaView
      style={[styles.container, {borderColor: config.backgroundColor}]}>
      {/* Colored icon section */}
      <View style={styles.iconContainer}>
        <View
          style={[
            styles.iconSection,
            {backgroundColor: config.backgroundColor},
          ]}>
          <Icon name={config.iconName} size={22} color={colors.whiteBg} />
        </View>
      </View>

      {/* White content section */}
      <View style={styles.contentSection}>
        <View style={styles.textContainer}>
          {text1 && <Text style={styles.title}>{text1}</Text>}
          {text2 && <Text style={styles.description}>{text2}</Text>}
        </View>

        {/* Close button */}
        <TouchableOpacity onPress={hide} style={styles.closeButton}>
          <Icon name="times" size={20} color="#999" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '90%',
    backgroundColor: colors.whiteBg,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    borderWidth: 1,
  },
  iconContainer: {
    width: 80,
    backgroundColor: colors.whiteBg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  iconSection: {
    width: 46,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  contentSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingLeft: 8,
    paddingRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.darkFont,
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: '#666',
    lineHeight: 18,
  },
  closeButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default CustomToast;
