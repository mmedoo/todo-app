import { useContext, useRef, useEffect } from "react";
import "./details.css";
import { SelectedContext, ListContext, ErrContext } from "../../index"

export default function Details() {

	const selectedID = useContext(SelectedContext)[0];
	const list = useContext(ListContext)[0];
	const task = list[selectedID];

	const Ipts = task ? <Inputs key={task.task_id} task={task} /> : <></>;

	return (
		<div id="dtls">
			{Ipts}
		</div>
	)
}

var n = 0;

function Inputs({ task }) {

	const listClass = useContext(ListContext)[1];

	const titleRef = useRef();
	const descRef = useRef();
	const complRef = useRef();

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