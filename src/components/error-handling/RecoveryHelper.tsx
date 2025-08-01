import React, { useState } from 'react';
import { RefreshCw, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

interface RecoveryHelperProps {
  title: string;
  description: string;
  onRecover: () => Promise<boolean>;
  onCancel?: () => void;
  recoveryButtonText?: string;
  cancelButtonText?: string;
}

/**
 * RecoveryHelper
 * @description Function
 */
export const RecoveryHelper = ({
  title,
  description,
  onRecover,
  onCancel,
  recoveryButtonText = 'Recover',
  cancelButtonText = 'Cancel',
}: RecoveryHelperProps): JSX.Element => {
  const [isRecovering, setIsRecovering] = useState(false);
  const [isRecovered, setIsRecovered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRecover = async () => {
    setIsRecovering(true);
    setError(null);

    try {
      const success = await onRecover();
      if (success) {
        setIsRecovered(true);
      } else {
        setError('Recovery attempt failed. Please try again.');
      }
    } catch (err) {
      setError(`Recovery error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsRecovering(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          {isRecovered ? (
            <RotateCw className="h-5 w-5 mr-2 text-green-500" />
          ) : (
            <RefreshCw className="h-5 w-5 mr-2 text-amber-500" />
          )}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {isRecovered ? 'Recovery completed successfully.' : description}
        </p>

        {error && (
          <div className="mt-4 p-2 bg-red-50 text-red-700 text-sm border border-red-200 rounded">
            {error}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {!isRecovered && onCancel && (
          <Button variant="outline" size="sm" onClick={onCancel} disabled={isRecovering}>
            {cancelButtonText}
          </Button>
        )}

        {!isRecovered ? (
          <Button
            variant="default"
            size="sm"
            onClick={handleRecover}
            disabled={isRecovering}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {isRecovering ? (
              <>
                <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                Recovering...
              </>
            ) : (
              recoveryButtonText
            )}
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={onCancel}
            className="bg-green-600 hover:bg-green-700"
          >
            Continue
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
