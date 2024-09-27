import { useMemo, useContext, useRef, useEffect, memo } from "react";
import { SelectedContext, ListContext, ErrContext } from "../../index.js";
import "./menu.css";
import TASK from "../../class.tsx";

var n = 0;

export default (function Menu() {

	const [list, listClass] = useContext(ListContext);
	const setSelected = useContext(SelectedContext)[1];
	const setErr = useContext(ErrContext)[1];

	const taskList = useMemo(() => {
		return Object.values(list).map((task) => {
			return <Task obj={task} key={task.task_id} />
		});
	}, [list]);


	const newRef = useRef(null);

	let go = true;

	useEffect(() => {

		const newTask = async () => {

			const task_id = listClass.newTask();

			setSelected(task_id);
		}

		if (go) newTask();

		newRef.current.addEventListener("click", newTask);

		return () => {
			go = false;
			newRef.current?.removeEventListener("click", newTask);
		}
	}, []);

	return (
		<div id="menu">
			<div id="btns">
				<button>Refresh</button>
				<button ref={newRef} >New</button>
			</div>
			<div id="tasks">
				{taskList}
			</div>
			<div id="note">Alt + Up/Down <br/> to Move</div>
		</div>
	)
})



const Task = ({ obj }) => {

	const [selectedID, setSelectedID] = useContext(SelectedContext);
	const listClass = useContext(ListContext)[1];
	const setErr = useContext(ErrContext)[1];

	const taskRef = useRef(null);
	const delRef = useRef(null);

	useEffect(() => {
		if (selectedID === obj.task_id)
			taskRef.current?.scrollIntoView({ block: "center" });
	}, [selectedID]);
	
	useEffect(() => {

		const taskClick = (e) => {
			if (!delNode) return
			if (e.target === delNode) return;
			setSelectedID(obj.task_id);
		}

		const removeTask = async () => {
			listClass.removeTask(obj.task_id);			
		}

		const taskNode = taskRef.current;
		const delNode = delRef.current;

		taskNode?.addEventListener("click", taskClick);
		delNode?.addEventListener("click", removeTask);

		return () => {
			taskNode?.removeEventListener("click", taskClick);
			delNode?.removeEventListener("click", removeTask);
		}
	}, []);

	const {data} = obj;
	
	return (
		<div ref={taskRef} className={`task ${selectedID === obj.task_id ? "selected" : ""}`}>
			<span
				style={{
					textDecoration: data.completed ? "line-through" : "none",
				}}
			>{data.title}
			</span>
			<button ref={delRef} >Del</button>
		</div>
	)
};