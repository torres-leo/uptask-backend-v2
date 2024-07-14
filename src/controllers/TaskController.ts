import type { Request, Response } from 'express';
import Task from '../models/task';

export class TaskController {
	static createTask = async (req: Request, res: Response) => {
		const { project } = req;

		try {
			const task = new Task({
				...req.body,
				project: project.id,
			});

			project.tasks.push(task.id);

			await Promise.allSettled([task.save(), project.save()]);

			res.send('Task Created');
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	};

	static getProjectTasks = async (req: Request, res: Response) => {
		try {
			const task = await Task.find({ project: req.project.id }).populate('project');
			res.json(task);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	};

	static getTaskById = async (req: Request, res: Response) => {
		try {
			const { task } = req;
			res.json(task);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	};

	static updateTask = async (req: Request, res: Response) => {
		try {
			const { task } = req;

			task.name = req.body.name ?? task.name;
			task.description = req.body.description ?? task.description;

			await task.save();
			res.send('Task updated');
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	};

	static deleteTask = async (req: Request, res: Response) => {
		try {
			const { task } = req;

			req.project.tasks = req.project.tasks.filter((id) => id.toString() !== task.id.toString());

			await Promise.allSettled([task.deleteOne(), req.project.save()]);

			res.send('Task deleted');
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	};

	static updateTaskStatus = async (req: Request, res: Response) => {
		try {
			const { task } = req;
			const { status } = req.body;

			task.status = status;

			await task.save();
			res.send('Task status updated');
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	};
}
