import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { MapPinIcon, PlayIcon, HomeIcon, BookOpenIcon, CloudIcon, SparklesIcon, StarIcon, Squares2X2Icon, TvIcon, ComputerDesktopIcon, GiftIcon, LinkIcon, WrenchIcon, RocketLaunchIcon, UserGroupIcon, SpeakerWaveIcon, FaceSmileIcon, FilmIcon } from '@heroicons/react/24/solid'
import { Helmet } from 'react-helmet';
import RocketButton from './components/RocketButton';


let isCN = false;

function getFavicon(url) {
	if (url.match(/https{0,1}:\/\//)) {
		if (isCN) {
			return "https://ui-avatars.com/api/?bold=true&size=36&background=0D8ABC&color=fff&rounded=true&name=" + url.split('//')[1];
		}
		return "https://www.google.com/s2/favicons?sz=64&domain_url=" + url;
	} else {
		if (isCN) {
			return "https://ui-avatars.com/api/?bold=true&size=36&background=0D8ABC&color=fff&rounded=true&name=" + url;
		}
		return "https://www.google.com/s2/favicons?sz=64&domain_url=http://" + url;
	}
}

function App() {
	const [sites, setSites] = useState(null);
		const [title] = useState("Lester's Curiosity Compass - Guides you to new discoveries.");

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch('sites.json'); // Replace with your JSON file path
			const jsonData = await response.json();
			setSites(jsonData);
		};

		fetchData();
	}, []);

		const targetRef = useRef(null);

	const IconComponent = ( props ) => {
		const DynamicComponent = icons[props.icon];
		return <DynamicComponent className="h-7 w-7 text-pink-400" />
	}

		const icons = {
			MapPinIcon: MapPinIcon,
				PlayIcon: PlayIcon,
				HomeIcon: HomeIcon,
				BookOpenIcon: BookOpenIcon,
				CloudIcon: CloudIcon,
				SparklesIcon: SparklesIcon,
				StarIcon: StarIcon,
				Squares2X2Icon: Squares2X2Icon,
				TvIcon: TvIcon,
				ComputerDesktopIcon: ComputerDesktopIcon,
				GiftIcon: GiftIcon,
				LinkIcon: LinkIcon,
				WrenchIcon: WrenchIcon,
				RocketLaunchIcon: RocketLaunchIcon,
				UserGroupIcon: UserGroupIcon,
				SpeakerWaveIcon: SpeakerWaveIcon,
				FaceSmileIcon: FaceSmileIcon,
				FilmIcon: FilmIcon
	}

	return (
		<div className="font-sans">
			<Helmet>
				<title>{title}</title>
			</Helmet>
			<div className="container mx-auto px-4">
				<h1 className="my-6 tracking-wide flex justify-center items-center">
				<img src="/avatar.png" className="w-12 h-12" alt="avatar" />
					<b className="text-center sm:text-2xl md:text-3xl font-bold">Lester's Curiosity Compass</b>
					</h1>
				<hr className="my-4" />
					{sites ? (
					sites.map((item, index) => (
						<div key={index} className='my-6'>
							<div className="flex items-center">
								<hr className="shrink w-full my-8 border-gray-200 mr-4" />
								<p className="flex-none flex justify-center gap-2 items-center" ref={targetRef} id={item.name}>
								<IconComponent icon={item.icon} /><b className="text-center text-xl font-bold">{item.name}</b>
								</p>
								<hr className="shrink w-full my-8 border-gray-200 ml-4" />
							</div>

							<ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
								{item.list.map((website, key) => (
								(isCN !== true || website.unavailableForCN !== true) && <li key={key} className='border-2 border-gray-200 rounded hover:shadow-lg duration-500 rounded-lg'>
									<a href={website.url} target="blank" className="flex overflow-hidden p-4">
										<img src={getFavicon(website.url)} className="w-16 h-16 object-cover" alt={website.name} />
										<div className="w-4/5 pl-4">
											<h5 className="text-xl font-medium mb-2">{website.name}</h5>
											<p className="text-gray-700 mb-2 h-10 overflow-auto">{website.desc}</p>
										</div>
									</a>
								</li>
								))}
							</ul>
							<RocketButton />
						</div>
				))
					) : (
						<p>Loading data...</p>
					)}
				</div>
					{sites && <footer className="bg-gray-800 text-white px-4 py-8 flex flex-col md:flex-row items-center justify-between mt-16">
						<div className="text-center md:text-left space-y-4">
							<h2 className="text-xl font-bold">Lester's Curiosity Compass</h2>
					<p className="text-gray-300">2022 - Now</p>
					</div>
					</footer>}
	</div>
	);
}

export default App;
