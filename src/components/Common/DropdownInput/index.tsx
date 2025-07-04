import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Platform,
} from 'react-native';
import {ChevronDownIcon, CheckIcon} from 'react-native-heroicons/outline';
import colors from '../../../themes/colors';
import fonts from '../../../themes/fonts';

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onSelect?: (value: string) => void;
  options: DropdownOption[];
  error?: string;
  warning?: string;
  message?: string;
  required?: boolean;
  disabled?: boolean;
  containerStyle?: any;
  testID?: string;
}

const DropdownInput: React.FC<DropdownInputProps> = ({
  label,
  placeholder = 'Select an option',
  value,
  onSelect,
  options,
  error,
  warning,
  message,
  required = false,
  disabled = false,
  containerStyle,
  testID,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSelect = (selectedValue: string) => {
    onSelect?.(selectedValue);
    setIsModalVisible(false);
  };

  const handlePress = () => {
    if (!disabled) {
      setIsModalVisible(true);
    }
  };

  // Find selected option label
  const selectedOption = options.find(option => option.value === value);
  const displayText = selectedOption ? selectedOption.label : '';

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

  const renderOption = ({item}: {item: DropdownOption}) => (
    <TouchableOpacity
      style={styles.optionItem}
      onPress={() => handleSelect(item.value)}
      testID={`${testID}-option-${item.value}`}>
      <Text style={styles.optionText}>{item.label}</Text>
      {value === item.value && <CheckIcon size={20} color={colors.primary} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      {/* Dropdown Container */}
      <TouchableOpacity
        style={getInputContainerStyle()}
        onPress={handlePress}
        disabled={disabled}
        testID={testID}>
        <Text
          style={[styles.inputText, !displayText && styles.placeholderText]}>
          {displayText || placeholder}
        </Text>
        <ChevronDownIcon
          size={20}
          color={disabled ? colors.grayFont : colors.grayIconColor}
        />
      </TouchableOpacity>

      {/* Message */}
      {displayMessage && (
        <Text style={getMessageStyle()}>{displayMessage}</Text>
      )}

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Select Option'}</Text>
            </View>
            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={item => item.value}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
    justifyContent: 'space-between',
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
  },
  placeholderText: {
    color: colors.grayFont,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.whiteBg,
    borderRadius: 12,
    maxHeight: '60%',
    width: '90%',
    overflow: 'hidden',
  },
  modalHeader: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fonts.semibold,
    color: colors.darkFont,
    textAlign: 'center',
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  optionText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.darkFont,
    flex: 1,
  },
});

export default DropdownInput;
