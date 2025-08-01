import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { Separator } from '@/components/ui/separator';

/**
 * TypographyGuide
 * @description Function
 */
export const TypographyGuide = (): JSX.Element => {
  return (
    <div className="container mx-auto py-12 px-4">
      <Typography variant="h1" className="mb-6">
        Typography Guide
      </Typography>

      <Typography variant="body-lg" className="mb-8">
        This guide showcases the typography system used throughout the EduEasy application.
        Consistent typography helps maintain visual hierarchy and improves readability.
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Heading Variants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Typography variant="h1">Heading 1</Typography>
              <Typography variant="caption" color="muted">
                variant="h1" - Used for main page titles
              </Typography>
            </div>

            <div>
              <Typography variant="h2">Heading 2</Typography>
              <Typography variant="caption" color="muted">
                variant="h2" - Used for section headings
              </Typography>
            </div>

            <div>
              <Typography variant="h3">Heading 3</Typography>
              <Typography variant="caption" color="muted">
                variant="h3" - Used for sub-section titles
              </Typography>
            </div>

            <div>
              <Typography variant="h4">Heading 4</Typography>
              <Typography variant="caption" color="muted">
                variant="h4" - Used for card titles and small sections
              </Typography>
            </div>

            <div>
              <Typography variant="h5">Heading 5</Typography>
              <Typography variant="caption" color="muted">
                variant="h5" - Used for small headings and emphasized text
              </Typography>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Body & Text Variants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Typography variant="body-lg">
                This is body-lg text. It's used for introductory paragraphs and important messages.
              </Typography>
              <Typography variant="caption" color="muted">
                variant="body-lg" - Larger body text
              </Typography>
            </div>

            <div>
              <Typography variant="body">
                This is body text. It's the standard text size used throughout the application for
                general content.
              </Typography>
              <Typography variant="caption" color="muted">
                variant="body" - Standard text size
              </Typography>
            </div>

            <div>
              <Typography variant="body-sm">
                This is body-sm text. It's used for secondary information and form helper text.
              </Typography>
              <Typography variant="caption" color="muted">
                variant="body-sm" - Smaller body text
              </Typography>
            </div>

            <div>
              <Typography variant="small">
                This is small text, used for auxiliary information.
              </Typography>
              <Typography variant="caption" color="muted">
                variant="small" - Small text
              </Typography>
            </div>

            <div>
              <Typography variant="caption">
                This is caption text, used for labels and very small text.
              </Typography>
              <Typography variant="caption" color="muted">
                variant="caption" - Caption text (smallest)
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-12" />

      <Typography variant="h2" className="mb-6">
        Text Colors
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="space-y-4 py-6">
            <Typography variant="h4" color="default">
              Default Text
            </Typography>
            <Typography variant="h4" color="primary">
              Primary Text
            </Typography>
            <Typography variant="h4" color="secondary">
              Secondary Text
            </Typography>
            <Typography variant="h4" color="muted">
              Muted Text
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 py-6">
            <Typography variant="h4" color="success">
              Success Text
            </Typography>
            <Typography variant="h4" color="warning">
              Warning Text
            </Typography>
            <Typography variant="h4" color="error">
              Error Text
            </Typography>
            <Typography variant="h4" color="info">
              Info Text
            </Typography>
          </CardContent>
        </Card>

        <Card className="bg-cap-dark">
          <CardContent className="space-y-4 py-6">
            <Typography variant="h4" color="white">
              White Text
            </Typography>
            <Typography variant="body" color="white">
              Used on dark backgrounds for maximum readability.
            </Typography>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-12" />

      <Typography variant="h2" className="mb-6">
        Example Usage
      </Typography>

      <Card>
        <CardContent className="py-6">
          <div className="prose max-w-none">
            <Typography variant="h2">Getting Started with EduEasy</Typography>

            <Typography variant="body-lg" className="mt-4 mb-6">
              EduEasy streamlines your university application process, making it easier to apply to
              multiple institutions across South Africa with a single application.
            </Typography>

            <Typography variant="h4" className="mt-8 mb-4">
              Step 1: Create Your Profile
            </Typography>

            <Typography variant="body">
              Start by creating a comprehensive profile with your personal information, academic
              history, and contact details. This information will be used across all your
              applications.
            </Typography>

            <Typography variant="caption" color="muted" className="block mt-2 mb-6">
              Your information is securely stored and only shared with your selected institutions.
            </Typography>

            <Typography variant="h4" className="mt-8 mb-4">
              Step 2: Upload Documents
            </Typography>

            <Typography variant="body">
              Upload your ID document, academic transcripts, and any supporting documents required
              for your applications. Our system will verify these documents meet institutional
              requirements.
            </Typography>

            <div className="bg-info/10 rounded-md p-4 my-4">
              <Typography variant="small" color="info" className="font-medium">
                Pro Tip: Make sure your documents are clear scans or photos in PDF format.
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
