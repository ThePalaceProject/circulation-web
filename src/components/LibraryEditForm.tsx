import * as React from "react";
import EditableInput from "./EditableInput";
import { LibrariesData, LibraryData } from "../interfaces";

export interface LibraryEditFormProps {
  data: LibrariesData;
  item?: LibraryData;
  csrfToken: string;
  disabled: boolean;
  editItem: (data: FormData) => Promise<void>;
}

export interface LibraryEditFormState {
  useRandomSecret: boolean;
}

export default class LibraryEditForm extends React.Component<LibraryEditFormProps, LibraryEditFormState> {
  constructor(props) {
    super(props);
    this.state = {
      useRandomSecret: false
    };
    this.handleRandomSecretChange = this.handleRandomSecretChange.bind(this);
  }

  render(): JSX.Element {
    return (
      <form ref="form" onSubmit={this.save.bind(this)} className="edit-form">
        <input
          type="hidden"
          name="csrf_token"
          value={this.props.csrfToken}
          />
        <input
          type="hidden"
          name="uuid"
          value={this.props.item && this.props.item.uuid}
          />
        <EditableInput
          elementType="input"
          type="text"
          disabled={this.props.disabled}
          name="name"
          label="Name"
          value={this.props.item && this.props.item.name}
          />
        <EditableInput
          elementType="input"
          type="text"
          disabled={this.props.disabled}
          name="short_name"
          label="Short name"
          value={this.props.item && this.props.item.short_name}
          />
        <EditableInput
          elementType="input"
          type="text"
          disabled={this.props.disabled}
          name="library_registry_short_name"
          label="Short name (for library registry)"
          value={this.props.item && this.props.item.library_registry_short_name}
          />
        { (!this.props.item || !this.props.item.library_registry_shared_secret) &&
          <EditableInput
            elementType="input"
            type="checkbox"
            disabled={this.props.disabled}
            name="random_library_registry_shared_secret"
            label="Set the library registry shared secret to a random value"
            onChange={this.handleRandomSecretChange}
            ref="randomSecret"
            />
        }
        { !this.state.useRandomSecret &&
          <EditableInput
            elementType="input"
            type="text"
            disabled={this.props.disabled}
            name="library_registry_shared_secret"
            label="Shared secret (for library registry)"
            value={this.props.item && this.props.item.library_registry_shared_secret}
            />
        }
        { this.props.data.settings && this.props.data.settings.map(setting =>
          <EditableInput
            elementType="input"
            type="text"
            disabled={this.props.disabled}
            name={setting.key}
            label={setting.label}
            value={this.props.item && this.props.item.settings && this.props.item.settings[setting.key]}
            />
          )
        }
        <button
          className="btn btn-default"
          disabled={this.props.disabled}
          type="submit">
          Submit
        </button>
      </form>
    );
  }

  save(event) {
    event.preventDefault();

    const data = new (window as any).FormData(this.refs["form"] as any);
    this.props.editItem(data);
  }

  handleRandomSecretChange() {
    const value = !this.state.useRandomSecret;
    this.setState({ useRandomSecret: value });
  }
}