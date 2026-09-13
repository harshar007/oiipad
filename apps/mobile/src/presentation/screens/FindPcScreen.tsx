import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  StatusBar
} from 'react-native';
import { useControllerStore } from '../state/useControllerStore';
import { Theme } from '../theme/colors';
import { DiscoveredPc } from '@oiipad/domain';

export const FindPcScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { discoveredPcs, connect, joinRoom } = useControllerStore();
  const [manualIp, setManualIp] = useState('');
  const [manualPort, setManualPort] = useState('8888');

  const handleSelectPc = async (pc: DiscoveredPc) => {
    await connect(pc.host, pc.port);
    if (pc.roomCode) {
      joinRoom(pc.roomCode);
    }
    navigation.navigate('RoomLobby');
  };

  const handleManualConnect = async () => {
    if (!manualIp.trim()) return;
    await connect(manualIp.trim(), parseInt(manualPort, 10) || 8888);
    joinRoom('BBR1');
    navigation.navigate('RoomLobby');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.bgRoot} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>PC Discovery</Text>
          <Text style={styles.subtitle}>Scanning local Wi-Fi for active Gynoo PC hosts...</Text>
        </View>

        <Text style={styles.sectionHeader}>Discovered PC Hosts on Network</Text>
        {discoveredPcs.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Searching for PC hosts on your Wi-Fi...</Text>
          </View>
        ) : (
          <FlatList
            data={discoveredPcs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.pcCard}
                onPress={() => handleSelectPc(item)}
                activeOpacity={0.8}
              >
                <View>
                  <Text style={styles.pcName}>{item.name}</Text>
                  <Text style={styles.pcIp}>ws://{item.host}:{item.port}</Text>
                </View>
                <View style={styles.pcBadge}>
                  <Text style={styles.pcBadgeText}>ROOM {item.roomCode || 'BBR1'}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}

        <View style={styles.manualCard}>
          <Text style={styles.manualTitle}>Direct IP Connection</Text>
          <TextInput
            style={styles.input}
            placeholder="192.168.1.xxx"
            placeholderTextColor={Theme.colors.textDim}
            value={manualIp}
            onChangeText={setManualIp}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.connectBtn} onPress={handleManualConnect} activeOpacity={0.85}>
            <Text style={styles.connectBtnText}>CONNECT TO IP</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.bgRoot
  },
  content: {
    padding: 20,
    flex: 1
  },
  header: {
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: Theme.colors.textPrimary
  },
  subtitle: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginTop: 2
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: Theme.colors.primary,
    marginBottom: 10,
    letterSpacing: 0.5
  },
  emptyCard: {
    backgroundColor: Theme.colors.bgCard,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Theme.colors.border
  },
  emptyText: {
    color: Theme.colors.textMuted,
    fontSize: 14
  },
  pcCard: {
    backgroundColor: Theme.colors.bgCard,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: Theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2
  },
  pcName: {
    color: Theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '800'
  },
  pcIp: {
    color: Theme.colors.primary,
    fontSize: 13,
    marginTop: 2,
    fontFamily: 'monospace'
  },
  pcBadge: {
    backgroundColor: Theme.colors.primaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8
  },
  pcBadgeText: {
    color: Theme.colors.onPrimaryContainer,
    fontSize: 11,
    fontWeight: '900'
  },
  manualCard: {
    backgroundColor: Theme.colors.bgCard,
    borderRadius: 18,
    padding: 18,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2
  },
  manualTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10
  },
  input: {
    backgroundColor: Theme.colors.bgInput,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Theme.colors.textPrimary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: 12
  },
  connectBtn: {
    backgroundColor: Theme.colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4
  },
  connectBtnText: {
    color: Theme.colors.white,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1
  },
  backBtn: {
    alignItems: 'center',
    paddingVertical: 14
  },
  backBtnText: {
    color: Theme.colors.textMuted,
    fontSize: 14,
    fontWeight: '700'
  }
});
