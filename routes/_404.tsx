import { asset, Head } from "$fresh/runtime.ts";

export default function Error404() {
	return (
		<>
			<Head>
				<title>404 - Page Not Found</title>
			</Head>
			<div class="container-tight py-4">
				<div class="empty">
					<img src={asset("images/not_found.svg")} alt="404 Image" />
					<p class="empty-title">Page Not Found</p>
					<p class="empty-subtitle text-secondary">The page you are looking for could not be found or no longer exists.</p>
					<div class="empty-action">
						<a href="/" class="btn btn-primary">
							<i class="icon ti ti-arrow-left"></i>
							Return to homepage
						</a>
					</div>
				</div>
			</div>
		</>
	);
}
