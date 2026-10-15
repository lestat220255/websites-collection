import { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
	ChatBubbleBottomCenterTextIcon,
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
};

// 四色霓虹轮换（类名必须写全，供 Tailwind 扫描）
const ACCENTS = [
	{
		text: 'text-neon',
		border: 'border-neon/30',
		hoverBorder: 'hover:border-neon',
		glow: 'hover:shadow-[0_0_28px_rgba(0,240,255,0.28)]',
		rule: 'rgba(0,240,255,0.65)',
	},
	{
		text: 'text-magenta',
		border: 'border-magenta/30',
		hoverBorder: 'hover:border-magenta',
		glow: 'hover:shadow-[0_0_28px_rgba(255,43,214,0.28)]',
		rule: 'rgba(255,43,214,0.65)',
	},
	{
		text: 'text-amber',
		border: 'border-amber/30',
		hoverBorder: 'hover:border-amber',
		glow: 'hover:shadow-[0_0_28px_rgba(255,176,0,0.28)]',
		rule: 'rgba(255,176,0,0.65)',
	},
	{
		text: 'text-lime',
		border: 'border-lime/30',
		hoverBorder: 'hover:border-lime',
		glow: 'hover:shadow-[0_0_28px_rgba(182,255,0,0.25)]',
		rule: 'rgba(182,255,0,0.6)',
	},
];

function SectionIcon({ name, className }) {
	const Cmp = ICONS[name] || SparklesIcon;
	return <Cmp className={className} />;
}

function SiteCard({ website, accent, groupName }) {
	const [showTip, setShowTip] = useState(false);
	if (isCN && website.unavailableForCN) return null;
	return (
		<li className="relative list-none">
			<a
				href={website.url}
				target="_blank"
				rel="noopener noreferrer"
				onMouseEnter={() => setShowTip(true)}
				onMouseLeave={() => setShowTip(false)}
				onFocus={() => setShowTip(true)}
				onBlur={() => setShowTip(false)}
				className={`card-hover group flex gap-4 border-2 bg-panel p-4 ${accent.border} ${accent.hoverBorder} ${accent.glow} hover:bg-panel-2`}
			>
				<img
					src={getFavicon(website.url)}
					alt=""
					loading="lazy"
					className="pixelated h-12 w-12 shrink-0 object-cover"
				/>
				<div className="min-w-0 flex-1">
					<h5 className="truncate text-base font-bold text-slate-100">{website.name}</h5>
					<p className="mt-1 line-clamp-2 text-sm leading-6 text-dim">{website.desc}</p>
					{groupName && (
						<p className={`mt-2 font-term text-base tracking-widest ${accent.text} opacity-80`}>
							[{groupName}]
						</p>
					)}
				</div>
			</a>
			{showTip && website.tips ? (
				<div
					className="pixel-tip absolute bottom-full left-0 z-30 mb-3 w-max max-w-[280px]"
					dangerouslySetInnerHTML={{ __html: website.tips }}
				/>
			) : null}
		</li>
	);
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

function App() {
	const [sites, setSites] = useState(null);
	const [error, setError] = useState(null);
	const [query, setQuery] = useState('');
	const searchRef = useRef(null);

	useEffect(() => {
		fetch('sites.json')
			.then((r) => {
				if (!r.ok) throw new Error('HTTP ' + r.status);
				return r.json();
			})
			.then(setSites)
			.catch((e) => setError(String(e)));
	}, []);

	// 按 "/" 聚焦搜索框
	useEffect(() => {
		const onKey = (e) => {
			if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
				e.preventDefault();
				searchRef.current?.focus();
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, []);

	const flatSites = useMemo(() => {
		if (!sites) return [];
		return sites.flatMap((s) =>
			s.list
				.filter((w) => !(isCN && w.unavailableForCN))
				.map((w) => ({ ...w, group: s.name }))
		);
	}, [sites]);

	const results = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return null;
		return flatSites.filter(
			(w) =>
				w.name.toLowerCase().includes(q) ||
				(w.desc && w.desc.toLowerCase().includes(q)) ||
				w.group.toLowerCase().includes(q)
		);
	}, [query, flatSites]);

	const randomWarp = () => {
		if (!flatSites.length) return;
		const pick = flatSites[Math.floor(Math.random() * flatSites.length)];
		window.open(pick.url, '_blank', 'noopener');
	};

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
					<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
						<span>
							<span className="text-neon">SYS.BOOT</span>
							<span className="mx-2 text-line">//</span>COMPASS v2.0
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
				<header className="mx-auto flex max-w-6xl items-center gap-5 px-4 pb-2 pt-10 md:gap-7">
					<div className="pixel-corners shrink-0 bg-neon p-[3px]">
						<img
							src="/avatar.png"
							alt="avatar"
							className="pixel-corners pixelated block h-16 w-16 bg-void md:h-20 md:w-20"
						/>
					</div>
					<div className="min-w-0">
						<h1 className="title-3d font-pixel text-sm leading-loose text-slate-50 md:text-2xl md:leading-relaxed">
							Lester's Curiosity Compass
						</h1>
						<p className="mt-3 font-term text-xl text-neon/90 md:text-2xl">
							&gt; Guides you to new discoveries.
							<span className="animate-blink text-magenta">▮</span>
						</p>
					</div>
				</header>

				{/* 搜索 + 随机漫游 */}
				{sites && !error && (
					<div className="mx-auto mt-8 flex max-w-6xl flex-col gap-3 px-4 sm:flex-row">
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
				<main className="mx-auto max-w-6xl px-4 pb-8">
					{error ? (
						<div className="mx-auto mt-16 max-w-md border-2 border-magenta bg-panel p-6 text-center">
							<p className="font-pixel text-xs text-magenta">LOAD ERROR</p>
							<p className="mt-4 font-term text-xl text-dim">{error}</p>
							<p className="mt-2 font-term text-xl text-dim">无法读取 sites.json，请检查部署。</p>
						</div>
					) : results ? (
						<section className="my-10">
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
										<SiteCard key={w.url + i} website={w} accent={ACCENTS[0]} groupName={w.group} />
									))}
								</ul>
							) : (
								<p className="mt-10 text-center font-term text-2xl text-dim">
									NO SIGNAL FOUND<span className="animate-blink text-magenta">▮</span>
								</p>
							)}
						</section>
					) : sites ? (
						sites.map((item, index) => {
							const accent = ACCENTS[index % ACCENTS.length];
							return (
								<section key={index} className="my-10">
									<div className="flex items-center gap-4">
										<div
											className="rule-neon flex-1"
											style={{ '--rule-color': accent.rule }}
										/>
										<div className="flex items-center gap-3 px-1">
											<SectionIcon name={item.icon} className={`h-6 w-6 ${accent.text}`} />
											<h2 className="font-pixel text-[11px] text-slate-100 md:text-sm">
												{item.name}
											</h2>
										</div>
										<div
											className="rule-neon flex-1"
											style={{ '--rule-color': accent.rule }}
										/>
									</div>
									<ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
										{item.list.map((website, key) => (
											<SiteCard key={key} website={website} accent={accent} />
										))}
									</ul>
								</section>
							);
						})
					) : (
						<p className="mt-24 text-center font-pixel text-xs text-neon">
							LOADING DATA<span className="animate-blink">...</span>
						</p>
					)}
				</main>

				{/* 页脚 */}
				{sites && !error && (
					<footer className="border-t-2 border-line bg-panel/70">
						<div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 font-term text-lg tracking-widest text-dim md:flex-row">
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
