"use client";

import Link from "next/link";
import CreateGroupForm from "@/components/CreateGroupForm";

import { useAuth } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Groups() {
	const [groups, setGroups] = useState([]);
	const { userId } = useAuth();
	const dialogRef = useRef();

	async function get() {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/groups?userId=${userId}`
		);

		if (!response.ok) return notFound();

		const data = await response.json();
		if (data) setGroups(data.groups);
	}

	useEffect(() => {
		get();
	}, []);

	return (
		<main className="relative w-screen min-h-[calc(100dvh-3rem)] flex flex-col">
			<button
				className="absolute z-10 left-[calc(100dvw-5rem)] top-[calc(100dvh-8rem)] size-12
								btn btn-sm btn-primary btn-circle text-2xl"
				onClick={() => dialogRef.current.showModal()}>
				+
			</button>
			<dialog className="modal" ref={dialogRef}>
				<CreateGroupForm setGroups={setGroups} dialogRef={dialogRef} />
			</dialog>

			<ul>
				{groups?.length > 0 ? (
					groups.map((group) => (
						<Link
							key={group.id}
							className="btn btn-block rounded-none bg-base-100
                                            justify-start hover:bg-primary/50"
							href={`/groups/${group.id}`}>
							{group.name}
						</Link>
					))
				) : (
					<p className="text-center">No groups</p>
				)}
			</ul>
		</main>
	);
}
