import * as React from "react";
import Libraries from "./Libraries";
import Collections from "./Collections";
import AdminAuthServices from "./AdminAuthServices";
import IndividualAdmins from "./IndividualAdmins";
import PatronAuthServices from "./PatronAuthServices";
import SitewideSettings from "./SitewideSettings";
import MetadataServices from "./MetadataServices";
import AnalyticsServices from "./AnalyticsServices";
import DRMServices from "./DRMServices";
import CDNServices from "./CDNServices";
import SearchServices from "./SearchServices";
import { TabContainer, TabContainerProps } from "./TabContainer";

export interface ConfigTabContainerProps extends TabContainerProps {
  editOrCreate?: string;
  identifier?: string;
}

export default class ConfigTabContainer extends TabContainer<ConfigTabContainerProps> {
  tabs() {
    return {
      libraries: (
        <Libraries
          store={this.props.store}
          csrfToken={this.props.csrfToken}
          editOrCreate={this.props.editOrCreate}
          identifier={this.props.identifier}
          />
      ),
      collections: (
        <Collections
          store={this.props.store}
          csrfToken={this.props.csrfToken}
          editOrCreate={this.props.editOrCreate}
          identifier={this.props.identifier}
          />
      ),
      adminAuth: (
        <AdminAuthServices
          store={this.props.store}
          csrfToken={this.props.csrfToken}
          editOrCreate={this.props.editOrCreate}
          identifier={this.props.identifier}
          />
      ),
      individualAdmins: (
        <IndividualAdmins
          store={this.props.store}
          csrfToken={this.props.csrfToken}
          editOrCreate={this.props.editOrCreate}
          identifier={this.props.identifier}
          />
      ),
      patronAuth: (
        <PatronAuthServices
          store={this.props.store}
          csrfToken={this.props.csrfToken}
          editOrCreate={this.props.editOrCreate}
          identifier={this.props.identifier}
          />
      ),
      sitewideSettings: (
        <SitewideSettings
          store={this.props.store}
          csrfToken={this.props.csrfToken}
          editOrCreate={this.props.editOrCreate}
          identifier={this.props.identifier}
          />
      ),
      metadata: (
        <MetadataServices
          store={this.props.store}
          csrfToken={this.props.csrfToken}
          editOrCreate={this.props.editOrCreate}
          identifier={this.props.identifier}
          />
      ),
      analytics: (
        <AnalyticsServices
          store={this.props.store}
          csrfToken={this.props.csrfToken}
          editOrCreate={this.props.editOrCreate}
          identifier={this.props.identifier}
          />
      ),
      drm: (
        <DRMServices
          store={this.props.store}
          csrfToken={this.props.csrfToken}
          editOrCreate={this.props.editOrCreate}
          identifier={this.props.identifier}
          />
      ),
      cdn: (
        <CDNServices
          store={this.props.store}
          csrfToken={this.props.csrfToken}
          editOrCreate={this.props.editOrCreate}
          identifier={this.props.identifier}
          />
      ),
      search: (
        <SearchServices
          store={this.props.store}
          csrfToken={this.props.csrfToken}
          editOrCreate={this.props.editOrCreate}
          identifier={this.props.identifier}
          />
      )
    };
  }

  handleSelect(event) {
    let tab = event.target.dataset.tabkey;
    if (this.context.router) {
      this.context.router.push("/admin/web/config/" + tab);
    }
  }

  tabDisplayName(name) {
    if (name === "adminAuth") {
      return "Admin Authentication";
    } else if (name === "individualAdmins") {
      return "Individual Admins";
    } else if (name === "patronAuth") {
      return "Patron Authentication";
    } else if (name === "sitewideSettings") {
      return "Sitewide Settings";
    } else if (name === "drm") {
      return "DRM";
    } else if (name === "cdn") {
      return "CDN";
    } else {
      return super.tabDisplayName(name);
    }
  }

  defaultTab() {
    return "libraries";
  }
}