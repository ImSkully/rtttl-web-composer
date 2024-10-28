import type { PageProps } from "$fresh/server.ts";
import { asset } from "$fresh/runtime.ts";
import ThemeButton from "../islands/ThemeButton.tsx";

export default function Navbar(props: PageProps) {
	return (
		<header class="navbar-expand-md">
			<div class="collapse navbar-collapse" id="navbar-menu">
				<div class="navbar navbar-light">
					<div class="container-xl">
						{/* Navbar Logo */}
						<div class="navbar-brand d-none-navbar-horizontal pe-0 pe-md-3">
							<a href="/" class="text-decoration-none">
								<img src={asset("images/logos/logo_400px.png")} alt="RTTTL WC Logo" class="navbar-brand-image" />
								<span class="ms-2 text-white">RTTTL Composer</span>
							</a>
						</div>

						{/* Navigation List */}
						<div class="collapse navbar-collapse" id="navbar-menu">
							<div class="d-flex flex-column flex-md-row flex-fill align-items-stretch align-items-md-center">
								<ul class="navbar-nav">
									<li class={`nav-item ${props.route === "/" ? "active" : ""}`}>
										<a class="nav-link" href="/">
											<span class="nav-link-icon d-md-none d-lg-inline-block">
												<i class="icon ti ti-music"></i>
											</span>
											<span class="nav-link-title">Composer</span>
										</a>
									</li>
									<li class={`nav-item ${props.route === "/rtttl_specification" ? "active" : ""}`}>
										<a class="nav-link" href="rtttl_specification">
											<span class="nav-link-icon d-md-none d-lg-inline-block">
												<i class="icon ti ti-book"></i>
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
							</div>
						</div>

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
