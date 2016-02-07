import React from "react";
import ReactDOM from "react-dom";
import MediumEditor from "react-medium-editor";
import SirTrevor from "sir-trevor";
import _ from "lodash";
import $ from "jquery";

class App extends React.Component {
	constructor(props) {
		super(props);

		this.onSubmit = this.onSubmit.bind(this);
	}

	render() {
		const swappedDir = _.get(this, "state.dir") !== "ltr" ? "ltr" : "rtl";

		return (
			<div>
				<div>
					<button
						onClick={() => this.setState({dir: swappedDir})}
					>{swappedDir}</button>
				</div>
				<h2>React Medium Editor</h2>
				<MediumEditor
					tag="pre"
					text={_.get(this, "state.text", "Edit me!")}
					onChange={((text) => {
						this.setState({text: text});
					})}
				/>
				<h2>Sir Trevor Editor</h2>
				<form onSubmit={this.onSubmit}>
					<textarea ref="sirTrevorEditor"/>
					<button type="submit">meditate</button>
				</form>
				<h2>Content View</h2>
				<div dangerouslySetInnerHTML={{__html: _.get(this, "state.text", "I'm hungry")}}/>
				<h2>Other Crap that Totally Shouldn't Be Way Out Here</h2>
			</div>
		);
	}

	componentDidMount() {
		const $sirTrevorEditor = $(this.refs.sirTrevorEditor);
		this.sirTrevorEditor = new SirTrevor.Editor({el: $sirTrevorEditor});
	}

	componentDidUpdate(prevProps, prevState) {
		if (_.get(this, "state.dir") !== _.get(prevState, "dir")) {
			document.querySelector("html").setAttribute("dir", _.get(this, "state.dir", "rtl"));
		}
	}

	onSubmit(event) {
		event.preventDefault();
		this.sirTrevorEditor.onFormSubmit(true);
		console.log(this.sirTrevorEditor.store.retrieve());
	}
};

ReactDOM.render(<App/>, document.getElementById("app-root"));
