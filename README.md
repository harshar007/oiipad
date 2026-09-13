# GYNOO (Oii Pad) — Wireless Mobile Game-Controller Platform

> Turn your smartphone into a high-performance, low-latency wireless game controller with **gyroscope-based tilt steering** for PC racing games like **Beach Buggy Racing 1 & 2** and standard PC titles.

---

## Architecture Overview

Gynoo strictly implements **Clean Architecture + SOLID principles**:

```text
┌──────────────────────────────────────────────┐
│                FRAMEWORKS                    │
│ React Native / Expo / Node / WebSocket / OS │
├──────────────────────────────────────────────┤
│             INTERFACE ADAPTERS               │
│ Controllers / Presenters / Gateways / DTOs  │
├──────────────────────────────────────────────┤
│                APPLICATION                   │
│                 Use Cases                    │
├──────────────────────────────────────────────┤
│                  DOMAIN                      │
│ Entities / Value Objects / Rules / Ports     │
└──────────────────────────────────────────────┘
```

- **Domain Layer (`packages/domain`)**: Pure TypeScript entities (`Player`, `Room`, `ControllerState`, `GameProfile`), value objects (`SteeringValue`, `RoomCode`, `PlayerId`), and ports (`VirtualGamepadPort`, `MotionSensorPort`). Zero dependencies on React, Expo, WebSocket, or OS drivers.
- **Protocol Layer (`packages/protocol`)**: Versioned (v1) schema validation with Zod (`ControllerInputMessage`, `JoinRoomMessage`, `RoomStateMessage`).
- **PC Server (`apps/pc-server`)**: WebSocket server, UDP PC Discovery, multiplayer room management (1–4 players), and virtual gamepad driver integration (ViGEm / Fallback Virtual Emulation).
- **Mobile Client (`apps/mobile`)**: React Native / Expo app featuring real-time motion sensor tilt steering, multi-touch race controls (Brake, Accelerate, Boost, Power-Up, Handbrake), calibration tools, and diagnostics.

---

## Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Automated Tests
```bash
npx jest
```

### 3. Start PC Server
```bash
npm run server:start
```
The server will print its local IP addresses and default room code (`BBR1`).

### 4. Start Mobile Controller (Expo)
```bash
npm run mobile:start
```
Scan the QR code with Expo Go on your Android / iOS smartphone on the same Wi-Fi network.

---

## Steering & Calibration Pipeline

The phone tilt steering pipeline:

```text
Gyro Reading
     ↓
Calibration (Neutral Offset)
     ↓
Dead Zone Filter
     ↓
Exponential Smoothing (Alpha)
     ↓
Sensitivity Multiplier
     ↓
Response Curve (Linear / Exp / Sigmoid)
     ↓
Clamp [-1.0, +1.0]
     ↓
SteeringValue
```

---

## Disconnect Safety & Multiplayer Isolation

- **Isolation**: Each player (P1–P4) is mapped to an isolated virtual gamepad controller slot. Player 1 inputs cannot bleed into Player 2.
- **Disconnect Safety**: If a player's phone disconnects, their controller state and virtual gamepad axes/buttons are immediately reset to zero and released.
