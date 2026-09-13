import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useControllerStore } from '../state/useControllerStore';
import { Theme } from '../theme/colors';

export const QrScannerScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const { connectFromQr } = useControllerStore();

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    const success = await connectFromQr(data);
    if (success) {
      navigation.replace('RoomLobby');
    } else {
      setTimeout(() => setScanned(false), 2000);
    }
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.containerCenter}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.containerCenter}>
        <View style={styles.permissionCard}>
          <Text style={styles.cardIcon}>📷</Text>
          <Text style={styles.cardTitle}>Camera Access Needed</Text>
          <Text style={styles.cardDesc}>
            Gynoo uses your camera to scan the PC Server QR code and connect instantly.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={requestPermission}>
            <Text style={styles.primaryButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.secondaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.cameraContainer}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['qr']
          }}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        />

        {/* Overlay Viewfinder */}
        <View style={styles.overlay}>
          <View style={styles.headerBar}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.closeBtnText}>✕ Close</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Scan PC QR Code</Text>
            <View style={{ width: 60 }} />
          </View>

          <View style={styles.scanTargetBox}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>

          <View style={styles.footerPrompt}>
            <Text style={styles.promptText}>
              Point camera at the QR code on your PC Server screen
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  containerCenter: {
    flex: 1,
    backgroundColor: Theme.colors.bgRoot,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  cameraContainer: {
    flex: 1,
    position: 'relative'
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 30
  },
  headerBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  closeBtn: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20
  },
  closeBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700'
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800'
  },
  scanTargetBox: {
    width: 250,
    height: 250,
    position: 'relative',
    backgroundColor: 'transparent'
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: Theme.colors.primaryLight
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12
  },
  footerPrompt: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    marginHorizontal: 20
  },
  promptText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center'
  },
  permissionCard: {
    backgroundColor: Theme.colors.bgCard,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: Theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16
  },
  cardIcon: {
    fontSize: 48,
    marginBottom: 12
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Theme.colors.textPrimary,
    marginBottom: 8
  },
  cardDesc: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20
  },
  primaryButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10
  },
  primaryButtonText: {
    color: Theme.colors.white,
    fontSize: 15,
    fontWeight: '800'
  },
  secondaryButton: {
    paddingVertical: 10,
    alignItems: 'center'
  },
  secondaryButtonText: {
    color: Theme.colors.textMuted,
    fontSize: 14,
    fontWeight: '600'
  },
  loadingText: {
    marginTop: 12,
    color: Theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '600'
  }
});
