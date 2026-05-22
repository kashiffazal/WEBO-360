import React, { Component } from 'react';
import { Spin, Button } from 'antd';
import Services from '../../../services';
import HTMLEditor from '../../../externalComponents/andt-text-html-editor';
class ConfirmationEmailTemplate extends Component {
	state = {
		html: null,
		tabKey : '1',
		loader : false
	}//End state

	updateHTML = () => {
		this.setState({loader : true});
		Services.http('post','accountSettings/confirmationTemplate/post.php',{html : this.state.html}).then(res => {
			this.setState({loader : false});
		});
	}//End function

	render() {
		const st = this.state;
		const scc = Services.copyOnClick;
		return (
			<div>
				<p className="pageDesc">
					Edit default template or create you own, you can use the following tags into your template/HTML code.<br/>
					{st.tabKey === '1' ?
					<span className="dis-block p-t-8">
						Template : &nbsp;
						<span className="tag" onClick={scc} >[campaign_name]</span>,&nbsp;
						<span className="tag" onClick={scc} >[total_subscribers]</span>,&nbsp;
						<span className="tag" onClick={scc} >[total_bounced]</span>
					</span> :
					<span className="dis-block p-t-8">
						HTML Tags: &nbsp;
						<span className="tag" onClick={scc}>&#60;campaign_name/&#62;</span>,&nbsp;
						<span className="tag" onClick={scc}>&#60;total_subscribers/&#62;</span>,&nbsp;
						<span className="tag" onClick={scc}>&#60;total_bounced/&#62;</span>
					</span> 
					}
				</p>
				<Spin spinning={st.loader}>
					<HTMLEditor
						tabType="card"
						value={st.html}
						height="500px"
						label="Plain Text"
						tabNames={['Template Editor', 'HTML Editor']}
						tabChangeHandle={(tabKey) => this.setState({tabKey})}
						onChange={(html) => this.setState({ html })}
						tagConvert={
							[
								{html : '<campaign_name/>', template : '[campaign_name]'},
								{html : '<total_subscribers/>', template : '[total_subscribers]'},
								{html : '<total_bounced/>', template : '[total_bounced]'}
							]
						}
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
		Services.http('get','accountSettings/confirmationTemplate/get.php').then(res => {
			this.setState({loader : false});
			if(!res){return false;}
			this.setState({html : res.data});
		});
	}//End componentDidMount
}//End class

export default ConfirmationEmailTemplate;