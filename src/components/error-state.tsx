import { Button, Result } from 'antd';
import { ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';

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
    <div className="flex-1 flex items-center justify-center min-h-[400px]">
      <Result
        icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
        title={
          <div className="text-xl font-semibold text-gray-800 mb-2">
            {title}
          </div>
        }
        subTitle={
          <div className="text-gray-600 mb-6 max-w-md text-center">
            {message}
          </div>
        }
        extra={
          onRetry ? (
            <Button type="primary" onClick={onRetry} size="large">
              <ReloadOutlined />
              {retryText}
            </Button>
          ) : null
        }
      />
    </div>
  );
}
