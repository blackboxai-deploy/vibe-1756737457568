"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Form validation schema
const urlSchema = z.object({
  url: z.string().url('Please enter a valid URL (e.g., https://example.com)'),
});

type UrlFormData = z.infer<typeof urlSchema>;

interface ShortenResponse {
  success: boolean;
  shortUrl?: string;
  shortCode?: string;
  originalUrl?: string;
  error?: string;
  details?: string;
}

export default function Home() {
  const [shortUrl, setShortUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UrlFormData>({
    resolver: zodResolver(urlSchema),
  });

  const onSubmit = async (data: UrlFormData) => {
    setIsLoading(true);
    setShortUrl('');

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: data.url }),
      });

      const result: ShortenResponse = await response.json();

      if (result.success && result.shortUrl) {
        setShortUrl(result.shortUrl);
        toast.success('URL shortened successfully!');
        reset();
      } else {
        toast.error(result.details || result.error || 'Failed to shorten URL');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
      console.error('Error shortening URL:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shortUrl) return;

    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success('Short URL copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy URL');
      console.error('Error copying to clipboard:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            URL Shortener
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Transform long URLs into short, shareable links in seconds
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Shorten Your URL</CardTitle>
            <CardDescription>
              Enter a long URL below to get a shortened version
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url" className="text-sm font-medium">
                  URL to shorten
                </Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/very/long/url/path"
                  {...register('url')}
                  className={`h-12 ${errors.url ? 'border-red-500' : ''}`}
                  aria-describedby={errors.url ? 'url-error' : undefined}
                />
                {errors.url && (
                  <p id="url-error" className="text-sm text-red-600" role="alert">
                    {errors.url.message}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Shortening...' : 'Shorten URL'}
              </Button>
            </form>

            {shortUrl && (
              <>
                <Separator />
                <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      Success! Your shortened URL:
                    </h3>
                    <div className="bg-white p-3 rounded border border-green-300 break-all">
                      <code className="text-blue-600 font-mono text-sm">
                        {shortUrl}
                      </code>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={copyToClipboard}
                    variant="outline"
                    className="w-full h-10 border-green-300 hover:bg-green-100"
                  >
                    Copy to Clipboard
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            URLs are stored temporarily in memory for demonstration purposes.
          </p>
          <p className="mt-1">
            In production, use a persistent database for long-term storage.
          </p>
        </div>
      </div>
    </div>
  );
}