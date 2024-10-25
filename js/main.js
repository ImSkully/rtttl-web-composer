/*	  ____  ______ ______ ______ __		  ______
*	 / __ \/_  __//_  __//_  __// /		 / ____/____   ____ ___   ____   ____   _____ ___   _____
*	/ /_/ / / /    / /    / /  / /		/ /    / __ \ / __ `__ \ / __ \ / __ \ / ___// _ \ / ___/
*  / _, _/ / /    / /    / /  / /___   / /___ / /_/ // / / / / // /_/ // /_/ /(__  )/  __// /
* /_/ |_| /_/    /_/    /_/  /_____/   \____/ \____//_/ /_/ /_// .___/ \____//____/ \___//_/
*			https://github.com/ImSkully/rtttl-web-composer	 /_*/

// DOM elements.
const ELEMENTS = {
	COMPOSER_TABLE: $("#composer-table"),
	RTTL_OUTPUT_BOX: $("#rtttl-output-textbox"),
	OCTAVE_SELECTOR: $("#octave-selector"),
	BPM_SLIDER: $("#bpm-slider"),
	DURATION_SELECTOR: $("#duration-selector"),
	BPM_INPUT: $("#bpm-input"),
	BUTTON: {
		PLAY: $("#radio-toolbar-play"),
		STOP: $("#radio-toolbar-stop"),
		LOAD_FROM_TEXTAREA: $("#radio-toolbar-load-from-textarea")
	}
};

/** Global variables and static definitions. */
const GLOBALS = {
	/** The number of note columns to create within the composer table. */
	COMPOSER_NOTE_COLUMNS: 64,

	/** Middle C note used for frequency calculations, see: https://en.wikipedia.org/wiki/C_(musical_note)#Middle_C */
	MIDDLE_C: 261.63,

	/** Pause note. */
	PAUSE_NOTE: "p",

	/** RTTTL note duration values. */
	DURATION_VALUES: [1, 2, 4, 8, 16, 32],

	/** RTTTL note octave values. */
	OCTAVE_VALUES: [4, 5, 6, 7],

	/** RTTTL note BPM values. */
	BPM_VALUES: [
		5, 28, 31, 35, 40, 45, 50, 56, 63, 70, 80, 90, 100,
		112, 125, 140, 160, 180, 200, 225, 250, 285, 320, 355,
		400, 450, 500, 565, 635, 715, 800, 900
	],

	/**
	 * Default control values, adopted from the RTTTL standard:
	 * > "defaults are 4=duration, 6=scale, 63=beats-per-minute"
	 */
	DEFAULT: { DURATION: 4, OCTAVE: 6, BPM: 63 },

	/** RTTTL note labels. */
	NOTE_LABELS: ["b", "a#", "a", "g#", "g", "f#", "f", "e", "d#", "d", "c#", "c"], // Must match exactly as it appears in frontend table.
};

/*
	COMPOSED_NOTES = [
		{
			row: int, // The composer table row index.
			column: int, // The composer table column index.
			note: string, // The note label, a value from NOTE_LABELS.
			duration: int, // The playback duration.
			octave: int // The note octave.
		},
		...
	];
*/
/** Array containing the currently active notes in the composer table. */
const COMPOSED_NOTES = [];

/**
 * The RTTTL audio player and controller data object.
 */
const RTTTL = {
	/** The AudioPlayer handles RTTTL playback via Web Audio API. */
	AudioPlayer: (() => {
		let context, noteVolume, oscillator, playbackTimeout;
		let highlighterTimeouts = [];
		let isPlaying = false;
		let elapsedTime = 0;

		/**
		 * Initializes the audio context and audio playback components, called once on first playback.
		 * This is necessary as the audio context must be initialized after user interaction.
		 */
		const init = () => {
			if (context) return; // Already initialized.

			// Initialize the audio context.
			context = new (window.AudioContext || window.webkitAudioContext)();

			// Create a gain node for volume control and connect it to the destination.
			const gainNode = context.createGain();
			gainNode.gain.value = 0.1; // TODO: Make this adjustable on the frontend.
			gainNode.connect(context.destination);

			// Create the oscillator and connect it to the gain node.
			noteVolume = context.createGain();
			noteVolume.connect(gainNode);
			noteVolume.gain.value = 0; // Initially muted.

			oscillator = context.createOscillator();
			oscillator.start(0); // Start immediately (but muted).
			oscillator.connect(noteVolume);
		};

		/**
		 * Starts audio playback of the RTTTL tune.
		 */
		const start = () => {
			if (isPlaying) return; // Do nothing if already playing.
			if (!context) init(); // Initialize the audio context if not already done.

			// Disable play button and enable stop button.
			ELEMENTS.BUTTON.PLAY.attr("disabled", true);
			ELEMENTS.BUTTON.STOP.attr("disabled", false);
			ELEMENTS.BUTTON.LOAD_FROM_TEXTAREA.attr("disabled", true);

			context.resume();
			isPlaying = true;

			let currentPlaybackTime = context.currentTime + 0.05; // Start time with a slight delay.
			elapsedTime = currentPlaybackTime;

			COMPOSED_NOTES.forEach((note, index) => {
				// Determine note duration and frequency.
				const dotted = false; // TODO: Implement dot notation support.
				const duration = (240 / RTTTL.PLAYER.BPM / (note.duration || RTTTL.PLAYER.DURATION)) * (dotted ? 1.5 : 1);

				// Schedule the note if it's not a pause tone.
				if (note.note !== GLOBALS.PAUSE_NOTE) {
					const octave = note.octave || RTTTL.PLAYER.OCTAVE;
					const frequency = GLOBALS.MIDDLE_C * 2 ** (octave - 4 + (11 - GLOBALS.NOTE_LABELS.indexOf(note.note)) / 12);

					oscillator.frequency.setValueAtTime(frequency, currentPlaybackTime); // Set note frequency.
					noteVolume.gain.setValueAtTime(0, currentPlaybackTime); // Mute note initially.
					noteVolume.gain.linearRampToValueAtTime(1, currentPlaybackTime + 0.01); // Fade in.
					noteVolume.gain.exponentialRampToValueAtTime(1, currentPlaybackTime + duration - 0.04); // Sustain.
					noteVolume.gain.linearRampToValueAtTime(0, currentPlaybackTime + duration - 0.01); // Fade out.
				}

				// Attach a timeout to highlight the current note's column.
				const highlighter = setTimeout(() => {
					if (!isPlaying) return;
					// Clear previous highlight.
					ELEMENTS.COMPOSER_TABLE.find(".playback-highlighter").removeClass("playback-highlighter");

					// Highlight current note's column.
					ELEMENTS.COMPOSER_TABLE.find(`[column="${index + 1}"]`).addClass("playback-highlighter");
				}, (currentPlaybackTime - context.currentTime) * 1000); // Ensure the timeout matches playback time.

				highlighterTimeouts.push(highlighter);

				// Increment the current playback time.
				currentPlaybackTime += duration;
				elapsedTime = currentPlaybackTime;
			});

			// Schedule stop after all notes have been played.
			playbackTimeout = setTimeout(stop, (elapsedTime - context.currentTime) * 1000);
			console.debug(`[AudioPlayer] @start(): Playback started for ${elapsedTime - context.currentTime} seconds.`);
		};

		/**
		 * Stops audio playback of the RTTTL tune.
		 */
		const stop = () => {
			if (!context) return; // Do nothing if the audio context is not initialized.

			// Reset playback variables and audio objects.
			clearTimeout(playbackTimeout);

			// Clear all highlight timeouts to stop highlighting after playback is stopped.
			highlighterTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
			highlighterTimeouts = [];

			const currentTime = context.currentTime;
			oscillator.frequency.cancelScheduledValues(currentTime); // Cancel frequency ramps.
			noteVolume.gain.cancelScheduledValues(currentTime); // Cancel volume ramps.
			noteVolume.gain.linearRampToValueAtTime(0, currentTime + 0.1); // Fade out.
			isPlaying = false;

			// Reset relevant UI elements.
			ELEMENTS.COMPOSER_TABLE.find(".playback-highlighter").removeClass("playback-highlighter");
			ELEMENTS.BUTTON.PLAY.attr("disabled", false);
			ELEMENTS.BUTTON.STOP.attr("disabled", true);
			ELEMENTS.BUTTON.LOAD_FROM_TEXTAREA.attr("disabled", false);
		};

		return { start, stop, isPlaying: () => isPlaying };
	})(),

	/** The RTTTL player settings and state. */
	PLAYER: {
		DURATION: GLOBALS.DEFAULT.DURATION,
		BPM: GLOBALS.DEFAULT.BPM,
		OCTAVE: GLOBALS.DEFAULT.OCTAVE,
		SONG_NAME: "Untitled",
		STRING_OUTPUT: ""
	}
};

/**
 * Populates the composer table with note rows and dropdown selectors.
 */
function createComposerTable() {
	// Prepare note rows.
	const noteRows = GLOBALS.NOTE_LABELS.map((_, row) => {
		const cells = Array.from({ length: GLOBALS.COMPOSER_NOTE_COLUMNS }, (_, column) => `<td row="${row}" column="${column}"></td>`).join("");
		return `<tr>${cells}</tr>`;
	}).join("");

	// Helper function to generate dropdown row with IDs.
	const createDropdownRow = (options) => {
		const cells = Array.from({ length: GLOBALS.COMPOSER_NOTE_COLUMNS }, (_, column) => `<td>${options(column)}</td>`).join("");
		return `<tr>${cells}</tr>`;
	};

	// Dropdown generators.
	const dropdownOptions = {
		duration: id => `
		<select id="duration-note-${id}" class="form-select-sm">
			<option selected value="0">d</option>
			` + GLOBALS.DURATION_VALUES.map(v => `<option value="${v}">${v}</option>`).join("") + `
		</select>`,
		octave: id => `
		<select id="octave-note-${id}" class="form-select-sm w-100">
			<option selected value="0">o</option>
			` + GLOBALS.OCTAVE_VALUES.map(v => `<option value="${v}">${v}</option>`).join("") + `
		</select>`
	};

	// Assemble the full table grid and append it to the composer table.
	ELEMENTS.COMPOSER_TABLE.html(`
        <tbody>
            ${noteRows}
            ${createDropdownRow(dropdownOptions.duration)}
            ${createDropdownRow(dropdownOptions.octave)}
        </tbody>
    `);
}

/**
 * Resets the composer table cells and dropdowns to their default state, this does NOT reset the RTTTL controls.
 */
function resetComposerTable() {
	ELEMENTS.COMPOSER_TABLE.find(".tone-enabled").removeClass("tone-enabled"); // Clear all enabled note cells.
	if (RTTTL.AudioPlayer.isPlaying()) RTTTL.AudioPlayer.stop(); // If playback is active, stop it.

	$("[id^=\"duration-note-\"]").prop("selectedIndex", 0); // Reset all note duration dropdowns.
	$("[id^=\"octave-note-\"]").prop("selectedIndex", 0); // Reset all note octave dropdowns.
}

/**
 * Generates the RTTTL output from the COMPOSED_NOTES array and updates the RTTTL text output box.
 */
function generateRTTTL() {
	// Initialize the RTTTL output with the current player settings.
	RTTTL.PLAYER.STRING_OUTPUT = `${RTTTL.PLAYER.SONG_NAME}:d=${RTTTL.PLAYER.DURATION},o=${RTTTL.PLAYER.OCTAVE},b=${RTTTL.PLAYER.BPM}:`;

	// Remove any pause notes so they can be redetermined.
	COMPOSED_NOTES.forEach((note, index) => note.note === GLOBALS.PAUSE_NOTE && delete COMPOSED_NOTES[index]);

	// Go through each note in the COMPOSED_NOTES array and generate the RTTTL string.
	let previousColumn = -1; // Track the column index of the last note for calculating pauses.
	for (let column = 0; column < COMPOSED_NOTES.length; column++) {
		const note = COMPOSED_NOTES[column];

		// Skip undefined entries in case a note was deleted.
		if (!note) continue;

		// Calculate pauses if there's a gap between the current column and the previous column (or if it's the first note not in column 0).
		if (previousColumn === -1 || column > previousColumn + 1) {
			for (let i = previousColumn + 1; i < column; i++) {
				const pauseDuration = +$(`#duration-note-${i}`).val(); // Get the duration for this pause note.
				RTTTL.PLAYER.STRING_OUTPUT += `${pauseDuration || ""}p,`;

				// Insert a pause note into COMPOSED_NOTES.
				COMPOSED_NOTES[i] = {
					row: 0, // Row for pause is always 0.
					column: i,
					note: GLOBALS.PAUSE_NOTE,
					duration: pauseDuration,
					octave: 0 // Octave for pause is always 0.
				};
			}
		}

		// Add the note to the RTTTL string.
		RTTTL.PLAYER.STRING_OUTPUT += `${note.duration || ""}${note.note}${note.octave || ""},`;

		// Update previous column index.
		previousColumn = column;
	}

	// Remove trailing comma at the end of the generated string.
	RTTTL.PLAYER.STRING_OUTPUT = RTTTL.PLAYER.STRING_OUTPUT.replace(/,$/, "");
	ELEMENTS.RTTL_OUTPUT_BOX.val(RTTTL.PLAYER.STRING_OUTPUT); // Update the RTTTL output box.

	console.debug("@generateRTTTL():", COMPOSED_NOTES);
}

/**
 * Loads the RTTTL data from the output textarea.
 */
function loadFromTextArea() {
	const loadedNoteText = ELEMENTS.RTTL_OUTPUT_BOX.val();
	if (!loadedNoteText) return;

	// Reset the composer table to clear all notes and settings.
	resetComposerTable();

	/*
		Attempt to extract all required sections of the RTTTL string, every RTTTL is composed of
		three sections separated by colons (:)
			- Section 1 (toneName): 	Tone name
			- Section 2 (toneSettings):	Default settings with key=value options (d, o, b) separated by commas (,)
			- Section 3 (notesData): 	The actual note data separated by commas (,)
	*/

	console.debug(`@loadFromTextArea(): Loading RTTTL string '${loadedNoteText}'..`);

	const RTTTLSections = loadedNoteText.split(":");
	if (RTTTLSections.length < 3) return console.error(`Invalid RTTTL string, expected 3 sections but got ${RTTTLSections.length}.`);

	/**
	 * [Section 1]
	 * Get the tone name.
	 */
	const toneName = RTTTLSections[0].trim();
	RTTTL.PLAYER.SONG_NAME = toneName;

	/**
	 * [Section 2] Tone Settings
	 * Get the tone settings and parse all options into a settings object.
	 * e.g. 'd=4,o=5,b=104' => { d: 4, o: 5, b: 104 }
	 */
	const toneSettings = Object.fromEntries(
		RTTTLSections[1]
			.toLowerCase()
			.replace(/\s/g, "")
			.split(",")
			.map(e => e.split("=").map((v, i) => (i === 1 ? parseInt(v) : v)))
	);

	// Validate that all required settings are present.
	if (!toneSettings.d || !GLOBALS.DURATION_VALUES.includes(toneSettings.d)) {
		console.warn(`@loadFromTextArea(): Missing or invalid default duration (d=${toneSettings.d}) setting, using default.`);
		toneSettings.d = GLOBALS.DEFAULT.DURATION;
	}

	if (!toneSettings?.o || !GLOBALS.OCTAVE_VALUES.includes(toneSettings.o)) {
		console.warn(`@loadFromTextArea(): Missing or invalid default octave (o=${toneSettings.o}) setting, using default.`);
		toneSettings.o = GLOBALS.DEFAULT.OCTAVE;
	}

	if (!toneSettings?.b) {
		console.warn(`@loadFromTextArea(): Missing default BPM (b=${toneSettings.b}) setting, using default.`);
		toneSettings.b = GLOBALS.DEFAULT.BPM;
	}

	// Load the duration.
	ELEMENTS.DURATION_SELECTOR.val(toneSettings.d);
	RTTTL.PLAYER.DURATION = toneSettings.d;

	// Load the octave.
	ELEMENTS.OCTAVE_SELECTOR.val(toneSettings.o);
	RTTTL.PLAYER.OCTAVE = toneSettings.o;

	// Load the BPM.
	setBPM(toneSettings.b, true);

	console.debug(`	[Settings] Duration: ${toneSettings.d} | Octave: ${toneSettings.o} | BPM: ${toneSettings.b}`);

	/**
	 * [Section 3] Notes Data
	 * Parse the note data and load it into the composer table.
	 */
	const notesData = RTTTLSections[2].toLowerCase().replace(/\s/g, "");

	notesData.split(/[,;]/).forEach((tone, i) => {
		let match = tone
			.replace(/\./g, "") // Remove dot notations (not currently supported).
			.match(/^(1|2|4|8|16|32)?(P|C|C#|D|D#|E|F|F#|G|G#|A|A#|B)(4|5|6|7)?$/i); // Match note data.

		// If no match, log a warning and skip this note.
		if (!match) return console.warn(`[PARSE] Invalid note: ${tone}`);

		let [raw, duration, note, octave] = match;

		// Set the note duration and octave if provided.
		if (duration) $(`#duration-note-${i}`).val(duration);
		if (octave) $(`#octave-note-${i}`).val(octave);

		// Load the note in the composer table.
		const noteCell = $(`[row="${GLOBALS.NOTE_LABELS.indexOf(note)}"][column="${i}"]`);
		toggleNote(noteCell, true);

		console.debug(`	[Tone] Added tone '${raw}'`, { duration, note, octave });
	});

	generateRTTTL();
}

/**
 * Sets the BPM value and updates the RTTTL output.
 *
 * @param {number}	bpm 			The BPM value to set.
 * @param {boolean} skipGenerate 	Whether to skip generating the RTTTL output to the textarea.
 */
function setBPM(bpm, skipGenerate = false) {
	// Find the closest BPM value in the table.
	RTTTL.PLAYER.BPM = GLOBALS.BPM_VALUES.reduce((prev, curr) => (Math.abs(curr - parseInt(bpm)) < Math.abs(prev - parseInt(bpm)) ? curr : prev));
	ELEMENTS.BPM_SLIDER.val(RTTTL.PLAYER.BPM);
	ELEMENTS.BPM_INPUT.val(RTTTL.PLAYER.BPM);
	if (!skipGenerate) generateRTTTL();
}

/**
 * Sets the octave value for a note in the COMPOSED_NOTES array.
 *
 * @param {number} octave 	The octave value to set.
 * @param {number} index 	The index of the note in the COMPOSED_NOTES array.
 */
function setOctave(octave, index) {
	if (COMPOSED_NOTES[index]) COMPOSED_NOTES[index].octave = octave * 1;
	generateRTTTL();
}

/**
 * Sets the duration value for a note in the COMPOSED_NOTES array.
 *
 * @param {number} duration The duration value to set.
 * @param {number} index 	The index of the note in the COMPOSED_NOTES array.
 */
function setDuration(duration, index) {
	if (COMPOSED_NOTES[index]) COMPOSED_NOTES[index].duration = duration * 1;
	generateRTTTL();
}

/**
 * Toggles the note enabled state in the composer table.
 *
 * @para  {jQuery}	noteCell 		The note cell to toggle.
 * @param {boolean} skipGenerate 	Whether to skip generating the RTTTL output to the textarea.
 */
function toggleNote(noteCell, skipGenerate = false) {
	// Toggle this note's enabled state.
	noteCell.toggleClass("tone-enabled");

	const column = +noteCell.attr("column"); // Horizontal position (0-63).
	const row = +noteCell.attr("row"); // Vertical position (0-11).
	const isEnabled = noteCell.hasClass("tone-enabled");

	// If the note is being disabled.
	if (isEnabled) {
		const note = GLOBALS.NOTE_LABELS[row];
		const duration = +$(`#duration-note-${column}`).val();
		const octave = +$(`#octave-note-${column}`).val();

		// Push to the COMPOSED_NOTES array.
		COMPOSED_NOTES[column] = { row, column, note, duration, octave };
	} else {
		// Remove the note from the COMPOSED_NOTES array.
		delete COMPOSED_NOTES[column];
	}

	// Regenerate the RTTTL output if not skipping.
	if (!skipGenerate) generateRTTTL();
}

$(() => {
	// Initialize the table.
	createComposerTable();

	// Generate the initial RTTTL output.
	generateRTTTL();

	// Debugging RTTTL strings.
	// ELEMENTS.RTTL_OUTPUT_BOX.val("test_one:d=4,o=5,b=225:c4,1c#5,2d6,4p,e7");
	// ELEMENTS.RTTL_OUTPUT_BOX.val("test_two:d=8,o=5,b=140:c,4p,c,4p,g,4p,g,4p,4a,4b,4c6,4a,4g,4p,f,4p,f,4p,e,4p,e,4p,d,4p,d,4p,4c");
	// ELEMENTS.RTTL_OUTPUT_BOX.val("test_three:d=4,o=6,b=63:c,c#,d,d#,e,f,f#,g,g#,a,a#,b");

	/*========================================================================
	# 						Register Event Listeners 						 #
	========================================================================*/

	// Table cell click event listener.
	ELEMENTS.COMPOSER_TABLE.on("click", "td, th", function (e) {
		let note = $(e.target);
		if (note.html() !== "") return; // Only listen for clicks on note cells.

		// Clear all other notes in this column.
		if (!note.hasClass("tone-enabled")) ELEMENTS.COMPOSER_TABLE.find(`[column="${note.attr("column")}"]`).removeClass("tone-enabled");

		toggleNote(note);
	});

	// Duration and octave dropdown selectors, extracts the note index from the ID.
	$(document).on("change", "[id^=\"duration-note-\"]", function () { setDuration($(this).val(), $(this).attr("id").split("-")[2]); });
	$(document).on("change", "[id^=\"octave-note-\"]", function () { setOctave($(this).val(), $(this).attr("id").split("-")[2]); });

	// Global octave selector.
	ELEMENTS.OCTAVE_SELECTOR.on("change", () => {
		RTTTL.PLAYER.OCTAVE = ELEMENTS.OCTAVE_SELECTOR.val();
		generateRTTTL();
	});

	// Global duration selector.
	ELEMENTS.DURATION_SELECTOR.on("change", () => {
		RTTTL.PLAYER.DURATION = ELEMENTS.DURATION_SELECTOR.val();
		generateRTTTL();
	});

	ELEMENTS.BPM_SLIDER.on("input", () => { setBPM(ELEMENTS.BPM_SLIDER.val()); }); // BPM slider.
	ELEMENTS.BUTTON.PLAY.on("click", RTTTL.AudioPlayer.start); // Start playback.
	ELEMENTS.BUTTON.STOP.on("click", RTTTL.AudioPlayer.stop); // Stop playback.
	ELEMENTS.BUTTON.LOAD_FROM_TEXTAREA.on("click", loadFromTextArea); // Load RTTTL from text area.

	/*========================================================================
	# 							Keybind Event Listeners 					 #
	========================================================================*/

	$(document).on("keydown", (e) => {
		// Prevent keybinds from firing when typing in an input field.
		if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;

		const pressedKey = e.key.toLowerCase();

		// Spacebar (32): Toggles playback.
		if (pressedKey === " ") {
			e.preventDefault();
			if (RTTTL.AudioPlayer.isPlaying()) RTTTL.AudioPlayer.stop(); // Stop playback.
			else RTTTL.AudioPlayer.start(); // Start playback.
		}
		// O (79): Cycle through octaves.
		else if (pressedKey === "o") {
			if (RTTTL.PLAYER.OCTAVE < GLOBALS.OCTAVE_VALUES[GLOBALS.OCTAVE_VALUES.length - 1]) RTTTL.PLAYER.OCTAVE++;
			else RTTTL.PLAYER.OCTAVE = GLOBALS.OCTAVE_VALUES[0];
			ELEMENTS.OCTAVE_SELECTOR.val(RTTTL.PLAYER.OCTAVE);
			generateRTTTL();
		}
		// D (68): Cycle through durations.
		else if (pressedKey === "d") {
			if (RTTTL.PLAYER.DURATION < GLOBALS.DURATION_VALUES[GLOBALS.DURATION_VALUES.length - 1]) RTTTL.PLAYER.DURATION *= 2;
			else RTTTL.PLAYER.DURATION = GLOBALS.DURATION_VALUES[0];
			ELEMENTS.DURATION_SELECTOR.val(RTTTL.PLAYER.DURATION);
			generateRTTTL();
		}
		// V (86): Decrease BPM.
		else if (pressedKey === "v" && RTTTL.PLAYER.BPM > 5) {
			const currentIndex = GLOBALS.BPM_VALUES.indexOf(RTTTL.PLAYER.BPM);
			if (currentIndex !== -1 && currentIndex > 0) {
				const previousBPM = GLOBALS.BPM_VALUES[currentIndex - 1];
				setBPM(previousBPM);
			}
		}
		// B (66): Increase BPM.
		else if (pressedKey === "b") {
			const currentIndex = GLOBALS.BPM_VALUES.indexOf(RTTTL.PLAYER.BPM);
			if (currentIndex !== -1 && currentIndex < GLOBALS.BPM_VALUES.length - 1) {
				const nextBPM = GLOBALS.BPM_VALUES[currentIndex + 1];
				setBPM(nextBPM);
			}
		}
	});
});
