import { TASK } from "./class"

type TaskMap = {
	[task_id: string]: TASK;
}

type TaskData = {
	/** Title of the task */
	title: string;
	/** Task Completion */
	completed: boolean;
	/** Task Description */
	description: string;
}

/**
 * RequestReturn is a tuple that returns a boolean and a value.
 * [0] - IsError: True if an error occurred.
 * [1] - Value: The value returned from the request.
 */
type RequestReturn = [boolean, string];

export {TaskMap, TaskData, RequestReturn}