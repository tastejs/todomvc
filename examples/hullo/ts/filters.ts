import { Task } from "./Task";

export const filters = {
	all: (tasks: Task[]) => tasks,
	active: (tasks: Task[]) => tasks.filter(task => !task.completed),
	completed: (tasks: Task[]) => tasks.filter(task => task.completed)
};
