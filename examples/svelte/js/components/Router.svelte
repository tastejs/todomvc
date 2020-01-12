<script>
	import Director from 'director/build/director';
	import { ALL, ACTIVE, COMPLETED } from '../helpers/filterCodes';

	let filterBy = ALL;

	const router = new Director.Router({
		'/active': () => filterBy = ACTIVE,
		'/completed': () => filterBy = COMPLETED,
		'/.*': () => filterBy = ALL,
	});
	router.init();
</script>

<slot filterBy={filterBy}/>
