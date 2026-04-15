/** Cross-MFE event bus types — remotes reference this for type safety. */

export interface SharedUser {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface SharedSettings {
  darkMode: boolean;
  notifications: boolean;
  language: string;
  theme: string;
  username: string;
}

export interface SharedState {
  selectedUser: SharedUser | null;
  settings: SharedSettings;
  notification: string | null;
}

export type EventMap = {
  'user:selected': SharedUser;
  'user:deselected': undefined;
  'settings:changed': {
    key: keyof SharedSettings;
    value: SharedSettings[keyof SharedSettings];
  };
  'notification:send': string;
  'notification:clear': undefined;
  'state:changed': Partial<SharedState>;
};

export type EventHandler<T> = (payload: T) => void;

export interface IEventBus {
  on<K extends keyof EventMap>(
    event: K,
    handler: EventHandler<EventMap[K]>,
  ): () => void;
  off<K extends keyof EventMap>(
    event: K,
    handler: EventHandler<EventMap[K]>,
  ): void;
  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void;
  getState(): SharedState;
}
