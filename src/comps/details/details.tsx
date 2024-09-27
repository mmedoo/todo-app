import React, { useContext, useRef, useEffect, useMemo, HtmlHTMLAttributes } from "react";
import "./details.css";
import { SelectedContext, ListContext, ErrContext } from "../../index"
import TASK, { List, TaskMap } from "../../class";

export default function Details() {
	
	const selectContext : any = useContext(SelectedContext);
	const selectedID : string = selectContext[0];
	
	const listContext : any = useContext(ListContext);
	const map : TaskMap = listContext[0];
	
	const Ipts = useMemo(() => {

		const task : TASK = map[selectedID];
		
		return task ? <Inputs key={task.task_id} task={task} /> : <></>;
		
	}, [selectedID])

	return (
		<div id="dtls">
			{Ipts}
		</div>
	)
}

var n = 0;

function Inputs({ task } : { task: TASK }) {
	const listContext : any = useContext(ListContext)
	const listClass : List = listContext[1];

	const titleRef : any = useRef();
	const descRef : any = useRef();
	const complRef : any = useRef();

	useEffect(() => {

		const updateTask = async () => {

			const title = titleRef.current.value === "" ? `Untitled` : titleRef.current.value;
			const description = descRef.current.value;
			const completed = complRef.current.checked;

			const data = { title, description, completed };
			
			listClass.updateTask(task.task_id, data);
		}

		const titleNode = titleRef.current;
		const descNode = descRef.current;
		const complNode = complRef.current;

		titleNode.focus()
		titleNode.select()

		titleNode.addEventListener("input", updateTask);
		descNode.addEventListener("input", updateTask);
		complNode.addEventListener("change", updateTask);

		return () => {
			titleNode?.removeEventListener("input", updateTask);
			descNode?.removeEventListener("input", updateTask);
			complNode?.removeEventListener("change", updateTask);
		}
	}, []);

	const {data} = task;
	
	return (
		<>
			<div>
				<input
					type="checkbox"
					ref={complRef}
					defaultChecked={data.completed}
				></input>
				<input
					ref={titleRef}
					type="text"
					defaultValue={data.title}
					style={{
						textDecoration: data.completed ? "line-through" : "none"
					}}
				></input>
			</div>
			<textarea
				ref={descRef}
				defaultValue={data.description}
			>
			</textarea>
		</>
	)
}