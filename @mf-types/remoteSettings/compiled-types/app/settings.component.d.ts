import { OnInit, OnDestroy } from '@angular/core';
interface SharedUser {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar: string;
}
interface Setting {
    id: string;
    label: string;
    type: 'toggle' | 'select' | 'text';
    value: boolean | string;
    options?: string[];
}
export declare class SettingsComponent implements OnInit, OnDestroy {
    savedMessage: string;
    selectedUser: SharedUser | null;
    private cleanupFns;
    private savedMessageTimer;
    settings: Setting[];
    ngOnInit(): void;
    ngOnDestroy(): void;
    toggleSetting(setting: Setting): void;
    updateSetting(setting: Setting, value: string): void;
    showSaved(setting: Setting): void;
}
export {};
