function Filters(props) {
	'use strict';

	const [filter] = useFilter();

	function selectedClass(match) {
		return filter === match ? 'selected' : '';
	}

	return (
		<ul className="filters">
			<li>
				<a className={selectedClass('')} href="#/">
					All
				</a>
			</li>
			<li>
				<a className={selectedClass('active')} href="#/active">
					Active
				</a>
			</li>
			<li>
				<a className={selectedClass('completed')} href="#/completed">
					Completed
				</a>
			</li>
		</ul>
	);
}
