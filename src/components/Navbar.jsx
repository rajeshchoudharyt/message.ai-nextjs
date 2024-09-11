import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
	return (
		<nav className="fixed top-0 z-40 flex justify-between items-center h-12 w-screen px-4 bg-primary text-primary-content">
			<h4 className="font-semibold text-primary-content tracking-wide hover:text-primary-content/80">
				<Link href="/">Message.ai</Link>
			</h4>
			<div>
				<SignedOut>
					<SignInButton>
						<button className="btn btn-sm bg-base-100 text-primary rounded hover:bg-base-200">
							Sign in
						</button>
					</SignInButton>
				</SignedOut>
				<SignedIn>
					<UserButton />
				</SignedIn>
			</div>
		</nav>
	);
}
