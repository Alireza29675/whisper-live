import { WhisperLiveImpl } from "./WhisperLiveImpl";
import { WhisperLiveConfig } from "./types";

export class WhisperLive {
	private instance: WhisperLiveImpl;

	constructor(config: WhisperLiveConfig) {
		this.instance = new WhisperLiveImpl(config);
	}

	start() {
		this.instance.startRecording();
	}

	stop() {
		this.instance.stopRecording();
	}

	onTranscript(cb: (text: string) => void) {
		this.instance.onTranscript(cb)
	}
}