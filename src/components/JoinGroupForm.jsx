"use client";

import { env } from "@/utils/config";
import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function JoinGroupForm({ dialogRef, setMessages }) {
	const [loading, setLoading] = useState(false);
	const path = usePathname();
	const groupId = path.slice(8);
	const { userId } = useAuth();

	const handleJoin = async () => {
		setLoading(true);

		try {
			const response = await fetch(`${env.BACKEND_END_URL}/groups`, {
				method: "PATCH",
				body: JSON.stringify({ userId, groupId }),
			});

			if (!response.ok) {
				alert("Error: Something went wrong.");
				return;
			}

			const data = await response.json();

			if (data) {
				setMessages(data.messages);
				dialogRef.current.close();
			}
			//
		} catch (error) {
			console.log(error);
		}

		setLoading(false);
	};

	return (
		<div className="modal-box rounded-md w-fit max-w-xl py-10 px-12">
			<form method="dialog">
				<button className="btn btn-sm btn-circle btn-ghost font-bold text-base absolute right-3 top-3">
					✕
				</button>
			</form>
			<button
				className="btn btn-primary text-base rounded w-32 
								disabled:bg-primary disabled:text-primary-content"
				disabled={loading}
				onClick={handleJoin}>
				{loading ? (
					<span className="loading loading-spinner" />
				) : (
					"Join group"
				)}
			</button>
		</div>
	);
}
