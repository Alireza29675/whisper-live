import axios from 'axios'
import {RecordRTCPromisesHandler} from 'recordrtc'
import {OPENAI_API_TOKEN, WHISPER_API_ENDPOINT} from './constants'

const AUDIO_MIME_TYPE = 'audio/webm;codecs=opus'

export type TranscriberConfig = {
	timeSlice?: number
	model?: string
	prompt?: string
	language?: string
	onTranscript?: (transcription: string) => void
}

export class Transcriber {
	timeSlice: number
	model: string
	prompt: string
	language: string
	chunks: Blob[] = []
	onTranscript?: (text: string) => void
	recorder?: RecordRTCPromisesHandler
	stream?: MediaStream

	recording = false
	transcribing = false
	transcript = ''

	constructor(config: TranscriberConfig) {
		this.timeSlice = config.timeSlice ?? 2000
		this.model = config.model ?? 'whisper-1'
		this.prompt = config.prompt ?? ''
		this.language = config.language ?? 'en'
		this.onTranscript = config.onTranscript
	}

	startRecording = async (): Promise<void> => {
		this.transcript = ''
		this.onTranscript?.('')
		await this.startStreaming()
		if (!this.recorder) {
			this.recorder = new RecordRTCPromisesHandler(this.stream!, {
				mimeType: 'audio/webm',
				timeSlice: this.timeSlice,
				type: 'audio',
				ondataavailable: this.transcribe,
			})
		}
		const recordState = await this.recorder.getState()
		if (recordState === 'inactive' || recordState === 'stopped') {
			await this.recorder.startRecording()
		}
		if (recordState === 'paused') {
			await this.recorder.resumeRecording()
		}
		this.recording = true
	}

	stopRecording = async (): Promise<string> => {
		if (!this.recorder) return ''

		const state = await this.recorder.getState()
		if (state === 'recording' || state === 'paused') {
			await this.recorder.stopRecording()
		}

		this.recording = false
		this.stopStreaming()
		await this.transcribe()
		await this.recorder.destroy()
		this.chunks = []
		this.recorder = undefined
		return this.transcript
	}

	startStreaming = async (): Promise<void> => {
		if (this.stream) {
			this.stream.getTracks().forEach(track => track.stop())
		}

		this.stream = await navigator.mediaDevices.getUserMedia({
			audio: true,
		})
	}

	stopStreaming = (): void => {
		if (!this.stream) return
		this.stream.getTracks().forEach(track => track.stop())
		this.stream = undefined
	}

	transcribe = async (chunk?: Blob): Promise<void> => {
		if (!this.recorder) return
		this.transcribing = true
		if (chunk) {
			this.chunks.push(chunk)
		}
		const blob = !chunk
			? await this.recorder.getBlob()
			: new Blob(this.chunks, {
					type: AUDIO_MIME_TYPE,
			  })
		const file = new File([blob], 'speech.webm', {
			type: AUDIO_MIME_TYPE,
		})
		const text = await this.sendToWhisper(file)
		this.transcript = text
		this.transcribing = false
		this.onTranscript?.(text)
	}

	sendToWhisper = async (file: File): Promise<string> => {
		const body = new FormData()
		body.append('file', file)
		body.append('model', this.model)
		body.append('language', this.language)
		if (this.prompt) body.append('prompt', this.prompt)

		const response = await axios.post(WHISPER_API_ENDPOINT, body, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `Bearer ${OPENAI_API_TOKEN}`,
			},
		})
		return response.data.text
	}
}