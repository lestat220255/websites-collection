// 一次性把 sites.json 里所有站点的 favicon 下载到 public/favicons/，
// 并生成 src/favicons.json（域名 -> 文件名）供 App.jsx 使用。
// 用法: npm run favicons
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const SITES_JSON = new URL('../public/sites.json', import.meta.url);
const OUT_DIR = new URL('../public/favicons/', import.meta.url);
const MAP_FILE = new URL('../src/favicons.json', import.meta.url);

function hostOf(url) {
	try {
		const u = new URL(/^https?:\/\//i.test(url) ? url : 'http://' + url);
		return u.hostname.replace(/^www\./, '').toLowerCase();
	} catch {
		return null;
	}
}

async function fetchOne(url, dest) {
	const src = 'https://www.google.com/s2/favicons?sz=64&domain_url=' + encodeURIComponent(url);
	const res = await fetch(src);
	if (!res.ok) throw new Error('HTTP ' + res.status);
	const buf = Buffer.from(await res.arrayBuffer());
	if (buf.length < 120) throw new Error('response too small');
	writeFileSync(dest, buf);
}

const sites = JSON.parse(readFileSync(SITES_JSON, 'utf8'));
mkdirSync(OUT_DIR, { recursive: true });

const jobs = [];
for (const section of sites) {
	for (const w of section.list) {
		const host = hostOf(w.url);
		if (host) jobs.push({ host, url: w.url });
	}
}
// 按域名去重
const uniq = [...new Map(jobs.map((j) => [j.host, j])).values()];
console.log('total unique hosts:', uniq.length);

const map = {};
let ok = 0,
	fail = 0;
const CONCURRENCY = 8;
for (let i = 0; i < uniq.length; i += CONCURRENCY) {
	const batch = uniq.slice(i, i + CONCURRENCY);
	await Promise.all(
		batch.map(async ({ host, url }) => {
			const filename = host + '.png';
			try {
				await fetchOne(url, new URL(filename, OUT_DIR));
				map[host] = filename;
				ok++;
			} catch (e) {
				fail++;
				console.log('FAIL', host, '-', e.message);
			}
		})
	);
}
writeFileSync(MAP_FILE, JSON.stringify(map, null, 2) + '\n');
console.log(`done: ok=${ok} fail=${fail} (失败的站点运行时回退到 google s2)`);
