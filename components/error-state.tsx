import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
}

export default function ErrorState({
  title = 'Oops! Something went wrong',
  message = 'We encountered an error while loading the data. Please try again.',
  onRetry = () => window.location.reload(),
  retryText = 'Try Again',
}: ErrorStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] gap-4">
      <AlertCircle className="size-12 text-destructive" />
      <div className="text-xl font-semibold">{title}</div>
      <div className="text-muted-foreground max-w-md text-center">
        {message}
      </div>
      {onRetry && (
        <Button size="lg" onClick={onRetry}>
          <RefreshCw className="size-4" />
          {retryText}
        </Button>
      )}
    </div>
  );
}
