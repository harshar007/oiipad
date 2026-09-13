# this name oii pad

## Clean Architecture — AI Coding Agent Instructions

---

# 1. ROLE

You are the primary software-engineering agent responsible for developing **Gynoo**.

Gynoo is a wireless mobile game-controller platform.

A smartphone connects to a PC over a local Wi-Fi network and acts as a game controller.

The initial target games are:

* Beach Buggy Racing 1
* Beach Buggy Racing 2

The primary differentiating feature is:

> **Gyroscope-based phone tilt steering.**

The system must support:

* Single player
* Multiplayer
* 1–4 mobile controllers
* Local Wi-Fi
* BBR-specific controller profiles
* Standard gamepad mode
* Future custom controller layouts

The entire system must follow **Clean Architecture + SOLID principles**.

---

# 2. TECHNOLOGY STACK

## Mobile

Use:

```text
React Native
Expo
TypeScript
```

Do NOT use Flutter.

Do NOT mix Flutter/Dart with Expo.

Recommended packages:

```text
expo-sensors
@react-navigation/native
@react-navigation/native-stack
@react-native-async-storage/async-storage
```

Use additional packages only when justified.

---

# 3. PC SERVER

Use:

```text
Node.js
TypeScript
WebSocket
```

The PC server is responsible for:

* PC discovery
* WebSocket connections
* Room management
* Player management
* Input processing
* Game profiles
* Virtual gamepad abstraction
* Windows virtual gamepad implementation
* Connection health
* Input reset on disconnect

---

# 4. ARCHITECTURAL RULE

The most important architectural rule is:

> **Business logic must never depend on frameworks, UI, WebSocket implementations, Expo APIs, or Windows virtual-gamepad libraries.**

Dependencies must point inward.

```text
Frameworks / Drivers
        ↓
Interface Adapters
        ↓
Application / Use Cases
        ↓
Domain
```

The Domain layer must be independent.

---

# 5. CLEAN ARCHITECTURE LAYERS

Use four layers:

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

Dependency direction:

```text
Framework
   ↓
Adapters
   ↓
Application
   ↓
Domain
```

Never reverse this.

---

# 6. MONOREPO

Use:

```text
oiipad/
│
├── apps/
│   │
│   ├── mobile/
│   │
│   └── pc-server/
│
├── packages/
│   │
│   ├── domain/
│   │
│   ├── protocol/
│   │
│   └── shared-types/
│
├── docs/
│
├── tests/
│
├── package.json
├── tsconfig.json
└── README.md
```

Use a workspace-based monorepo.

Possible tooling:

```text
npm workspaces
```

or

```text
pnpm workspaces
```

Choose one and keep it consistent.

---

# 7. DOMAIN PACKAGE

The shared domain package must contain only pure TypeScript.

It must NOT import:

```text
React
React Native
Expo
WebSocket
Node
Express
Windows APIs
ViGEm
filesystem libraries
AsyncStorage
```

Domain should contain concepts such as:

```text
Player
Room
ControllerState
ControllerProfile
GameProfile
SteeringState
ConnectionState
```

---

# 8. DOMAIN ENTITIES

Create entities/value objects for:

## Player

```text
Player
- id
- name
- slot
- connectionState
- readyState
```

## Room

```text
Room
- id
- code
- players
- maxPlayers
- gameProfile
- state
```

## ControllerState

```text
ControllerState
- steering
- accelerate
- brake
- handbrake
- boost
- powerUp
- pause
- buttons
```

Steering must be normalized:

```text
-1.0 = full left
 0.0 = center
+1.0 = full right
```

---

# 9. DOMAIN VALUE OBJECTS

Create validated value objects where appropriate.

Examples:

```text
PlayerId
RoomCode
SteeringValue
GameProfileId
ControllerProfileId
```

A SteeringValue must never allow:

```text
-2
+5
NaN
Infinity
```

It must be constrained to:

```text
[-1, +1]
```

---

# 10. DOMAIN RULES

Domain rules include:

```text
A room cannot exceed its player limit.

A player must have a unique slot.

Disconnected players cannot send active gameplay input.

Steering must remain normalized.

A controller state must be reset when a player disconnects.

A game profile must define valid mappings.

A room cannot start unless its required conditions are satisfied.
```

Keep these rules independent of UI and networking.

---

# 11. MOBILE CLEAN ARCHITECTURE

Use this structure:

```text
apps/mobile/
│
├── src/
│
│   ├── domain/
│   │   ├── entities/
│   │   ├── valueObjects/
│   │   ├── repositories/
│   │   └── services/
│   │
│   ├── application/
│   │   ├── useCases/
│   │   ├── commands/
│   │   └── services/
│   │
│   ├── infrastructure/
│   │   ├── sensors/
│   │   ├── networking/
│   │   ├── storage/
│   │   └── discovery/
│   │
│   ├── presentation/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── state/
│   │   └── navigation/
│   │
│   └── config/
│
├── app/
└── package.json
```

---

# 12. MOBILE DOMAIN

The domain must know nothing about Expo.

Bad:

```text
domain/
  import { Gyroscope } from "expo-sensors";
```

Never do this.

Correct:

```text
domain/
  GyroReading
  SteeringValue
  ControllerState
```

Expo belongs in infrastructure.

---

# 13. SENSOR ABSTRACTION

Create an interface:

```text
MotionSensor
```

Conceptually:

```text
interface MotionSensor {
    start(): Promise<void>
    stop(): Promise<void>
    subscribe(listener): Unsubscribe
}
```

The domain/application layer depends on this abstraction.

Expo implements it.

Architecture:

```text
Application
    ↓
MotionSensor interface
    ↑
ExpoMotionSensor
```

---

# 14. GYRO PROCESSING

Create a dedicated application/domain service:

```text
SteeringProcessor
```

Pipeline:

```text
Gyro Reading
      ↓
Calibration
      ↓
Orientation
      ↓
Dead Zone
      ↓
Smoothing
      ↓
Sensitivity
      ↓
Response Curve
      ↓
Clamp
      ↓
SteeringValue
```

Do not place this logic inside React components.

---

# 15. GYRO CALIBRATION

Create a use case:

```text
CalibrateSteering
```

Responsibilities:

1. Read current orientation.
2. Store neutral position.
3. Reset steering to zero.
4. Notify the presentation layer.

The calibration algorithm must be independently testable.

---

# 16. GYRO CONFIGURATION

Create:

```text
SteeringConfiguration
```

Containing:

```text
sensitivity
deadZone
smoothing
invert
autoCenter
responseCurve
```

Do not hard-code these values inside UI components.

---

# 17. MOBILE USE CASES

Create use cases such as:

```text
DiscoverPcs
ConnectToPc
DisconnectFromPc
JoinRoom
LeaveRoom
SetPlayerReady
SelectGameProfile
StartController
StopController
CalibrateSteering
UpdateSteeringSettings
SendControllerInput
SaveControllerSettings
LoadControllerSettings
```

Each use case must perform one clear responsibility.

---

# 18. MOBILE REPOSITORY INTERFACES

Define interfaces in the inner layers.

Examples:

```text
PcDiscoveryRepository
RoomRepository
ControllerRepository
SettingsRepository
MotionSensor
```

Infrastructure implements them.

Example:

```text
RoomRepository
      ↑
      │
WebSocketRoomRepository
```

The application must never directly instantiate WebSocket classes.

---

# 19. MOBILE NETWORKING

WebSocket implementation belongs here:

```text
infrastructure/networking/
```

Create:

```text
GynooWebSocketClient
```

It implements application/domain-facing interfaces.

Do not put business logic inside the WebSocket client.

Its job is:

```text
connect
disconnect
send
receive
reconnect
heartbeat
```

---

# 20. MOBILE PRESENTATION

React components must remain thin.

They should:

```text
Display state
Receive user interaction
Call use cases
Render results
```

They should NOT:

```text
calculate gyro steering
build WebSocket packets
manage room business rules
perform controller mapping
```

---

# 21. MOBILE STATE MANAGEMENT

Use a predictable state-management approach.

Choose one:

```text
Zustand
```

or another lightweight solution.

Do not introduce Redux unless project complexity actually requires it.

Keep presentation state separate from domain state.

---

# 22. BBR CONTROLLER SCREEN

Create:

```text
BbrControllerScreen
```

The screen should consume a controller state from the application layer.

UI:

```text
┌────────────────────────────────────┐
│ GYNOO          BBR 2         P1    │
│                                    │
│          TILT TO STEER             │
│                                    │
│                                    │
│                                    │
│ [ BRAKE ]              [POWER-UP] │
│                                    │
│                        [ BOOST ]   │
│                                    │
│              [ PAUSE ]             │
└────────────────────────────────────┘
```

Do not put gyro calculations in this component.

---

# 23. GYRO DIAGNOSTIC SCREEN

Create:

```text
GyroTestScreen
```

Show:

```text
Raw X
Raw Y
Raw Z

Calibration center

Filtered value

Steering output

Dead zone

Sensitivity
```

Add:

```text
[ RECALIBRATE ]
```

This screen is for development and debugging.

---

# 24. MOBILE PC DISCOVERY

Create:

```text
PcDiscoveryRepository
```

Infrastructure implementation can use:

```text
UDP
```

or:

```text
mDNS
```

The rest of the application must not care which discovery protocol is used.

---

# 25. PC SERVER CLEAN ARCHITECTURE

Structure:

```text
apps/pc-server/
│
├── src/
│
│   ├── domain/
│   │   ├── entities/
│   │   ├── valueObjects/
│   │   ├── repositories/
│   │   └── services/
│   │
│   ├── application/
│   │   ├── useCases/
│   │   ├── commands/
│   │   └── services/
│   │
│   ├── infrastructure/
│   │   ├── websocket/
│   │   ├── discovery/
│   │   ├── virtualGamepad/
│   │   ├── persistence/
│   │   └── system/
│   │
│   ├── presentation/
│   │   ├── controllers/
│   │   ├── handlers/
│   │   └── dto/
│   │
│   └── config/
│
└── tests/
```

---

# 26. PC SERVER USE CASES

Implement:

```text
CreateRoom
JoinRoom
LeaveRoom
AssignPlayerSlot
SetPlayerReady
StartGame
StopGame
ReceiveControllerInput
ResetController
DisconnectPlayer
LoadGameProfile
```

---

# 27. WEBSOCKET HANDLERS

WebSocket handlers belong in:

```text
presentation/
```

or an adapter layer.

They should translate:

```text
WebSocket message
```

into:

```text
Application command
```

Example:

```text
WebSocket
   ↓
ControllerInputMessage
   ↓
ReceiveControllerInput
   ↓
Domain ControllerState
   ↓
Gamepad Adapter
```

The WebSocket handler must not directly control the virtual gamepad.

---

# 28. INPUT PIPELINE

PC input pipeline:

```text
Mobile
  ↓
WebSocket
  ↓
Message Validation
  ↓
DTO → Domain Model
  ↓
ReceiveControllerInput
  ↓
Game Profile Mapping
  ↓
Virtual Gamepad Port
  ↓
Windows Adapter
  ↓
Game
```

---

# 29. VIRTUAL GAMEPAD ABSTRACTION

Define an interface:

```text
VirtualGamepad
```

Example operations:

```text
connect()
disconnect()
setAxis()
setTrigger()
setButton()
reset()
```

The domain/application layer depends on this abstraction.

Windows-specific implementation belongs in infrastructure.

---

# 30. WINDOWS IMPLEMENTATION

The Windows implementation must be isolated.

Potential technology:

```text
ViGEm-compatible virtual controller
```

or another reliable Windows virtual-gamepad solution.

Do not spread Windows-specific imports across the project.

Only the infrastructure adapter should know about the Windows implementation.

---

# 31. GAME PROFILE SYSTEM

Create:

```text
GameProfile
```

Example:

```text
Beach Buggy Racing 1
Beach Buggy Racing 2
Standard Gamepad
```

Profiles define mappings.

Example conceptual profile:

```json
{
  "id": "bbr1",
  "name": "Beach Buggy Racing 1",
  "mapping": {
    "steering": "LEFT_STICK_X",
    "accelerate": "RIGHT_TRIGGER",
    "brake": "LEFT_TRIGGER",
    "powerUp": "A",
    "pause": "START"
  }
}
```

BBR 2 must have a separate profile.

Do not assume the games have identical mappings.

---

# 32. GAME PROFILE REPOSITORY

Create:

```text
GameProfileRepository
```

Possible implementations:

```text
JsonGameProfileRepository
```

Profiles should be data-driven.

Do not hard-code every game's mapping into application services.

---

# 33. MULTIPLAYER

Maximum MVP:

```text
4 players
```

Each player gets:

```text
Player 1 → Controller 1
Player 2 → Controller 2
Player 3 → Controller 3
Player 4 → Controller 4
```

The room is responsible for player membership.

The gamepad service is responsible for virtual-controller lifecycle.

Do not merge those responsibilities.

---

# 34. DISCONNECT SAFETY

This is mandatory.

When a mobile client disconnects:

```text
Receive disconnect
        ↓
Mark player disconnected
        ↓
Reset ControllerState
        ↓
Reset virtual gamepad
        ↓
Release active buttons
        ↓
Release player slot
```

Never leave:

```text
accelerate = true
brake = true
boost = true
```

after a lost connection.

---

# 35. HEARTBEAT

Implement:

```text
PING
PONG
```

The server must identify stale clients.

Heartbeat logic belongs in infrastructure/application services, not the domain entity.

---

# 36. PROTOCOL PACKAGE

Create:

```text
packages/protocol/
```

It contains:

```text
message types
message schemas
protocol version
DTO definitions
validation schemas
```

Example:

```text
ControllerInputMessage
JoinRoomMessage
JoinRoomResponse
RoomStateMessage
PlayerStateMessage
HeartbeatMessage
ErrorMessage
```

Use schema validation.

Possible library:

```text
Zod
```

---

# 37. PROTOCOL VERSIONING

Every message should support:

```text
version
```

Example:

```json
{
  "version": 1,
  "type": "controller_input"
}
```

Future protocol changes must not silently break older clients.

---

# 38. ERROR HANDLING

Use typed application errors.

Examples:

```text
RoomNotFoundError
RoomFullError
PlayerNotFoundError
InvalidControllerInputError
UnsupportedGameProfileError
ConnectionError
CalibrationError
```

Do not throw generic strings.

---

# 39. LOGGING

Use structured logging.

Important events:

```text
Server started
PC discovered
Phone connected
Player joined
Player ready
Game started
Controller input received
Player disconnected
Controller reset
Room closed
```

Do not log excessive raw gyro values in production.

---

# 40. TESTING STRATEGY

Use multiple test levels.

## Domain tests

Test:

```text
SteeringValue
Room
Player
ControllerState
GameProfile
```

## Application tests

Test:

```text
JoinRoom
LeaveRoom
CalibrateSteering
ReceiveControllerInput
DisconnectPlayer
```

## Infrastructure tests

Test:

```text
WebSocket
Discovery
VirtualGamepad adapter
Storage
```

## Integration tests

Test:

```text
Mobile
 ↓
WebSocket
 ↓
PC Server
 ↓
Virtual Controller
```

---

# 41. GYRO TESTS

Test:

```text
Neutral phone
→ steering ≈ 0

Tilt left
→ negative steering

Tilt right
→ positive steering

Dead zone
→ small movements ignored

Maximum tilt
→ steering clamped to ±1

Invert enabled
→ direction reversed

Disconnect
→ steering returns to zero
```

---

# 42. MULTIPLAYER TEST

Minimum test:

```text
Phone 1
Phone 2
```

Then:

```text
Phone 1
Phone 2
Phone 3
Phone 4
```

Verify:

```text
P1 does not control P2
P2 does not control P1
```

Each controller must remain isolated.

---

# 43. PERFORMANCE TARGETS

Target:

```text
30–60 controller updates/sec
```

Aim for low LAN latency.

Avoid unnecessary allocations inside high-frequency gyro/input loops.

Do not update React UI at the full sensor rate unless required.

Separate:

```text
input processing frequency
```

from:

```text
UI rendering frequency
```

---

# 44. BATTERY OPTIMIZATION

When controller screen is not active:

```text
Stop motion sensors
```

Do not keep sensors running in the background unnecessarily.

Reduce UI work.

Keep WebSocket alive only when necessary.

---

# 45. OFFLINE-FIRST PRINCIPLE

Basic gameplay must not require internet.

Required:

```text
Phone
+
Local Wi-Fi
+
PC
```

Internet should not be required.

---

# 46. NO CLOUD GAMEPLAY

Do not send real-time controller input through:

```text
Firebase
Cloud server
REST API
Third-party relay
```

Use:

```text
Phone → Local Wi-Fi → PC
```

Cloud functionality can be considered later for:

* Profile backup
* Analytics
* Account systems
* Remote discovery

But never make cloud connectivity a requirement for local gameplay.

---

# 47. SETTINGS STORAGE

Mobile settings can use:

```text
AsyncStorage
```

Store:

```text
gyro sensitivity
dead zone
smoothing
invert setting
selected game
player name
custom layouts
```

Storage must be hidden behind:

```text
SettingsRepository
```

Do not call AsyncStorage directly from domain/application logic.

---

# 48. UI NAVIGATION

Recommended navigation:

```text
Home
 │
 ├── Find PC
 │      ↓
 │   PC Selection
 │      ↓
 │   Room Lobby
 │
 ├── Join Room
 │      ↓
 │   Room Lobby
 │
 └── Settings

Room Lobby
     ↓
Controller Selection
     ↓
Calibration
     ↓
Controller
```

---

# 49. BBR USER FLOW

The ideal user flow:

```text
Open Gynoo
      ↓
Find PC
      ↓
Connect
      ↓
Join Room
      ↓
Select:
Beach Buggy Racing 1
or
Beach Buggy Racing 2
      ↓
Select Player
      ↓
Calibrate Gyro
      ↓
READY
      ↓
Play
```

Make this flow extremely fast.

---

# 50. CONTROLLER UX

The player should not need to read instructions during gameplay.

Use visual hints:

```text
TILT LEFT / RIGHT TO STEER
```

Show this only when necessary.

After the player understands the controller, hide unnecessary instructions.

---

# 51. DEBUG MODE

Create a developer/debug mode.

It should expose:

```text
Connection status
WebSocket latency
Packets/sec
Gyro values
Filtered steering
Player ID
Room ID
Game profile
Virtual controller status
```

Example:

```text
DEBUG

Connection: CONNECTED
Latency: 18ms
Packets: 60/s

Player: 2
Room: 4821

Steering: +0.63

Virtual Gamepad:
CONNECTED
```

---

# 52. CONFIGURATION

Do not hard-code:

```text
Port
Max players
Sensitivity
Dead zone
Network timeout
Game mappings
```

Use configuration with sensible defaults.

---

# 53. SECURITY

Even on LAN:

Validate all incoming messages.

Check:

```text
message type
protocol version
player ID
room ID
numeric ranges
boolean values
payload size
```

Never trust the client.

A client must not be able to claim:

```text
playerId = 999
```

and control another player's gamepad.

The server determines authoritative player identity.

---

# 54. SERVER AUTHORITATIVE MODEL

The PC server owns:

```text
Room
Player IDs
Player slots
Game profile
Connection state
Virtual controller assignment
```

The phone owns:

```text
Local sensor readings
Local UI
Local button state
```

The phone does NOT own authoritative player assignment.

---

# 55. FUTURE FEATURES

Design the architecture so these can be added later:

```text
Custom controller builder
More PC games
Android
iOS
Gamepad vibration
Controller skins
Profiles
Game presets
QR room joining
Bluetooth support
USB support
Cloud profile sync
Controller macros
Accessibility layouts
```

Do not implement all of these in the MVP.

---

# 56. MVP PRIORITY

Development order:

## Phase 1

```text
PC server
+
One phone
+
WebSocket
+
Gyro steering
+
One virtual controller
```

## Phase 2

```text
BBR 1 profile
BBR 2 profile
```

## Phase 3

```text
2-player multiplayer
```

## Phase 4

```text
4-player multiplayer
```

## Phase 5

```text
PC discovery
```

## Phase 6

```text
Settings
Calibration
Debug tools
```

## Phase 7

```text
Standard gamepad
```

## Phase 8

```text
Custom controller
```

---

# 57. DEVELOPMENT RULE

After every major feature:

```text
1. Build
2. Run tests
3. Run lint
4. Test affected feature
5. Fix errors
6. Commit clean code
```

Never stack many untested features together.

---

# 58. AGENT BEHAVIOR

Before implementing a feature:

1. Understand which Clean Architecture layer owns it.
2. Check whether an interface already exists.
3. Reuse existing domain models.
4. Avoid duplicating functionality.
5. Add tests.
6. Keep framework dependencies at the outer boundary.

If a requirement conflicts with Clean Architecture, restructure the implementation rather than violating the architecture.

---

# 59. STRICT DEPENDENCY RULES

Allowed:

```text
Presentation
    ↓
Application
    ↓
Domain
```

Allowed:

```text
Infrastructure
    ↓
Application interfaces
```

Not allowed:

```text
Domain → Expo
Domain → React
Domain → Node
Domain → WebSocket
Domain → Windows API
Domain → AsyncStorage
```

Not allowed:

```text
React Component → WebSocket directly
React Component → Virtual Gamepad directly
React Component → AsyncStorage directly
```

Use application interfaces/use cases instead.

---

# 60. FINAL ARCHITECTURE

The completed system should conceptually look like:

```text
                         GYNOO
                           │
              ┌────────────┴────────────┐
              │                         │
           MOBILE                    PC SERVER
              │                         │
      ┌───────┴────────┐        ┌───────┴────────┐
      │ Presentation   │        │ Presentation   │
      │ React Native   │        │ WS Handlers    │
      └───────┬────────┘        └───────┬────────┘
              │                         │
      ┌───────▼────────┐        ┌───────▼────────┐
      │ Application    │        │ Application    │
      │ Use Cases      │        │ Use Cases      │
      └───────┬────────┘        └───────┬────────┘
              │                         │
      ┌───────▼────────┐        ┌───────▼────────┐
      │ Domain        │◄────────►│ Domain        │
      │ Controller    │ Protocol │ Room/Player   │
      │ Steering      │          │ Input         │
      └───────┬────────┘        └───────┬────────┘
              │                         │
      ┌───────▼────────┐        ┌───────▼────────┐
      │ Infrastructure │        │ Infrastructure │
      │ Expo Sensors   │        │ WebSocket      │
      │ Storage        │        │ Discovery      │
      │ Networking     │        │ Virtual Gamepad│
      └────────────────┘        └───────┬────────┘
                                        │
                                        ▼
                                 Windows Gamepad
                                        │
                                        ▼
                              Beach Buggy Racing
                                   1 / 2
```

---

# 61. SUCCESS CRITERIA

The MVP is successful when:

```text
✓ PC starts Gynoo server

✓ Phone discovers PC

✓ Phone connects to PC

✓ Player joins a room

✓ Phone calibrates gyro

✓ Tilting phone left steers left

✓ Tilting phone right steers right

✓ Phone buttons control game actions

✓ PC receives controller input

✓ Windows recognizes the virtual controller

✓ Beach Buggy Racing receives the input

✓ Two phones can play independently

✓ Four phones can eventually play independently

✓ Disconnecting a phone safely resets its controller

✓ No internet is required

✓ Domain logic remains framework-independent

✓ Automated tests pass
```

---

# 62. MOST IMPORTANT PRODUCT PRINCIPLE

Gynoo should not feel like:

> "A website with joystick buttons."

It should feel like:

> **A real wireless game controller that happens to be your phone.**

The gyro steering must be the signature experience.

For Beach Buggy Racing:

```text
Pick up phone
       ↓
Tilt phone
       ↓
Car turns
       ↓
Press accelerator
       ↓
Press power-up
       ↓
Play
```

The experience must be fast, responsive, reliable, and simple.

---

# 63. FIRST IMPLEMENTATION TASK

Do NOT build the entire product at once.

Start with:

```text
STEP 1
Create monorepo

STEP 2
Create shared protocol package

STEP 3
Create PC server Clean Architecture

STEP 4
Create mobile Clean Architecture

STEP 5
Implement WebSocket connection

STEP 6
Implement gyro abstraction

STEP 7
Implement gyro calibration

STEP 8
Implement steering processor

STEP 9
Send steering from phone → PC

STEP 10
Implement virtual gamepad adapter

STEP 11
Test one phone with BBR

STEP 12
Implement BBR 1 profile

STEP 13
Implement BBR 2 profile

STEP 14
Implement multiplayer

STEP 15
Add discovery and polished UX
```

Do not proceed to the next major phase until the previous phase is working and tested.
