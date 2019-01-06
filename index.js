'use strict';
const fs = require('fs');
const puppeteer = require('puppeteer');
const $ = require('cheerio');
const download = require('download-file-sync');

function createDirSync(dirName) {
	if (!fs.existsSync(dirName)) {
		fs.mkdirSync(dirName);
	}
}

module.exports = async (input, options = {}) => {
	const url = 'https://www.archiprix.org/2019/?m=22';
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url);
	await page.waitFor(1000);
	const html = await page.content();
	const projectBaseUrl = 'http://www.archiprix.org/2019/?project=';
	let projectIds = [];

	console.log('Getting project Ids');
	$('.project-thumb', html).each(function () {
		const id = $(this).prop('data-id');
		projectIds.push(id);
	});
	console.log(`Project ids obtained: ${projectIds.length}`);

	const projectsDir = './projects';
	createDirSync(projectsDir);

	for (let i = 0; i < 5; ++i) {
		console.log(`Processing project ${i + 1} out of ${projectIds.length}`);
		const id = projectIds[i];
		const projectUrl = projectBaseUrl + id;
		await page.goto(projectUrl);
		await page.waitFor(500);
		const html = await page.content();
		const title = $('.project-title', html).text();
		console.log('  > ' + title);
		const dirTitle = id + '-' + title
			.replace(/\//, '')
			.replace(/\s+/g, '-')
			.toLowerCase();
		const projectDir = projectsDir + '/' + dirTitle;
		createDirSync(projectDir);

		const projectFilePath = projectDir +
			'/readme.md'
		fs.writeFileSync(projectFilePath, '# ' + title);

		let imageIndex = 1;
		$('.project-image', html).each(function () {
			const src = $(this).prop('src');
			const regex = /(?<=\.\.)\/projects.*(?=\.jpg)/g;
			const groups = src.match(regex);
			const url = 'http://www.archiprix.org' +
				groups[0] + '_blowup.jpg';

			console.log(`  Downloading ${url}`);
			const data = download(url);
			const imageName = id + '-' + imageIndex + '.jpg';
			const imageFilePath = projectDir +
				'/' + imageName;
			if (!fs.existsSync(imageFilePath)) {
				console.log(`  Downloading ${url}`);
				fs.writeFileSync(imageFilePath, data);
				console.log(`  Written into ${imageFilePath}`);
			} else {
				console.log(`  ${imageFilePath} already exists`);
			}

			fs.appendFileSync(projectFilePath,
				`\n\n[](${imageName})`);
			++imageIndex;
		});

		fs.appendFileSync(projectFilePath,'\n\n');

		const projectText =
			$('.project-text', html).text()

		fs.appendFileSync(projectFilePath, projectText);
	}
	browser.close();
};
