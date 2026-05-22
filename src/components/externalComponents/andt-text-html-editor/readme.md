<HTMLEditor
	tabType="card"
	//value="<p>This is demo</p>"
	//height="500px"
	get="text-editor || code-editor"
	label="Plain Text"
	tabNames={['Template Editor', 'HTML Editor']}
	tabChangeHandle={(tabKey) => this.setState({tabKey})}
	onChange={(value) => this.setState({edValue : value})}
	tagConvert={
		[
			{html : '<campaign_name/>', template : '[campaign_name]'},
			{html : '<total_subscribers/>', template : '[total_subscribers]'},
			{html : '<total_bounced/>', template : '[total_bounced]'}
		]
    }
/>