import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TiltedSteeringWheelHud } from '../TiltedSteeringWheelHud';

interface TemplateProps {
  theme: any;
  liveSteering: number;
  calibrate: () => void;
  setButtonState: (updates: any) => void;
}

export const UniversalGamepadTemplate: React.FC<TemplateProps> = ({
  theme,
  liveSteering,
  calibrate,
  setButtonState
}) => {
  const [steerMode, setSteerMode] = useState<'tilt' | 'dpad'>('tilt');

  const handleDpadPress = (key: string, pressed: boolean) => {
    setButtonState({
      buttons: { [key]: pressed }
    });
  };

  return (
    <View style={styles.container}>
      {/* Left Control Zone: LB/LT + D-Pad */}
      <View style={styles.leftZone}>
        <View style={styles.shoulderRow}>
          <TouchableOpacity
            style={[styles.shoulderBtn, { backgroundColor: theme.colors.bgCard, borderColor: theme.colors.borderActive }]}
            activeOpacity={0.7}
            onPressIn={() => setButtonState({ buttons: { LB: true } })}
            onPressOut={() => setButtonState({ buttons: { LB: false } })}
          >
            <Text style={[styles.shoulderText, { color: theme.colors.textPrimary }]}>LB</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shoulderBtn, { backgroundColor: theme.colors.brake, borderColor: '#FB7185' }]}
            activeOpacity={0.7}
            onPressIn={() => setButtonState({ brake: 1.0, buttons: { LT: true } })}
            onPressOut={() => setButtonState({ brake: 0.0, buttons: { LT: false } })}
          >
            <Text style={[styles.shoulderText, { color: '#FFFFFF' }]}>LT</Text>
          </TouchableOpacity>
        </View>

        {/* 8-Way D-Pad Grid */}
        <View style={styles.dpadContainer}>
          {/* UP */}
          <TouchableOpacity
            style={[styles.dpadBtn, styles.dpadUp, { backgroundColor: theme.colors.bgCard, borderColor: theme.colors.border }]}
            activeOpacity={0.6}
            onPressIn={() => handleDpadPress('DPAD_UP', true)}
            onPressOut={() => handleDpadPress('DPAD_UP', false)}
          >
            <Text style={[styles.dpadArrow, { color: theme.colors.textPrimary }]}>▲</Text>
          </TouchableOpacity>

          {/* LEFT */}
          <TouchableOpacity
            style={[styles.dpadBtn, styles.dpadLeft, { backgroundColor: theme.colors.bgCard, borderColor: theme.colors.border }]}
            activeOpacity={0.6}
            onPressIn={() => handleDpadPress('DPAD_LEFT', true)}
            onPressOut={() => handleDpadPress('DPAD_LEFT', false)}
          >
            <Text style={[styles.dpadArrow, { color: theme.colors.textPrimary }]}>◀</Text>
          </TouchableOpacity>

          {/* CENTER CAP */}
          <View style={[styles.dpadCenter, { backgroundColor: theme.colors.bgInput }]} />

          {/* RIGHT */}
          <TouchableOpacity
            style={[styles.dpadBtn, styles.dpadRight, { backgroundColor: theme.colors.bgCard, borderColor: theme.colors.border }]}
            activeOpacity={0.6}
            onPressIn={() => handleDpadPress('DPAD_RIGHT', true)}
            onPressOut={() => handleDpadPress('DPAD_RIGHT', false)}
          >
            <Text style={[styles.dpadArrow, { color: theme.colors.textPrimary }]}>▶</Text>
          </TouchableOpacity>

          {/* DOWN */}
          <TouchableOpacity
            style={[styles.dpadBtn, styles.dpadDown, { backgroundColor: theme.colors.bgCard, borderColor: theme.colors.border }]}
            activeOpacity={0.6}
            onPressIn={() => handleDpadPress('DPAD_DOWN', true)}
            onPressOut={() => handleDpadPress('DPAD_DOWN', false)}
          >
            <Text style={[styles.dpadArrow, { color: theme.colors.textPrimary }]}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Center Zone: Mode Toggle, Steering HUD, SELECT & START */}
      <View style={styles.centerZone}>
        {steerMode === 'tilt' ? (
          <TiltedSteeringWheelHud steering={liveSteering} theme={theme} subTitle="UNIVERSAL GAMEPAD" />
        ) : (
          <View style={styles.dpadModeBadge}>
            <Text style={styles.dpadModeText}>🎮 D-PAD STEER MODE</Text>
          </View>
        )}

        {/* Steer Mode Switch */}
        <TouchableOpacity
          style={[styles.modeToggleBtn, { backgroundColor: theme.colors.primaryContainer, borderColor: theme.colors.primary }]}
          onPress={() => setSteerMode(steerMode === 'tilt' ? 'dpad' : 'tilt')}
        >
          <Text style={[styles.modeToggleText, { color: theme.colors.onPrimaryContainer }]}>
            {steerMode === 'tilt' ? '📱 TILT STEERING ON' : '🎮 D-PAD MODE'}
          </Text>
        </TouchableOpacity>

        <View style={styles.centerPillRow}>
          <TouchableOpacity
            style={[styles.centerPill, { backgroundColor: theme.colors.bgCard, borderColor: theme.colors.border }]}
            activeOpacity={0.7}
            onPressIn={() => setButtonState({ buttons: { SELECT: true, BACK: true } })}
            onPressOut={() => setButtonState({ buttons: { SELECT: false, BACK: false } })}
          >
            <Text style={[styles.centerPillText, { color: theme.colors.textSecondary }]}>SELECT</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.centerPill, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primaryLight }]}
            activeOpacity={0.7}
            onPressIn={() => setButtonState({ pause: true, buttons: { START: true } })}
            onPressOut={() => setButtonState({ pause: false, buttons: { START: false } })}
          >
            <Text style={[styles.centerPillText, { color: '#FFFFFF', fontWeight: '900' }]}>START</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.centerPill, { backgroundColor: theme.colors.bgCard, borderColor: theme.colors.border }]}
            activeOpacity={0.7}
            onPress={calibrate}
          >
            <Text style={[styles.centerPillText, { color: theme.colors.textPrimary }]}>🎯</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Right Control Zone: RB/RT + Diamond ABXY Cluster */}
      <View style={styles.rightZone}>
        <View style={styles.shoulderRow}>
          <TouchableOpacity
            style={[styles.shoulderBtn, { backgroundColor: theme.colors.bgCard, borderColor: theme.colors.borderActive }]}
            activeOpacity={0.7}
            onPressIn={() => setButtonState({ handbrake: true, buttons: { RB: true } })}
            onPressOut={() => setButtonState({ handbrake: false, buttons: { RB: false } })}
          >
            <Text style={[styles.shoulderText, { color: theme.colors.textPrimary }]}>RB</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shoulderBtn, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primaryLight }]}
            activeOpacity={0.7}
            onPressIn={() => setButtonState({ accelerate: 1.0, buttons: { RT: true } })}
            onPressOut={() => setButtonState({ accelerate: 0.0, buttons: { RT: false } })}
          >
            <Text style={[styles.shoulderText, { color: '#FFFFFF' }]}>RT</Text>
          </TouchableOpacity>
        </View>

        {/* Diamond ABXY Cluster */}
        <View style={styles.abxyContainer}>
          {/* Y BUTTON (Top) */}
          <TouchableOpacity
            style={[styles.abxyBtn, styles.btnY, { backgroundColor: '#F59E0B' }]}
            activeOpacity={0.7}
            onPressIn={() => setButtonState({ boost: true, buttons: { Y: true } })}
            onPressOut={() => setButtonState({ boost: false, buttons: { Y: false } })}
          >
            <Text style={styles.abxyText}>Y</Text>
          </TouchableOpacity>

          {/* X BUTTON (Left) */}
          <TouchableOpacity
            style={[styles.abxyBtn, styles.btnX, { backgroundColor: '#0284C7' }]}
            activeOpacity={0.7}
            onPressIn={() => setButtonState({ buttons: { X: true } })}
            onPressOut={() => setButtonState({ buttons: { X: false } })}
          >
            <Text style={styles.abxyText}>X</Text>
          </TouchableOpacity>

          {/* B BUTTON (Right) */}
          <TouchableOpacity
            style={[styles.abxyBtn, styles.btnB, { backgroundColor: '#E11D48' }]}
            activeOpacity={0.7}
            onPressIn={() => setButtonState({ buttons: { B: true } })}
            onPressOut={() => setButtonState({ buttons: { B: false } })}
          >
            <Text style={styles.abxyText}>B</Text>
          </TouchableOpacity>

          {/* A BUTTON (Bottom) */}
          <TouchableOpacity
            style={[styles.abxyBtn, styles.btnA, { backgroundColor: '#16A34A' }]}
            activeOpacity={0.7}
            onPressIn={() => setButtonState({ powerUp: true, buttons: { A: true } })}
            onPressOut={() => setButtonState({ powerUp: false, buttons: { A: false } })}
          >
            <Text style={styles.abxyText}>A</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    gap: 10
  },
  leftZone: {
    flex: 2,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  shoulderRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    height: 42
  },
  shoulderBtn: {
    flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    elevation: 2
  },
  shoulderText: {
    fontSize: 12,
    fontWeight: '900'
  },
  dpadContainer: {
    width: 130,
    height: 130,
    position: 'relative',
    marginVertical: 'auto'
  },
  dpadBtn: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3
  },
  dpadUp: {
    top: 0,
    left: 43
  },
  dpadLeft: {
    top: 43,
    left: 0
  },
  dpadCenter: {
    position: 'absolute',
    top: 43,
    left: 43,
    width: 44,
    height: 44
  },
  dpadRight: {
    top: 43,
    right: 0
  },
  dpadDown: {
    bottom: 0,
    left: 43
  },
  dpadArrow: {
    fontSize: 14,
    fontWeight: '900'
  },
  centerZone: {
    flex: 1.8,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2
  },
  dpadModeBadge: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  dpadModeText: {
    color: '#F8FAFC',
    fontSize: 10,
    fontWeight: '900'
  },
  modeToggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 4
  },
  modeToggleText: {
    fontSize: 10,
    fontWeight: '900'
  },
  centerPillRow: {
    flexDirection: 'row',
    gap: 6
  },
  centerPill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerPillText: {
    fontSize: 10,
    fontWeight: '800'
  },
  rightZone: {
    flex: 2,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  abxyContainer: {
    width: 130,
    height: 130,
    position: 'relative',
    marginVertical: 'auto'
  },
  abxyBtn: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  btnY: {
    top: 0,
    left: 43
  },
  btnX: {
    top: 43,
    left: 0
  },
  btnB: {
    top: 43,
    right: 0
  },
  btnA: {
    bottom: 0,
    left: 43
  },
  abxyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900'
  }
});
