import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Text,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../../themes/colors';
import fonts from '../../../themes/fonts';
import {ArrowLeftIcon} from 'react-native-heroicons/outline';
import {useNavigation} from '@react-navigation/native';
import TextInput from '../../../components/Common/Textinput/index';
import DropdownInput from '../../../components/Common/DropdownInput/index';
import DateTimeInput from '../../../components/Common/DateTimeInput/index';
import Button from '../../../components/Common/Button/index';

const AddGuest = () => {
  const navigation = useNavigation();

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    phone: '',
    purpose: '',
    arrivalTime: new Date(),
    vehicleLicensePlate: '',
    vehicleMake: '',
    vehicleModel: '',
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleInputChange = (field: string) => (value: string | Date) => {
    setFormData(prev => ({...prev, [field]: value}));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.idNumber.trim()) {
      newErrors.idNumber = 'ID number is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Purpose is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddGuest = () => {
    if (validateForm()) {
      Alert.alert(
        'Guest Added',
        'Guest has been successfully added to the system.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    }
  };

  const purposeOptions = [
    {label: 'Business Meeting', value: 'business'},
    {label: 'Personal Visit', value: 'personal'},
    {label: 'Delivery', value: 'delivery'},
    {label: 'Maintenance', value: 'maintenance'},
    {label: 'Guest/Friend', value: 'guest'},
    {label: 'Family Visit', value: 'family'},
    {label: 'Other', value: 'other'},
  ];

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.whiteBg} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}>
              <ArrowLeftIcon size={24} color={colors.darkFont} />
            </TouchableOpacity>
            <Text style={styles.title}>Add Guest</Text>
            <Text style={styles.subtitle}>
              Register your guest by filling out their details.
            </Text>
          </View>

          <View style={styles.formContainer}>
            {/* Personal Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>

              <TextInput
                label="Full Name"
                placeholder="Enter guest's full name"
                value={formData.fullName}
                onChangeText={handleInputChange('fullName')}
                error={errors.fullName}
                required
                testID="full-name-input"
              />

              <TextInput
                label="ID Number"
                placeholder="Enter ID/Passport number"
                value={formData.idNumber}
                onChangeText={handleInputChange('idNumber')}
                error={errors.idNumber}
                required
                testID="id-number-input"
              />

              <TextInput
                label="Phone Number"
                placeholder="Enter phone number"
                value={formData.phone}
                onChangeText={handleInputChange('phone')}
                mode="phone"
                error={errors.phone}
                required
                testID="phone-input"
              />
            </View>

            {/* Visit Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Visit Information</Text>

              <DropdownInput
                label="Purpose of Visit"
                placeholder="Select purpose"
                value={formData.purpose}
                onSelect={handleInputChange('purpose')}
                options={purposeOptions}
                error={errors.purpose}
                required
                testID="purpose-dropdown"
              />

              <DateTimeInput
                label="Arrival Date & Time"
                value={formData.arrivalTime}
                onChange={handleInputChange('arrivalTime')}
                mode="datetime"
                testID="arrival-time-picker"
              />
            </View>

            {/* Vehicle Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vehicle Information</Text>
              <Text style={styles.sectionSubtitle}>
                Optional - Fill if guest has a vehicle
              </Text>

              <TextInput
                label="License Plate"
                placeholder="Enter vehicle license plate"
                value={formData.vehicleLicensePlate}
                onChangeText={handleInputChange('vehicleLicensePlate')}
                testID="license-plate-input"
              />

              <TextInput
                label="Vehicle Make"
                placeholder="e.g., Toyota, BMW, Honda"
                value={formData.vehicleMake}
                onChangeText={handleInputChange('vehicleMake')}
                testID="vehicle-make-input"
              />

              <TextInput
                label="Vehicle Model"
                placeholder="e.g., Camry, X5, Civic"
                value={formData.vehicleModel}
                onChangeText={handleInputChange('vehicleModel')}
                testID="vehicle-model-input"
              />
            </View>

            {/* Bottom spacing for fixed button */}
            <View style={styles.bottomSpacing} />
          </View>
        </SafeAreaView>
      </ScrollView>

      {/* Fixed Add Guest Button */}
      <SafeAreaView style={styles.buttonSafeArea} edges={['bottom']}>
        <View style={styles.buttonContainer}>
          <Button
            title="Add Guest"
            onPress={handleAddGuest}
            testID="add-guest-button"
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.whiteBg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Space for fixed button
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.whiteBg,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 14,
    paddingVertical: 0,
    marginBottom: 24,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 0,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.darkFont,
    marginLeft: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    marginLeft: 4,
    marginTop: 4,
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.semibold,
    color: colors.darkFont,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    marginBottom: 16,
  },
  bottomSpacing: {
    height: 20,
  },
  buttonSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.whiteBg,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.whiteBg,
  },
});

export default AddGuest;
