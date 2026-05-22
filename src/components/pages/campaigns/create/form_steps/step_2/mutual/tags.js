import React, { Component } from 'react';
import '../../../../styles.css';
import Services from '../../../../../../services';

class Tags extends Component {
	constructor(props){
		super(props);
		this.state = { tags:[] }
	}//End constructor
	
	render() {
		const scc = Services.copyOnClick;
		const type = this.props.type;
		return (
			<div className="side_mutual">
				<h3>Content Tags</h3>
				<p>Use any of the tags below to add custom element or personalization to your email.</p>
				<div className="tagArea">
					<ul>
						{this.state.tags.map((item,i) => 
							type === '1' ?
							<li key={i}><span className="tag" onClick={scc}>{item.template}</span></li> : 
							<li key={i}><span className="tag" onClick={scc}>{item.html}</span></li>									
						)}
					</ul>
				</div>
			</div>
		);//End return
	}//End render

	componentDidMount() {
		//Getting Tags
		let tags = Services.loadArrLocalStorage(window.htmlTagsLocalStorage);
		this.setState({tags});
	}//End componentDidMount


}//End class

export default Tags;