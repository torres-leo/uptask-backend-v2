import type { Request, Response } from 'express';
import Project from '../models/project';

export class ProjectController {
	static createProject = async (req: Request, res: Response) => {
		const project = new Project(req.body);

		try {
			await project.save();
			res.send('Project Created');
		} catch (error) {
			console.log(error);
		}
	};

	static getAllProducts = async (req: Request, res: Response) => {
		try {
			const projects = await Project.find();
			res.json(projects);
		} catch (error) {
			console.log(error);
		}
	};

	static getProjectById = async (req: Request, res: Response) => {
		const projectId = req.params.id;

		try {
			const project = await Project.findById(projectId).populate('tasks');

			if (!project) {
				const error = new Error('Project not found');
				res.status(404).json({ error: error.message });
			}

			res.json(project);
		} catch (error) {
			console.log(error);
		}
	};

	static updateProject = async (req: Request, res: Response) => {
		const projectId = req.params.id;

		try {
			const project = await Project.findById(projectId);

			if (!project) {
				const error = new Error('Project not found');
				res.status(404).json({ error: error.message });
			}

			project.projectName = req.body.projectName ?? project.projectName;
			project.clientName = req.body.clientName ?? project.clientName;
			project.description = req.body.description ?? project.description;

			await project.save();
			res.send('Project updated');
		} catch (error) {
			console.log(error);
		}
	};

	static deleteProject = async (req: Request, res: Response) => {
		const projectId = req.params.id;

		try {
			const project = await Project.findById(projectId);

			if (!project) {
				const error = new Error('Project not found');
				res.status(404).json({ error: error.message });
			}

			await project.deleteOne();
			res.send('Project Deleted');
		} catch (error) {
			console.log(error);
		}
	};
}
