import { Component, type ErrorInfo, type ReactNode } from 'react';
import { PageState } from './PageState';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo): void {
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <PageState
          title="No se pudo cargar la reportería"
          message="Ocurrió un problema inesperado. Recarga la página para intentarlo nuevamente."
        />
      );
    }

    return this.props.children;
  }
}
