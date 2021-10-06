import * as React from "react";
import { Store } from "redux";
import * as PropTypes from "prop-types";
import Header from "./Header";
import Footer from "./Footer";
import CustomLists from "./CustomLists";
import { State } from "../reducers/index";
import { ListManagerContext } from "./ListManagerContext";

export interface CustomListPageProps {
  params: {
    library?: string;
    editOrCreate?: string;
    identifier?: string;
  };
  location?: { [key: string]: string | { [key: string]: string } };
}

export interface CustomListPageContext {
  editorStore: Store<State>;
  csrfToken: string;
}

/** Page that shows all lists for a library and allows creating and editing lists. */

export default function CustomListPage({
  params,
  location,
}: CustomListPageProps) {
  const { editorStore, csrfToken } = React.useContext<CustomListPageContext>(
    ListManagerContext
  );
  const { library, editOrCreate, identifier } = params;

  let startingTitle;
  if (location && location.state) {
    startingTitle = (location.state as any).bookTitle;
  }

  return (
    <div className="custom-list-page">
      <Header />
      <CustomLists
        library={library}
        editOrCreate={editOrCreate}
        identifier={identifier}
        store={editorStore}
        csrfToken={csrfToken}
        startingTitle={startingTitle}
      />
      <Footer />
    </div>
  );
}
