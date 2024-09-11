import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function Home() {
	return (
		<div
			className="flex flex-col justify-center items-center text-center text-gray-600
						gap-y-4 h-[calc(100dvh-3rem)]">
			<h1 className="text-3xl font-bold text-primary-content">
				Welcome to Message.ai
			</h1>
			<p>Chat with your friends and with Message.ai</p>
			<SignedOut>
				<SignInButton>
					<button className="btn btn-primary rounded">Sign in</button>
				</SignInButton>
			</SignedOut>
			<SignedIn>
				<Link href="/groups" className="btn btn-primary rounded">
					My groups
				</Link>
			</SignedIn>
		</div>
	);
}
