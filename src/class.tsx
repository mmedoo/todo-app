import axios from "axios"

import {TaskMap, TaskData, RequestReturn} from "./types"

// const url = process.env.REACT_APP_SERVER || ""
const url = "";
var n = 0;
var errn = 0;
const fingerprint = Math.random().toString(36);

class TASK {

	static n = 0;
	data: TaskData;
	id: string;

	private static fp: string = fingerprint;


	checkfp(fp : string) {
		if (fp !== TASK.fp) {
			throw new Error("Invalid Fingerprint. TASK is only accessible through List class.");
		}
	}
	
	constructor(fp: string, task?: TASK) {
		this.checkfp(fp);
		this.id = task?.id ?? String(Date.now() + n);
		this.data = task?.data ?? {
			title: String(`Task #${n}`),
			completed: false,
			description: `Description for Task #${n++}`
		}
	}

	/**
	 * Warning! #####################################
	 * Don't call this function Outside of List Class
	*/
	async createInDB(): Promise<RequestReturn> {
		return axios.post(url + "/api/todo", {
			id: this.id,
			...this.data
		})
			.then(() => { return [false, ""] as RequestReturn })
			.catch(err => { return [true, err.message] as RequestReturn });
	}

	/**
	 * Warning! #####################################
	 * Don't call this function Outside of List Class
	*/
	async updateInDB(): Promise<RequestReturn> {
		const id = this.id;
		const row = await List.model.findOne({ where: { id } });
		if (row === null) {
			return [true, `Task with ID ${id} not found.`];
		}
		return await row.set({
			...this.data
		}).save()
			.then(() => { return [false, ""] })
			.catch(err => { return [true, err.message] });
	}

	/**
	 * Warning! #####################################
	 * Don't call this function Outside of List Class
	*/
	async deleteInDB(): Promise<RequestReturn> {

		const id = this.id;
		const row = await List.model.findOne({ where: { id } });

		if (row === null) {
			return [true, `Task with ID ${id} not found.`];
		}

		return await row.destroy()
			.then(() => { return [false, this] })
			.catch((err) => { return [true, err] });
	}
};


class List {

	taskMap: TaskMap;

	setListState: Function;
	setErrorState: Function;

	private static fp = fingerprint;

	/**
	 * Create a new List.
	 * @param setStateFunction - Function to set the state of the list.
	 * @param setErrorFunction - Function to set the displayed error state.
	 */

	constructor(setStateFunction: Function, setErrorFunction: Function) {
		this.setListState = setStateFunction;
		this.setErrorState = setErrorFunction;

		this.taskMap = {};
	}

	/**
	 * Fetch all tasks from the database.
	*/
	async fetchAll() {
		return await axios.get("/api/todo")
			// .then((tasks) => {
			// 	tasks.forEach((task) => {
			// 		this.taskMap[task.id] = new TASK(task);
			// 	});
			// 	this.updateListState();
			// 	return [false, "State Updated"];
			// })
			// .catch(err => { return [true, err] });
	}

	/**
	 * Triggers a list mutation.
	 */

	updateListState() {
		this.setListState({ ...this.taskMap });
	}


	/**
	 * Update a task with new data.
	 * @param {string} task_id - Task ID for the task to update.
	 * @param {TaskData} data - Data for a task (title - description - completed).
	*/

	async updateTask(task_id: string, data: TaskData) {

		const task = this.taskMap[task_id];
		task.data = data;
		this.updateListState();

		const [err, res] = await task.updateInDB();
		if (err) {
			this.setErrorState(res + "#" + errn++);
		}
	}

	/**
	 * Initialize a new task.
	 * @param userid - User ID for the task.
	 * @returns {string} - Task ID for the new task. 
	 */

	async newTask(): Promise<string> {
		const task = new TASK(List.fp);
		this.taskMap[task.id] = task;
		this.updateListState();

		const [err, res] = await task.createInDB();
		if (err) {
			this.setErrorState(res + "#" + errn++);
		}

		return task.id;
	}

	/**
	 * Remove a task from the list.
	 * @param task_id - Task ID for the task to remove.
	 */

	async removeTask(task_id: string) {
		const [err, res] = await this.taskMap[task_id].deleteInDB();
		if (err) {
			this.setErrorState(res + "#" + errn++);
		}
		delete this.taskMap[task_id];
		this.updateListState();
	}
}


export default TASK;
export { TASK, List, TaskData as TaskInfoType, TaskMap };