import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Platform,
  TextInput,
} from 'react-native';
import {
  ChevronDownIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline';
import colors from '../../../themes/colors';
import fonts from '../../../themes/fonts';

export interface SearchableDropdownOption {
  label: string;
  value: string;
}

export interface SearchableDropdownProps {
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  value?: string;
  onSelect?: (value: string) => void;
  options: SearchableDropdownOption[];
  error?: string;
  warning?: string;
  message?: string;
  required?: boolean;
  disabled?: boolean;
  containerStyle?: any;
  testID?: string;
  loading?: boolean;
  emptyMessage?: string;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  label,
  placeholder = 'Search and select...',
  searchPlaceholder = 'Search...',
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
  loading = false,
  emptyMessage = 'No options found',
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Filter options based on search text
  const filteredOptions = useMemo(() => {
    if (!searchText.trim()) return options;

    return options.filter(
      option =>
        option.label.toLowerCase().includes(searchText.toLowerCase()) ||
        option.value.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [options, searchText]);

  const handleSelect = (selectedValue: string) => {
    onSelect?.(selectedValue);
    setIsModalVisible(false);
    setSearchText('');
  };

  const handlePress = () => {
    if (!disabled) {
      setIsModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSearchText('');
  };

  const clearSearch = () => {
    setSearchText('');
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

  const renderOption = ({item}: {item: SearchableDropdownOption}) => (
    <TouchableOpacity
      style={styles.optionItem}
      onPress={() => handleSelect(item.value)}
      testID={`${testID}-option-${item.value}`}>
      <Text style={styles.optionText}>{item.label}</Text>
      {value === item.value && <CheckIcon size={20} color={colors.primary} />}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>{emptyMessage}</Text>
    </View>
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
        disabled={disabled || loading}
        testID={testID}>
        <Text
          style={[styles.inputText, !displayText && styles.placeholderText]}>
          {loading ? 'Loading...' : displayText || placeholder}
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
        onRequestClose={handleModalClose}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleModalClose}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Select Option'}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleModalClose}>
                <XMarkIcon size={24} color={colors.darkFont} />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
              <MagnifyingGlassIcon
                size={20}
                color={colors.grayIconColor}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder={searchPlaceholder}
                placeholderTextColor={colors.grayFont}
                value={searchText}
                onChangeText={setSearchText}
                autoCapitalize="none"
                testID={`${testID}-search-input`}
              />
              {searchText.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={clearSearch}>
                  <XMarkIcon size={16} color={colors.grayFont} />
                </TouchableOpacity>
              )}
            </View>

            {/* Options List */}
            <FlatList
              data={filteredOptions}
              renderItem={renderOption}
              keyExtractor={item => item.value}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={renderEmptyState}
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
    marginTop: 4,
    marginLeft: 4,
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
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: colors.whiteBg,
    borderRadius: 12,
    width: '100%',
    maxHeight: '80%',
    paddingBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fonts.semibold,
    color: colors.darkFont,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.darkFont,
    padding: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  optionText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.darkFont,
    flex: 1,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    textAlign: 'center',
  },
});

export default SearchableDropdown;
