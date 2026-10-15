// 一次性迁移：public/sites.json 扁平 20 分组 -> { pinned, sectors } 扇区嵌套结构
// 用法：node scripts/migrate-sectors.mjs（在仓库根目录执行）
import { readFileSync, writeFileSync } from 'node:fs';

const SECTOR_DEF = [
	{
		id: 'ai-lab', name: 'AI LAB', icon: 'CpuChipIcon', color: 'neon',
		groups: ['Generative AI', 'Playground'],
	},
	{
		id: 'dev-forge', name: 'DEV FORGE', icon: 'WrenchIcon', color: 'lime',
		groups: ['工具', '学习/技术栈', 'Tutorials', '环境', 'PC DIY'],
	},
	{
		id: 'tracker-net', name: 'TRACKER NET', icon: 'GlobeAltIcon', color: 'amber',
		groups: ['PT站', 'Semi-private Trackers', 'Public Trackers', 'Porn Private Trackers'],
	},
	{
		id: 'comm-link', name: 'COMM LINK', icon: 'ChatBubbleLeftRightIcon', color: 'magenta',
		groups: ['社区', '游戏社区', 'Fediverse|联邦宇宙|去中心化社区群'],
	},
	{
		id: 'media-deck', name: 'MEDIA DECK', icon: 'PlayIcon', color: 'violet',
		groups: ['流媒体', '播客', 'HIFI'],
	},
	{
		id: 'data-vault', name: 'DATA VAULT', icon: 'ArchiveBoxIcon', color: 'sky',
		groups: ['百科', 'Future'],
	},
];

const raw = JSON.parse(readFileSync('public/sites.json', 'utf8'));
if (!Array.isArray(raw)) {
	console.error('sites.json 已是新结构，跳过迁移');
	process.exit(0);
}
const byName = Object.fromEntries(raw.map((g) => [g.name, g]));

const sectors = SECTOR_DEF.map((sd) => ({
	id: sd.id,
	name: sd.name,
	icon: sd.icon,
	color: sd.color,
	groups: sd.groups.map((n) => {
		const g = byName[n];
		if (!g) throw new Error('缺少分组: ' + n);
		return { id: n, name: g.name, icon: g.icon, list: g.list };
	}),
}));

const pinned = byName['Pinned'] ? byName['Pinned'].list : [];

const used = new Set(['Pinned', ...SECTOR_DEF.flatMap((s) => s.groups)]);
const unused = raw.map((g) => g.name).filter((n) => !used.has(n));
if (unused.length) throw new Error('未分配的分组: ' + unused.join(', '));

const total = sectors.flatMap((s) => s.groups).flatMap((g) => g.list).length;
writeFileSync('public/sites.json', JSON.stringify({ pinned, sectors }, null, 2) + '\n');
console.log(`OK: pinned ${pinned.length} 站, ${sectors.length} 扇区, 共 ${total} 站`);
