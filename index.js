'use strict';
const fs = require('fs');
const puppeteer = require('puppeteer');
const $ = require('cheerio');
const download = require('image-downloader');
const filenamify = require('filenamify');

function createDirSync(dirName) {
	if (!fs.existsSync(dirName)) {
		fs.mkdirSync(dirName);
	}
}

module.exports = async () => {
	const url = 'https://www.archiprix.org/2019/?m=22';
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url);
	await page.waitFor(1000);
	const html = await page.content();
	const projectBaseUrl = 'http://www.archiprix.org/2019/?project=';
	const projectIds = [];

	console.log('Getting project Ids');
	$('.project-thumb', html).each(function () {
		const id = $(this).prop('data-id');
		projectIds.push(id);
	});
	console.log(`Project ids obtained: ${projectIds.length}`);

	const projectsDir = './projects';
	const postsDir = projectsDir + '/_posts';
	const imagesDir = projectsDir + '/images';
	createDirSync(projectsDir);
	createDirSync(postsDir);
	createDirSync(imagesDir);
	const date = new Date().toISOString().slice(0, 10);

	// Uncomment for iterating through all projects
	// for (let i = 0; i < projectIds.length; ++i) {
	/* eslint-disable no-await-in-loop */
	for (let i = 0; i < 10; ++i) {
		console.log(`Processing project ${i + 1} out of ${projectIds.length}`);
		const id = projectIds[i];
		const projectUrl = projectBaseUrl + id;

		try {
			await page.goto(projectUrl);
			await page.waitFor(500);
		} catch (error) {
			console.error(error);
			continue;
		}

		const html = await page.content();
		const title = $('.project-title', html).text();
		console.log('  > ' + title);
		const formattedTitle =
			filenamify(title.toLowerCase(), {replacement: '-'});

		const projectFilePath = postsDir +
			'/' + date + '-' + formattedTitle + '.md';

		$('.project-image', html).each(async function () {
			const src = $(this).prop('src');
			const regex = /(?<=\.\.)\/projects.*(?=\.jpg)/g;
			const groups = src.match(regex);
			const url = 'http://www.archiprix.org' +
				groups[0] + '_blowup.jpg';

			console.log(`  Downloading ${url}`);

			const imageName = url.match(/[^\s/]*\.jpg/);
			const imageFilePath = imagesDir +
				'/' + imageName;
			const options = {
				url, dest: imageFilePath
			};
			await download.image(options);
			fs.appendFileSync(projectFilePath,
				`\n\n![]({{site.url}}/images/${imageName})`);
		});

		let projectText =
			$('.project-text', html).text();

		projectText = `---
layout: post
title: "${title}"
---
# [${title}](${projectUrl})
${projectText}
`;

		fs.appendFileSync(projectFilePath, projectText);
	}
	browser.close();
};
