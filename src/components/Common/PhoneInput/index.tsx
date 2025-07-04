import React, {useRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import colors from '../../../themes/colors';
import fonts from '../../../themes/fonts';

interface PhoneInputComponentProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeFormattedText?: (text: string) => void;
  onChangeText?: (text: string) => void;
  onChangeCountryCode?: (countryCode: string) => void;
  onChangeCallingCode?: (callingCode: string) => void;
  defaultCode?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  testID?: string;
}

const PhoneInputComponent: React.FC<PhoneInputComponentProps> = ({
  label = 'Phone Number',
  placeholder = 'Enter phone number',
  value = '',
  onChangeFormattedText,
  onChangeText,
  onChangeCountryCode,
  onChangeCallingCode,
  defaultCode = 'US',
  error,
  required = false,
  disabled = false,
  testID,
}) => {
  const phoneInput = useRef<any>(null);

  const handleTextChange = (text: string) => {
    if (onChangeText) {
      onChangeText(text);
    }

    // Extract and send country code and calling code if callbacks provided
    if (phoneInput.current) {
      if (onChangeCountryCode) {
        const countryCode = phoneInput.current.getCountryCode();
        onChangeCountryCode(countryCode);
      }

      if (onChangeCallingCode) {
        const callingCode = phoneInput.current.getCallingCode();
        onChangeCallingCode(callingCode);
      }
    }
  };

  const handleFormattedTextChange = (text: string) => {
    if (onChangeFormattedText) {
      onChangeFormattedText(text);
    }
  };

  const handleCountryChange = (country: any) => {
    // Extract and send country code and calling code when country changes
    console.log('Country changed:', country);

    if (onChangeCountryCode && country.cca2) {
      onChangeCountryCode(country.cca2);
    }

    if (onChangeCallingCode && country.callingCode && country.callingCode[0]) {
      onChangeCallingCode(country.callingCode[0]);
    }
  };

  return (
    <View style={styles.container} testID={testID}>
      {/* Label */}
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}

      {/* Phone Input */}
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {/* @ts-ignore */}
        <PhoneInput
          ref={phoneInput}
          defaultValue={value}
          defaultCode={defaultCode as any}
          layout="second"
          onChangeText={handleTextChange}
          onChangeFormattedText={handleFormattedTextChange}
          onChangeCountry={handleCountryChange}
          placeholder={placeholder}
          disabled={disabled}
          textInputProps={{
            placeholderTextColor: colors.grayFont,
          }}
          withDarkTheme={false}
          withShadow={false}
          autoFocus={false}
          containerStyle={styles.phoneContainer}
          textContainerStyle={styles.textContainer}
          textInputStyle={styles.textInput}
          codeTextStyle={styles.codeText}
          flagButtonStyle={styles.flagButton}
          countryPickerButtonStyle={styles.countryPickerButton}
          countryPickerProps={{
            withAlphaFilter: true,
            withCallingCode: true,
            withEmoji: true,
            withFilter: true,
            withFlag: true,
            withModal: true,
            withCallingCodeButton: true,
          }}
        />
      </View>

      {/* Error Message */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.darkFont,
  },
  required: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: '#FF6B6B',
    marginLeft: 4,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: colors.whiteBg,
    overflow: 'hidden',
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  phoneContainer: {
    width: '100%',
    height: 56,
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  textContainer: {
    backgroundColor: 'transparent',
    paddingLeft: 16,
    paddingRight: 16,
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
    marginLeft: 8,
  },
  textInput: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.darkFont,
    backgroundColor: 'transparent',
    paddingVertical: 0,
    height: 54,
  },
  codeText: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: colors.darkFont,
  },
  flagButton: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  countryPickerButton: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  errorText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: '#FF6B6B',
    marginTop: 8,
    marginLeft: 4,
  },
});

export default PhoneInputComponent;
