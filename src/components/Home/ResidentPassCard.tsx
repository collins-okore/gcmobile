import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {WifiIcon, QrCodeIcon} from 'react-native-heroicons/outline';
import colors from '../../themes/colors';
import fonts from '../../themes/fonts';
import {useAuth} from '../../contexts/AuthContext';

const ResidentPassCard = () => {
  const {user} = useAuth();

  // Format address - prioritize resident data
  const userAddress = user
    ? user.resident?.houseNumber && user.resident?.blockCourt
      ? `Unit ${user.resident.houseNumber}, Block ${user.resident.blockCourt}`
      : user.houseNumber && user.blockCourt
      ? `Unit ${user.houseNumber}, Block ${user.blockCourt}`
      : 'Address not available'
    : 'Loading address...';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A7FF2', '#0066CC']} // Gradient from primary to a slightly darker blue
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.card}>
        
        <View style={styles.headerRow}>
          <View>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>RESIDENT PASS</Text>
            </View>
            <Text style={styles.addressText}>{userAddress}</Text>
          </View>
          <View style={styles.iconContainer}>
             <WifiIcon color="white" size={24} />
          </View>
        </View>

        <View style={styles.footerRow}>
            <View>
                <Text style={styles.entryCodeLabel}>ENTRY CODE</Text>
                <Text style={styles.entryCodeValue}>882 901</Text> 
            </View>
            <TouchableOpacity style={styles.qrContainer}>
                <QrCodeIcon color="white" size={24} />
            </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

// Placeholder for now, later we can fetch real code
// The entry code logic would likely come from backend

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    height: 200, // Approximate height from screenshot
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80', // Green dot
    marginRight: 6,
  },
  statusText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontFamily: fonts.bold,
    letterSpacing: 1,
  },
  addressText: {
    color: 'white',
    fontSize: 18,
    fontFamily: fonts.bold,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  entryCodeLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontFamily: fonts.bold,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  entryCodeValue: {
    color: 'white',
    fontSize: 32,
    fontFamily: fonts.regular, // Looks monospaced or just regular in screenshot
    letterSpacing: 2,
  },
  qrContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});

export default ResidentPassCard;

