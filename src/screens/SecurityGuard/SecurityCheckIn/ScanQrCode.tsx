import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {ArrowLeftIcon} from 'react-native-heroicons/outline';
import colors from '../../../themes/colors';
import fonts from '../../../themes/fonts';
import Button from '../../../components/Common/Button';
import TextInputComponent from '../../../components/Common/Textinput';
import securityGuardGuestService from '../../../services/securityGuardGuestService';
import {normalize} from '../../../lib/normalize';
import {Camera, CameraType} from 'react-native-camera-kit';

const ScanQrCode = () => {
  const navigation = useNavigation();
  const [isScanning, setIsScanning] = useState(true);
  const [manualCode, setManualCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBackPress = () => {
    (navigation as any).goBack();
  };

  const handleQRCodeScanned = async (data: string) => {
    if (!data.trim()) {
      Alert.alert('Error', 'Invalid QR code data');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await securityGuardGuestService.verifyPassCode(
        data.trim(),
      );
      const responseData = normalize(response.data);

      setIsProcessing(false);
      if (responseData && responseData.guestId) {
        (navigation as any).navigate('ViewSecurityGuardGuest', {
          guestId: responseData.guestId,
        });
      } else {
        Alert.alert('Invalid Code', 'No guest found for this code.');
      }
    } catch (error: any) {
      setIsProcessing(false);
      Alert.alert(
        'Verification Failed',
        error?.message || 'Could not verify code. Please try again.',
      );
    }
  };

  const handleManualCodeSubmit = async () => {
    if (!manualCode.trim()) {
      Alert.alert('Error', 'Please enter a valid invitation code');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await securityGuardGuestService.verifyPassCode(
        manualCode.trim(),
      );
      const data = normalize(response.data);

      setIsProcessing(false);
      setManualCode('');
      if (data && data.guestId) {
        (navigation as any).navigate('ViewSecurityGuardGuest', {
          guestId: data.guestId,
        });
      } else {
        Alert.alert('Invalid Code', 'No guest found for this code.');
      }
    } catch (error: any) {
      setIsProcessing(false);
      Alert.alert(
        'Verification Failed',
        error?.message || 'Could not verify code. Please try again.',
      );
    }
  };

  const onReadCode = (event: any) => {
    if (!isProcessing) {
      handleQRCodeScanned(event.nativeEvent.codeStringValue);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.whiteBg} />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeftIcon size={24} color={colors.darkFont} />
          </TouchableOpacity>
          <Text style={styles.title}>Scan Invitation</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {isScanning ? (
            <>
              {/* QR Scanner Section */}
              <View style={styles.scannerSection}>
                <Text style={styles.sectionTitle}>Scan QR Code</Text>
                <Text style={styles.sectionSubtitle}>
                  Position the QR code within the frame to scan
                </Text>

                {/* Scanner Frame */}
                <View style={styles.scannerContainer}>
                  <View style={styles.scannerFrame}>
                    {isProcessing ? (
                      <View style={styles.processingContainer}>
                        <ActivityIndicator
                          size="large"
                          color={colors.primary}
                        />
                        <Text style={styles.processingText}>Processing...</Text>
                      </View>
                    ) : (
                      <Camera
                        onReadCode={onReadCode}
                        scanBarcode={true}
                        cameraType={CameraType.Back}
                        flashMode="auto"
                        focusMode="on"
                        showFrame={true}
                        laserColor={colors.primary}
                        frameColor={colors.primary}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 12,
                        }}
                      />
                    )}
                  </View>

                  {/* Scanner corners */}
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />
                </View>
              </View>

              {/* OR Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Manual Entry Section */}
              <View style={styles.manualSection}>
                <Text style={styles.sectionTitle}>Enter Code Manually</Text>
                <Text style={styles.sectionSubtitle}>
                  Enter the invitation code if QR is not available
                </Text>

                <TouchableOpacity
                  style={styles.switchButton}
                  onPress={() => setIsScanning(false)}>
                  <Text style={styles.switchButtonText}>
                    Enter Code Manually
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              {/* Manual Code Entry */}
              <View style={styles.manualEntrySection}>
                <Text style={styles.sectionTitle}>Enter Invitation Code</Text>
                <Text style={styles.sectionSubtitle}>
                  Type the invitation code provided by the guest
                </Text>

                <View style={styles.inputContainer}>
                  <TextInputComponent
                    placeholder="INV-XXXXXXXXX"
                    value={manualCode}
                    onChangeText={setManualCode}
                    autoCapitalize="characters"
                    autoCorrect={false}
                  />
                </View>

                <View style={styles.buttonContainer}>
                  <Button
                    title="Verify Code"
                    onPress={handleManualCodeSubmit}
                    disabled={!manualCode.trim() || isProcessing}
                    loading={isProcessing}
                    variant="primary"
                  />
                </View>

                <TouchableOpacity
                  style={styles.backToScanButton}
                  onPress={() => setIsScanning(true)}>
                  <Text style={styles.backToScanText}>Back to QR Scanner</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
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
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.semibold,
    color: colors.darkFont,
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  scannerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.semibold,
    color: colors.darkFont,
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    textAlign: 'center',
    marginBottom: 24,
  },
  scannerContainer: {
    position: 'relative',
    width: 280,
    height: 280,
  },
  scannerFrame: {
    flex: 1,
    backgroundColor: colors.grayBg,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  processingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.primary,
    marginTop: 12,
  },
  scannerText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.grayFont,
    textAlign: 'center',
    marginTop: 12,
  },
  demoButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 16,
  },
  demoButtonText: {
    fontSize: 12,
    fontFamily: fonts.semibold,
    color: colors.whiteBg,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: colors.primary,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.grayFont,
    marginHorizontal: 16,
  },
  manualSection: {
    alignItems: 'center',
  },
  switchButton: {
    backgroundColor: colors.grayBg,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  switchButtonText: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.darkFont,
  },
  manualEntrySection: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 24,
  },
  backToScanButton: {
    paddingVertical: 12,
  },
  backToScanText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.primary,
    textAlign: 'center',
  },
});

export default ScanQrCode;
