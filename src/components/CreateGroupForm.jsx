"use client";

import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

export default function CreateGroupForm({ setGroups, dialogRef }) {
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const { userId } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const groupName = name.trim();
		setLoading(true);

		try {
			const response = await fetch("http://localhost:3001/groups", {
				method: "POST",
				body: JSON.stringify({ userId, groupName }),
			});

			if (!response.ok) {
				alert("Error: Something went wrong.");
				return;
			}

			const data = await response.json();

			if (data) {
				const { groupId: id, groupName: name } = data;
				setName("");
				setGroups((prev) => [...prev, { id, name }]);
				dialogRef.current.close();
			}
			//
		} catch (error) {
			console.log(error);
		}

		setLoading(false);
	};

	return (
		<div className="modal-box rounded-md max-w-3xl py-10 px-8">
			<form method="dialog">
				<button className="btn btn-sm btn-circle btn-ghost font-bold text-base absolute right-3 top-3">
					✕
				</button>
			</form>
			<form
				onSubmit={handleSubmit}
				className="flex flex-col justify-center items-center gap-y-6">
				<h3 className="font-semibold text-2xl mb-4 capitalize">
					create new group
				</h3>
				<input
					type="text"
					className="input input-primary rounded w-full max-w-80"
					placeholder="Group name"
					minLength={2}
					required
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<button
					type="submit"
					className="btn btn-primary text-base rounded w-32 
								disabled:bg-primary disabled:text-primary-content"
					disabled={loading}>
					{loading ? (
						<span className="loading loading-spinner" />
					) : (
						"Create"
					)}
				</button>
			</form>
		</div>
	);
}
