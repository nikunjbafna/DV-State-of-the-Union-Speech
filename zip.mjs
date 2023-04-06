/**
 * creates a zip file to submit assignment
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { exec } from 'node:child_process';
import glob from 'fast-glob';
import JSZip from 'jszip';
import pkg from './package.json' assert { type: 'json' };

// Template for the zip file name
const EXPORT_FILE = `${pkg.author}_${pkg.name}.zip`;

const createZip = () => {
	const zip = new JSZip();

	const filePaths = glob.sync('**/*', {
		realpath: true,
		cwd: '.',
		ignore: ['.vscode/**/*', 'node_modules/**/*', 'zip.js'],
	});

	for (let f of filePaths) {
		zip.file(f, readFileSync(f));
	}

	/* cspell:disable-next-line nodebuffer */
	zip.generateAsync({ type: 'nodebuffer' }).then(function (content) {
		writeFileSync(EXPORT_FILE, content);
	});
};

exec('npm run build', (err) => {
	// if there is an error after building project
	// do not create zip file
	if (err) {
		console.log(err);
		return;
	}

	createZip();
});
