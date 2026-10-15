import { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
	ChatBubbleBottomCenterTextIcon,
	ChatBubbleLeftRightIcon,
	MapPinIcon,
	PlayIcon,
	HomeIcon,
	BookOpenIcon,
	CloudIcon,
	SparklesIcon,
	StarIcon,
	Squares2X2Icon,
	TvIcon,
	ComputerDesktopIcon,
	GiftIcon,
	LinkIcon,
	WrenchIcon,
	RocketLaunchIcon,
	UserGroupIcon,
	SpeakerWaveIcon,
	FaceSmileIcon,
	FilmIcon,
	MagnifyingGlassIcon,
	CpuChipIcon,
	GlobeAltIcon,
	ArchiveBoxIcon,
	ChevronRightIcon,
	ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/solid';
import RocketButton from './components/RocketButton.jsx';
import FAVICON_MAP from './favicons.json';

const isCN = false;
const TITLE = "Lester's Curiosity Compass - Guides you to new discoveries.";

// favicon 优先用本地 public/favicons/（npm run favicons 生成），
// 下载失败的站点回退到 google s2（与之前线上行为一致）。
function getFavicon(url) {
	let host = null;
	try {
		host =
			new URL(/^https?:\/\//i.test(url) ? url : 'http://' + url).hostname
				.replace(/^www\./, '')
				.toLowerCase();
	} catch {
		/* ignore */
	}
	if (host && FAVICON_MAP[host]) return '/favicons/' + FAVICON_MAP[host];
	if (/https{0,1}:\/\//.test(url)) {
		return 'https://www.google.com/s2/favicons?sz=64&domain_url=' + url;
	}
	return 'https://www.google.com/s2/favicons?sz=64&domain_url=http://' + url;
}

const ICONS = {
	MapPinIcon,
	PlayIcon,
	HomeIcon,
	BookOpenIcon,
	CloudIcon,
	SparklesIcon,
	StarIcon,
	Squares2X2Icon,
	TvIcon,
	ComputerDesktopIcon,
	GiftIcon,
	LinkIcon,
	WrenchIcon,
	RocketLaunchIcon,
	UserGroupIcon,
	SpeakerWaveIcon,
	FaceSmileIcon,
	FilmIcon,
	ChatBubbleBottomCenterTextIcon,
	ChatBubbleLeftRightIcon,
	CpuChipIcon,
	GlobeAltIcon,
	ArchiveBoxIcon,
};

// 六扇区霓虹配色（类名必须写全，供 Tailwind 扫描）
const SECTOR_STYLE = {
	neon: {
		text: 'text-neon',
		border: 'border-neon',
		dimBorder: 'border-neon/30',
		bgSoft: 'bg-neon/10',
		glow: 'shadow-[0_0_24px_rgba(0,240,255,0.25)]',
		hex: '#00f0ff',
		rule: 'rgba(0,240,255,0.65)',
	},
	lime: {
		text: 'text-lime',
		border: 'border-lime',
		dimBorder: 'border-lime/30',
		bgSoft: 'bg-lime/10',
		glow: 'shadow-[0_0_24px_rgba(182,255,0,0.25)]',
		hex: '#b6ff00',
		rule: 'rgba(182,255,0,0.6)',
	},
	amber: {
		text: 'text-amber',
		border: 'border-amber',
		dimBorder: 'border-amber/30',
		bgSoft: 'bg-amber/10',
		glow: 'shadow-[0_0_24px_rgba(255,176,0,0.25)]',
		hex: '#ffb000',
		rule: 'rgba(255,176,0,0.65)',
	},
	magenta: {
		text: 'text-magenta',
		border: 'border-magenta',
		dimBorder: 'border-magenta/30',
		bgSoft: 'bg-magenta/10',
		glow: 'shadow-[0_0_24px_rgba(255,43,214,0.28)]',
		hex: '#ff2bd6',
		rule: 'rgba(255,43,214,0.65)',
	},
	violet: {
		text: 'text-violet',
		border: 'border-violet',
		dimBorder: 'border-violet/30',
		bgSoft: 'bg-violet/10',
		glow: 'shadow-[0_0_24px_rgba(160,107,255,0.28)]',
		hex: '#a06bff',
		rule: 'rgba(160,107,255,0.65)',
	},
	sky: {
		text: 'text-sky',
		border: 'border-sky',
		dimBorder: 'border-sky/30',
		bgSoft: 'bg-sky/10',
		glow: 'shadow-[0_0_24px_rgba(77,166,255,0.28)]',
		hex: '#4da6ff',
		rule: 'rgba(77,166,255,0.65)',
	},
};

function SectionIcon({ name, className }) {
	const Cmp = ICONS[name] || SparklesIcon;
	return <Cmp className={className} />;
}

function Clock() {
	const [now, setNow] = useState(() => new Date());
	useEffect(() => {
		const t = setInterval(() => setNow(new Date()), 1000);
		return () => clearInterval(t);
	}, []);
	const p = (n) => String(n).padStart(2, '0');
	return (
		<span className="tabular-nums">
			{p(now.getHours())}:{p(now.getMinutes())}:{p(now.getSeconds())}
		</span>
	);
}

// 右栏详情（桌面端第三栏 / 移动端详情页共用）
function SiteDetail({ site, sectorName, groupName, style }) {
	if (!site) {
		return (
			<div className="flex h-full min-h-[240px] items-center justify-center border-2 border-dashed border-line p-6 text-center">
				<p className="font-term text-xl tracking-widest text-dim">
					&gt; SELECT A NODE<span className="animate-blink text-magenta">▮</span>
				</p>
			</div>
		);
	}
	return (
		<div className={`border-2 bg-panel ${style.dimBorder} ${style.glow}`}>
			<div className={`border-b-2 px-4 py-2 font-term text-lg tracking-widest ${style.dimBorder}`}>
				<span className={style.text}>NODE</span>
				<span className="mx-2 text-line">//</span>
				<span className="text-dim">
					{sectorName} / {groupName}
				</span>
			</div>
			<div className="p-5">
				<div className="flex items-start gap-4">
					<img
						src={getFavicon(site.url)}
						alt=""
						loading="lazy"
						className="pixelated h-14 w-14 shrink-0 object-cover"
					/>
					<div className="min-w-0">
						<h4 className="text-lg font-bold leading-snug text-slate-100">{site.name}</h4>
						<p className="mt-1 truncate font-term text-lg tracking-wider text-dim">{site.url}</p>
					</div>
				</div>
				{site.desc && <p className="mt-4 text-[15px] leading-7 text-slate-300">{site.desc}</p>}
				{site.tips && (
					<div
						className="tips-body mt-4 border-l-2 pl-3 text-sm leading-6 text-dim"
						style={{ borderColor: style.hex }}
						dangerouslySetInnerHTML={{ __html: site.tips }}
					/>
				)}
				<a
					href={site.url}
					target="_blank"
					rel="noopener noreferrer"
					className={`pixel-corners mt-5 flex items-center justify-center gap-2 border-2 px-4 py-3 font-pixel text-[10px] transition-colors ${style.border} ${style.text} hover:bg-white hover:text-void`}
				>
					OPEN SITE
					<ArrowTopRightOnSquareIcon className="h-4 w-4" />
				</a>
			</div>
		</div>
	);
}

function App() {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [query, setQuery] = useState('');
	const [sectorIdx, setSectorIdx] = useState(0);
	const [groupIdx, setGroupIdx] = useState(0);
	const [siteIdx, setSiteIdx] = useState(0);
	const [focusCol, setFocusCol] = useState(1); // 1=小类栏 2=网站栏
	const [mobileView, setMobileView] = useState('sectors'); // sectors|groups|sites|detail
	const searchRef = useRef(null);

	useEffect(() => {
		fetch('sites.json')
			.then((r) => {
				if (!r.ok) throw new Error('HTTP ' + r.status);
				return r.json();
			})
			.then(setData)
			.catch((e) => setError(String(e)));
	}, []);

	// 从 hash 恢复扇区/分组
	useEffect(() => {
		if (!data) return;
		try {
			const [s, g] = location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
			if (!s) return;
			const si = data.sectors.findIndex((x) => x.id === s);
			if (si < 0) return;
			const gi = data.sectors[si].groups.findIndex((x) => x.id === g);
			setSectorIdx(si);
			setGroupIdx(gi < 0 ? 0 : gi);
			setSiteIdx(0);
			if (gi >= 0) setMobileView('sites');
			else setMobileView('groups');
		} catch {
			/* ignore */
		}
	}, [data]);

	const sector = data?.sectors[sectorIdx];
	const group = sector?.groups[groupIdx];
	const style = SECTOR_STYLE[sector?.color] || SECTOR_STYLE.neon;

	const visibleSites = useMemo(() => {
		if (!group) return [];
		return group.list.filter((w) => !(isCN && w.unavailableForCN));
	}, [group]);

	const selIdx = Math.min(siteIdx, Math.max(visibleSites.length - 1, 0));
	const selectedSite = visibleSites[selIdx];

	const sectorCounts = useMemo(() => {
		if (!data) return [];
		return data.sectors.map((s) => s.groups.flatMap((g) => g.list).length);
	}, [data]);

	const flatSites = useMemo(() => {
		if (!data) return [];
		const out = [];
		data.sectors.forEach((s) =>
			s.groups.forEach((g) =>
				g.list
					.filter((w) => !(isCN && w.unavailableForCN))
					.forEach((w) => out.push({ ...w, sector: s.name, sectorId: s.id, group: g.name, groupId: g.id }))
			)
		);
		if (data.pinned) data.pinned.forEach((w) => out.push({ ...w, sector: 'PINNED', sectorId: '', group: '' }));
		return out;
	}, [data]);

	const results = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return null;
		return flatSites.filter(
			(w) =>
				w.name.toLowerCase().includes(q) ||
				(w.desc && w.desc.toLowerCase().includes(q)) ||
				(w.group && w.group.toLowerCase().includes(q)) ||
				(w.sector && w.sector.toLowerCase().includes(q))
		);
	}, [query, flatSites]);

	const selectSector = (i) => {
		setSectorIdx(i);
		setGroupIdx(0);
		setSiteIdx(0);
		setFocusCol(1);
		setMobileView('groups');
		const s = data.sectors[i];
		if (s) location.hash = `/${s.id}`;
	};
	const selectGroup = (i) => {
		setGroupIdx(i);
		setSiteIdx(0);
		setFocusCol(2);
		setMobileView('sites');
		if (sector) location.hash = `/${sector.id}/${encodeURIComponent(sector.groups[i].id)}`;
	};
	const selectSite = (i) => {
		setSiteIdx(i);
		setMobileView('detail');
	};

	const randomWarp = () => {
		if (!flatSites.length) return;
		const pick = flatSites[Math.floor(Math.random() * flatSites.length)];
		window.open(pick.url, '_blank', 'noopener');
	};
	const openSite = (w) => {
		if (w) window.open(w.url, '_blank', 'noopener');
	};

	// 键盘导航
	useEffect(() => {
		const onKey = (e) => {
			const tag = document.activeElement?.tagName;
			if (tag === 'INPUT' || tag === 'TEXTAREA') {
				if (e.key === 'Escape') {
					setQuery('');
					searchRef.current?.blur();
				}
				return;
			}
			if (e.key === '/' && !query) {
				e.preventDefault();
				searchRef.current?.focus();
				return;
			}
			if (query) {
				if (e.key === 'Escape') setQuery('');
				return;
			}
			if (!data) return;
			if (e.key >= '1' && e.key <= String(data.sectors.length)) {
				selectSector(Number(e.key) - 1);
				return;
			}
			if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
				e.preventDefault();
				const d = e.key === 'ArrowDown' ? 1 : -1;
				if (focusCol === 1 && sector) {
					const n = sector.groups.length;
					const ni = Math.min(Math.max(groupIdx + d, 0), n - 1);
					if (ni !== groupIdx) selectGroup(ni);
				} else {
					const n = visibleSites.length;
					if (n) setSiteIdx(Math.min(Math.max(selIdx + d, 0), n - 1));
				}
				return;
			}
			if (e.key === 'ArrowRight') {
				e.preventDefault();
				setFocusCol(2);
				return;
			}
			if (e.key === 'ArrowLeft') {
				e.preventDefault();
				setFocusCol(1);
				return;
			}
			if (e.key === 'Enter') {
				openSite(selectedSite);
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	return (
		<div className="relative min-h-screen bg-void">
			<Helmet>
				<title>{TITLE}</title>
			</Helmet>

			{/* 背景层 */}
			<div className="bg-grid pointer-events-none fixed inset-0" aria-hidden />
			<div className="scanbeam animate-scan pointer-events-none fixed left-0 right-0 top-0" aria-hidden />
			<div className="scanlines pointer-events-none fixed inset-0 z-40 opacity-60" aria-hidden />
			<div className="vignette pointer-events-none fixed inset-0 z-40" aria-hidden />

			<div className="relative z-10">
				{/* HUD 顶栏 */}
				<div className="border-b border-line bg-panel/70 font-term text-lg tracking-widest text-dim">
					<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
						<span>
							<span className="text-neon">SYS.BOOT</span>
							<span className="mx-2 text-line">//</span>COMPASS v3.0
						</span>
						<span className="flex items-center gap-4">
							<span className="hidden sm:inline">
								SYS.TIME <Clock />
							</span>
							<span className="flex items-center gap-2">
								<span className="animate-pulse-dot inline-block h-2 w-2 rounded-full bg-lime text-lime" />
								<span className="text-lime">ONLINE</span>
							</span>
						</span>
					</div>
				</div>

				{/* 页眉 */}
				<header className="mx-auto flex max-w-7xl items-center gap-5 px-4 pb-2 pt-8 md:gap-7">
					<div className="pixel-corners shrink-0 bg-neon p-[3px]">
						<img
							src="/avatar.png"
							alt="avatar"
							className="pixel-corners pixelated block h-14 w-14 bg-void md:h-16 md:w-16"
						/>
					</div>
					<div className="min-w-0">
						<h1 className="title-3d font-pixel text-xs leading-loose text-slate-50 md:text-xl md:leading-relaxed">
							Lester's Curiosity Compass
						</h1>
						<p className="mt-2 font-term text-lg text-neon/90 md:text-xl">
							&gt; Guides you to new discoveries.
							<span className="animate-blink text-magenta">▮</span>
						</p>
					</div>
				</header>

				{/* 搜索 + 随机漫游 */}
				{data && !error && (
					<div className="mx-auto mt-6 flex max-w-7xl flex-col gap-3 px-4 sm:flex-row">
						<div className="relative flex-1">
							<MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neon" />
							<input
								ref={searchRef}
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="SEARCH DATABASE...  (按 / 快速聚焦)"
								className="w-full border-2 border-line bg-panel py-3 pl-11 pr-4 font-term text-xl tracking-widest text-slate-100 outline-none placeholder:text-dim/50 focus:border-neon"
							/>
						</div>
						<button
							onClick={randomWarp}
							className="pixel-corners flex items-center justify-center gap-2 border-2 border-magenta bg-panel px-5 py-3 font-pixel text-[10px] text-magenta transition-colors hover:bg-magenta hover:text-void"
						>
							<RocketLaunchIcon className="h-4 w-4" />
							RANDOM WARP
						</button>
					</div>
				)}

				{/* 内容区 */}
				<main className="mx-auto max-w-7xl px-4 pb-8">
					{error ? (
						<div className="mx-auto mt-16 max-w-md border-2 border-magenta bg-panel p-6 text-center">
							<p className="font-pixel text-xs text-magenta">LOAD ERROR</p>
							<p className="mt-4 font-term text-xl text-dim">{error}</p>
							<p className="mt-2 font-term text-xl text-dim">无法读取 sites.json，请检查部署。</p>
						</div>
					) : results ? (
						<section className="my-8">
							<div className="flex items-center gap-4">
								<div className="rule-neon flex-1" style={{ '--rule-color': 'rgba(0,240,255,0.65)' }} />
								<p className="font-pixel text-[11px] text-slate-100 md:text-sm">
									SEARCH RESULTS <span className="text-neon">// {results.length} HITS</span>
								</p>
								<div className="rule-neon flex-1" style={{ '--rule-color': 'rgba(0,240,255,0.65)' }} />
							</div>
							{results.length ? (
								<ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
									{results.map((w, i) => (
										<li key={w.url + i} className="list-none">
											<a
												href={w.url}
												target="_blank"
												rel="noopener noreferrer"
												className="card-hover flex h-full gap-4 border-2 border-line bg-panel p-4 hover:border-neon hover:bg-panel-2"
											>
												<img
													src={getFavicon(w.url)}
													alt=""
													loading="lazy"
													className="pixelated h-12 w-12 shrink-0 object-cover"
												/>
												<div className="min-w-0 flex-1">
													<h5 className="truncate text-base font-bold text-slate-100">{w.name}</h5>
													<p className="mt-1 line-clamp-2 text-sm leading-6 text-dim">{w.desc}</p>
													<p className="mt-2 font-term text-base tracking-widest text-neon/80">
														[{w.sector}{w.group ? ` // ${w.group}` : ''}]
													</p>
												</div>
											</a>
										</li>
									))}
								</ul>
							) : (
								<p className="mt-10 text-center font-term text-2xl text-dim">
									NO SIGNAL FOUND<span className="animate-blink text-magenta">▮</span>
								</p>
							)}
						</section>
					) : data ? (
						<>
							{/* 置顶条 */}
							{data.pinned?.length > 0 && (
								<section className="mt-8">
									<p className="mb-3 flex items-center gap-2 font-pixel text-[10px] text-amber">
										<StarIcon className="h-4 w-4" /> PINNED
									</p>
									<div className="flex gap-3 overflow-x-auto pb-2">
										{data.pinned.map((w, i) => (
											<a
												key={i}
												href={w.url}
												target="_blank"
												rel="noopener noreferrer"
												className="card-hover flex shrink-0 items-center gap-3 border-2 border-amber/30 bg-panel px-4 py-2.5 hover:border-amber"
											>
												<img src={getFavicon(w.url)} alt="" loading="lazy" className="pixelated h-8 w-8 object-cover" />
												<span className="whitespace-nowrap text-sm font-bold text-slate-100">{w.name}</span>
											</a>
										))}
									</div>
								</section>
							)}

							{/* 扇区选择条 */}
							<div className="mt-8">
								<p className="mb-3 font-pixel text-[10px] text-dim">
									SELECT SECTOR <span className="text-line">[1-{data.sectors.length}]</span>
								</p>
								<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
									{data.sectors.map((s, i) => {
										const st = SECTOR_STYLE[s.color] || SECTOR_STYLE.neon;
										const active = i === sectorIdx;
										return (
											<button
												key={s.id}
												onClick={() => selectSector(i)}
												className={`pixel-corners border-2 p-3 text-left transition-all ${
													active
														? `${st.border} ${st.bgSoft} ${st.glow}`
														: 'border-line bg-panel hover:border-dim'
												}`}
											>
												<div className="flex items-center justify-between">
													<SectionIcon name={s.icon} className={`h-6 w-6 ${active ? st.text : 'text-dim'}`} />
													<span className={`font-term text-base ${active ? st.text : 'text-dim/60'}`}>
														0{i + 1}
													</span>
												</div>
												<p className={`mt-2 font-pixel text-[9px] leading-relaxed ${active ? 'text-slate-100' : 'text-dim'}`}>
													{s.name}
												</p>
												<p className={`mt-1 font-term text-base tracking-widest ${active ? st.text : 'text-dim/60'}`}>
													{sectorCounts[i]} NODES
												</p>
											</button>
										);
									})}
								</div>
							</div>

							{/* 面包屑 */}
							<div className="mt-6 flex items-center gap-2 font-term text-xl tracking-widest text-dim">
								<span className="text-neon">ROOT</span>
								<span className="text-line">//</span>
								<span className={style.text}>{sector?.name}</span>
								<span className="text-line">//</span>
								<span className="text-slate-200">{group?.name}</span>
								<span className="ml-2 hidden text-dim/60 md:inline">
									(↑↓ 选择 · ←→ 换栏 · Enter 打开 · 1-6 切扇区)
								</span>
							</div>

							{/* 桌面端三栏 */}
							<div className="mt-4 hidden gap-4 md:grid md:grid-cols-[240px_minmax(0,1fr)_320px]">
								{/* 小类栏 */}
								<div className={`border-2 bg-panel ${style.dimBorder}`}>
									<div className={`border-b-2 px-4 py-2 font-pixel text-[10px] ${style.dimBorder} ${style.text}`}>
										SUBSECTORS
									</div>
									<ul className={`max-h-[62vh] overflow-y-auto ${focusCol === 1 ? '' : 'opacity-80'}`}>
										{sector?.groups.map((g, i) => {
											const n = g.list.filter((w) => !(isCN && w.unavailableForCN)).length;
											const active = i === groupIdx;
											return (
												<li key={g.id}>
													<button
														onClick={() => selectGroup(i)}
														className={`flex w-full items-center gap-3 border-b border-line/60 px-4 py-3 text-left transition-colors ${
															active ? `${style.bgSoft}` : 'hover:bg-panel-2'
														}`}
													>
														<span className={`font-term text-xl ${active ? style.text : 'text-line'}`}>
															{active ? '▶' : '▷'}
														</span>
														<SectionIcon name={g.icon} className={`h-5 w-5 shrink-0 ${active ? style.text : 'text-dim'}`} />
														<span className={`min-w-0 flex-1 truncate text-[15px] font-bold ${active ? 'text-slate-50' : 'text-dim'}`}>
															{g.name}
														</span>
														<span className={`font-term text-base ${active ? style.text : 'text-dim/50'}`}>{n}</span>
													</button>
												</li>
											);
										})}
									</ul>
								</div>

								{/* 网站栏 */}
								<div className={`border-2 bg-panel ${style.dimBorder}`}>
									<div className={`flex items-center justify-between border-b-2 px-4 py-2 font-pixel text-[10px] ${style.dimBorder} ${style.text}`}>
										<span>NODES</span>
										<span>{visibleSites.length}</span>
									</div>
									<ul className={`max-h-[62vh] overflow-y-auto ${focusCol === 2 ? '' : 'opacity-80'}`}>
										{visibleSites.map((w, i) => {
											const active = i === selIdx;
											return (
												<li key={w.url + i}>
													<div
														onClick={() => setSiteIdx(i)}
														onDoubleClick={() => openSite(w)}
														className={`flex w-full cursor-pointer items-center gap-3 border-b border-line/60 px-4 py-2.5 text-left transition-colors ${
															active ? `${style.bgSoft}` : 'hover:bg-panel-2'
														}`}
													>
														<span className={`font-term text-xl ${active ? style.text : 'text-line'}`}>
															{active ? '▶' : '·'}
														</span>
														<img src={getFavicon(w.url)} alt="" loading="lazy" className="pixelated h-8 w-8 shrink-0 object-cover" />
														<div className="min-w-0 flex-1">
															<p className={`truncate text-[15px] font-bold ${active ? 'text-slate-50' : 'text-slate-300'}`}>
																{w.name}
															</p>
															{w.desc && <p className="truncate text-sm text-dim">{w.desc}</p>}
														</div>
														<a
															href={w.url}
															target="_blank"
															rel="noopener noreferrer"
															onClick={(e) => e.stopPropagation()}
															title="在新标签页打开"
															className={`shrink-0 p-1 ${active ? style.text : 'text-dim/50 hover:text-slate-200'}`}
														>
															<ArrowTopRightOnSquareIcon className="h-4 w-4" />
														</a>
													</div>
												</li>
											);
										})}
										{!visibleSites.length && (
											<li className="p-8 text-center font-term text-xl text-dim">EMPTY SECTOR</li>
										)}
									</ul>
								</div>

								{/* 详情栏 */}
								<div>
									<SiteDetail site={selectedSite} sectorName={sector?.name} groupName={group?.name} style={style} />
								</div>
							</div>

							{/* 移动端钻取 */}
							<div className="mt-4 md:hidden">
								{mobileView === 'sectors' && (
									<div className="grid grid-cols-2 gap-3">
										{data.sectors.map((s, i) => {
											const st = SECTOR_STYLE[s.color] || SECTOR_STYLE.neon;
											return (
												<button
													key={s.id}
													onClick={() => selectSector(i)}
													className="pixel-corners border-2 border-line bg-panel p-4 text-left"
												>
													<SectionIcon name={s.icon} className={`h-7 w-7 ${st.text}`} />
													<p className="mt-2 font-pixel text-[9px] leading-relaxed text-slate-100">{s.name}</p>
													<p className="mt-1 font-term text-base text-dim">{sectorCounts[i]} NODES</p>
												</button>
											);
										})}
									</div>
								)}
								{mobileView === 'groups' && sector && (
									<div className={`border-2 bg-panel ${style.dimBorder}`}>
										<button onClick={() => setMobileView('sectors')} className="flex w-full items-center gap-2 border-b-2 border-line px-4 py-3 font-term text-xl tracking-widest text-dim">
											<span className={style.text}>◀</span> SECTORS
										</button>
										{sector.groups.map((g, i) => {
											const n = g.list.filter((w) => !(isCN && w.unavailableForCN)).length;
											return (
												<button
													key={g.id}
													onClick={() => selectGroup(i)}
													className="flex w-full items-center gap-3 border-b border-line/60 px-4 py-3.5 text-left"
												>
													<SectionIcon name={g.icon} className={`h-5 w-5 ${style.text}`} />
													<span className="flex-1 truncate font-bold text-slate-100">{g.name}</span>
													<span className="font-term text-lg text-dim">{n}</span>
													<ChevronRightIcon className="h-5 w-5 text-dim" />
												</button>
											);
										})}
									</div>
								)}
								{mobileView === 'sites' && (
									<div className={`border-2 bg-panel ${style.dimBorder}`}>
										<button onClick={() => setMobileView('groups')} className="flex w-full items-center gap-2 border-b-2 border-line px-4 py-3 font-term text-xl tracking-widest text-dim">
											<span className={style.text}>◀</span> {sector?.name}
										</button>
										{visibleSites.map((w, i) => (
											<button
												key={w.url + i}
												onClick={() => selectSite(i)}
												className="flex w-full items-center gap-3 border-b border-line/60 px-4 py-3 text-left"
											>
												<img src={getFavicon(w.url)} alt="" loading="lazy" className="pixelated h-9 w-9 shrink-0 object-cover" />
												<span className="min-w-0 flex-1">
													<span className="block truncate font-bold text-slate-100">{w.name}</span>
													{w.desc && <span className="block truncate text-sm text-dim">{w.desc}</span>}
												</span>
												<ChevronRightIcon className="h-5 w-5 shrink-0 text-dim" />
											</button>
										))}
										{!visibleSites.length && <p className="p-8 text-center font-term text-xl text-dim">EMPTY SECTOR</p>}
									</div>
								)}
								{mobileView === 'detail' && (
									<div>
										<button onClick={() => setMobileView('sites')} className="mb-3 flex items-center gap-2 font-term text-xl tracking-widest text-dim">
											<span className={style.text}>◀</span> {group?.name}
										</button>
										<SiteDetail site={selectedSite} sectorName={sector?.name} groupName={group?.name} style={style} />
									</div>
								)}
							</div>
						</>
					) : (
						<p className="mt-24 text-center font-pixel text-xs text-neon">
							LOADING DATA<span className="animate-blink">...</span>
						</p>
					)}
				</main>

				{/* 页脚 */}
				{data && !error && (
					<footer className="border-t-2 border-line bg-panel/70">
						<div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 font-term text-lg tracking-widest text-dim md:flex-row">
							<span className="font-pixel text-[10px] text-slate-300">
								LESTER'S CURIOSITY COMPASS
							</span>
							<span>
								2022 <span className="text-line">—</span> 2026
								<span className="mx-2 text-line">//</span>ALL SYSTEMS NOMINAL
								<span className="animate-blink text-lime"> ▮</span>
							</span>
						</div>
					</footer>
				)}
			</div>

			<RocketButton />
		</div>
	);
}

export default App;
