"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Square, Volume2, Settings } from "lucide-react"
import { useTextToSpeech } from "@/hooks/use-text-to-speech"

interface AudioControlsProps {
  analysisText: string
}

export function AudioControls({ analysisText }: AudioControlsProps) {
  const [rate, setRate] = useState(1)
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  const { isSupported, isPlaying, isPaused, voices, speak, pause, resume, stop } = useTextToSpeech({
    rate,
    voice: selectedVoice,
  })

  const handlePlay = () => {
    if (isPaused) {
      resume()
    } else {
      speak(analysisText)
    }
  }

  const handlePause = () => {
    pause()
  }

  const handleStop = () => {
    stop()
  }

  const formatAnalysisForSpeech = (text: string) => {
    // Clean up the text for better speech synthesis
    return text
      .replace(/#{1,6}\s/g, "") // Remove markdown headers
      .replace(/\*\*/g, "") // Remove bold markdown
      .replace(/\*/g, "") // Remove italic markdown
      .replace(/\n\n/g, ". ") // Replace double newlines with periods
      .replace(/\n/g, " ") // Replace single newlines with spaces
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim()
  }

  if (!isSupported) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-slate-500 text-center">Text-to-speech is not supported in your browser.</p>
        </CardContent>
      </Card>
    )
  }

  const cleanText = formatAnalysisForSpeech(analysisText)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-blue-600" />
          Audio Book
          <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)} className="ml-auto">
            <Settings className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Controls */}
        <div className="flex items-center gap-2">
          <Button onClick={handlePlay} disabled={isPlaying && !isPaused} size="sm" className="flex-shrink-0">
            <Play className="h-4 w-4 mr-1" />
            {isPaused ? "Resume" : "Play"}
          </Button>

          <Button
            onClick={handlePause}
            disabled={!isPlaying || isPaused}
            variant="outline"
            size="sm"
            className="flex-shrink-0 bg-transparent"
          >
            <Pause className="h-4 w-4 mr-1" />
            Pause
          </Button>

          <Button
            onClick={handleStop}
            disabled={!isPlaying && !isPaused}
            variant="outline"
            size="sm"
            className="flex-shrink-0 bg-transparent"
          >
            <Square className="h-4 w-4 mr-1" />
            Stop
          </Button>

          {(isPlaying || isPaused) && (
            <div className="flex items-center gap-2 ml-4 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${isPlaying && !isPaused ? "bg-green-500 animate-pulse" : "bg-slate-400"}`}
                />
                {isPlaying && !isPaused ? "Playing" : isPaused ? "Paused" : "Stopped"}
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        {showSettings && (
          <div className="space-y-4 pt-4 border-t">
            {/* Speed Control */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Speed: {rate}x</label>
              <Slider
                value={[rate]}
                onValueChange={(value) => setRate(value[0])}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Voice Selection */}
            {voices.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Voice</label>
                <Select
                  value={selectedVoice?.name || "default"}
                  onValueChange={(value) => {
                    const voice = voices.find((v) => v.name === value) || null
                    setSelectedVoice(voice)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    {voices
                      .filter((voice) => voice.lang.startsWith("en"))
                      .map((voice) => (
                        <SelectItem key={voice.name} value={voice.name}>
                          {voice.name} ({voice.lang})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-slate-500">
          Listen to the analysis while multitasking. Estimated reading time: ~
          {Math.ceil(cleanText.split(" ").length / 200)} minutes
        </p>
      </CardContent>
    </Card>
  )
}
