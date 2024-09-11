"use client";

import { notFound, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Page() {
	const [messages, setMessages] = useState([]);
	const [socket, setSocket] = useState(null);
	const path = usePathname();

	function startWebSoocket() {
		const webSocket = new WebSocket("http://127.0.0.1:3001/message");

		webSocket.onopen = () => {
			webSocket.send("open for connection");
			console.log("socket connected.");
		};

		webSocket.onmessage = (ev) => {
			// console.log(ev);
			console.log("message: ", ev.data);
		};

		webSocket.onclose = () => {
			console.log("disconnected");
			setSocket(null);
		};

		setSocket(webSocket);

		return webSocket;
	}

	async function get() {
		const response = await fetch("http://localhost:3001" + path);

		if (!response.ok) return notFound();

		const data = await response.json();

		if (data) {
			setMessages(data);
		}
	}

	useEffect(() => {
		const webSocket = startWebSoocket();
		get();

		return () => {
			console.log("cleanup");
			webSocket?.close();
			setSocket(null);
		};
	}, []);

	const sendMessage = () => {
		if (socket) {
			socket.send("hello server");
		} else {
			startWebSoocket();
		}
	};

	return (
		<main className="relative w-screen min-h-[calc(100dvh-3rem)] flex flex-col">
			<button
				className="btn btn-primary rounded w-fit"
				onClick={sendMessage}>
				Send
			</button>
			<div>
				{messages?.length > 0
					? messages.map((obj, key) => (
							<div key={key}>
								<p>{obj.user}</p>
								<p>{obj.message}</p>
							</div>
					  ))
					: "No messages"}
			</div>
		</main>
	);
}
