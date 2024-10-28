import { Head } from "$fresh/runtime.ts";

export default async function RTTTLSpecification() {
	// Load RTTTL Specifications from files.
	const RTTTL_SPECIFICATIONS = {
		["1.0.0"]: await Deno.readTextFile("./routes/specs/rtttl_1.0.0.txt"),
		["1.1.0"]: await Deno.readTextFile("./routes/specs/rtttl_1.1.0.txt"),
		["NuukiaWorld"]: await Deno.readTextFile("./routes/specs/rtttl_nuukiaworld.txt"),
	};

	return (
		<>
			<Head>
				<title>RTTTL Specification</title>
			</Head>
			<div class="container-xl">
				<div class="container-xl">
					<div class="card">
						<div class="card-body">
							<h1 class="mb-3">Ring Tone Text Transfer Language (RTTTL)</h1>
							<p>
								The official specification for <abbr title="Ring Tone Text Transfer Language">RTTTL</abbr> <em>(Previously referred to as Nokring)</em>
								was originally developed in 1996 by Nokia<sup>1</sup>
								for use in their mobile phones back when they were the dominant force in the mobile phone market and the most common method of composing, and
								sharing ringtones was through text messages. The format was simple and easy to understand which made its adoption quite popular though was quickly
								replaced by more modern formats such as <abbr title="Musical Instrument Digital Interface">MIDI</abbr>
								and MP3 ringtones which offered more features and better sound quality.
							</p>
							<p>
								The RTTTL format is still used today in some applications and devices such as hobbyist Arduino projects, ESP8266, and ESP32 IoT devices, and some
								older mobile phones.
							</p>

							<h2>How It Works</h2>
							<p>
								An RTTTL string is divided into three sections that are separated by colons <code>:</code>
								and collectively contain everything necessary to play a ringtone.
							</p>
							<p>
								Take the following RTTTL string below as an example:
								<pre><span class="text-red">Bethoven</span>:<span class="text-yellow">d=4,o=5,b=160</span>:<span class="text-green">c,e,c,g,c,c6,8b,8a,8g,8a,8g,8f,8e,8f,8e,8d,c,e,g,e,c6,g.</span></pre>
							</p>

							<h3>
								Part 1: Name Section (<code class="text-red">Bethoven</code>)
							</h3>
							<p>The name of the ringtone, this is normally not used by the player but is useful for identifying the ringtone.</p>

							<h3>
								Part 2: Control Section (<code class="text-yellow">d=4,o=5,b=160</code>)
							</h3>
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
												The <a href="https://en.wikipedia.org/wiki/Duration_(music)" target="_blank" class="fw-bold">duration</a>
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
														<tr>
															<td>
																<code>1</code>
															</td>
															<td>
																A full note (<sup>1</sup>&frasl;<sub>1</sub>)
															</td>
														</tr>
														<tr>
															<td>
																<code>2</code>
															</td>
															<td>A half note (&#189;)</td>
														</tr>
														<tr>
															<td>
																<code>4</code>
															</td>
															<td>A quarter note (&#188;)</td>
														</tr>
														<tr>
															<td>
																<code>1</code>
															</td>
															<td>An eighth note (&#8539;)</td>
														</tr>
														<tr>
															<td>
																<code>16</code>
															</td>
															<td>
																A sixteenth note (<sup>1</sup>&frasl;<sub>16</sub>)
															</td>
														</tr>
														<tr>
															<td>
																<code>32</code>
															</td>
															<td>
																A thirty-second note (<sup>1</sup>&frasl;<sub>32</sub>)
															</td>
														</tr>
													</tbody>
												</table>
											</div>
										</div>
									</div>
									{/* Octave */}
									<div id="rtttl-control-o" class="card tab-pane" role="tabpanel">
										<div class="card-body">
											<p>
												The <a href="https://en.wikipedia.org/wiki/Octave" target="_blank" class="fw-bold">octave</a> of the note
												<em>
													(also referred to as <u>scale</u> or <u>pitch</u>)
												</em>
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
														<tr>
															<td>
																<code>4</code>
															</td>
															<td>Note A is 440Hz</td>
														</tr>
														<tr>
															<td>
																<code>5</code>
															</td>
															<td>Note A is 880Hz</td>
														</tr>
														<tr>
															<td>
																<code>6</code>
															</td>
															<td>Note A is 1.76 kHz</td>
														</tr>
														<tr>
															<td>
																<code>7</code>
															</td>
															<td>Note A is 3.52 kHz</td>
														</tr>
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
												</em>) which is the speed at which the note is played. The <abbr title="beats per minute">BPM</abbr>
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

							<h3>
								Part 3: Tone Commands (<code class="text-green">c,e,c,g,c,c6,8b,8a,8g,8a,8g,8f,8e,8f,8e,8d,c,e,g,e,c6,g.</code>)
							</h3>
							<p>
								The tone commands section contains the notes that make up the ringtone. Each note is separated by a comma <code>,</code> character.
							</p>

							{/* Specifications Section */}
							<div class="hr-text">
								<span>RTTTL Specifications</span>
							</div>

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
							<div class="hr-text">
								<span>References</span>
							</div>
							<div class="alert alert-secondary mt-3">
								<ol>
									<li>
										RTTTL is not a well documented format and is a relatively niche piece of historical technology which was quickly replaced by more modern
										formats such as MIDI and MP3 ringtones. There is very little information available on the modern internet today regarding the language,
										original authors, etc. with citations.
									</li>
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
