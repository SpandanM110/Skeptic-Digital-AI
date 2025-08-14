"use client"

import { useState, useEffect, useCallback } from "react"

interface UseTextToSpeechOptions {
  rate?: number
  pitch?: number
  volume?: number
  voice?: SpeechSynthesisVoice | null
}

export function useTextToSpeech(options: UseTextToSpeechOptions = {}) {
  const [isSupported, setIsSupported] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null)

  const { rate = 1, pitch = 1, volume = 1, voice = null } = options

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true)

      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices()
        setVoices(availableVoices)
      }

      loadVoices()
      speechSynthesis.addEventListener("voiceschanged", loadVoices)

      return () => {
        speechSynthesis.removeEventListener("voiceschanged", loadVoices)
      }
    }
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (!isSupported) return

      // Stop any current speech
      speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = rate
      utterance.pitch = pitch
      utterance.volume = volume

      if (voice) {
        utterance.voice = voice
      }

      utterance.onstart = () => {
        setIsPlaying(true)
        setIsPaused(false)
      }

      utterance.onend = () => {
        setIsPlaying(false)
        setIsPaused(false)
        setCurrentUtterance(null)
      }

      utterance.onerror = () => {
        setIsPlaying(false)
        setIsPaused(false)
        setCurrentUtterance(null)
      }

      setCurrentUtterance(utterance)
      speechSynthesis.speak(utterance)
    },
    [isSupported, rate, pitch, volume, voice],
  )

  const pause = useCallback(() => {
    if (isSupported && isPlaying) {
      speechSynthesis.pause()
      setIsPaused(true)
    }
  }, [isSupported, isPlaying])

  const resume = useCallback(() => {
    if (isSupported && isPaused) {
      speechSynthesis.resume()
      setIsPaused(false)
    }
  }, [isSupported, isPaused])

  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel()
      setIsPlaying(false)
      setIsPaused(false)
      setCurrentUtterance(null)
    }
  }, [isSupported])

  return {
    isSupported,
    isPlaying,
    isPaused,
    voices,
    speak,
    pause,
    resume,
    stop,
  }
}
