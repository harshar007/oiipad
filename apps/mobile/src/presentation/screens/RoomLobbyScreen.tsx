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
import { getTheme } from '../theme/colors';

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
    startController,
    themeMode,
    toggleTheme
  } = useControllerStore();

  const theme = getTheme(themeMode);

  const handleStartGameplay = async () => {
    await startController();
    navigation.navigate('BbrController');
  };

  const handleLeave = () => {
    leaveRoom();
    navigation.navigate('Home');
  };

  const profiles = [
    { id: 'bbr1', label: 'Beach Buggy Racing 1', icon: '🏎️', desc: 'Single item, boost & drift HUD' },
    { id: 'bbr2', label: 'Beach Buggy Racing 2', icon: '🚀', desc: 'Dual powerups & driver special' },
    { id: 'standard', label: 'Universal Gamepad', icon: '🎮', desc: '8-way D-Pad & ABXY diamond cluster' }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bgRoot }]}>
      <StatusBar
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.bgRoot}
      />

      {/* Top Navbar Row */}
      <View style={[styles.navBar, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity style={styles.backLink} onPress={handleLeave}>
          <Text style={[styles.backLinkText, { color: theme.colors.primary }]}>← Home</Text>
        </TouchableOpacity>

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

      <ScrollView contentContainerStyle={styles.content}>
        {/* Lobby Header Card */}
        <View style={[styles.headerCard, { backgroundColor: theme.colors.bgCard, borderColor: theme.colors.border }]}>
          <Text style={[styles.lobbyLabel, { color: theme.colors.primary }]}>MULTIPLAYER ROOM</Text>
          <Text style={[styles.roomCodeText, { color: theme.colors.textPrimary }]}>{roomCode}</Text>
          <View style={[styles.slotPill, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text style={[styles.slotBadgeText, { color: theme.colors.onPrimaryContainer }]}>
              Assigned: Player {playerSlot ?? '?'}
            </Text>
          </View>
        </View>

        {/* Game Profile Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            Select Controller Template
          </Text>
          <View style={styles.profileRow}>
            {profiles.map((p) => {
              const isSelected = gameProfile === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.profileChip,
                    {
                      backgroundColor: isSelected ? theme.colors.primaryContainer : theme.colors.bgCard,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border
                    }
                  ]}
                  onPress={() => selectGameProfile(p.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.profileIcon}>{p.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.profileText,
                        { color: isSelected ? theme.colors.onPrimaryContainer : theme.colors.textPrimary }
                      ]}
                    >
                      {p.label}
                    </Text>
                    <Text style={[styles.profileDesc, { color: theme.colors.textMuted }]}>
                      {p.desc}
                    </Text>
                  </View>
                  {isSelected ? (
                    <View style={[styles.activeCheck, { backgroundColor: theme.colors.primary }]}>
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
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            Room Roster (1–4 Players)
          </Text>
          <View style={styles.slotsGrid}>
            {[1, 2, 3, 4].map((slotNum) => {
              const playerInSlot = players.find((p) => p.slot === slotNum);
              const isMe = playerInSlot?.id === playerId;

              return (
                <View
                  key={slotNum}
                  style={[
                    styles.slotCard,
                    {
                      backgroundColor: isMe ? theme.colors.bgCardHover : theme.colors.bgCard,
                      borderColor: isMe ? theme.colors.primary : playerInSlot ? theme.colors.primaryLight : theme.colors.border,
                      opacity: playerInSlot ? 1.0 : 0.6
                    }
                  ]}
                >
                  <View style={styles.slotHeader}>
                    <Text
                      style={[
                        styles.slotNumber,
                        { color: isMe ? theme.colors.primary : theme.colors.textMuted }
                      ]}
                    >
                      P{slotNum}
                    </Text>
                    {playerInSlot?.readyState ? (
                      <View style={[styles.readyBadge, { backgroundColor: theme.colors.onlineBg }]}>
                        <Text style={[styles.readyText, { color: theme.colors.online }]}>READY</Text>
                      </View>
                    ) : playerInSlot ? (
                      <View style={[styles.waitingBadge, { backgroundColor: theme.colors.bgSubtle }]}>
                        <Text style={[styles.waitingText, { color: theme.colors.textSecondary }]}>JOINED</Text>
                      </View>
                    ) : null}
                  </View>

                  <Text
                    style={[styles.slotPlayerName, { color: theme.colors.textPrimary }]}
                    numberOfLines={1}
                  >
                    {playerInSlot ? playerInSlot.name : 'Waiting...'}
                  </Text>
                  {isMe ? (
                    <Text style={[styles.selfTag, { color: theme.colors.primary }]}>★ YOU</Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>

        {/* Action Controls */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.readyButton,
              isReady
                ? { backgroundColor: theme.colors.onlineBg, borderColor: theme.colors.online }
                : { backgroundColor: theme.colors.bgCard, borderColor: theme.colors.border }
            ]}
            onPress={() => setReady(!isReady)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.readyButtonText,
                { color: isReady ? theme.colors.online : theme.colors.textSecondary }
              ]}
            >
              {isReady ? '✓ READY TO RACE' : 'MARK AS READY'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleStartGameplay}
            activeOpacity={0.85}
          >
            <Text style={styles.playButtonText}>LAUNCH CONTROLLER 🚀</Text>
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
  backLink: {
    paddingVertical: 4
  },
  backLinkText: {
    fontSize: 14,
    fontWeight: '800'
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
  content: {
    padding: 20
  },
  headerCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    elevation: 2
  },
  lobbyLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2
  },
  roomCodeText: {
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 6,
    marginVertical: 4
  },
  slotPill: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20
  },
  slotBadgeText: {
    fontSize: 12,
    fontWeight: '800'
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 10
  },
  profileRow: {
    gap: 8
  },
  profileChip: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  profileIcon: {
    fontSize: 22
  },
  profileText: {
    fontWeight: '800',
    fontSize: 14
  },
  profileDesc: {
    fontSize: 11,
    marginTop: 2
  },
  activeCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkText: {
    color: '#FFFFFF',
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
    borderRadius: 16,
    minHeight: 85,
    justifyContent: 'space-between',
    borderWidth: 1.5
  },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  slotNumber: {
    fontSize: 14,
    fontWeight: '900'
  },
  readyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  readyText: {
    fontSize: 9,
    fontWeight: '900'
  },
  waitingBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  waitingText: {
    fontSize: 9,
    fontWeight: '800'
  },
  slotPlayerName: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6
  },
  selfTag: {
    fontSize: 11,
    fontWeight: '900'
  },
  buttonGroup: {
    marginTop: 6,
    gap: 10
  },
  readyButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5
  },
  readyButtonText: {
    fontSize: 15,
    fontWeight: '800'
  },
  playButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 4
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1
  }
});
