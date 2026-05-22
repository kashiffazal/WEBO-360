import React, { Component } from 'react';
import { Icon } from 'antd';
import './styles.css';
import './styles-flip-book.css';

class ScreenLoader extends Component {
	render() {
		const pr = this.props;
		const {
			active,
			color,
			bg,
			children } = pr;

		const type = (pr.type && pr.type <= 4 && pr.type !== 0 ? pr.type : '1');
		const tip = pr.tip ? pr.tip : "Loading, Please wait...";
		const loaderType = pr.loaderType ? pr.loaderType : "circle";
		const childExists = pr.children ? "children_container" : "";
		const bgc = pr.bgc ? pr.bgc : "white";
		const inline = pr.inline ? "c_k_screenLoaderInline" : "";
		const style = pr.style ? pr.style : {};


		const colorStyle = (color ? { 'color': color } : {});
		const bgStyle = (bg ? { 'background': bg } : {});

		return (
			<span className={"c_k_screenLoader_0"} style={style}>
				{active ?
					<span className={childExists + " " + inline}>
						<div className={`c_k_container bgc_${bgc}`} style={bgStyle}>
							<div className="content">
								{(loaderType === 'box') &&
									<div className="inline">
										<div className="spinner"><img src={require('./' + type + '.svg')} alt="" /></div>
										<div className="label" style={colorStyle}>{tip}</div>
									</div>
								}
								{loaderType === 'window' &&
									<div className="cube-wrapper">
										<div className="cube-folding">
											<span className="leaf1"></span>
											<span className="leaf2"></span>
											<span className="leaf3"></span>
											<span className="leaf4"></span>
										</div>
										<span className="loading" style={colorStyle}>{tip}</span>
									</div>
								}
								{loaderType === 'jellyBox' &&
									<div>
										<div id="loader">
											<div id="shadow"></div>
											<div id="box"></div>
										</div>
										<div className="label jellyBoxLabel" style={colorStyle}>{tip}</div>
									</div>
								}
								{loaderType === 'flipbook' &&
									<div>
										<div className="book">
											<div className="book__page"></div>
											<div className="book__page"></div>
											<div className="book__page"></div>
										</div>
										<div className="label">{tip}</div>
									</div>
								}
								{loaderType === 'circle' &&
									<div>
										<div className="circle">
											<Icon type="loading" /><br />
											<div className="label">{tip}</div>
										</div>
									</div>
								}
							</div>{/*End Content*/}
							<span className="children">{children}</span>
						</div>{/*End c_k_container*/}
					</span>
					: (children && children)
				}
			</span>
		);
	}
}

export default ScreenLoader;