import type {
  EventMap,
  EventHandler,
  IEventBus,
  SharedState,
} from './event-bus-types';

type ListenerEntry = {
  event: keyof EventMap;
  handler: EventHandler<unknown>;
};

const INITIAL_STATE: SharedState = {
  selectedUser: null,
  settings: {
    darkMode: false,
    notifications: true,
    language: 'English',
    theme: 'Blue',
    username: 'John Doe',
  },
  notification: null,
};

export class EventBus implements IEventBus {
  private listeners: ListenerEntry[] = [];
  private state: SharedState = { ...INITIAL_STATE };

  on<K extends keyof EventMap>(
    event: K,
    handler: EventHandler<EventMap[K]>,
  ): () => void {
    const entry: ListenerEntry = {
      event,
      handler: handler as EventHandler<unknown>,
    };
    this.listeners.push(entry);
    return () => this.off(event, handler);
  }

  off<K extends keyof EventMap>(
    event: K,
    handler: EventHandler<EventMap[K]>,
  ): void {
    this.listeners = this.listeners.filter(
      (l) =>
        !(
          l.event === event && l.handler === (handler as EventHandler<unknown>)
        ),
    );
  }

  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
    for (const l of this.listeners) {
      if (l.event === event) {
        l.handler(payload);
      }
    }
  }

  getState(): SharedState {
    return { ...this.state, settings: { ...this.state.settings } };
  }

  setState(partial: Partial<SharedState>): void {
    this.state = { ...this.state, ...partial };
    this.emit('state:changed', partial);
  }
}

const WINDOW_KEY = '__mf_bus' as const;

declare global {
  interface Window {
    [WINDOW_KEY]?: EventBus;
  }
}

export function createEventBus(): EventBus {
  if (window[WINDOW_KEY]) {
    return window[WINDOW_KEY];
  }
  const bus = new EventBus();
  window[WINDOW_KEY] = bus;
  return bus;
}

export function getEventBus(): EventBus | undefined {
  return window[WINDOW_KEY];
}
