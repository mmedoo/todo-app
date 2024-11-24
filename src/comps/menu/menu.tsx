import React, { useMemo, useContext, useRef, useEffect } from "react";
import { SelectedContext, ListContext, ErrContext } from "../../index.js";
import "./menu.css";
import TASK, { List } from "../../class.tsx";

var n = 0;

export default (function Menu() {

	const [list, listClass]: [any, List] = useContext(ListContext) ?? [{}, new List(() => { }, () => { })];
	const selectedContext: any = useContext(SelectedContext);
	const setSelected: any = selectedContext[1];
	const errContext: any = useContext(ErrContext);
	const setErr: any = errContext[1];

	const taskList = useMemo(() => {
		const tasks: TASK[] = Object.values(list);
		return tasks.map((task) => {
			return <Task obj={task} key={task.id} />
		});
	}, [list]);


	const newRef: any = useRef(null);
	const menuRef: any = useRef(null);

	let go = true;

	useEffect(() => {

		const newTask = () => {
			const task_id = listClass.newTask();
			setSelected(task_id);
		}

		if (go) newTask();

		newRef.current.addEventListener("click", newTask);

		const mousedown = function (e) {
			const { right, width } = menuRef.current.getBoundingClientRect();
			menuRef.current.isRightEdgeDragged = (e.x < right + 8 && e.x > right - 5);
			menuRef.current.width = width;
			menuRef.current.downX = e.x;
		}

		window.addEventListener("mousedown", mousedown)

		const mouseup = (e) => {
			const { right } = menuRef.current.getBoundingClientRect();
			menuRef.current.isRightEdgeDragged = false;
			menuRef.current.classList.toggle("drag", (e.x < right + 8 && e.x > right - 5))
		}

		window.addEventListener("mouseup", mouseup)

		const mouseout = function () {
			if (this.isRightEdgeDragged)
				return;
			this.isRightEdgeDragged = false;
			this.classList.remove("drag");
		}

		menuRef.current.addEventListener("mouseout", mouseout)

		const mousemove = function (e) {
			const { right } = menuRef.current.getBoundingClientRect();

			if (menuRef.current.isRightEdgeDragged) {
				let rightDragDist = e.x - menuRef.current.downX;
				let newWidth = (rightDragDist + menuRef.current.width) * 100 / window.innerWidth;
				if (newWidth > 10 && newWidth < 40)
					menuRef.current.style.width = newWidth + '%';
				return;
			}

			menuRef.current.classList.toggle("drag", (e.x < right + 8 && e.x > right - 5))
		}

		window.addEventListener("mousemove", mousemove)

		return () => {
			go = false;
			newRef.current?.removeEventListener("click", newTask);
			window.removeEventListener("mousedown", mousedown)
			window.removeEventListener("mouseup", mouseup)
			menuRef.current.removeEventListener("mouseout", mouseout)
			window.removeEventListener("mousemove", mousemove)
		}
	}, []);

	return (
		<div ref={menuRef} id="menu">
			<div id="btns">
				<button>Refresh</button>
				<button ref={newRef} >New</button>
			</div>
			<div id="tasks">
				{taskList}
			</div>
			<div id="note">Alt + Up/Down <br /> to Move</div>
		</div>
	)
})


const Task = ({ obj }: { obj: TASK }) => {

	const [selectedID, setSelectedID]: any = useContext(SelectedContext);
	const listContext: any = useContext(ListContext);
	const listClass = listContext[1];
	const errContext: any = useContext(ErrContext);
	const setErr = errContext[1];

	const taskRef: any = useRef(null);
	const delRef: any = useRef(null);

	useEffect(() => {
		if (selectedID === obj.id)
			taskRef.current?.scrollIntoView({ block: "center" });
	}, [selectedID]);

	useEffect(() => {

		const taskClick = function (e) {
			if (!delNode) return
			if (e.target === delNode) return;
			setSelectedID(obj.id);
		}

		const removeTask = async () => {
			listClass.removeTask(obj.id);
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

	const { data } = obj;

	return (
		<div ref={taskRef} className={`task ${selectedID === obj.id ? "selected" : ""}`}>
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
