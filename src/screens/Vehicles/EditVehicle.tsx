import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Text,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowLeftIcon} from 'react-native-heroicons/outline';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Toast} from 'toastify-react-native';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import TextInput from '../../components/Common/Textinput/index';
import Button from '../../components/Common/Button/index';
import residentVehicleService, {
  Vehicle,
} from '../../services/residentVehicleService';
import {normalize} from '../../lib/normalize';

interface VehicleFormData {
  licensePlate: string;
  make: string;
  model: string;
  color: string;
}

interface FormErrors {
  licensePlate?: string;
  make?: string;
  model?: string;
  color?: string;
}

const EditVehicle = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {vehicleId} = route.params as {vehicleId: string};

  const [_vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<VehicleFormData>({
    licensePlate: '',
    make: '',
    model: '',
    color: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadVehicleData = useCallback(async () => {
    try {
      setIsFetching(true);
      setFetchError(null);

      const response = await residentVehicleService.getVehicleById(vehicleId, {
        populate: ['resident', 'estate'],
      });

      const vehicleData = normalize(response.data);
      setVehicle(vehicleData);

      // Pre-populate form with existing data
      setFormData({
        licensePlate: vehicleData.licensePlate || '',
        make: vehicleData.make || '',
        model: vehicleData.model || '',
        color: vehicleData.color || '',
      });
    } catch (error: any) {
      console.error('Error fetching vehicle:', error);
      setFetchError('Failed to load vehicle details. Please try again.');

      Toast.show({
        type: 'error',
        text1: 'Failed to Load Vehicle',
        text2: 'Could not load vehicle details',
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setIsFetching(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    loadVehicleData();
  }, [loadVehicleData]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleInputChange =
    (field: keyof VehicleFormData) => (value: string) => {
      setFormData(prev => ({...prev, [field]: value}));

      // Clear error when user starts typing
      if (errors[field as keyof FormErrors]) {
        setErrors(prev => ({...prev, [field]: undefined}));
      }
    };

  const validatePlateNumber = (plateNumber: string): boolean => {
    if (!plateNumber.trim()) return false;
    // Basic validation - at least 3 characters, alphanumeric and hyphens
    const plateRegex = /^[A-Za-z0-9\-]{3,}$/;
    return plateRegex.test(plateNumber.replace(/\s/g, ''));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // License plate validation (required)
    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = 'License plate is required';
    } else if (!validatePlateNumber(formData.licensePlate)) {
      newErrors.licensePlate =
        'Please enter a valid plate number (at least 3 characters)';
    }

    // Make validation (required)
    if (!formData.make.trim()) {
      newErrors.make = 'Vehicle make is required';
    }

    // Model validation (required)
    if (!formData.model.trim()) {
      newErrors.model = 'Vehicle model is required';
    }

    // Color is optional, no validation needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateVehicle = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare update data
      const updateData = {
        licensePlate: formData.licensePlate.trim(),
        make: formData.make.trim(),
        model: formData.model.trim(),
        ...(formData.color.trim() && {color: formData.color.trim()}),
      };

      await residentVehicleService.updateVehicle(vehicleId, updateData);

      Toast.show({
        type: 'success',
        text1: 'Vehicle Updated Successfully!',
        text2: `${formData.make} ${formData.model} has been updated`,
        position: 'top',
        visibilityTime: 3000,
      });

      // Navigate back after a short delay to show the toast
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error: any) {
      console.error('Error updating vehicle:', error);

      let errorMessage = 'Failed to update vehicle. Please try again.';

      if (error.response) {
        if (error.response.status === 422) {
          // Validation errors
          if (error.response.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data?.errors) {
            // Handle validation errors object
            const errors = error.response.data.errors;
            const firstError = Object.values(errors)[0];
            if (Array.isArray(firstError) && firstError.length > 0) {
              errorMessage = firstError[0];
            }
          }
        } else if (error.response.status === 404) {
          errorMessage = 'Vehicle not found. It may have been deleted.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage =
          'Network error. Please check your connection and try again.';
      }

      Toast.show({
        type: 'error',
        text1: 'Failed to Update Vehicle',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while fetching data
  if (isFetching) {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.whiteBg} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}>
              <ArrowLeftIcon size={24} color={colors.darkFont} />
            </TouchableOpacity>
            <Text style={styles.title}>Edit Vehicle</Text>
            <Text style={styles.subtitle}>Update vehicle information</Text>
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading vehicle details...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Show error state if fetching failed
  if (fetchError) {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.whiteBg} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}>
              <ArrowLeftIcon size={24} color={colors.darkFont} />
            </TouchableOpacity>
            <Text style={styles.title}>Edit Vehicle</Text>
            <Text style={styles.subtitle}>Update vehicle information</Text>
          </View>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{fetchError}</Text>
            <View style={styles.retryButtonContainer}>
              <Button title="Retry" onPress={loadVehicleData} />
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.whiteBg} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}>
              <ArrowLeftIcon size={24} color={colors.darkFont} />
            </TouchableOpacity>
            <Text style={styles.title}>Edit Vehicle</Text>
            <Text style={styles.subtitle}>Update vehicle information</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Vehicle Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vehicle Information</Text>

              <TextInput
                label="License Plate"
                placeholder="Enter plate number (e.g., ABC-123)"
                value={formData.licensePlate}
                onChangeText={handleInputChange('licensePlate')}
                error={errors.licensePlate}
                required
                autoCapitalize="characters"
                testID="license-plate-input"
              />

              <TextInput
                label="Vehicle Make"
                placeholder="Enter vehicle make (e.g., Toyota, Honda)"
                value={formData.make}
                onChangeText={handleInputChange('make')}
                error={errors.make}
                required
                autoCapitalize="words"
                testID="vehicle-make-input"
              />

              <TextInput
                label="Vehicle Model"
                placeholder="Enter vehicle model (e.g., Camry, Civic)"
                value={formData.model}
                onChangeText={handleInputChange('model')}
                error={errors.model}
                required
                autoCapitalize="words"
                testID="vehicle-model-input"
              />

              <TextInput
                label="Vehicle Color"
                placeholder="Enter vehicle color (optional)"
                value={formData.color}
                onChangeText={handleInputChange('color')}
                error={errors.color}
                autoCapitalize="words"
                testID="vehicle-color-input"
              />
            </View>

            {/* Bottom spacing for fixed button */}
            <View style={styles.bottomSpacing} />
          </View>
        </SafeAreaView>
      </ScrollView>

      {/* Fixed Update Button */}
      <SafeAreaView style={styles.buttonSafeArea} edges={['bottom']}>
        <View style={styles.buttonContainer}>
          <Button
            title="Update Vehicle"
            onPress={handleUpdateVehicle}
            loading={isLoading}
            disabled={isLoading}
            testID="update-vehicle-button"
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.whiteBg,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.whiteBg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Space for fixed button
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    marginTop: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    textAlign: 'center',
  },
  retryButtonContainer: {
    marginTop: 16,
    width: '100%',
    maxWidth: 200,
  },
});

export default EditVehicle;
