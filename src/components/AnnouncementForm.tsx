import * as React from "react";
import EditableInput from "./EditableInput";
import { Button } from "library-simplified-reusable-components";

export interface AnnouncementFormProps {
  content?: string;
  startDate?: string;
  endDate?: string;
  onChange?: () => void;
  add?: (announcement: any) => void;
}

export interface AnnouncementFormState {
  content?: string;
  startDate?: string;
  endDate?: string;
}

export default class AnnouncementForm extends React.Component<AnnouncementFormProps, AnnouncementFormState>{
  constructor(props: AnnouncementFormProps) {
    super(props);
    this.updateStartDate = this.updateStartDate.bind(this);
    this.updateEndDate = this.updateEndDate.bind(this);
    let [start, end] = this.getDefaultDates()
    this.state = {content: "", startDate: start, endDate: end};
  }
  getDefaultDates(): string[] {
    let today = new Date();
    let startDate = this.formatDate(today);
    let endDate = this.formatDate(new Date(today.setMonth(today.getMonth() + 2)));
    return [startDate, endDate];
  }
  formatDate(date: Date): string {
    let [month, day, year] = date.toLocaleDateString().split("/");
    return `${year}-${month.toString().length === 1 ? "0" + month : month}-${day.toString().length === 1 ? "0" + day : day}`;
  }
  updateContent(content: string) {
    this.setState({ content });
  }
  updateStartDate(startDate: string) {
    this.setState({ startDate });
  }
  updateEndDate(endDate: string) {
    this.setState({ endDate });
  }
  add(e) {
    e.preventDefault();
    this.props.add({ content: this.state.content, startDate: this.state.startDate, endDate: this.state.endDate });
    this.setState({ content: "", startDate: "", endDate: "" });
  }
  componentWillReceiveProps(newProps: AnnouncementFormProps) {
    if (newProps.content !== this.props.content) {
      this.setState({ content: newProps.content, startDate: this.formatDate(new Date(newProps.startDate)), endDate: this.formatDate(new Date(newProps.endDate)) });
    }
  }
  render(): JSX.Element {
    return (
      <div>
        <EditableInput type="text" value={this.state.content} label="Content" optionalText={false} onChange={(e) => this.updateContent(e)} />
        <EditableInput type="date" max={this.state.endDate} value={this.state.startDate} label="Start" optionalText={false} onChange={(e) => this.updateStartDate(e)} description="If no start date is chosen, the default start date is today's date."/>
        <EditableInput type="date" min={this.state.startDate} value={this.state.endDate} label="End" optionalText={false} onChange={(e) => this.updateEndDate(e)} description="If no expiration date is chosen, the default expiration date is 2 months from the start date." />
        <Button callback={(e) => this.add(e)} className="left-align" disabled={!(this.state.content && this.state.startDate && this.state.endDate)}/>
      </div>
    );
  }
}
