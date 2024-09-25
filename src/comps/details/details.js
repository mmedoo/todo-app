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

	const setList = useContext(ListContext)[1];
	const setErr = useContext(ErrContext)[1];

	const titleRef = useRef();
	const descRef = useRef();
	const complRef = useRef();

	useEffect(() => {

		const updateTask = async () => {

			task.title = titleRef.current.value === "" ? `Untitled` : titleRef.current.value;
			task.description = descRef.current.value;
			task.completed = complRef.current.checked;

			setList((prev) => ({
				...prev,
				[task.task_id]: task
			}))

			const save = await task.save();
			const isErr = Object.getPrototypeOf(save).isAxiosError;

			if (isErr)
				setErr(save.message + "#" + n++);
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

	return (
		<>
			<div>
				<input
					type="checkbox"
					ref={complRef}
					defaultChecked={task.completed}
				></input>
				<input
					ref={titleRef}
					type="text"
					defaultValue={task.title}
					style={{
						textDecoration: task.completed ? "line-through" : "none"
					}}
				></input>
			</div>
			<textarea
				ref={descRef}
				defaultValue={task.description}
			>
			</textarea>
		</>
	)
}