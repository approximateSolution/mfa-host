import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import { useMfaStore } from '../shared/mfa-store';

interface RemoteModule {
  mount: (el: HTMLElement) => void | Promise<void>;
  unmount: (el: HTMLElement) => void;
}

interface RemoteWrapperProps {
  loader: () => Promise<RemoteModule>;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RemoteErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: 'var(--text-accent-red)' }}>
          <h3>⚠️ Remote microfrontend crashed</h3>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export function RemoteWrapper({ loader }: RemoteWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const unmountFnRef = useRef<((el: HTMLElement) => void) | null>(null);
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>(
    'loading',
  );
  const [errorMsg, setErrorMsg] = useState('');
  const notification = useMfaStore((s) => s.notification);

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;

    loader()
      .then((module) => {
        if (!cancelled && container) {
          unmountFnRef.current = module.unmount;
          return module.mount(container);
        }
      })
      .then(() => {
        if (!cancelled) setStatus('ready');
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('Remote load failed:', err);
          setErrorMsg(String(err));
          setStatus('error');
        }
      });

    return () => {
      cancelled = true;
      if (unmountFnRef.current && container) {
        unmountFnRef.current(container);
      }
    };
  }, [loader]);

  if (status === 'error') {
    return (
      <div
        style={{
          padding: '2rem',
          color: 'var(--text-accent-red)',
        }}
      >
        <h3>⚠️ Failed to load microfrontend</h3>
        <p>{errorMsg}</p>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
          }}
        >
          Make sure the remote application is running on its expected port.
        </p>
      </div>
    );
  }

  return (
    <RemoteErrorBoundary>
      <div>
        {status === 'loading' && (
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '1.1rem',
            }}
          >
            Loading microfrontend...
          </div>
        )}
        {notification && (
          <div
            style={{
              padding: '0.75rem 2rem',
              background: 'var(--bg-info)',
              color: 'var(--text-link)',
              borderBottom: '1px solid var(--border-info)',
              fontSize: '0.9rem',
            }}
          >
            🔔 {notification}
          </div>
        )}
        <div ref={containerRef} />
      </div>
    </RemoteErrorBoundary>
  );
}
