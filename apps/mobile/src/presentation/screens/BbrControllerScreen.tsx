import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { useControllerStore } from '../state/useControllerStore';
import { getTheme } from '../theme/colors';
import { Bbr1Template } from '../components/templates/Bbr1Template';
import { Bbr2Template } from '../components/templates/Bbr2Template';
import { UniversalGamepadTemplate } from '../components/templates/UniversalGamepadTemplate';

export const BbrControllerScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    playerSlot,
    gameProfile,
    selectGameProfile,
    liveSteering,
    calibrate,
    setButtonState,
    startController,
    stopController,
    themeMode,
    toggleTheme,
    latencyMs,
    claimScreen
  } = useControllerStore();

  const theme = getTheme(themeMode);
  const [activeTemplate, setActiveTemplate] = useState<'bbr1' | 'bbr2' | 'standard'>(
    (gameProfile as any) || 'bbr1'
  );
  const [showHint, setShowHint] = useState(true);
  const [calibToast, setCalibToast] = useState(true);

  useEffect(() => {
    startController();
    const timer = setTimeout(() => setShowHint(false), 3500);
    const calibTimer = setTimeout(() => setCalibToast(false), 2200);
    return () => {
      clearTimeout(timer);
      clearTimeout(calibTimer);
      stopController();
    };
  }, []);

  const handleManualCalibrate = () => {
    calibrate();
    setCalibToast(true);
    setTimeout(() => setCalibToast(false), 1800);
  };

  useEffect(() => {
    if (gameProfile === 'bbr2' || gameProfile === 'standard' || gameProfile === 'bbr1') {
      setActiveTemplate(gameProfile as any);
    }
  }, [gameProfile]);

  const handleExit = async () => {
    await stopController();
    navigation.goBack();
  };

  const handleSelectTemplate = (id: 'bbr1' | 'bbr2' | 'standard') => {
    setActiveTemplate(id);
    selectGameProfile(id);
  };

  // Latency Color
  const latencyColor = latencyMs < 15 ? '#10B981' : latencyMs < 50 ? '#F59E0B' : '#EF4444';
  const latencyBg = latencyMs < 15 ? '#064E3B' : latencyMs < 50 ? '#78350F' : '#7F1D1D';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bgRoot }]}>
      <StatusBar hidden={true} />

      {/* Top Header Bar */}
      <View style={[styles.topBar, { backgroundColor: theme.colors.bgCard, borderBottomColor: theme.colors.border }]}>
        {/* Brand & Player Slot */}
        <View style={styles.headerLeft}>
          <Text style={[styles.brandTitle, { color: theme.colors.textPrimary }]}>GYNOO</Text>
          <View style={[styles.playerBadge, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.playerText}>P{playerSlot ?? 1}</Text>
          </View>
          
          {/* Live High-Visibility Latency Pill */}
          <View style={[styles.latencyPill, { backgroundColor: latencyBg, borderColor: latencyColor }]}>
            <Text style={[styles.latencyDot, { color: latencyColor }]}>●</Text>
            <Text style={[styles.latencyText, { color: '#FFFFFF' }]}>
              {latencyMs} ms
            </Text>
          </View>
        </View>

        {/* Quick Template Switcher Chips */}
        <View style={styles.templateSwitcher}>
          <TouchableOpacity
            style={[
              styles.templateChip,
              activeTemplate === 'bbr1' && { backgroundColor: theme.colors.primaryContainer, borderColor: theme.colors.primary }
            ]}
            onPress={() => handleSelectTemplate('bbr1')}
          >
            <Text style={[styles.templateChipText, { color: activeTemplate === 'bbr1' ? theme.colors.onPrimaryContainer : theme.colors.textMuted }]}>
              BBR 1
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.templateChip,
              activeTemplate === 'bbr2' && { backgroundColor: theme.colors.primaryContainer, borderColor: theme.colors.primary }
            ]}
            onPress={() => handleSelectTemplate('bbr2')}
          >
            <Text style={[styles.templateChipText, { color: activeTemplate === 'bbr2' ? theme.colors.onPrimaryContainer : theme.colors.textMuted }]}>
              BBR 2
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.templateChip,
              activeTemplate === 'standard' && { backgroundColor: theme.colors.primaryContainer, borderColor: theme.colors.primary }
            ]}
            onPress={() => handleSelectTemplate('standard')}
          >
            <Text style={[styles.templateChipText, { color: activeTemplate === 'standard' ? theme.colors.onPrimaryContainer : theme.colors.textMuted }]}>
              GAMEPAD
            </Text>
          </TouchableOpacity>
        </View>

        {/* Right Tools (Claim Screen, Theme Toggle, Calibrate, Exit) */}
        <View style={styles.headerRight}>
          {/* Direct Claim Screen Button for Beach Buggy Racing */}
          <TouchableOpacity
            style={[styles.claimScreenBtn, { backgroundColor: '#10B981' }]}
            onPress={claimScreen}
            activeOpacity={0.7}
          >
            <Text style={styles.claimScreenText}>JOIN SCREEN 🎮</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolIconBtn, { backgroundColor: theme.colors.bgInput }]}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <Text style={styles.toolIconText}>{themeMode === 'dark' ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolIconBtn, { backgroundColor: theme.colors.bgInput }]}
            onPress={handleManualCalibrate}
            activeOpacity={0.7}
          >
            <Text style={styles.toolIconText}>🎯</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolIconBtn, { backgroundColor: theme.colors.errorBg }]}
            onPress={handleExit}
            activeOpacity={0.7}
          >
            <Text style={[styles.toolIconText, { color: theme.colors.error, fontWeight: '900' }]}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {calibToast ? (
        <View style={[styles.hintBanner, { backgroundColor: '#10B981' }]}>
          <Text style={styles.hintText}>🎯 AUTO-CALIBRATED • 0° NEUTRAL CENTER LOCKED</Text>
        </View>
      ) : showHint ? (
        <View style={[styles.hintBanner, { backgroundColor: theme.colors.primaryDark }]}>
          <Text style={styles.hintText}>🏎️ TILT PHONE TO STEER • ULTRA LOW LATENCY {latencyMs}ms</Text>
        </View>
      ) : null}

      {/* Active Gamepad Template Content */}
      <View style={styles.contentArea}>
        {activeTemplate === 'bbr1' && (
          <Bbr1Template
            theme={theme}
            liveSteering={liveSteering}
            calibrate={calibrate}
            setButtonState={setButtonState}
          />
        )}

        {activeTemplate === 'bbr2' && (
          <Bbr2Template
            theme={theme}
            liveSteering={liveSteering}
            calibrate={calibrate}
            setButtonState={setButtonState}
          />
        )}

        {activeTemplate === 'standard' && (
          <UniversalGamepadTemplate
            theme={theme}
            liveSteering={liveSteering}
            calibrate={calibrate}
            setButtonState={setButtonState}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5
  },
  playerBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  playerText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  latencyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4
  },
  latencyDot: {
    fontSize: 8
  },
  latencyText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  templateSwitcher: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center'
  },
  templateChip: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  templateChipText: {
    fontSize: 10,
    fontWeight: '800'
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  claimScreenBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  claimScreenText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900'
  },
  toolIconBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  toolIconText: {
    fontSize: 13
  },
  hintBanner: {
    paddingVertical: 3,
    alignItems: 'center'
  },
  hintText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  contentArea: {
    flex: 1
  }
});
