import * as React from "react";
import { ButtonInput } from "react-bootstrap";

export interface ButtonFormProps extends React.HTMLProps<ButtonForm> {
  label: string;
  submit: (...args: any[]) => void;
  disabled?: boolean;
}

export default class ButtonForm extends React.Component<ButtonFormProps, any> {
  render(): JSX.Element {
    let disabledProps = this.props.disabled ? { disabled: true } : {};

    return (
      <input
        className={"btn btn-default " + this.props.className}
        style={{ marginRight: "10px" }}
        type="submit"
        value={this.props.label}
        onClick={this.props.submit}
        {...disabledProps}
        />
    );
  }
}