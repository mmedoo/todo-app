import axios from "axios"

// const url = process.env.REACT_APP_SERVER || ""
const url = "";

var n = 0;

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

type IsError = boolean;
type RequestReturn = [IsError, any];

class TASK {

	static n = 0;

	user_id: string;
	data: TaskData;
	task_id: string;

	constructor(userid: string, task?: TASK) {
		this.user_id = userid;
		this.task_id = task?.task_id ?? String(Date.now() + n);
		this.data = task?.data ?? {
			title: `Task #${n}`,
			completed: false,
			description: `Description for Task #${n++}`
		}
	}

	// async create() : RequestReturn {
	async create() {
		return true;
		return await axios.post(`${url}/task/${this.user_id}`, this)
			.catch(err => { return (err) });
	}

	// async save() : RequestReturn {
	async save() {
		return true;
		return await axios.put(`${url}/task/${this.user_id}`, this)
			.catch(err => { return (err) });
	}

	// async delete() : RequestReturn {
	async delete() {
		return true;
		return await axios.delete(`${url}/task/${this.user_id}/${this.task_id}`)
			.catch(err => { return (err) });
	}

};


class List {

	taskMap: TaskMap;

	setListState: Function;

	constructor(setStateFunction: Function) {
		this.taskMap = {};
		this.setListState = setStateFunction;
	}

	/**
	 * Triggers a list mutation.
	 */

	updateList() {
		this.setListState({ ...this.taskMap });
	}


	/**
	 * Update a task with new data.
	 * @param {string} task_id - Task ID for the task to update.
	 * @param {TaskData} data - Data for a task (title - description - completed).
	*/

	updateTask(task_id: string, data: TaskData) {

		this.taskMap[task_id].data = data;

		this.updateList();
	}

	/**
	 * Initialize a new task.
	 * @param userid - User ID for the task.
	 * @returns {string} - Task ID for the new task. 
	 */
	
	newTask(userid?: string): string {
		const task = new TASK(userid ?? "");
		this.taskMap[task.task_id] = task;
		this.updateList();
		return task.task_id;
	}

	/**
	 * Remove a task from the list.
	 * @param task_id - Task ID for the task to remove.
	 */

	removeTask(task_id: string) {
		delete this.taskMap[task_id];
		this.updateList();
	}
}


export default TASK;
export { List, TaskData as TaskInfoType, TaskMap };