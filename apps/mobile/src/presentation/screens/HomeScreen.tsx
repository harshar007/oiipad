import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Image
} from 'react-native';
import { useControllerStore } from '../state/useControllerStore';
import { getTheme } from '../theme/colors';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    connectionStatus,
    serverHost,
    serverPort,
    roomCode,
    playerName,
    init,
    connect,
    joinRoom,
    connectFromQr,
    setPlayerName,
    themeMode,
    toggleTheme,
    error
  } = useControllerStore();

  const theme = getTheme(themeMode);

  const [hostInput, setHostInput] = useState(serverHost);
  const [roomInput, setRoomInput] = useState(roomCode);
  const [nameInput, setNameInput] = useState(playerName);
  const [qrInput, setQrInput] = useState('');
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    setHostInput(serverHost);
  }, [serverHost]);

  const handleQuickConnect = async () => {
    await setPlayerName(nameInput);
    if (connectionStatus !== 'connected') {
      await connect(hostInput, serverPort);
    }
    joinRoom(roomInput);
    navigation.navigate('RoomLobby');
  };

  const handleManualQrConnect = async () => {
    if (!qrInput.trim()) return;
    await setPlayerName(nameInput);
    const success = await connectFromQr(qrInput.trim());
    if (success) {
      navigation.navigate('RoomLobby');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bgRoot }]}>
      <StatusBar
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.bgRoot}
      />
      
      {/* Top Navbar Row */}
      <View style={[styles.navBar, { borderBottomColor: theme.colors.border }]}>
        <View style={styles.brandGroup}>
          <Text style={[styles.navBrand, { color: theme.colors.primary }]}>⚡ GYNOO</Text>
        </View>

        <TouchableOpacity
          style={[styles.themeToggleBtn, { backgroundColor: theme.colors.bgCard, borderColor: theme.colors.border }]}
          onPress={toggleTheme}
          activeOpacity={0.7}
        >
          <Text style={styles.themeToggleIcon}>{themeMode === 'dark' ? '☀️' : '🌙'}</Text>
          <Text style={[styles.themeToggleLabel, { color: theme.colors.textPrimary }]}>
            {themeMode === 'dark' ? 'Light' : 'Dark'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Google Developer App Brand Header */}
        <View style={styles.header}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Gynoo</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Wireless Mobile Game Controller Platform (oii pad)
          </Text>

          <View
            style={[
              styles.statusBadge,
              connectionStatus === 'connected'
                ? { backgroundColor: theme.colors.onlineBg, borderColor: theme.colors.online }
                : { backgroundColor: theme.colors.offlineBg, borderColor: theme.colors.border }
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: connectionStatus === 'connected' ? theme.colors.online : theme.colors.textDim }
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: connectionStatus === 'connected' ? theme.colors.online : theme.colors.textSecondary }
              ]}
            >
              {connectionStatus === 'connected' ? 'CONNECTED TO PC' : 'READY TO CONNECT'}
            </Text>
          </View>
        </View>

        {error ? (
          <View style={[styles.errorBox, { backgroundColor: theme.colors.errorBg, borderColor: theme.colors.error }]}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
          </View>
        ) : null}

        {/* Primary Action Card: Scan Camera QR Code */}
        <View style={[styles.scanCard, { backgroundColor: theme.colors.bgCard, borderColor: theme.colors.primary }]}>
          <View style={styles.cardHeaderRow}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.primaryContainer }]}>
              <Text style={styles.cameraIcon}>📷</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.scanCardTitle, { color: theme.colors.textPrimary }]}>
                Instant QR Camera Connect
              </Text>
              <Text style={[styles.scanCardDesc, { color: theme.colors.textSecondary }]}>
                Scan the QR code on your PC server screen
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.scanButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.navigate('QrScanner')}
            activeOpacity={0.85}
          >
            <Text style={styles.scanButtonText}>OPEN CAMERA SCANNER 🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Match Setup & Player Profile Card */}
        <View style={[styles.card, { backgroundColor: theme.colors.bgCard, borderColor: theme.colors.border }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>Player & Room Setup</Text>

          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Your Racer Name</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.bgInput,
                color: theme.colors.textPrimary,
                borderColor: theme.colors.border
              }
            ]}
            value={nameInput}
            onChangeText={setNameInput}
            placeholder="e.g. SpeedRacer"
            placeholderTextColor={theme.colors.textDim}
          />

          <TouchableOpacity
            style={styles.toggleManualRow}
            onPress={() => setShowManual(!showManual)}
          >
            <Text style={[styles.toggleManualText, { color: theme.colors.primary }]}>
              {showManual ? '▲ Hide Direct IP & Room Entry' : '▼ Manual IP & Room Code Connect'}
            </Text>
          </TouchableOpacity>

          {showManual ? (
            <View style={styles.manualFields}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>PC Host IP Address</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.bgInput,
                    color: theme.colors.textPrimary,
                    borderColor: theme.colors.border
                  }
                ]}
                value={hostInput}
                onChangeText={setHostInput}
                placeholder="192.168.1.xxx"
                placeholderTextColor={theme.colors.textDim}
                keyboardType="numeric"
              />

              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Room Code</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.bgInput,
                    color: theme.colors.textPrimary,
                    borderColor: theme.colors.border
                  }
                ]}
                value={roomInput}
                onChangeText={(t) => setRoomInput(t.toUpperCase())}
                placeholder="BBR1"
                placeholderTextColor={theme.colors.textDim}
                autoCapitalize="characters"
              />

              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Paste QR Code Link</Text>
              <View style={styles.pasteRow}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      flex: 1,
                      backgroundColor: theme.colors.bgInput,
                      color: theme.colors.textPrimary,
                      borderColor: theme.colors.border
                    }
                  ]}
                  value={qrInput}
                  onChangeText={setQrInput}
                  placeholder="gynoo://192.168.1.xx:8888/BBR1"
                  placeholderTextColor={theme.colors.textDim}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={[styles.pasteBtn, { backgroundColor: theme.colors.primaryContainer }]}
                  onPress={handleManualQrConnect}
                >
                  <Text style={[styles.pasteBtnText, { color: theme.colors.onPrimaryContainer }]}>Join</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.colors.primaryDark }]}
            onPress={handleQuickConnect}
          >
            <Text style={styles.primaryButtonText}>ENTER GAME LOBBY →</Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Bottom Row */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: theme.colors.bgCard, borderColor: theme.colors.border }]}
            onPress={() => navigation.navigate('FindPc')}
          >
            <Text style={styles.secondaryButtonIcon}>📡</Text>
            <Text style={[styles.secondaryButtonText, { color: theme.colors.textPrimary }]}>Discover PCs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: theme.colors.bgCard, borderColor: theme.colors.border }]}
            onPress={() => navigation.navigate('GyroTest')}
          >
            <Text style={styles.secondaryButtonIcon}>🎯</Text>
            <Text style={[styles.secondaryButtonText, { color: theme.colors.textPrimary }]}>Gyro Test</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: theme.colors.bgCard, borderColor: theme.colors.border }]}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.secondaryButtonIcon}>⚙️</Text>
            <Text style={[styles.secondaryButtonText, { color: theme.colors.textPrimary }]}>Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  navBrand: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2
  },
  themeToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6
  },
  themeToggleIcon: {
    fontSize: 14
  },
  themeToggleLabel: {
    fontSize: 12,
    fontWeight: '800'
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center'
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8
  },
  logoImage: {
    width: 68,
    height: 68,
    marginBottom: 10,
    borderRadius: 20
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
    textAlign: 'center'
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 1
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  errorBox: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
    borderWidth: 1
  },
  errorText: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600'
  },
  scanCard: {
    borderRadius: 20,
    padding: 20,
    width: '100%',
    borderWidth: 1.5,
    marginBottom: 16,
    elevation: 3
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cameraIcon: {
    fontSize: 22
  },
  scanCardTitle: {
    fontSize: 17,
    fontWeight: '800'
  },
  scanCardDesc: {
    fontSize: 12,
    marginTop: 2
  },
  scanButton: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 4
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1
  },
  card: {
    borderRadius: 20,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    marginBottom: 16,
    elevation: 2
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 8
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1
  },
  toggleManualRow: {
    paddingVertical: 12,
    marginTop: 4
  },
  toggleManualText: {
    fontSize: 13,
    fontWeight: '700'
  },
  manualFields: {
    marginTop: 4
  },
  pasteRow: {
    flexDirection: 'row',
    gap: 8
  },
  pasteBtn: {
    borderRadius: 12,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pasteBtnText: {
    fontWeight: '800',
    fontSize: 13
  },
  primaryButton: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 18
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 1
  },
  secondaryButtonIcon: {
    fontSize: 18,
    marginBottom: 3
  },
  secondaryButtonText: {
    fontSize: 11,
    fontWeight: '700'
  }
});
