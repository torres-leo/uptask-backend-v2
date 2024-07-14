import { Router } from 'express';
import { body, param } from 'express-validator';
import { ProjectController } from '../controllers/ProjectController';
import { handleInputErrors } from '../middleware/validation';
import { TaskController } from '../controllers/TaskController';
import { projectExist } from '../middleware/project';
import { taskBelongsToProject, taskExist } from '../middleware/task';

const router = Router();

router.post(
	'/',
	body('projectName').notEmpty().withMessage('Project Name is required'),
	body('clientName').notEmpty().withMessage('Client Name is required'),
	body('description').notEmpty().withMessage('Description is required'),
	handleInputErrors,
	ProjectController.createProject
);

router.get('/', ProjectController.getAllProducts);
router.get(
	'/:id',
	param('id').isMongoId().withMessage('Invalid ID'),
	handleInputErrors,
	ProjectController.getProjectById
);
router.put(
	'/:id',
	param('id').isMongoId().withMessage('Invalid ID'),
	body('projectName').notEmpty().withMessage('Project Name is required'),
	body('clientName').notEmpty().withMessage('Client Name is required'),
	body('description').notEmpty().withMessage('Description is required'),
	handleInputErrors,
	ProjectController.updateProject
);
router.delete(
	'/:id',
	param('id').isMongoId().withMessage('Invalid ID'),
	handleInputErrors,
	ProjectController.deleteProject
);

/** Routes for tasks*/
router.param('projectId', projectExist);
router.post(
	'/:projectId/tasks',

	body('name').notEmpty().withMessage('Task Name is required'),
	body('description').notEmpty().withMessage('Description is required'),
	handleInputErrors,
	TaskController.createTask
);

router.get('/:projectId/tasks', TaskController.getProjectTasks);

router.param('taskId', taskExist);
router.param('taskId', taskBelongsToProject);

router.get(
	'/:projectId/tasks/:taskId',
	param('taskId').isMongoId().withMessage('Invalid ID'),
	handleInputErrors,
	TaskController.getTaskById
);

router.put(
	'/:projectId/tasks/:taskId',
	param('taskId').isMongoId().withMessage('Invalid ID'),
	body('name').notEmpty().withMessage('Task Name is required'),
	body('description').notEmpty().withMessage('Description is required'),
	handleInputErrors,
	TaskController.updateTask
);

router.delete(
	'/:projectId/tasks/:taskId',
	param('taskId').isMongoId().withMessage('Invalid ID'),
	handleInputErrors,
	TaskController.deleteTask
);

router.post(
	'/:projectId/tasks/:taskId/status',
	param('taskId').isMongoId().withMessage('Invalid ID'),
	body('status').notEmpty().withMessage('Status is required'),
	handleInputErrors,
	TaskController.updateTaskStatus
);

export default router;
