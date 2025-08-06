import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

interface ColorCardProps {
  name: string;
  variable: string;
  className?: string;
  textClassName?: string;
}

const ColorCard = ({ name, variable, className, textClassName }: ColorCardProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(variable);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          'h-16 rounded-md mb-2 flex items-center justify-center cursor-pointer',
          className,
        )}
        onClick={copyToClipboard}
        title={`Click to copy: ${variable}`}
      >
        {copied && <span className="bg-background/80 px-2 py-1 rounded text-xs">Copied!</span>}
      </div>
      <Typography variant="small" className={cn('font-medium', textClassName)}>
        {name}
      </Typography>
      <Typography variant="caption" color="muted" className="truncate">
        {variable}
      </Typography>
    </div>
  );
};

/**
 * ColorSystem
 * @description Function
 */
export const ColorSystem = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Typography variant="h2" className="mb-2">
            Color System Documentation
          </Typography>
          <Typography variant="body">
            This page documents the color system used throughout the application.
          </Typography>
        </div>
        <Button onClick={toggleTheme} variant="outline">
          Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </Button>
      </div>

      <Tabs defaultValue="core">
        <TabsList className="mb-6">
          <TabsTrigger value="core">Core Colors</TabsTrigger>
          <TabsTrigger value="semantic">Semantic Tokens</TabsTrigger>
          <TabsTrigger value="chart">Chart Colors</TabsTrigger>
          <TabsTrigger value="usage">Usage Guidelines</TabsTrigger>
        </TabsList>

        <TabsContent value="core">
          <Card>
            <CardHeader>
              <CardTitle>Core Brand Colors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <ColorCard
                  name="Teal (Primary)"
                  variable="var(--color-primary)"
                  className="bg-primary"
                  textClassName="text-primary"
                />
                <ColorCard
                  name="Coral (Secondary)"
                  variable="var(--color-secondary)"
                  className="bg-secondary"
                  textClassName="text-secondary"
                />
                <ColorCard name="Dark" variable="var(--cap-dark)" className="bg-cap-dark" />
                <ColorCard
                  name="Light"
                  variable="var(--cap-light)"
                  className="bg-cap-light border"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Status Colors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <ColorCard name="Success" variable="var(--color-success)" className="bg-success" />
                <ColorCard name="Warning" variable="var(--color-warning)" className="bg-warning" />
                <ColorCard name="Error" variable="var(--color-error)" className="bg-error" />
                <ColorCard name="Info" variable="var(--color-info)" className="bg-info" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="semantic">
          <Card>
            <CardHeader>
              <CardTitle>Text Colors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                <ColorCard
                  name="Text Primary"
                  variable="var(--text-primary)"
                  className="bg-text-primary"
                />
                <ColorCard
                  name="Text Secondary"
                  variable="var(--text-secondary)"
                  className="bg-text-secondary"
                />
                <ColorCard
                  name="Text Muted"
                  variable="var(--text-muted)"
                  className="bg-text-muted"
                />
                <ColorCard
                  name="On Primary"
                  variable="var(--text-on-primary)"
                  className="bg-text-on-primary border"
                />
                <ColorCard
                  name="On Secondary"
                  variable="var(--text-on-secondary)"
                  className="bg-text-on-secondary border"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Background Colors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <ColorCard
                  name="BG Subtle"
                  variable="var(--bg-subtle)"
                  className="bg-bg-subtle border"
                />
                <ColorCard
                  name="BG Muted"
                  variable="var(--bg-muted)"
                  className="bg-bg-muted border"
                />
                <ColorCard
                  name="BG Emphasis"
                  variable="var(--bg-emphasis)"
                  className="bg-bg-emphasis"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Border Colors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <ColorCard name="Border Default" variable="var(--border)" className="bg-border" />
                <ColorCard
                  name="Border Subtle"
                  variable="var(--border-subtle)"
                  className="bg-border-subtle"
                />
                <ColorCard
                  name="Border Focus"
                  variable="var(--border-focus)"
                  className="bg-border-focus"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>Chart Colors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <ColorCard
                  name="Chart Approved"
                  variable="var(--chart-approved)"
                  className="bg-[color:var(--chart-approved)]"
                />
                <ColorCard
                  name="Chart Rejected"
                  variable="var(--chart-rejected)"
                  className="bg-[color:var(--chart-rejected)]"
                />
                <ColorCard
                  name="Chart Pending"
                  variable="var(--chart-pending)"
                  className="bg-[color:var(--chart-pending)]"
                />
                <ColorCard
                  name="Chart Resubmission"
                  variable="var(--chart-request-resubmission)"
                  className="bg-[color:var(--chart-request-resubmission)]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Usage Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Typography variant="h4" className="mb-2">
                  Color Variables
                </Typography>
                <Typography variant="body">
                  Always use CSS variables instead of hardcoded hex values. This ensures consistency
                  and supports theming.
                </Typography>
                <div className="mt-2 p-4 bg-muted rounded-md">
                  <code className="text-sm">
                    {/* Use semantic color variable */}
                    .button {'{'} color: var(--color-primary); {'}'}
                    {/* Instead of hardcoded color */}
                    .button {'{'} color: #2A9D8F; {'}'}
                  </code>
                </div>
              </div>

              <div>
                <Typography variant="h4" className="mb-2">
                  Tailwind Classes
                </Typography>
                <Typography variant="body">
                  Use Tailwind utility classes that map to our color system variables.
                </Typography>
                <div className="mt-2 p-4 bg-muted rounded-md">
                  <code className="text-sm">
                    {/* Use Tailwind class */}
                    &lt;button className="bg-primary
                    text-primary-foreground"&gt;Submit&lt;/button&gt;
                  </code>
                </div>
              </div>

              <div>
                <Typography variant="h4" className="mb-2">
                  State Colors
                </Typography>
                <Typography variant="body">
                  Use the predefined state classes for consistent status indicators.
                </Typography>
                <div className="mt-2 space-y-2">
                  <div className="state-active p-2 rounded-md">Active state</div>
                  <div className="state-success p-2 rounded-md">Success state</div>
                  <div className="state-warning p-2 rounded-md">Warning state</div>
                  <div className="state-error p-2 rounded-md">Error state</div>
                  <div className="state-pending p-2 rounded-md">Pending state</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
