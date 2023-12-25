import { Language } from "./constants"

export type WhisperLiveConfig = {
	openAiKey: string
	timeSlice?: number
	model?: string
	prompt?: string
	language?: Language
	onTranscript?: (transcription: string) => void
}
