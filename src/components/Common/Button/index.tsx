import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import colors from '../../../themes/colors';
import fonts from '../../../themes/fonts';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'large',
  containerStyle,
  textStyle,
  testID,
}) => {
  const getButtonStyle = () => {
    return [
      styles.button,
      size === 'small'
        ? styles.smallButton
        : size === 'medium'
        ? styles.mediumButton
        : styles.largeButton,
      variant === 'primary'
        ? styles.primaryButton
        : variant === 'secondary'
        ? styles.secondaryButton
        : styles.outlineButton,
      (disabled || loading) && styles.disabledButton,
      containerStyle,
    ].filter(Boolean);
  };

  const getTextStyle = () => {
    return [
      styles.buttonText,
      size === 'small'
        ? styles.smallButtonText
        : size === 'medium'
        ? styles.mediumButtonText
        : styles.largeButtonText,
      variant === 'primary'
        ? styles.primaryButtonText
        : variant === 'secondary'
        ? styles.secondaryButtonText
        : styles.outlineButtonText,
      (disabled || loading) && styles.disabledButtonText,
      textStyle,
    ].filter(Boolean);
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      testID={testID}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.whiteBg : colors.primary}
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // Size variants
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },

  // Color variants
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.grayBg,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  disabledButton: {
    backgroundColor: colors.grayBg,
    opacity: 0.6,
    elevation: 0,
    shadowOpacity: 0,
  },

  // Text styles
  buttonText: {
    fontFamily: fonts.semibold,
    textAlign: 'center',
  },

  // Text size variants
  smallButtonText: {
    fontSize: 14,
  },
  mediumButtonText: {
    fontSize: 16,
  },
  largeButtonText: {
    fontSize: 18,
  },

  // Text color variants
  primaryButtonText: {
    color: colors.whiteBg,
  },
  secondaryButtonText: {
    color: colors.darkFont,
  },
  outlineButtonText: {
    color: colors.primary,
  },
  disabledButtonText: {
    color: colors.grayFont,
  },
});

export default Button;
