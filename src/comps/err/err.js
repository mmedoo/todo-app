import { useContext, useEffect, useRef } from "react";
import { ErrContext } from "../..";
import "./err.css";


export default function ErrAlert() {
	const errMessage = useContext(ErrContext)[0];

	const errRef = useRef();

	useEffect(() => {
		
		if (!errMessage) return;		
		
		(async () => {
			errRef.current.classList.add("show");
			await new Promise((resolve) => setTimeout(resolve, 100));
			errRef.current.classList.remove("show");
		})();
		
	}, [errMessage]);

	return (
		<div ref={errRef} className="err">
			<h1>{errMessage?.split("#")[0]}</h1>
		</div>
	)
}