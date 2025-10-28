import { useState } from "react";
import GazeButton from "../gazeButton";
import { BsStopFill, BsFillVolumeUpFill } from "react-icons/bs";

export default function SpeakButton({ text }: { text: string }) {
	const [isSpeaking, setIsSpeaking] = useState(false);

	const speak = (text: string) => {
		// logic gọi speech
		const synth = window.speechSynthesis;
		if (synth.speaking) synth.cancel();

		const utterance = new SpeechSynthesisUtterance(text);
		utterance.rate = 1;
		utterance.lang = "en-US";

		synth.speak(utterance);
		// window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
		setIsSpeaking(true);
	};

	const stopSpeaking = () => {
		window.speechSynthesis.cancel();
		setIsSpeaking(false);
	};
	
	return (
		<GazeButton
			onClick={() => {
				if (isSpeaking) {
					stopSpeaking();
				} else {
					speak(text);
				}
			}}
			className={`p-10 rounded-full text-white text-xl shadow-lg transform transition-transform duration-300 ${isSpeaking ? "bg-red-600 hover:bg-red-700" : "bg-[#1e1f25] hover:scale-110 hover:shadow-xl"
				} active:scale-95`}
		>
			{/* {isSpeaking ? "⏹" : "🔊"} */}
			{isSpeaking ? <BsStopFill /> : <BsFillVolumeUpFill />}
		</GazeButton>
	);
}

