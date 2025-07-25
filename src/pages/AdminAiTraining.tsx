import { DashboardLayout } from '@/components/DashboardLayout';
import { Spinner } from '@/components/Spinner';
import { IntentForm } from '@/components/thandi/IntentForm';
import { IntentList } from '@/components/thandi/IntentList';
import { MessageTraining } from '@/components/thandi/MessageTraining';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIntentManagement, type IntentWithStats } from '@/hooks/useIntentManagement';
import { useTrainingData } from '@/hooks/useTrainingData';
import { useState } from 'react';

const AdminAiTraining = (): void => {
  const [activeTab, setActiveTab] = useState('messages');
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  // Intent management hook
  const {
    intents,
    loading: intentsLoading,
    selectedIntent,
    setSelectedIntent,
    fetchIntents,
    createIntent,
    updateIntent,
    deleteIntent,
  } = useIntentManagement();

  // Training data hook
  const {
    messages,
    trainedMessages,
    loading: messagesLoading,
    lowConfidenceOnly,
    setLowConfidenceOnly,
    page,
    setPage,
    hasMore,
    addTrainingData,
    updateTrainingData,
    deleteTrainingData,
  } = useTrainingData();

  // Handle intent edit
  const handleEditIntent = (intent: IntentWithStats): void => {
    setSelectedIntent(intent);
    setIsEditFormOpen(true);
  };

  // Handle intent update
  const handleUpdateIntent = async (data: {
    intent_name: string;
    description?: string;
    response_template?: string;
    sample_queries?: string[];
  }) => {
    if (selectedIntent) {
      await updateIntent(selectedIntent.id, data);
      setSelectedIntent(null);
      setIsEditFormOpen(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-7xl py-8 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Thandi AI Training</h1>
          <p className="text-gray-500">
            Manage intents and train the AI assistant with correct responses
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="messages">Message Training</TabsTrigger>
            <TabsTrigger value="intents">Intent Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Messages Training Tab */}
          <TabsContent value="messages" className="space-y-6">
            {messagesLoading || intentsLoading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : (
              <MessageTraining
                messages={messages}
                trainedMessages={trainedMessages}
                loading={messagesLoading}
                intents={intents}
                lowConfidenceOnly={lowConfidenceOnly}
                setLowConfidenceOnly={setLowConfidenceOnly}
                page={page}
                setPage={setPage}
                hasMore={hasMore}
                onTrain={addTrainingData}
                onUpdateTraining={updateTrainingData}
                onDeleteTraining={deleteTrainingData}
              />
            )}
          </TabsContent>

          {/* Intent Management Tab */}
          <TabsContent value="intents" className="space-y-6">
            {isEditFormOpen && selectedIntent ? (
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Edit Intent</h3>
                <IntentForm
                  intent={selectedIntent}
                  onSubmit={handleUpdateIntent}
                  onCancel={() => {
                    setSelectedIntent(null);
                    setIsEditFormOpen(false);
                  }}
                />
              </Card>
            ) : (
              <IntentList
                intents={intents}
                loading={intentsLoading}
                onEdit={handleEditIntent}
                onDelete={deleteIntent}
                onCreate={createIntent}
              />
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">AI Performance Analytics</h3>
              <p className="text-gray-500">
                This feature is coming soon. It will display metrics about Thandi's performance,
                including confidence scores, user feedback, and intent detection accuracy.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminAiTraining;
