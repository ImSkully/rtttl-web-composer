import type { PageProps } from "$fresh/server.ts";
import ThemeButton from "../islands/ThemeButton.tsx";

export default function Navbar(props: PageProps) {
	return (
		<header class="navbar-expand-md">
			<div class="collapse navbar-collapse" id="navbar-menu">
				<div class="navbar navbar-light">
					<div class="container-xl">
						{/* Navigation List */}
						<ul class="navbar-nav">
							<li class={`nav-item ${props.route === "/" ? "active" : ""}`}>
								<a class="nav-link" href="/">
									<span class="nav-link-icon d-md-none d-lg-inline-block">
										<i class="icon ti ti-music"></i>
									</span>
									<span class="nav-link-title">RTTTL Composer</span>
								</a>
							</li>
							<li class={`nav-item ${props.route === "/rtttl_specification" ? "active" : ""}`}>
								<a class="nav-link" href="rtttl_specification">
									<span class="nav-link-icon d-md-none d-lg-inline-block">
										<i class="icon ti ti-question-mark"></i>
									</span>
									<span class="nav-link-title">What is RTTTL?</span>
								</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" href="https://github.com/ImSkully/rtttl-web-composer" target="_blank">
									<span class="nav-link-icon d-md-none d-lg-inline-block">
										<i class="icon ti ti-brand-github"></i>
									</span>
									<span class="nav-link-title">Source</span>
								</a>
							</li>
						</ul>
						<div class="navbar-nav flex-row order-md-last">
							<div class="d-md-flex">
								<ThemeButton />
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
