import axios from 'axios'
import {RecordRTCPromisesHandler} from 'recordrtc'
import {EVENTS, WHISPER_API_ENDPOINT} from './constants'
import { WhisperLiveConfig } from './types'
import EventEmitter from 'events'

const AUDIO_MIME_TYPE = 'audio/webm;codecs=opus'

export class WhisperLiveImpl {
	openAiKey: string
	timeSlice: number
	model: string
	prompt: string
	language: string | undefined
	chunks: Blob[] = []
	recorder?: RecordRTCPromisesHandler
	stream?: MediaStream
	recording = false
	transcribing = false
	transcript = ''
  events: EventEmitter

	constructor(config: WhisperLiveConfig) {
		this.openAiKey = config.openAiKey
		this.timeSlice = config.timeSlice ?? 2000
		this.model = config.model ?? 'whisper-1'
		this.prompt = config.prompt ?? ''
		this.language = config.language ?? undefined
		this.events = new EventEmitter()
	}

	startRecording = async (): Promise<void> => {
		this.transcript = ''
		this.events.emit(EVENTS.Transcribe, '')
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
		this.events.emit('transcipt', text)
    }

	sendToWhisper = async (file: File): Promise<string> => {
		const body = new FormData()
		body.append('file', file)
		body.append('model', this.model)
		if (this.language) body.append('language', this.language)
		if (this.prompt) body.append('prompt', this.prompt)

		const response = await axios.post(WHISPER_API_ENDPOINT, body, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `Bearer ${this.openAiKey}`,
			},
		})
		return response.data.text
	}

	onTranscript(cb: (text: string) => void) {
			return this.events.on(EVENTS.Transcribe, cb)
	}
}