import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar
} from 'react-native';
import { useControllerStore } from '../state/useControllerStore';
import { Theme } from '../theme/colors';

export const RoomLobbyScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    roomCode,
    playerId,
    playerSlot,
    gameProfile,
    players,
    isReady,
    setReady,
    selectGameProfile,
    leaveRoom,
    startController
  } = useControllerStore();

  const handleStartGameplay = async () => {
    await startController();
    navigation.navigate('BbrController');
  };

  const handleLeave = () => {
    leaveRoom();
    navigation.navigate('Home');
  };

  const profiles = [
    { id: 'bbr1', label: 'Beach Buggy Racing 1', icon: '🏎️' },
    { id: 'bbr2', label: 'Beach Buggy Racing 2', icon: '🚀' },
    { id: 'standard', label: 'Standard Gamepad', icon: '🎮' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.bgRoot} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Lobby Header */}
        <View style={styles.header}>
          <Text style={styles.lobbyLabel}>ACTIVE RACE ROOM</Text>
          <Text style={styles.roomCodeText}>{roomCode}</Text>
          <View style={styles.slotPill}>
            <Text style={styles.slotBadgeText}>🎮 Assigned: Player {playerSlot ?? '?'}</Text>
          </View>
        </View>

        {/* Game Profile Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Game Profile</Text>
          <View style={styles.profileRow}>
            {profiles.map((p) => {
              const isSelected = gameProfile === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.profileChip, isSelected && styles.profileChipActive]}
                  onPress={() => selectGameProfile(p.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.profileIcon}>{p.icon}</Text>
                  <Text style={[styles.profileText, isSelected && styles.profileTextActive]}>
                    {p.label}
                  </Text>
                  {isSelected ? (
                    <View style={styles.activeCheck}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 4-Player Slot Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Multiplayer Slots (1–4)</Text>
          <View style={styles.slotsGrid}>
            {[1, 2, 3, 4].map((slotNum) => {
              const playerInSlot = players.find((p) => p.slot === slotNum);
              const isMe = playerInSlot?.id === playerId;

              return (
                <View
                  key={slotNum}
                  style={[
                    styles.slotCard,
                    playerInSlot ? styles.slotCardOccupied : styles.slotCardEmpty,
                    isMe && styles.slotCardSelf
                  ]}
                >
                  <View style={styles.slotHeader}>
                    <Text style={[styles.slotNumber, isMe && styles.slotNumberSelf]}>
                      P{slotNum}
                    </Text>
                    {playerInSlot?.readyState ? (
                      <View style={styles.readyBadge}>
                        <Text style={styles.readyText}>READY</Text>
                      </View>
                    ) : playerInSlot ? (
                      <View style={styles.waitingBadge}>
                        <Text style={styles.waitingText}>JOINED</Text>
                      </View>
                    ) : null}
                  </View>

                  <Text style={styles.slotPlayerName} numberOfLines={1}>
                    {playerInSlot ? playerInSlot.name : 'Waiting for phone...'}
                  </Text>
                  {isMe ? <Text style={styles.selfTag}>★ YOU</Text> : null}
                </View>
              );
            })}
          </View>
        </View>

        {/* Action Controls */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.readyButton, isReady ? styles.readyButtonActive : styles.readyButtonInactive]}
            onPress={() => setReady(!isReady)}
            activeOpacity={0.8}
          >
            <Text style={styles.readyButtonText}>
              {isReady ? '✓ READY TO RACE' : 'MARK AS READY'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playButton}
            onPress={handleStartGameplay}
            activeOpacity={0.8}
          >
            <Text style={styles.playButtonText}>START CONTROLLER 🚀</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.leaveButton}
            onPress={handleLeave}
          >
            <Text style={styles.leaveButtonText}>← Leave Room</Text>
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
  content: {
    padding: 20
  },
  header: {
    alignItems: 'center',
    marginBottom: 20
  },
  lobbyLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Theme.colors.lavender,
    letterSpacing: 2
  },
  roomCodeText: {
    fontSize: 42,
    fontWeight: '900',
    color: Theme.colors.white,
    letterSpacing: 6,
    marginVertical: 4
  },
  slotPill: {
    backgroundColor: Theme.colors.bgCard,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Theme.colors.primaryLight
  },
  slotBadgeText: {
    fontSize: 13,
    color: Theme.colors.lavender,
    fontWeight: '800'
  },
  section: {
    marginBottom: 22
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Theme.colors.textSecondary,
    marginBottom: 10,
    letterSpacing: 0.5
  },
  profileRow: {
    gap: 8
  },
  profileChip: {
    backgroundColor: Theme.colors.bgCard,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  profileChipActive: {
    borderColor: Theme.colors.primaryGlow,
    backgroundColor: Theme.colors.bgCardHover,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6
  },
  profileIcon: {
    fontSize: 18
  },
  profileText: {
    color: Theme.colors.textMuted,
    fontWeight: '700',
    fontSize: 14,
    flex: 1
  },
  profileTextActive: {
    color: Theme.colors.white,
    fontWeight: '900'
  },
  activeCheck: {
    backgroundColor: Theme.colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkText: {
    color: Theme.colors.white,
    fontSize: 12,
    fontWeight: '900'
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  slotCard: {
    width: '48%',
    padding: 14,
    borderRadius: 14,
    minHeight: 85,
    justifyContent: 'space-between',
    borderWidth: 1.5
  },
  slotCardEmpty: {
    backgroundColor: Theme.colors.bgCard,
    borderColor: Theme.colors.border,
    opacity: 0.5
  },
  slotCardOccupied: {
    backgroundColor: Theme.colors.bgCard,
    borderColor: Theme.colors.borderActive
  },
  slotCardSelf: {
    borderColor: Theme.colors.primaryGlow,
    backgroundColor: Theme.colors.bgCardHover
  },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  slotNumber: {
    fontSize: 14,
    fontWeight: '900',
    color: Theme.colors.textMuted
  },
  slotNumberSelf: {
    color: Theme.colors.lavender
  },
  readyBadge: {
    backgroundColor: Theme.colors.onlineBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Theme.colors.online
  },
  readyText: {
    fontSize: 9,
    fontWeight: '900',
    color: Theme.colors.white
  },
  waitingBadge: {
    backgroundColor: '#3b2164',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  waitingText: {
    fontSize: 9,
    fontWeight: '800',
    color: Theme.colors.lavender
  },
  slotPlayerName: {
    color: Theme.colors.white,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6
  },
  selfTag: {
    fontSize: 11,
    fontWeight: '900',
    color: Theme.colors.primaryGlow
  },
  buttonGroup: {
    marginTop: 8,
    gap: 10
  },
  readyButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5
  },
  readyButtonActive: {
    backgroundColor: Theme.colors.onlineBg,
    borderColor: Theme.colors.online
  },
  readyButtonInactive: {
    backgroundColor: Theme.colors.bgCard,
    borderColor: Theme.colors.border
  },
  readyButtonText: {
    color: Theme.colors.white,
    fontSize: 15,
    fontWeight: '900'
  },
  playButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: Theme.colors.primaryGlow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10
  },
  playButtonText: {
    color: Theme.colors.white,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.5
  },
  leaveButton: {
    alignItems: 'center',
    paddingVertical: 10
  },
  leaveButtonText: {
    color: Theme.colors.textDim,
    fontSize: 13,
    fontWeight: '700'
  }
});
