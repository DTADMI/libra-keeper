"use client";

import { useTranslations } from "next-intl";
import { Component, ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onRetry?: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundaryInner extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {return this.props.fallback;}
      return <ErrorFallback error={this.state.error} onRetry={this.handleRetry} />;
    }
    return this.props.children;
  }
}

function ErrorFallback({ error, onRetry }: { error: Error | null; onRetry: () => void }) {
  const t = useTranslations("Common");
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">{t("error")}</h3>
        <p className="text-sm text-muted-foreground">
          {error?.message ?? t("unexpectedError")}
        </p>
      </div>
      <Button variant="outline" onClick={onRetry}>
        {t("tryAgain")}
      </Button>
    </div>
  );
}

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return <ErrorBoundaryInner {...props} />;
}
