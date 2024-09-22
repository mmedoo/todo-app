import { createContext, StrictMode, useState } from "react"
import { createRoot } from "react-dom/client"
import Menu from "./comps/menu/menu"
import Detail from "./comps/details/details"
import ErrAlert from "./comps/err/err"
import TASK from "./class"
import "./index.css"

const SelectedContext = createContext(null);
const ListContext = createContext(null);
const ErrContext = createContext(null);

const init = new TASK();

function App() {

	const [selected, setSelected] = useState(init.task_id);
	const [list, setList] = useState({ [init.task_id]: init });
	const [err, setErr] = useState(null);

	return (
		<SelectedContext.Provider value={[selected, setSelected]}>
			<ListContext.Provider value={[list, setList]}>
				<ErrContext.Provider value={[err, setErr]}>

					<Menu />
					<Detail />
					<ErrAlert />

				</ErrContext.Provider>
			</ListContext.Provider>
		</SelectedContext.Provider>
	)
}

export { SelectedContext, ListContext, ErrContext }

const root = createRoot(document.querySelector("#root"));
root.render(
	<StrictMode>
		<App />
	</StrictMode>
)
