import { createContext, StrictMode, useEffect, useMemo, useState } from "react"
import { createRoot } from "react-dom/client"
// import Menu from "./comps/menu/menu"
import Menu from "./comps/menu/menu.tsx"
// import Detail from "./comps/details/details"
import Detail from "./comps/details/details.tsx"
import ErrAlert from "./comps/err/err"
import { List } from "./class.tsx"
import "./index.css"

const SelectedContext = createContext(null);
const ListContext = createContext(null);
const ErrContext = createContext(null);
export { SelectedContext, ListContext, ErrContext }

var isAltDown = false;


function App() {

	const [selected, setSelected] = useState();
	const [taskMap, setList] = useState({});
	const [err, setErr] = useState(null);

	const listClass = useMemo(() => new List(setList), []);

	useEffect(() => {

		window.onkeydown = (e) => {
			if (e.key === "Alt"){
				isAltDown = true;
				return;
			}

			if (!isAltDown) {
				return;
			}
	
			let inc = 0;
			
			if (e.key === "ArrowUp") inc = -1;
			else if (e.key === "ArrowDown") inc = 1;
			else return;
	
			const ids = Object.keys(taskMap);
	
			const currentPosition = ids.indexOf((selected));
	
			let next = ids[currentPosition + inc] ?? selected;
	
			setSelected(next);
		}

		window.onkeyup = (e) => {
			if (e.key === "Alt"){
				isAltDown = false;
			}
		}

		return () => {
			window.onkeydown = null;
			window.onkeyup = null;
		}

	}, [taskMap, selected]);

	return (
		<SelectedContext.Provider value={[selected, setSelected]}>
			<ListContext.Provider value={[taskMap, listClass]}>
				<ErrContext.Provider value={[err, setErr]}>

					<Menu />
					<Detail />
					<ErrAlert />

				</ErrContext.Provider>
			</ListContext.Provider>
		</SelectedContext.Provider>
	)
}

const root = createRoot(document.querySelector("#root"));
root.render(
	<StrictMode>
		<App />
	</StrictMode>
)
