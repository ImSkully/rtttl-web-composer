import { type PageProps } from "$fresh/server.ts";
import { asset } from "$fresh/runtime.ts";
import { Footer } from "../components/Footer.tsx";
import Navbar from "../components/Navbar.tsx";

export default function App(props: PageProps) {
	return (
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<meta name="description" content="A rich web based Ring Tone Text Transfer Language (RTTTL) composer." />
				<meta name="keywords" content="rtttl, ringtone, ring, tone, text, transfer, language, composer, web, online, creator, application" />
				<meta name="author" content="Skully" />
				<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

				<meta property="og:image" content={asset("images/logos/icon.png")} />
				<meta property="og:image:type" content="image/png" />
				<meta property="og:image:width" content="64" />
				<meta property="og:image:height" content="64" />
				<meta http-equiv="X-UA-Compatible" content="ie=edge" />

				{/* Favicon */}
				<link rel="icon" type="image/x-icon" href={asset("favicon.ico")} />
				<link rel="shortcut icon" href={asset("images/logos/icon.png")} />

				{/* CSS. */}
				<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/core@1.0.0-beta17/dist/css/tabler.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
				<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
				<link rel="stylesheet" href={asset("css/style.css")} />

				<title>RTTTL Web Composer</title>
			</head>

			<body>
				<div class="page">
					<Navbar {...props} />

					{/* Page Content */}
					<div class="page-wrapper">
						<div class="page-body">
							<props.Component />
						</div>
					</div>

					<Footer />
				</div>

				{/* Scripts */}
				<script src="https://code.jquery.com/jquery-3.7.1.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
				<script src="https://cdn.jsdelivr.net/npm/@tabler/core@1.0.0-beta17/dist/js/tabler.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
				<script src="https://cdnjs.cloudflare.com/ajax/libs/notyf/3.10.0/notyf.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
				<script src={asset("js/main.js")}></script>
			</body>
		</html>
	);
}
