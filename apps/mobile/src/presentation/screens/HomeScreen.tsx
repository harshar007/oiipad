import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { useControllerStore } from '../state/useControllerStore';
import { Theme } from '../theme/colors';

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
    error
  } = useControllerStore();

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

  const handleQrConnect = async () => {
    if (!qrInput.trim()) return;
    await setPlayerName(nameInput);
    const success = await connectFromQr(qrInput.trim());
    if (success) {
      navigation.navigate('RoomLobby');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.bgRoot} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Google Devs Raven Brand Header */}
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoGlow}>⚡</Text>
          </View>
          <Text style={styles.title}>GYNOO</Text>
          <Text style={styles.subtitle}>Wireless Motion Controller • oii pad</Text>
          
          <View style={[styles.statusBadge, connectionStatus === 'connected' ? styles.statusOnline : styles.statusOffline]}>
            <View style={[styles.statusDot, connectionStatus === 'connected' ? styles.dotOnline : styles.dotOffline]} />
            <Text style={styles.statusText}>{connectionStatus.toUpperCase()}</Text>
          </View>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Instant QR Quick Connect Card (Top Priority) */}
        <View style={styles.qrCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.qrCardTitle}>📷 Quick QR / Terminal Connect</Text>
            <View style={styles.fastBadge}>
              <Text style={styles.fastBadgeText}>FAST</Text>
            </View>
          </View>
          <Text style={styles.cardDesc}>
            Enter the QR code link from your PC server terminal (e.g. gynoo://192.168.1.36:8888/BBR1)
          </Text>

          <TextInput
            style={styles.qrInput}
            value={qrInput}
            onChangeText={setQrInput}
            placeholder="gynoo://192.168.1.xx:8888/BBR1"
            placeholderTextColor={Theme.colors.textDim}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity style={styles.qrButton} onPress={handleQrConnect}>
            <Text style={styles.qrButtonText}>⚡ INSTANT CONNECT</Text>
          </TouchableOpacity>
        </View>

        {/* Player Profile & Match Setup Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Player Setup</Text>

          <Text style={styles.label}>Racer Name</Text>
          <TextInput
            style={styles.input}
            value={nameInput}
            onChangeText={setNameInput}
            placeholder="e.g. SpeedRacer"
            placeholderTextColor={Theme.colors.textDim}
          />

          <TouchableOpacity
            style={styles.toggleManualRow}
            onPress={() => setShowManual(!showManual)}
          >
            <Text style={styles.toggleManualText}>
              {showManual ? '▲ Hide Manual Host IP & Room' : '▼ Customize Server IP & Room Code'}
            </Text>
          </TouchableOpacity>

          {showManual ? (
            <View style={styles.manualFields}>
              <Text style={styles.label}>PC Host IP Address</Text>
              <TextInput
                style={styles.input}
                value={hostInput}
                onChangeText={setHostInput}
                placeholder="192.168.1.xxx"
                placeholderTextColor={Theme.colors.textDim}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Room Code</Text>
              <TextInput
                style={styles.input}
                value={roomInput}
                onChangeText={(t) => setRoomInput(t.toUpperCase())}
                placeholder="BBR1"
                placeholderTextColor={Theme.colors.textDim}
                autoCapitalize="characters"
              />
            </View>
          ) : null}

          <TouchableOpacity style={styles.primaryButton} onPress={handleQuickConnect}>
            <Text style={styles.primaryButtonText}>ENTER GAME LOBBY →</Text>
          </TouchableOpacity>
        </View>

        {/* Developer & Utility Navigation */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('FindPc')}
          >
            <Text style={styles.secondaryButtonIcon}>📡</Text>
            <Text style={styles.secondaryButtonText}>Discover PCs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('GyroTest')}
          >
            <Text style={styles.secondaryButtonIcon}>🎯</Text>
            <Text style={styles.secondaryButtonText}>Gyro Test</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.secondaryButtonIcon}>⚙️</Text>
            <Text style={styles.secondaryButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgRoot
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center'
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8
  },
  logoBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Theme.colors.bgCard,
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: Theme.colors.primaryLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10
  },
  logoGlow: {
    fontSize: 24
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: Theme.colors.white,
    letterSpacing: 4
  },
  subtitle: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    marginTop: 4,
    fontWeight: '500'
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 12,
    borderWidth: 1
  },
  statusOnline: {
    backgroundColor: Theme.colors.onlineBg,
    borderColor: Theme.colors.online
  },
  statusOffline: {
    backgroundColor: '#1b1328',
    borderColor: Theme.colors.border
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },
  dotOnline: {
    backgroundColor: Theme.colors.online
  },
  dotOffline: {
    backgroundColor: Theme.colors.textDim
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    color: Theme.colors.white,
    letterSpacing: 1
  },
  errorBox: {
    backgroundColor: Theme.colors.errorBg,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: Theme.colors.error
  },
  errorText: {
    color: Theme.colors.white,
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600'
  },
  qrCard: {
    backgroundColor: Theme.colors.bgCard,
    borderRadius: 18,
    padding: 18,
    width: '100%',
    borderWidth: 1.5,
    borderColor: Theme.colors.primaryLight,
    marginBottom: 18,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  qrCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.white
  },
  fastBadge: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  fastBadgeText: {
    color: Theme.colors.white,
    fontSize: 10,
    fontWeight: '900'
  },
  cardDesc: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    marginBottom: 14,
    lineHeight: 18
  },
  qrInput: {
    backgroundColor: Theme.colors.bgInput,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Theme.colors.white,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: 14,
    fontFamily: 'monospace'
  },
  qrButton: {
    backgroundColor: Theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: Theme.colors.primaryGlow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8
  },
  qrButtonText: {
    color: Theme.colors.white,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1
  },
  card: {
    backgroundColor: Theme.colors.bgCard,
    borderRadius: 18,
    padding: 18,
    width: '100%',
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: 18
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Theme.colors.white,
    marginBottom: 12
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.textSecondary,
    marginBottom: 6,
    marginTop: 8
  },
  input: {
    backgroundColor: Theme.colors.bgInput,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Theme.colors.white,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Theme.colors.border
  },
  toggleManualRow: {
    paddingVertical: 10,
    marginTop: 6
  },
  toggleManualText: {
    color: Theme.colors.lavender,
    fontSize: 12,
    fontWeight: '600'
  },
  manualFields: {
    marginTop: 4
  },
  primaryButton: {
    backgroundColor: Theme.colors.bgCardHover,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: Theme.colors.primaryLight
  },
  primaryButtonText: {
    color: Theme.colors.white,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: Theme.colors.bgCard,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border
  },
  secondaryButtonIcon: {
    fontSize: 18,
    marginBottom: 2
  },
  secondaryButtonText: {
    color: Theme.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700'
  }
});
