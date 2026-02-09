# Backend - Discord-like Application

NestJS backend with Modular Monolith architecture.

## 📁 Architecture

### Modular Monolith Structure

```
src/
├── gateway/              # Entry points
│   ├── storefront-gateway/    # REST API
│   └── realtime-gateway/      # WebSocket
│
├── modules/              # Domain modules (isolated)
│   ├── user/
│   ├── auth/
│   ├── guild/
│   ├── channel/
│   ├── message/
│   ├── presence/
│   ├── permission/
│   ├── notification/
│   └── media/
│
├── shared/               # Shared utilities
│   ├── events/          # Event definitions
│   ├── guards/          # Auth guards
│   ├── dto/             # Shared DTOs
│   └── utils/
│
└── infrastructure/       # Technical concerns
    ├── database/        # TypeORM config
    ├── redis/           # Redis client
    └── auth/            # JWT strategy
```

### Module Communication

#### Direct Calls (Synchronous)
For core business logic:
```typescript
// GuildService directly calls UserService
constructor(private userService: UserService) {}
```

#### Events (Asynchronous)
For side effects and decoupling:
```typescript
// MessageModule emits event
this.eventEmitter.emit(EVENTS.MESSAGE_SENT, event);

// NotificationModule listens
@OnEvent(EVENTS.MESSAGE_SENT)
handleMessageSent(event: MessageSentEvent) {
  // Create notification
}
```

## 🔄 Event System

All events are defined in `src/shared/events/events.ts`:

| Event | Emitter | Listeners |
|-------|---------|-----------|
| `message.sent` | MessageModule | NotificationModule, WebSocketGateway |
| `user.online` | PresenceModule | WebSocketGateway |
| `user.typing` | WebSocketGateway | PresenceModule |

### Why In-Memory Events?

- **No Kafka overhead**: Simpler development and deployment
- **Decoupling**: Modules don't know about each other
- **Future-ready**: Easy to replace with message queue later
- **Testable**: Easy to test event handlers in isolation

## 🌐 WebSocket Gateway

The WebSocket Gateway is **NOT** a business module. It only:

1. **Authenticates** socket connections
2. **Broadcasts** events to clients
3. **Handles** typing and presence

Business logic stays in domain modules.

### WebSocket Flow

```
Client sends message
    ↓
REST API → MessageModule.create()
    ↓
MessageModule.save() → Database
    ↓
MessageModule.emit('message.sent')
    ↓
WebSocketGateway.handleMessageSent()
    ↓
Gateway.broadcast() → All clients in channel
```

## 💾 Redis Usage

### 1. Presence Data
```typescript
// Online users
redis.sadd('users:online', userId);
redis.get(`presence:${userId}`); // 'online' | 'offline'

// Typing indicators
redis.set(`typing:${channelId}:${userId}`, '1', 'EX', 5);
```

### 2. Session Cache (Future)
```typescript
redis.set(`session:${userId}`, sessionData, 'EX', 3600);
```

### 3. Pub/Sub (Future - for horizontal scaling)
```typescript
// When you have multiple server instances
redis.publish('message:new', messageData);
```

## 📊 Database Schema

### Core Entities

- **users**: User accounts
- **guilds**: Servers/communities
- **guild_members**: User-guild relationships
- **channels**: Text channels within guilds
- **messages**: Chat messages
- **roles**: Permission roles
- **notifications**: User notifications
- **media**: File upload metadata

### Relationships

```
Guild (1) ──── (N) Channel
  │
  └── (N) GuildMember ──── (1) User

Channel (1) ──── (N) Message ──── (1) User
```

## 🔐 Authentication

### JWT Flow

1. User registers/logs in → `AuthModule`
2. Server generates JWT with user payload
3. Client stores token
4. Client sends token in `Authorization: Bearer <token>`
5. `JwtAuthGuard` validates token
6. Request proceeds with `req.user` populated

### WebSocket Authentication

```typescript
// Client connects with token
socket.auth = { token: 'jwt-token' };

// Server validates in handleConnection
const payload = jwtService.verify(token);
client.data.userId = payload.sub;
```

## 📡 API Endpoints

### Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login

### Guilds
- `GET /guilds` - List all guilds
- `GET /guilds/my` - My guilds
- `POST /guilds` - Create guild

### Channels
- `GET /channels/guild/:guildId` - List channels
- `POST /channels` - Create channel

### Messages
- `GET /messages/channel/:channelId` - Get messages
- `POST /messages` - Send message

### Media
- `POST /media/upload` - Upload file

## 🚀 Running the Backend

### Development
```bash
npm run start:dev
```

### Production Build
```bash
npm run build
npm run start:prod
```

### Database Migration
```bash
# TypeORM will auto-sync in development
# For production, use migrations:
npm run typeorm migration:generate -- -n MigrationName
npm run typeorm migration:run
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 📝 Environment Variables

See `.env.example` for all required variables:

- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- `JWT_SECRET`, `JWT_EXPIRES_IN`
- `REDIS_HOST`, `REDIS_PORT`
- `UPLOAD_DIR`, `MAX_FILE_SIZE`

## 🔮 Future Enhancements

- [ ] Add database migrations
- [ ] Implement caching layer
- [ ] Add rate limiting
- [ ] Implement voice channels
- [ ] Add message reactions
- [ ] Implement thread support
