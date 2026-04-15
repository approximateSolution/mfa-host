declare module 'remoteUsers/UsersApp' {
  export const mount: (el: HTMLElement) => void | Promise<void>;
  export const unmount: (el: HTMLElement) => void;
}

declare module 'remoteDashboard/DashboardApp' {
  export const mount: (el: HTMLElement) => void | Promise<void>;
  export const unmount: (el: HTMLElement) => void;
}

declare module 'remoteSettings/SettingsApp' {
  export const mount: (el: HTMLElement) => void | Promise<void>;
  export const unmount: (el: HTMLElement) => void;
}
