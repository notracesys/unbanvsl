
import { FirestorePermissionError } from './errors';

type Listener = (error: FirestorePermissionError) => void;

/**
 * Emissor de eventos simples para centralizar erros do Firebase.
 */
class ErrorEmitter {
  private listeners: Record<string, Listener[]> = {};

  on(event: 'permission-error', listener: Listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
    return () => this.off(event, listener);
  }

  private off(event: string, listener: Listener) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(l => l !== listener);
  }

  emit(event: 'permission-error', error: FirestorePermissionError) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(l => l(error));
  }
}

export const errorEmitter = new ErrorEmitter();
