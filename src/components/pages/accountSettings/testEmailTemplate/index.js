import React, { Component } from 'react';
import { Spin, Button } from 'antd';
import Services from '../../../services';
import HTMLEditor from '../../../externalComponents/andt-text-html-editor';

class TestEmailTemplate extends Component {
	state = {
		html: null,
		loader : false
	}//End state

	updateHTML = () => {
		this.setState({loader : true});
		Services.http('post','accountSettings/testTemplate/post.php',{html : this.state.html}).then(res => {
			this.setState({loader : false});
		});
	}//End function

	render() {
		const st = this.state;
		return (
			<div>
				<p className="pageDesc">Edit default template or create you own.</p>
				<Spin spinning={st.loader}>
					<HTMLEditor
						tabType="card"
						value={st.html}
						height="500px"
						label="Plain Text"
						tabNames={['Template Editor', 'HTML Editor']}
						onChange={(html) => this.setState({ html })}
					/>
					<div className="text-right">
						<hr className="hr-dashed m-t-20 m-b-20"/>
						<Button onClick={() => this.updateHTML()} loading={st.loader} type="primary" size="large">Update Template</Button>
					</div>
				</Spin>
			</div>
		);//End return
	}//End render
	componentDidMount(){
		this.setState({loader : true});
		Services.http('get','accountSettings/testTemplate/get.php').then(res => {
			this.setState({loader : false});
			if(!res){return false;}
			this.setState({html : res.data});
		});
	}//End componentDidMount
}//End class

export default TestEmailTemplate;