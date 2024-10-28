export function Footer() {
	return (
		<footer class="footer footer-transparent d-print-none">
			<div class="container-xl">
				<div class="row text-center align-items-center flex-row-reverse">
					{/* Footer Links */}
					<div class="col-lg-auto ms-lg-auto">
						<ul class="list-inline list-inline-dots mb-0">
							<li class="list-inline-item">
								<a href="https://github.com/ImSkully/rtttl-web-composer" target="_blank" class="link-secondary">
									View source on GitHub <i class="ti ti-external-link"></i>
								</a>
							</li>
						</ul>
					</div>

					{/* Footer Text */}
					<div class="col-12 col-lg-auto mt-3 mt-lg-0">
						<ul class="list-inline list-inline-dots mb-0">
							<li class="list-inline-item">
								Made with ☕ by <a href="https://github.com/ImSkully" target="_blank" title="View GitHub Profile">Skully</a> &mdash;
								<em>
									Found this useful? <a href="https://www.buymeacoffee.com/Skully" target="_blank">Leave a tip</a>!
								</em>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</footer>
	);
}
