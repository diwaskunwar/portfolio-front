import { useSyncExternalStore } from 'react';

/**
 * Tracks whether the boot sequence has handed control to the interface.
 *
 * Section entrance animations subscribe to this so they do not play while the
 * terminal overlay is still covering them. Without it the hero staggers in
 * behind the overlay and is already finished by the time it lifts.
 */
let booted = false;
const listeners = new Set<() => void>();

const getSnapshot = () => booted;
const getServerSnapshot = () => true;

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};

export const markBooted = () => {
    if (booted) return;
    booted = true;
    listeners.forEach((listener) => listener());
};

export const useIsBooted = () =>
    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
