import DB, { Tasks } from "./model/todos.tsx";

DB.initialize()
	.then(() => {
		console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });


// const url = process.env.REACT_APP_SERVER || ""
const url = "";

var n = 0;
var errn = 0;

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
/**
 * RequestReturn is a tuple that returns a boolean and a value.
 * [0] - IsError: True if an error occurred.
 * [1] - Value: The value returned from the request.
 */
type RequestReturn = [IsError, any];

class TASK {

	static n = 0;
	data: TaskData;
	id: string;

	constructor(task?: TASK) {
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
		try {
			// await DB.create(Tasks, {
			// 	id: this.id,
			// 	...this.data
			// })
			return [false, this];
		} catch (err) {
			return [true, err]
		}
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
			.then(() => { return [false, this] })
			.catch(err => { return [true, err] });
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
			.catch(err => { return [true, err] });
	}



};


class List {

	taskMap: TaskMap;

	setListState: Function;
	setErrorState: Function;

	static connection;
	static model;

	/**
	 * Create a new List.
	 * @param setStateFunction - Function to set the state of the list.
	 * @param setErrorFunction - Function to set the displayed error state.
	 */

	constructor(setStateFunction: Function, setErrorFunction: Function) {
		// List.connection = new_Connection();
		// List.model = new_todo_model(List.connection);

		this.setListState = setStateFunction;
		this.setErrorState = setErrorFunction;

		this.taskMap = {};
	}

	/**
	 * Fetch all tasks from the database.
	 */
	async fetchAll() {
		return await List.model.findAll()
			.then((tasks) => {
				// tasks.forEach((task) => {
				// this.taskMap[task.id] = new TASK(task);
				// });
				// this.updateList();
				return [false, this.taskMap];
			})
			.catch(err => { return [true, err] });
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
		const task = new TASK();
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
export { List, TaskData as TaskInfoType, TaskMap };