import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {CalendarIcon, ClockIcon} from 'react-native-heroicons/outline';
import DatePicker from 'react-native-date-picker';
import colors from '../../../themes/colors';
import fonts from '../../../themes/fonts';

export interface DateTimeInputProps {
  label?: string;
  value: Date;
  onChange?: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  error?: string;
  warning?: string;
  message?: string;
  required?: boolean;
  disabled?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
  containerStyle?: any;
  testID?: string;
}

const DateTimeInput: React.FC<DateTimeInputProps> = ({
  label,
  value,
  onChange,
  mode = 'datetime',
  error,
  warning,
  message,
  required = false,
  disabled = false,
  minimumDate,
  maximumDate,
  containerStyle,
  testID,
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };

    switch (mode) {
      case 'date':
        return date.toLocaleDateString('en-US', options);
      case 'time':
        return date.toLocaleTimeString('en-US', timeOptions);
      case 'datetime':
        const dateStr = date.toLocaleDateString('en-US', options);
        const timeStr = date.toLocaleTimeString('en-US', timeOptions);
        return `${dateStr} at ${timeStr}`;
      default:
        return date.toLocaleDateString('en-US', options);
    }
  };

  const handlePress = () => {
    if (!disabled) {
      setIsDatePickerOpen(true);
    }
  };

  const handleDateChange = (selectedDate: Date) => {
    setIsDatePickerOpen(false);
    if (onChange) {
      onChange(selectedDate);
    }
  };

  // Determine current state
  const hasError = !!error;
  const hasWarning = !!warning && !hasError;
  const displayMessage = error || warning || message;

  // Dynamic styles based on state
  const getInputContainerStyle = () => {
    let borderColor = '#E5E5E5';

    if (hasError) {
      borderColor = '#FF5252';
    } else if (hasWarning) {
      borderColor = '#FF9800';
    }

    return [
      styles.inputContainer,
      {borderColor},
      disabled && styles.disabledContainer,
      containerStyle,
    ];
  };

  const getMessageStyle = () => {
    if (hasError) return [styles.message, styles.errorMessage];
    if (hasWarning) return [styles.message, styles.warningMessage];
    return [styles.message, styles.normalMessage];
  };

  const getIcon = () => {
    if (mode === 'time') {
      return <ClockIcon size={20} color={colors.grayIconColor} />;
    }
    return <CalendarIcon size={20} color={colors.grayIconColor} />;
  };

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      {/* Input Container */}
      <TouchableOpacity
        style={getInputContainerStyle()}
        onPress={handlePress}
        disabled={disabled}
        testID={testID}>
        {getIcon()}
        <Text style={styles.inputText}>{formatDate(value)}</Text>
      </TouchableOpacity>

      {/* Message */}
      {displayMessage && (
        <Text style={getMessageStyle()}>{displayMessage}</Text>
      )}

      {/* Date Picker */}
      <DatePicker
        modal
        open={isDatePickerOpen}
        date={value}
        mode={mode}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onConfirm={handleDateChange}
        onCancel={() => setIsDatePickerOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: colors.whiteBg,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  disabledContainer: {
    backgroundColor: colors.grayBg,
    opacity: 0.6,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.darkFont,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    marginLeft: 12,
  },
  message: {
    fontSize: 14,
    fontFamily: fonts.regular,
    marginTop: 8,
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
});

export default DateTimeInput;
