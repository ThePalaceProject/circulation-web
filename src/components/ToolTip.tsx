import * as React from "react";

export interface ToolTipState {
  show: boolean;
}

export interface ToolTipProps {
  trigger: JSX.Element;
  text: string;
}

export default class ToolTip extends React.Component <ToolTipProps, ToolTipState> {

  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
    this.showToolTip = this.showToolTip.bind(this);
    this.hideToolTip = this.hideToolTip.bind(this);
  }

  render(): JSX.Element {
    return(
      <div className="tool-tip-container" onMouseEnter={this.showToolTip} onMouseLeave={this.hideToolTip}>
        { this.props.trigger }
        <span className={`tool-tip ${this.state.show ? "" : "hide"}`}>
          {this.props.text}
        </span>
      </div>
    );
  }

  showToolTip() {
    this.setState({ show: true });
  }

  hideToolTip() {
    this.setState({ show: false });
  }
}