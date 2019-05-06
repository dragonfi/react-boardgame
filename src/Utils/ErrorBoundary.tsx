import React, {Component, ReactNode} from 'react';

export {ErrorBoundary};

interface ErrorBoundaryProps {
  errorMessage: string | ReactNode;
}

interface ErrorBoundaryState {
  isErrorHappened: boolean;
}
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {isErrorHappened: false};
  }

  static getDerivedStateFromError(e: any) {
    console.log("error:", e);
    return {isErrorHappened:  true};
  }

  componentDidCatch(e: any, info: any) {
    console.log("error:", e.type , e);
    console.log("info:", info.type , info);
  }

  render() {
    if (this.state.isErrorHappened) {
      return <p>{this.props.errorMessage}</p>;
    }
    return this.props.children;
  }
}
