import Navbar from "@/components/Navbar";
import { Source_Sans_3 } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

const sans = Source_Sans_3({ subsets: ["latin"] });

export const metadata = {
	title: "Message.ai",
	description: "A real-time messaging app with AI.",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<ClerkProvider>
				<body className={sans.className}>
					<Navbar />
					<main className="fixed top-12">{children}</main>
				</body>
			</ClerkProvider>
		</html>
	);
}
