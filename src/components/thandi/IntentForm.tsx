import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { IntentWithStats } from '@/hooks/useIntentManagement';

interface IntentFormProps {
  intent?: IntentWithStats;
  onSubmit: (data: {
    intent_name: string;
    description?: string;
    response_template?: string;
    sample_queries?: string[];
  }) => void;
  onCancel: () => void;
}

export const IntentForm = ({ intent, onSubmit, onCancel }: IntentFormProps) => {
  const [name, setName] = useState(intent?.intent_name || '');
  const [description, setDescription] = useState(intent?.description || '');
  const [template, setTemplate] = useState(intent?.response_template || '');
  const [queries, setQueries] = useState<string[]>(intent?.sample_queries || []);
  const [newQuery, setNewQuery] = useState('');
  const [errors, setErrors] = useState({
    name: false,
  });

  useEffect(() => {
    if (intent) {
      setName(intent.intent_name);
      setDescription(intent.description || '');
      setTemplate(intent.response_template || '');
      setQueries(intent.sample_queries || []);
    }
  }, [intent]);

  const handleAddQuery = () => {
    if (newQuery.trim() && !queries.includes(newQuery.trim())) {
      setQueries([...queries, newQuery.trim()]);
      setNewQuery('');
    }
  };

  const handleRemoveQuery = (index: number) => {
    setQueries(queries.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!name.trim()) {
      setErrors({ ...errors, name: true });
      return;
    }

    onSubmit({
      intent_name: name.trim(),
      description: description.trim() || undefined,
      response_template: template.trim() || undefined,
      sample_queries: queries.length > 0 ? queries : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className={errors.name ? 'text-destructive' : ''}>
          Intent Name*
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors({ ...errors, name: false });
          }}
          placeholder="e.g., document_status, general_question"
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && <p className="text-xs text-destructive">Intent name is required</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what this intent covers"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="template">Response Template</Label>
        <Textarea
          id="template"
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          placeholder="Template for responses to this intent"
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          Provide guidance on how Thandi should respond to this intent
        </p>
      </div>

      <div className="space-y-2">
        <Label>Sample Queries</Label>
        <div className="flex space-x-2">
          <Input
            value={newQuery}
            onChange={(e) => setNewQuery(e.target.value)}
            placeholder="Add an example query"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddQuery();
              }
            }}
          />
          <Button type="button" onClick={handleAddQuery}>
            Add
          </Button>
        </div>

        {queries.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {queries.map((query, index) => (
              <div
                key={index}
                className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm flex items-center"
              >
                <span className="truncate max-w-[200px]">{query}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 ml-1 p-0"
                  onClick={() => handleRemoveQuery(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{intent ? 'Update Intent' : 'Create Intent'}</Button>
      </div>
    </form>
  );
};
