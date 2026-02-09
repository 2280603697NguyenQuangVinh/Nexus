# Frontend - Discord-like Application

React 18 frontend with micro-frontend architecture.

## 📁 Architecture

### Shell Application

The shell app is the main container that:
- Manages **routing**
- Handles **authentication**
- Maintains **single WebSocket connection**
- Provides **global state** (Zustand)

### Micro-Frontends

Each feature is a separate "app" within the shell:

| App | Responsibility |
|-----|----------------|
| `auth-app` | Login, Register |
| `main-layout` | Guild/Channel/Chat integration |
| `admin-app` | Admin panel (future) |

## 🔌 WebSocket Integration

### Single Connection Pattern

**CRITICAL**: Only ONE WebSocket connection for the entire application.

```typescript
// Shell manages the connection
socketClient.connect(token, userId);

// All components use the same client
socketClient.on('message:new', handleMessage);
socketClient.emit('typing:start', { channelId });
```

### Why Single Connection?

- **Efficiency**: One connection vs many
- **Consistency**: Single source of truth
- **Simplicity**: Easier to manage lifecycle

### WebSocket Events

#### Outgoing (Client → Server)
- `channel:join` - Join a channel room
- `channel:leave` - Leave a channel room
- `typing:start` - User started typing

#### Incoming (Server → Client)
- `message:new` - New message in channel
- `user:online` - User came online
- `user:offline` - User went offline
- `user:typing` - User is typing

## 🗂️ State Management

### Zustand Stores

#### Auth Store (`store/auth.store.ts`)
```typescript
{
  user: User | null,
  token: string | null,
  isAuthenticated: boolean,
  login: (user, token) => void,
  logout: () => void
}
```

#### Socket Store (`store/socket.store.ts`)
```typescript
{
  connected: boolean,
  onlineUsers: string[],
  typingUsers: Map<channelId, userId[]>,
  setConnected: (connected) => void,
  addOnlineUser: (userId) => void,
  setTyping: (channelId, userId) => void
}
```

### Why Zustand?

- **Simple**: Less boilerplate than Redux
- **Fast**: Minimal re-renders
- **TypeScript**: Great type inference
- **Hooks-based**: Natural React integration

## 🎨 Component Structure

### Main Layout

```
MainLayout
├── GuildSidebar (left)
│   └── Guild icons
├── ChannelSidebar (middle)
│   └── Channel list
└── ChatView (right)
    ├── Message list
    └── Message input
```

### Real-time Updates

```typescript
// ChatView listens for new messages
useEffect(() => {
  socketClient.on('message:new', (data) => {
    setMessages(prev => [...prev, data]);
  });
  
  return () => {
    socketClient.off('message:new', handleMessage);
  };
}, [channelId]);
```

## 🚀 Running the Frontend

### Development
```bash
cd frontend/shell
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## 🎨 Styling

### TailwindCSS

Using utility-first CSS:

```tsx
<div className="bg-gray-900 text-white p-4 rounded-lg">
  <h1 className="text-2xl font-bold">Title</h1>
</div>
```

### Color Scheme

- **Background**: `bg-gray-900`, `bg-gray-800`, `bg-gray-700`
- **Text**: `text-white`, `text-gray-300`, `text-gray-400`
- **Primary**: `bg-blue-600`, `hover:bg-blue-700`

## 📡 API Integration

### Axios Client

```typescript
// With authentication
const response = await axios.get('http://localhost:3000/guilds/my', {
  headers: { Authorization: `Bearer ${token}` }
});
```

### Future: Shared API Client

Create `shared/api-client/` for:
- Type-safe API calls
- Automatic token injection
- Error handling
- Request/response interceptors

## 🔄 Component Lifecycle

### Chat Component Flow

1. **Mount**: Fetch initial messages
2. **Connect**: Join WebSocket channel room
3. **Listen**: Subscribe to `message:new` event
4. **Send**: POST to REST API
5. **Receive**: WebSocket broadcasts to all clients
6. **Unmount**: Leave channel room, cleanup listeners

## 🧩 Future Enhancements

### Shared Components (`shared/ui/`)
```
shared/ui/
├── Button.tsx
├── Input.tsx
├── Modal.tsx
├── Avatar.tsx
└── MessageBubble.tsx
```

### Shared Types (`shared/types/`)
```typescript
// Match backend DTOs
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface Message {
  id: string;
  content: string;
  authorId: string;
  channelId: string;
  createdAt: string;
}
```

### API Client (`shared/api-client/`)
```typescript
export const api = {
  auth: {
    login: (credentials) => axios.post('/auth/login', credentials),
    register: (data) => axios.post('/auth/register', data),
  },
  guilds: {
    list: () => axios.get('/guilds/my'),
    create: (data) => axios.post('/guilds', data),
  },
  // ...
};
```

## 🔮 Roadmap

- [ ] Add shared UI component library
- [ ] Implement shared TypeScript types
- [ ] Create centralized API client
- [ ] Add admin panel micro-frontend
- [ ] Implement message reactions
- [ ] Add emoji picker
- [ ] Implement file preview
- [ ] Add user profiles
- [ ] Implement voice channels UI

## 📝 Development Guidelines

### Adding a New Component

1. Create component in appropriate app folder
2. Use TypeScript for props
3. Use Tailwind for styling
4. Extract reusable logic to hooks
5. Use Zustand for global state

### WebSocket Best Practices

1. Always cleanup listeners in `useEffect` return
2. Join/leave rooms when component mounts/unmounts
3. Handle reconnection gracefully
4. Show connection status to user

### State Management

- **Local state**: `useState` for component-specific
- **Global state**: Zustand for app-wide
- **Server state**: Fetch on mount, update via WebSocket
