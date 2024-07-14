import type { Request, Response, NextFunction } from 'express';
import Task, { ITask } from '../models/task';

declare global {
	namespace Express {
		interface Request {
			task: ITask;
		}
	}
}

export async function taskExist(req: Request, res: Response, next: NextFunction) {
	try {
		const { taskId } = req.params;

		const task = await Task.findById(taskId);

		if (!task) {
			const error = new Error('Task not found');
			res.status(404).json({ error: error.message });
		}

		req.task = task;

		next();
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

export function taskBelongsToProject(req: Request, res: Response, next: NextFunction) {
	if (req.task.project.toString() !== req.project.id.toString()) {
		const error = new Error('Task not found in this project');
		return res.status(404).json({ error: error.message });
	}
	next();
}
