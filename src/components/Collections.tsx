import EditableConfigList from "./EditableConfigList";
import { connect } from "react-redux";
import ActionCreator from "../actions";
import { CollectionsData, CollectionData, LibraryData } from "../interfaces";
import CollectionEditForm from "./CollectionEditForm";

export class Collections extends EditableConfigList<CollectionsData, CollectionData> {
  EditForm =  CollectionEditForm;
  listDataKey = "collections";
  itemTypeName = "collection";
  urlBase = "/admin/web/config/collections/";
  identifierKey = "name";
}

function mapStateToProps(state, ownProps) {
  const data = Object.assign({}, state.editor.collections && state.editor.collections.data || {});
  data.allLibraries = state.editor.collections.libraries;
  return {
    data: data,
    fetchError: state.editor.collections.fetchError,
    isFetching: state.editor.collections.isFetching || state.editor.collections.isEditing
  };
}

function mapDispatchToProps(dispatch) {
  let actions = new ActionCreator();
  return {
    fetchData: () => dispatch(actions.fetchCollections()),
    editItem: (data: FormData) => dispatch(actions.editCollection(data))
  };
}

const ConnectedCollections = connect<any, any, any>(
  mapStateToProps,
  mapDispatchToProps,
)(Collections);

export default ConnectedCollections;