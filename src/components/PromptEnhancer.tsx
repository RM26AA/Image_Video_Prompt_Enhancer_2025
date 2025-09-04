import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { enhancePrompt, downloadAsTextFile } from '@/services/promptEnhancer';
import { toast } from 'sonner';
import { Loader2, Download, Image, Video, Sparkles } from 'lucide-react';

export function PromptEnhancer() {
  const [selectedType, setSelectedType] = useState<'image' | 'video' | null>(null);
  const [inputPrompt, setInputPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEnhance = async () => {
    if (!selectedType || !inputPrompt.trim()) {
      toast.error('Please select a type and enter a prompt');
      return;
    }

    setIsLoading(true);
    try {
      const enhanced = await enhancePrompt({
        prompt: inputPrompt,
        type: selectedType
      });
      setEnhancedPrompt(enhanced);
      toast.success('Prompt enhanced successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to enhance prompt');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!enhancedPrompt) {
      toast.error('No enhanced prompt to download');
      return;
    }
    
    const filename = `enhanced-${selectedType}-prompt-${Date.now()}.txt`;
    downloadAsTextFile(enhancedPrompt, filename);
    toast.success('Prompt downloaded successfully!');
  };

  const handleReset = () => {
    setSelectedType(null);
    setInputPrompt('');
    setEnhancedPrompt('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Prompt Enhancer
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform your simple prompts into detailed, creative descriptions for stunning AI-generated images and videos
        </p>
      </div>

      {/* Type Selection */}
      <Card className="p-8 shadow-elegant">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-center">Choose Content Type</h2>
          <div className="flex gap-4 justify-center">
            <Button
              variant={selectedType === 'image' ? 'default' : 'outline'}
              size="lg"
              onClick={() => setSelectedType('image')}
              className="flex items-center gap-3 px-8 py-6 text-lg transition-smooth hover:shadow-glow"
            >
              <Image className="w-6 h-6" />
              Images
            </Button>
            <Button
              variant={selectedType === 'video' ? 'default' : 'outline'}
              size="lg"
              onClick={() => setSelectedType('video')}
              className="flex items-center gap-3 px-8 py-6 text-lg transition-smooth hover:shadow-glow"
            >
              <Video className="w-6 h-6" />
              Videos
            </Button>
          </div>
          
          {selectedType && (
            <div className="flex justify-center">
              <Badge variant="secondary" className="px-3 py-1">
                {selectedType === 'image' ? 'Image Generation' : 'Video Generation'} Mode
              </Badge>
            </div>
          )}
        </div>
      </Card>

      {/* Prompt Input */}
      {selectedType && (
        <Card className="p-8 shadow-elegant">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Enter Your {selectedType === 'image' ? 'Image' : 'Video'} Prompt</h3>
            <Textarea
              placeholder={selectedType === 'image' 
                ? "e.g., A cat sitting in a garden..."
                : "e.g., A time-lapse of a flower blooming..."
              }
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className="min-h-[120px] text-base transition-smooth focus:shadow-glow"
              disabled={isLoading}
            />
            
            <div className="flex gap-3">
              <Button
                onClick={handleEnhance}
                disabled={!inputPrompt.trim() || isLoading}
                className="flex items-center gap-2 bg-gradient-primary hover:opacity-90 transition-smooth shadow-soft"
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                {isLoading ? 'Enhancing...' : 'Enhance Prompt'}
              </Button>
              
              {(inputPrompt || enhancedPrompt) && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={isLoading}
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Enhanced Prompt Display */}
      {enhancedPrompt && (
        <Card className="p-8 shadow-elegant">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Enhanced Prompt</h3>
              <Button
                variant="secondary"
                onClick={handleDownload}
                className="flex items-center gap-2 transition-smooth hover:shadow-glow"
              >
                <Download className="w-4 h-4" />
                Save as TXT
              </Button>
            </div>
            
            <div className="bg-gradient-subtle p-6 rounded-lg border">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {enhancedPrompt}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}