const router = Skeleton.Router();

router.path('/all', () => filterTodos('all'));
router.path('/active', () => filterTodos('active'));
router.path('/completed', () => filterTodos('completed'));