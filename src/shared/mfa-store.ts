import { create } from 'zustand';
import { createEventBus } from './event-bus';
import type {
  SharedUser,
  SharedSettings,
  SharedState,
} from './event-bus-types';

interface MfaStore extends SharedState {
  selectUser: (user: SharedUser | null) => void;
  updateSetting: <K extends keyof SharedSettings>(
    key: K,
    value: SharedSettings[K],
  ) => void;
  sendNotification: (msg: string) => void;
  clearNotification: () => void;
}

const bus = createEventBus();

export const useMfaStore = create<MfaStore>((set, get) => ({
  selectedUser: null,
  settings: {
    darkMode: false,
    notifications: true,
    language: 'English',
    theme: 'Blue',
    username: 'John Doe',
  },
  notification: null,

  selectUser: (user) => {
    set({ selectedUser: user });
    bus.setState({ selectedUser: user });
    if (user) {
      bus.emit('user:selected', user);
      get().sendNotification(`Selected: ${user.name}`);
    } else {
      bus.emit('user:deselected', undefined);
      get().clearNotification();
    }
  },

  updateSetting: (key, value) => {
    set((state) => ({
      settings: { ...state.settings, [key]: value },
    }));
    bus.setState({ settings: get().settings });
    bus.emit('settings:changed', { key, value });
  },

  sendNotification: (msg) => {
    set({ notification: msg });
    bus.setState({ notification: msg });
    bus.emit('notification:send', msg);
  },

  clearNotification: () => {
    set({ notification: null });
    bus.setState({ notification: null });
    bus.emit('notification:clear', undefined);
  },
}));

bus.on('user:selected', (user) => {
  const current = useMfaStore.getState().selectedUser;
  if (!current || current.id !== user.id) {
    useMfaStore.setState({ selectedUser: user, notification: `Selected: ${user.name}` });
    bus.setState({ selectedUser: user, notification: `Selected: ${user.name}` });
  }
});

bus.on('user:deselected', () => {
  if (useMfaStore.getState().selectedUser !== null) {
    useMfaStore.setState({ selectedUser: null, notification: null });
    bus.setState({ selectedUser: null, notification: null });
  }
});

bus.on('settings:changed', ({ key, value }) => {
  const current = useMfaStore.getState().settings[key];
  if (current !== value) {
    const settings = { ...useMfaStore.getState().settings, [key]: value as SharedSettings[typeof key] };
    useMfaStore.setState({ settings });
    bus.setState({ settings });
  }
});

bus.on('notification:send', (msg) => {
  if (useMfaStore.getState().notification !== msg) {
    useMfaStore.setState({ notification: msg });
    bus.setState({ notification: msg });
  }
});

bus.on('notification:clear', () => {
  if (useMfaStore.getState().notification !== null) {
    useMfaStore.setState({ notification: null });
    bus.setState({ notification: null });
  }
});
