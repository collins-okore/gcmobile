import React, {useState, forwardRef, useImperativeHandle, useRef} from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import {EyeIcon, EyeSlashIcon} from 'react-native-heroicons/outline';
import colors from '../../../themes/colors';
import fonts from '../../../themes/fonts';
import * as Yup from 'yup';

export interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string;
  warning?: string;
  message?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  isPassword?: boolean;
  mode?: 'email' | 'phone' | 'number' | 'url' | 'default';
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  validationSchema?: Yup.StringSchema;
  showCharacterCount?: boolean;
  containerStyle?: any;
  inputStyle?: any;
  labelStyle?: any;
  errorStyle?: any;
  onValidation?: (isValid: boolean, error?: string) => void;
  autoFocus?: boolean;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send' | 'default';
  onSubmitEditing?: () => void;
  testID?: string;
}

export interface TextInputRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  isFocused: () => boolean;
  validate: () => boolean;
}

const TextInput = forwardRef<TextInputRef, TextInputProps>(
  (
    {
      label,
      placeholder,
      value = '',
      onChangeText,
      error,
      warning,
      message,
      prefixIcon,
      suffixIcon,
      isPassword = false,
      mode = 'default',
      required = false,
      disabled = false,
      multiline = false,
      numberOfLines = 1,
      maxLength,
      validationSchema,
      showCharacterCount = false,
      containerStyle,
      inputStyle,
      labelStyle,
      errorStyle,
      onValidation,
      autoFocus = false,
      returnKeyType = 'default',
      onSubmitEditing,
      testID,
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState(value);
    const [validationError, setValidationError] = useState<string>('');
    const inputRef = useRef<RNTextInput>(null);

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      clear: () => {
        setInternalValue('');
        onChangeText?.('');
      },
      isFocused: () => isFocused,
      validate: () => validateInput(internalValue),
    }));

    const validateInput = (text: string): boolean => {
      if (!validationSchema) return true;

      try {
        validationSchema.validateSync(text);
        setValidationError('');
        onValidation?.(true);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Invalid input';
        setValidationError(errorMessage);
        onValidation?.(false, errorMessage);
        return false;
      }
    };

    const handleChangeText = (text: string) => {
      setInternalValue(text);
      onChangeText?.(text);

      // Real-time validation
      if (validationSchema) {
        validateInput(text);
      }
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
      // Validate on blur
      if (validationSchema) {
        validateInput(internalValue);
      }
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const getKeyboardType = () => {
      switch (mode) {
        case 'email':
          return 'email-address';
        case 'phone':
          return 'phone-pad';
        case 'number':
          return 'numeric';
        case 'url':
          return 'url';
        default:
          return 'default';
      }
    };

    const getAutoCapitalize = () => {
      if (mode === 'email' || mode === 'url') return 'none';
      return 'sentences';
    };

    const getAutoComplete = () => {
      switch (mode) {
        case 'email':
          return 'email';
        case 'phone':
          return 'tel';
        default:
          return 'off';
      }
    };

    // Determine current state
    const hasError = !!(error || validationError);
    const hasWarning = !!warning && !hasError;
    const displayMessage = error || validationError || warning || message;

    // Dynamic styles based on state
    const getInputContainerStyle = () => {
      let borderColor = '#E5E5E5';

      if (hasError) {
        borderColor = '#FF5252';
      } else if (hasWarning) {
        borderColor = '#FF9800';
      } else if (isFocused) {
        borderColor = colors.primary;
      }

      return [
        styles.inputContainer,
        {borderColor},
        disabled && styles.disabledContainer,
        containerStyle,
      ];
    };

    const getMessageStyle = () => {
      if (hasError) return [styles.message, styles.errorMessage, errorStyle];
      if (hasWarning) return [styles.message, styles.warningMessage];
      return [styles.message, styles.normalMessage];
    };

    const renderPasswordToggle = () => {
      if (!isPassword) return null;

      return (
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.passwordToggle}
          testID={`${testID}-password-toggle`}>
          {showPassword ? (
            <EyeSlashIcon size={20} color={colors.grayIconColor} />
          ) : (
            <EyeIcon size={20} color={colors.grayIconColor} />
          )}
        </TouchableOpacity>
      );
    };

    const renderCharacterCount = () => {
      if (!showCharacterCount || !maxLength) return null;

      return (
        <Text style={styles.characterCount}>
          {internalValue.length}/{maxLength}
        </Text>
      );
    };

    const content = (
      <View style={styles.container}>
        {/* Label */}
        {label && (
          <Text style={[styles.label, labelStyle]}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        )}

        {/* Input Container */}
        <View style={getInputContainerStyle()}>
          {/* Prefix Icon */}
          {prefixIcon && <View style={styles.prefixIcon}>{prefixIcon}</View>}

          {/* Text Input */}
          <RNTextInput
            ref={inputRef}
            style={[
              styles.input,
              multiline && styles.multilineInput,
              inputStyle,
            ]}
            value={internalValue}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor={colors.grayFont}
            secureTextEntry={isPassword && !showPassword}
            keyboardType={getKeyboardType()}
            autoCapitalize={getAutoCapitalize()}
            autoComplete={getAutoComplete()}
            editable={!disabled}
            multiline={multiline}
            numberOfLines={multiline ? numberOfLines : 1}
            maxLength={maxLength}
            autoFocus={autoFocus}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            testID={testID}
            {...rest}
          />

          {/* Suffix Icon or Password Toggle */}
          {isPassword
            ? renderPasswordToggle()
            : suffixIcon && <View style={styles.suffixIcon}>{suffixIcon}</View>}
        </View>

        {/* Bottom Row: Message and Character Count */}
        {(displayMessage || renderCharacterCount()) && (
          <View style={styles.bottomRow}>
            {displayMessage && (
              <Text style={getMessageStyle()}>{displayMessage}</Text>
            )}
            {renderCharacterCount()}
          </View>
        )}
      </View>
    );

    // Wrap with KeyboardAvoidingView for better UX
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        {content}
      </KeyboardAvoidingView>
    );
  },
);

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 0,
  },
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.darkFont,
    marginBottom: 8,
  },
  required: {
    color: '#FF5252',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: colors.whiteBg || '#FFFFFF',
    paddingHorizontal: 16,
    minHeight: 56,
  },
  disabledContainer: {
    backgroundColor: colors.grayBg,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.darkFont || '#212121',
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: 16,
    paddingBottom: 16,
  },
  prefixIcon: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suffixIcon: {
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordToggle: {
    marginLeft: 12,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    minHeight: 20,
  },
  message: {
    fontSize: 14,
    fontFamily: fonts.regular,
    flex: 1,
  },
  errorMessage: {
    color: '#FF5252',
  },
  warningMessage: {
    color: '#FF9800',
  },
  normalMessage: {
    color: colors.grayFont,
  },
  characterCount: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    marginLeft: 8,
  },
});

TextInput.displayName = 'TextInput';

export default TextInput;
