"use client";

import JoinGroupForm from "@/components/JoinGroupForm";
import { useAuth } from "@clerk/nextjs";
import { notFound, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const options = {
	year: "numeric",
	month: "short",
	day: "numeric",
	hour: "numeric",
	minute: "numeric",
	hour12: true,
};

function parseDate(timestamp) {
	const time = new Date(
		timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
	);

	return time.toLocaleString(undefined, options);
}

export default function Page() {
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState("");
	const [groupName, setGroupName] = useState("");
	const [socket, setSocket] = useState(null);

	const { userId } = useAuth();
	const path = usePathname();
	const groupId = path.slice(8);

	const dialogRef = useRef();
	const scrollRef = useRef();

	function startWebSoocket() {
		const webSocket = new WebSocket(
			`${process.env.BACKEND_URL}/message?groupId=${groupId}&userId=${userId}`
		);

		// webSocket.onopen = () => {
		// 	console.log("socket connected.");
		// };

		webSocket.onmessage = (ev) => {
			const data = JSON.parse(ev.data);
			setMessages((prev) => (prev ? [...prev, data] : [data]));
		};

		webSocket.onclose = () => {
			setSocket(null);
		};

		setSocket(webSocket);
		return webSocket;
	}

	async function get() {
		const response = await fetch(
			`${process.env.BACKEND_URL}/messages?groupId=${groupId}&userId=${userId}`
		);

		if (!response.ok) {
			if (response.status === 404) return notFound();
			if (response.status === 403) {
				dialogRef.current.showModal();
				return;
			}
		}

		const data = await response.json();
		if (data) {
			setGroupName(data.name);
			setMessages(data.messages);
		}
	}

	useEffect(() => {
		get();
		const webSocket = startWebSoocket();

		return () => {
			webSocket?.close();
			setSocket(null);
		};
	}, []);

	useEffect(() => {
		if (scrollRef.current)
			scrollRef.current.lastChild.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const sendMessage = (e) => {
		e.preventDefault();

		if (socket && socket.OPEN) {
			socket.send(message);
			setMessage("");
		} else {
			startWebSoocket();
		}
	};

	const handleAIMessage = async () => {
		const msg = message.trim();
		if (!msg) return;

		if (!socket && !socket?.OPEN) return startWebSoocket();
		setMessage("");

		const response = await fetch(`${process.env.BACKEND_URL}/chat`, {
			method: "POST",
			body: JSON.stringify({
				userId,
				groupId,
				data: {
					messages,
					query: message.trim(),
				},
			}),
		});

		if (!response.ok) alert("Something went wrong. Try again.");
	};

	return (
		<div className="relative flex flex-col w-full h-[calc(100dvh-3.5rem)]">
			<div className="flex justify-between items-center px-4 py-2 shadow-md">
				<p className="text-primary-content max-w-full">{groupName}</p>
				<div className="dropdown dropdown-end">
					<div tabIndex={0} role="button">
						<svg viewBox="0 0 24 24" className="size-5">
							<path d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
						</svg>
					</div>
					<ul
						tabIndex={0}
						data-tip="copy link"
						className="dropdown-content bg-base-200 rounded z-[1] tooltip mt-1">
						<li>
							<input
								type="radio"
								className="btn btn-sm justify-start rounded"
								aria-label="Share"
								value="share"
								onClick={() => {
									navigator?.clipboard?.writeText(
										window.location.href
									);
								}}
							/>
						</li>
					</ul>
				</div>
			</div>
			<dialog className="modal" ref={dialogRef}>
				<JoinGroupForm
					dialogRef={dialogRef}
					setMessages={setMessages}
				/>
			</dialog>
			<div
				className="flex flex-col h-full overflow-y-auto px-4 gap-y-2"
				ref={scrollRef}>
				{messages?.length > 0 ? (
					messages.map((obj, key) => (
						<div
							key={key}
							className={`chat ${
								obj.userId === userId
									? "chat-end"
									: "chat-start"
							}`}>
							<p className="chat-header">
								{obj.name}
								<time className="ml-2 text-xs opacity-50">
									{parseDate(obj.timestamp)}
								</time>
							</p>
							<div
								className={`chat-bubble p-1 rounded bg-primary text-primary-content ${
									obj.userId == userId
										? "bg-primary"
										: "bg-base-200"
								}`}>
								{obj.query ? (
									<p className="px-2">{obj.query}</p>
								) : (
									""
								)}
								<p
									className={`whitespace-pre-line rounded p-2 w-full ${
										obj.query && "bg-base-200"
									}`}>
									{obj.message}
									<br />
								</p>
							</div>
						</div>
					))
				) : (
					<p className="text-center">No message</p>
				)}
			</div>
			<form
				onSubmit={sendMessage}
				className="flex justify-between w-full gap-x-2 px-4 py-2">
				<input
					type="text"
					className="input input-primary rounded w-full"
					placeholder="Start typing..."
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					required
				/>
				<button className="btn btn-primary rounded w-16" type="submit">
					Send
				</button>
				<button
					className="btn btn-primary bg-base-100 tracking-wider rounded w-fit"
					type="button"
					onClick={handleAIMessage}>
					AI
				</button>
			</form>
		</div>
	);
}
