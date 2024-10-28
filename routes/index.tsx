import { Head } from "$fresh/runtime.ts";

export default function Home() {
	const notes = ["B", "A#", "A", "G#", "G", "F#", "F", "E", "D#", "D", "C#", "C"];

	return (
		<>
			<Head>
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/notyf/3.10.0/notyf.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
				<title>RTTTL Web Composer</title>
			</Head>
			<div class="container-xl">
				{/* Main Tone Table is loaded from JS */}
				<div class="card">
					<div class="row">
						<div class="col-1 bg-primary">
							<table class="table card-table header-table">
								<tbody>
									{notes.map((note) => (
										<tr key={note}>
											<th>{note}</th>
										</tr>
									))}
									<tr>
										<th>
											<span
												class="form-help mx-1"
												data-bs-toggle="popover"
												data-bs-placement="top"
												data-bs-html="true"
												data-bs-content="Controls the duration for individual notes, any column with <code>d</code> will use the default <strong>Duration</strong> that is set below."
											>
												?
											</span>
											d
										</th>
									</tr>
									<tr>
										<th>
											<span
												class="form-help mx-1"
												data-bs-toggle="popover"
												data-bs-placement="top"
												data-bs-html="true"
												data-bs-content="Adjust the octave (pitch) for individual notes, any column with <code>o</code> will use the default <strong>Octave</strong> that is set below."
											>
												?
											</span>
											o
										</th>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="col-11 px-0">
							<div class="table-responsive">
								<table id="composer-table" class="table composer-table"></table>
							</div>
						</div>
					</div>
				</div>

				<div class="card mt-3">
					<div class="card-body">
						{/* Controls Row */}
						<div class="row">
							{/* BPM Slider */}
							<div class="col-6">
								<label class="form-label" for="bpm-slider">
									BPM <span class="text-muted">(Range: 5 - 900)</span> <kbd>V</kbd> - <kbd>B</kbd>
								</label>
								<div class="row">
									<div class="col-8">
										<input type="range" class="form-range mt-2" value="63" min="5" max="900" id="bpm-slider" />
									</div>
									<div class="col-3">
										<input
											data-bs-toggle="tooltip"
											data-bs-placement="top"
											title="Use left slider to adjust"
											type="text"
											class="form-control disabled"
											id="bpm-input"
											value="63"
											readonly
										/>
									</div>
								</div>
							</div>

							{/* Octave Dropdown */}
							<div class="col-3">
								<label class="form-label" for="octave-selector">
									Octave <kbd>O</kbd>
								</label>
								<select id="octave-selector" class="form-select">
									<option value="4">4</option>
									<option value="5">5</option>
									<option value="6" selected>6 (Default)</option>
									<option value="7">7</option>
								</select>
							</div>

							{/* Duration Dropdown */}
							<div class="col-3">
								<label class="form-label" for="duration-selector">
									Duration <kbd>D</kbd>
								</label>
								<select id="duration-selector" class="form-select">
									<option value="1">1</option>
									<option value="2">1/2</option>
									<option value="4" selected>1/4 (Default)</option>
									<option value="8">1/8</option>
									<option value="16">1/16</option>
									<option value="32">1/32</option>
								</select>
							</div>
						</div>

						{/* RTTTL Output Text Area */}
						<div class="row">
							<div class="col-8">
								<div class="my-3">
									<label class="form-label" for="rtttl-output-textbox">RTTTL Output</label>
									<div class="input-icon mb-3">
										<span class="input-icon-addon">
											<i class="icon ti ti-music"></i>
										</span>
										<input type="text" class="form-control font-terminal" id="rtttl-output-textbox" placeholder="song_name:d=4,o=5,b=140:..." />
									</div>
								</div>
							</div>

							{/* Playback */}
							<div class="col-4">
								<div class="my-3">
									<div class="form-label">
										Playback <kbd>Spacebar</kbd>
									</div>
									<div class="btn-group w-100" role="group">
										{/* Play Button */}
										<input type="radio" class="btn-check" name="btn-radio-toolbar" id="radio-toolbar-play" autocomplete="off" />
										<label for="radio-toolbar-play" class="btn btn-success">
											<i class="icon ti ti-player-play"></i>
											Play
										</label>
										{/* Stop Button */}
										<input type="radio" class="btn-check" name="btn-radio-toolbar" id="radio-toolbar-stop" autocomplete="off" disabled />
										<label for="radio-toolbar-stop" class="btn btn-danger">
											<i class="icon ti ti-player-stop"></i>
											Stop
										</label>

										{/* Load From Text Area Button */}
										<input type="radio" class="btn-check" name="btn-radio-toolbar" id="radio-toolbar-load-from-textarea" autocomplete="off" />
										<label for="radio-toolbar-load-from-textarea" class="btn btn-info">
											<i class="icon ti ti-book-upload"></i>
											Load From Text Area
										</label>

										{/* Volume Button */}
										<button class="btn btn-icon bg-azure-lt" name="btn-radio-toolbar" data-bs-toggle="dropdown" autocomplete="off">
											<i class="icon ti ti-volume"></i>
											<div class="dropdown-menu p-2">
												<label class="form-label text-center" id="radio-toolbar-slider-volume-text" for="radio-toolbar-slider-volume">20%</label>
												<input type="range" class="form-range" value="20" min="0" max="100" id="radio-toolbar-slider-volume" />
											</div>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
