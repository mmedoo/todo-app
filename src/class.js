import axios from "axios"

const url = process.env.REACT_APP_SERVER || ""

var n = 0;

class TASK {

	static n = 0;

	constructor(userid, task = null) {
		this.user_id = userid;
		this.task_id = task?.task_id ?? String(Date.now() + n);
		this.title = task?.title ?? `Task #${n}`
		this.completed = task?.completed ?? false;
		this.description = task?.description ?? `Description for Task #${n++}`
	}

	async create() {
		return true;
		return await axios.post(`${url}/task/${this.user_id}`, this)
			.catch(err => { return (err) });
	}

	async save() {
		return true;
		return await axios.put(`${url}/task/${this.user_id}`, this)
			.catch(err => { return (err) });
	}

	async delete() {
		return true;
		return await axios.delete(`${url}/task/${this.user_id}/${this.task_id}`)
			.catch(err => { return (err) });
	}


};


export default TASK;