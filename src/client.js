import React from "react";
import ReactDOM from "react-dom";
import Editor from "react-medium-editor";
import _ from "lodash";

class App extends React.Component {
	render() {
		const swappedDir = _.get(this, "state.dir") !== "ltr" ? "ltr" : "rtl";

		return (
			<div>
				<div>
					<button
						onClick={() => this.setState({dir: swappedDir})}
					>{swappedDir}</button>
				</div>
				<Editor
					tag="pre"
					text={_.get(this, "state.text", "Edit me!")}
					onChange={((text) => {
						this.setState({text: text});
					})}
				/>
				<div dangerouslySetInnerHTML={{__html: _.get(this, "state.text", "I'm hungry")}}/>
			</div>
		);
	}

	componentDidUpdate(prevProps, prevState) {
		if (_.get(this, "state.dir") !== _.get(prevState, "dir")) {
			document.querySelector("html").setAttribute("dir", _.get(this, "state.dir", "rtl"));
		}
	}
};

ReactDOM.render(<App/>, document.getElementById("app-root"));
