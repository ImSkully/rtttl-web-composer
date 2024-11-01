import { Head } from "$fresh/runtime.ts";

export default async function RTTTLSpecification() {
	// Load RTTTL Specifications from files.
	const RTTTL_SPECIFICATIONS = {
		["1.0.0"]: await Deno.readTextFile("./routes/specs/rtttl_1.0.0.txt"),
		["1.1.0"]: await Deno.readTextFile("./routes/specs/rtttl_1.1.0.txt"),
		["NuukiaWorld"]: await Deno.readTextFile("./routes/specs/rtttl_nuukiaworld.txt"),
	};

	// Example RTTTL string to use as reference throughout this documentation.
	const rtttl_example_string = ["Bethoven", "d=4,o=5,b=160", "c,e,c,g,c,c6,8b,8a,8g,8a,8g,8f,8e,8f,8e,8d,c,e,g,e,c6,g."];

	return (
		<>
			<Head>
				<title>RTTTL Specification</title>
			</Head>
			<div class="container-xl">
				<div class="container-xl">
					<div class="card">
						<div class="card-body">
							<div class="row">
								<div class="col-8">
									<h1 class="mb-3" id="ring-tone-text-transfer-language">Ring Tone Text Transfer Language (RTTTL)</h1>
									<p>
										<abbr title="Ring Tone Text Transfer Language">RTTTL</abbr> <em>(Previously referred to as Nokring)</em>{" "}
										was originally developed in 1996 by Nokia<sup>1</sup>{" "}
										for use in their mobile phones back when they were the dominant force in the mobile phone market and the most common method of composing,
										and sharing ringtones was through text messages. The format was simple and easy to understand which made its adoption quite popular though
										was quickly replaced by more modern formats such as <abbr title="Musical Instrument Digital Interface">MIDI</abbr>{" "}
										and MP3 ringtones which offered more features and better sound quality.
									</p>
									<p>
										The RTTTL format is still used today in some applications and devices such as hobbyist Arduino projects, IoT devices, and some older mobile
										phones.
									</p>
									<h1 id="how-it-works" class="mt-4">How It Works</h1>
									<p>
										An RTTTL string is divided into three sections that are separated by colons <code>:</code>
										and collectively contain everything necessary to play a ringtone.
									</p>
									<p>
										Take the following RTTTL string below as an example:
										<pre><span class="text-red">{rtttl_example_string[0]}</span>:<span class="text-yellow">{rtttl_example_string[1]}</span>:<span class="text-green">{rtttl_example_string[2]}</span></pre>
									</p>
								</div>
								{/* Table of Contents */}
								<div class="col-4">
									<div class="card">
										<div class="card-body">
											<h3 class="card-title">Table of Contents</h3>
											<table class="table table-sm table-borderless">
												<tbody>
													<tr>
														<td>
															<a href="#ring-tone-text-transfer-language">Ring Tone Text Transfer Language</a>
														</td>
													</tr>
													<tr>
														<td>
															<a href="#how-it-works">How It Works</a>
														</td>
													</tr>
													<tr>
														<td>
															<a href="#part-1-name-section" class="ms-3">Part 1: Name Section</a>
														</td>
													</tr>
													<tr>
														<td>
															<a href="#part-2-control-section" class="ms-3">Part 2: Control Section</a>
														</td>
													</tr>
													<tr>
														<td>
															<a href="#part-3-tone-commands" class="ms-3">Part 3: Tone Commands</a>
														</td>
													</tr>
													<tr>
														<td>
															<a href="#audio-hardware">Audio Hardware</a>
														</td>
													</tr>
													<tr>
														<td>
															<a href="#rtttl-specifications">RTTTL Specifications</a>
														</td>
													</tr>
													<tr>
														<td>
															<a href="#references">References</a>
														</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>

							<h2 id="part-1-name-section" class="mt-4">
								Part 1: Name Section (<code class="text-red">{rtttl_example_string[0]}</code>)
							</h2>
							<p>
								The name of the ringtone, this is normally not used by the player but is useful for identifying the ringtone. According to the official
								specification, the name must not exceed 11 characters in length though this is arbritary and many implementation of RTTTL are generally capable of
								handling names with much greater lengths. Whilst no character restrictions are specified, it is recommended to use only alphanumeric characters and
								spaces, with the semicolon <code>:</code> character.
							</p>

							<h2 id="part-2-control-section" class="mt-4">
								Part 2: Control Section (<code class="text-yellow">{rtttl_example_string[1]}</code>)
							</h2>
							<p>
								The control section contains the default values for the ringtone and is separated by commas <code>,</code>
								in a key-value pair further separated by an equals sign
								<code>=</code>. These values are used when a note does not specify a value. Use the table below to learn more about each control value.
							</p>

							{/* Control Section Table */}
							<div class="card-tabs mb-3">
								<ul class="nav nav-tabs" role="tablist">
									<li class="nav-item" role="presentation">
										<a href="#rtttl-control-d" class="nav-link active" data-bs-toggle="tab" aria-selected="true" role="tab">
											<code>d</code> = Duration
										</a>
									</li>
									<li class="nav-item" role="presentation">
										<a href="#rtttl-control-o" class="nav-link" data-bs-toggle="tab" aria-selected="false" role="tab" tabindex={-1}>
											<code>o</code> = Octave
										</a>
									</li>
									<li class="nav-item" role="presentation">
										<a href="#rtttl-control-b" class="nav-link" data-bs-toggle="tab" aria-selected="false" tabindex={-1} role="tab">
											<code>b</code> = BPM
										</a>
									</li>
								</ul>
								<div class="tab-content">
									{/* Duration */}
									<div id="rtttl-control-d" class="card tab-pane active show" role="tabpanel">
										<div class="card-body">
											<p>
												The <a href="https://en.wikipedia.org/wiki/Duration_(music)" target="_blank" class="fw-bold">duration</a>{" "}
												of the note which is measured relative to other notes using a system of whole notes.
												<strong>
													<u>It is not measured in time (seconds or minutes)</u>
												</strong>.
											</p>
											<div class="col-4">
												<table class="table table-vcenter card-table">
													<thead>
														<tr>
															<th>Value</th>
															<th>Description</th>
														</tr>
													</thead>
													<tbody>
														{[
															{ value: "1", description: "A full note (1/1)" },
															{ value: "2", description: "A half note (½)" },
															{ value: "4", description: "A quarter note (¼)" },
															{ value: "8", description: "An eighth note (⅛)" },
															{ value: "16", description: "A sixteenth note (1/16)" },
															{ value: "32", description: "A thirty-second note (1/32)" },
														].map((item, index) => (
															<tr key={index}>
																<td>
																	<code>{item.value}</code>
																</td>
																<td>{item.description}</td>
															</tr>
														))}
													</tbody>
												</table>
											</div>
										</div>
									</div>
									{/* Octave */}
									<div id="rtttl-control-o" class="card tab-pane" role="tabpanel">
										<div class="card-body">
											<p>
												The <a href="https://en.wikipedia.org/wiki/Octave" target="_blank" class="fw-bold">octave</a> of the note{" "}
												<em>
													(also referred to as <u>scale</u> or <u>pitch</u>)
												</em>{" "}
												which is a range of notes that are higher or lower in pitch. The octave is measured in Hertz (Hz) and is used to determine the
												frequency of the note.
											</p>
											<div class="col-4">
												<table class="table table-vcenter card-table">
													<thead>
														<tr>
															<th>Value</th>
															<th>Description</th>
														</tr>
													</thead>
													<tbody>
														{[
															{ value: "4", description: "Note A is 440Hz" },
															{ value: "5", description: "Note A is 880Hz" },
															{ value: "6", description: "Note A is 1.76 kHz" },
															{ value: "7", description: "Note A is 3.52 kHz" },
														].map((item, index) => (
															<tr key={index}>
																<td>
																	<code>{item.value}</code>
																</td>
																<td>{item.description}</td>
															</tr>
														))}
													</tbody>
												</table>
											</div>
										</div>
									</div>
									{/* BPM */}
									<div id="rtttl-control-b" class="card tab-pane" role="tabpanel">
										<div class="card-body">
											<p>
												The <a href="https://en.wikipedia.org/wiki/Beat_(music)" target="_blank" class="fw-bold">beats per minute</a> of the note (<em>
													also referred to as <a href="https://en.wikipedia.org/wiki/Tempo" target="_blank" class="text-decoration-underline">tempo</a>
												</em>) which is the speed at which the note is played. The <abbr title="beats per minute">BPM</abbr>{" "}
												is measured in beats per minute and is used to determine the tempo of the note.
											</p>
											<div class="col-4">
												<p>
													The value for BPM must be one of the following:
													<pre style="white-space: pre-line">
														5, 28, 31, 35, 40, 45, 50, 56, 63, 70, 80, 90, 100,
														112, 125, 140, 160, 180, 200, 225, 250, 285, 320, 355,
														400, 450, 500, 565, 635, 715, 800, 900
													</pre>
												</p>
											</div>
											<p>
												This would mean if for instance a ringtone is played at a BPM of 112, the tone will get one beat every (60/112) 1.867 second.
												Similiarly, if you you want the ringtone twice as fast, you would increase the BPM to 224.
											</p>
										</div>
									</div>
								</div>
							</div>

							<h2 id="part-3-tone-commands" class="mt-4">
								Part 3: Tone Commands (<code class="text-green">{rtttl_example_string[2]}</code>)
							</h2>
							<p>
								The tone commands section contains the notes that make up the ringtone with each note separated by a comma <code>,</code> character.
							</p>
							<p>
								Each tone note must be one of the following <em>(not case sensitive)</em>:
								<pre class="text-purple">B, A#, A, G#, G, F#, F, E, D#, D, C#, C, <span class="text-red">P</span></pre>
							</p>
							<p>
								Each note can also have an optional duration and octave specified after the note. The duration and octave are separated by a number which is the
								duration of the note and the octave of the note respectively. If the duration or octave is not specified, the default values from the control
								section are used.
							</p>
							<p>
								The note <code class="text-red">P</code>{" "}
								is a special note that represents a pause or rest in the music and is used to create silence in the ringtone rather than output any audible
								frequency.
							</p>
							<p>
								Tones can be represented in the following format:
								<pre>
									<span class="text-blue">[(d)uration]</span>
									<span class="text-purple">[note]</span>
									<span class="text-yellow">[(o)ctave]</span>
									<span class="text-orange">[.]</span>
								</pre>
								<p>
									Notes can also have a dot <code>.</code>{" "}
									character after the note which indicates a dotted note, this gives the note a duration of itself plus half of itself.
								</p>
								<p>
									Here are three examples of notes with varying duration, note, octave, and dot:
									<table class="table table-vcenter card-table w-50">
										<thead>
											<tr>
												<th>Note</th>
												<th>Description</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>
													<code>
														<span class="text-blue">8</span>
														<span class="text-purple">c</span>
														<span class="text-yellow">5</span>
													</code>
												</td>
												<td>An eighth note C in the 5th octave.</td>
											</tr>
											<tr>
												<td>
													<code>
														<span class="text-blue">4</span>
														<span class="text-purple">d</span>
														<span class="text-yellow">6</span>
														<span class="text-orange">.</span>
													</code>
												</td>
												<td>A dotted quarter note D in the 6th octave.</td>
											</tr>
											<tr>
												<td>
													<code>
														<span class="text-blue">16</span>
														<span class="text-purple">g</span>
														<span class="text-yellow">4</span>
													</code>
												</td>
												<td>A sixteenth note G in the 4th octave.</td>
											</tr>
										</tbody>
									</table>
								</p>
							</p>

							<h1 id="audio-hardware" class="mt-4">Audio Hardware</h1>
							<p>
								RTTTL is incredibly useful for programming electrical components with <abbr title="Pulse-width modulation">PWM</abbr>{" "}
								outputs such as passive buzzers and speakers to play simple monophonic melodies such as chimes, sirens, alarms, and ringtones. If you are interested
								in playing RTTTL on a passive buzzer via a microcontroller, the <a href="https://esphome.io" target="_blank">ESPHome</a> project has a{" "}
								<a href="https://esphome.io/components/rtttl.html" target="_blank">built-in component</a>{" "}
								readily available for use with RTTTL through microcontrollers such as ESP3266 and ESP32. For a pre-made device that already has everything needed to
								program and play RTTTL with no additional programming required, check out the <a href="https://apolloautomation.com/products/msr-2">Apollo MSR-2</a>
								{" "}
								mmWave Sensor for use with <a href="https://www.home-assistant.io/" target="_blank">Home Assistant</a>{" "}
								and comes packed with several other features beyond RTTTL.
							</p>

							{/* Specifications */}
							<h2 id="rtttl-specifications" class="mt-4">RTTTL Specifications</h2>
							<p>
								<sup>1</sup>RTTTL is not a well documented format and is a relatively niche piece of historical technology which was quickly replaced by more modern
								formats such as MIDI and MP3 ringtones. There is very little information available on the modern internet today regarding the language, original
								authors, etc. with citations.
							</p>

							<div id="rtttl-spec-1" class="accordion" role="tablist" aria-multiselectable="true">
								<div class="accordion-item">
									<div class="accordion-header" role="tab">
										<button class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#rtttl-spec-1-1" aria-expanded="false">
											Original Specification v1.0<sup>2</sup> <span class="status status-info ms-2">29 July 1998</span>
										</button>
									</div>
									<div id="rtttl-spec-1-1" class="accordion-collapse collapse" role="tabpanel" data-bs-parent="#rtttl-spec-1">
										<div class="accordion-body pt-0">
											<pre style="white-space: pre-wrap">{RTTTL_SPECIFICATIONS["1.0.0"]}</pre>
										</div>
									</div>
								</div>
								<div class="accordion-item">
									<div class="accordion-header" role="tab">
										<button class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#rtttl-spec-1-2" aria-expanded="false">
											Revised Specification v1.1<sup>3</sup> <span class="status status-info ms-2">13 August 1999</span>
											<span class="status status-secondary ms-2">Unofficial</span>
										</button>
									</div>
									<div id="rtttl-spec-1-2" class="accordion-collapse collapse" role="tabpanel" data-bs-parent="#rtttl-spec-2">
										<div class="accordion-body pt-0">
											<pre style="white-space: pre-wrap">{RTTTL_SPECIFICATIONS["1.1.0"]}</pre>
										</div>
									</div>
								</div>
								<div class="accordion-item">
									<div class="accordion-header" role="tab">
										<button class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#rtttl-spec-1-3" aria-expanded="false">
											Modern Specification: NuukiaWorld<sup>4</sup> <span class="status status-secondary ms-2">Unofficial</span>
										</button>
									</div>
									<div id="rtttl-spec-1-3" class="accordion-collapse collapse" role="tabpanel" data-bs-parent="#rtttl-spec-3">
										<div class="accordion-body pt-0">
											<pre style="white-space: pre-wrap">{RTTTL_SPECIFICATIONS["NuukiaWorld"]}</pre>
										</div>
									</div>
								</div>
							</div>

							{/* References Section */}
							<div class="hr-text" id="references">
								<span>References</span>
							</div>
							<div class="alert alert-secondary mt-3">
								<ol>
									<li>
										<a href="https://web.archive.org/web/20000615010005/http://www.binet.lv/personal/nokia/note_syntax_1-1.txt" target="_blank">
											Web Archive: binet.lv/personal/nokia/note_syntax_1-1.txt
										</a>
									</li>
									<li>
										<a href="https://web.archive.org/web/19990302051912/http://members.tripod.com/~ringtones/note_syntax.txt" target="_blank">
											Web Archive: members.tripod.com/~ringtones/note_syntax.txt
										</a>
									</li>
									<li>
										<a href="https://panuworld.net/nuukiaworld/download/nokix/rtttl.htm" target="_blank">
											NuukiaWorld: panuworld.net/nuukiaworld/download/nokix/rtttl.htm
										</a>
									</li>
								</ol>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
