import { expect } from "chai";
import { stub } from "sinon";

import * as React from "react";
import { shallow, mount } from "enzyme";

const dnd = require("react-beautiful-dnd");
const Droppable = dnd.Droppable;
const Draggable = dnd.Draggable;

import CustomListEntriesEditor from "../CustomListEntriesEditor";

import {
  AudioHeadphoneIcon,
  BookIcon,
} from "@nypl/dgx-svg-icons";

describe("CustomListEntriesEditor", () => {
  let wrapper;
  let onUpdate;
  let loadMoreSearchResults;
  let loadMoreEntries;
  let childContextTypes;
  let fullContext;

  let searchResultsData = {
    id: "id",
    url: "url",
    title: "title",
    lanes: [],
    navigationLinks: [],
    books: [
      { id: "1", title: "result 1", authors: ["author 1"], url: "/some/url1", language: "eng",
        raw: {
          "$": { "schema:additionalType": { "value": "http://schema.org/EBook" } },
        }
      },
      { id: "2", title: "result 2", authors: ["author 2a", "author 2b"], url: "/some/url2", language: "eng",
        raw: { "$": { "schema:additionalType": { "value": "http://bib.schema.org/Audiobook" } } }},
      { id: "3", title: "result 3", authors: ["author 3"], url: "/some/url3", language: "eng",
        raw: { "$": { "schema:additionalType": { "value": "http://schema.org/EBook" } } }},
    ]
  };

  let entriesData = [
    { id: "A", title: "entry A", authors: ["author A"], url: "/some/urlA",
      raw: { "$": { "schema:additionalType": { "value": "http://schema.org/EBook" }}} },
    { id: "B", title: "entry B", authors: ["author B1", "author B2"], url: "/some/urlB",
      raw: { "$": { "schema:additionalType": { "value": "http://bib.schema.org/Audiobook" }}} },
  ];
  let entriesDataExtra = [
    { id: "C", title: "entry C", authors: ["author C"], url: "/some/urlC",
      raw: { "$": { "schema:additionalType": { "value": "http://schema.org/EBook" }}} },
    { id: "D", title: "entry D", authors: ["author D1", "author D2"], url: "/some/urlD",
      raw: { "$": { "schema:additionalType": { "value": "http://bib.schema.org/Audiobook" }}} },
  ];
  let entriesNextPageUrl = "nextpage?after=50";

  beforeEach(() => {
    onUpdate = stub();
    loadMoreSearchResults = stub();
    loadMoreEntries = stub();

    childContextTypes = {
      pathFor: React.PropTypes.func.isRequired,
      router: React.PropTypes.object.isRequired,
    };
    fullContext = Object.assign({}, {
      pathFor: stub().returns("url"),
      router: {
        createHref: stub(),
        push: stub(),
        isActive: stub(),
        replace: stub(),
        go: stub(),
        goBack: stub(),
        goForward: stub(),
        setRouteLeaveHook: stub()
      }
    });
  });

  it("renders search results", () => {
    let wrapper = mount(
      <CustomListEntriesEditor
        searchResults={searchResultsData}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
      />,
      { context: fullContext, childContextTypes }
    );
    let resultsContainer = wrapper.find(".custom-list-search-results");
    expect(resultsContainer.length).to.equal(1);

    let droppable = resultsContainer.find(Droppable);
    expect(droppable.length).to.equal(1);

    let results = droppable.find(Draggable);
    expect(results.length).to.equal(3);

    expect(results.at(0).text()).to.contain("result 1");
    expect(results.at(0).text()).to.contain("author 1");
    expect(results.at(1).text()).to.contain("result 2");
    expect(results.at(1).text()).to.contain("author 2a, author 2b");
    expect(results.at(2).text()).to.contain("result 3");
    expect(results.at(2).text()).to.contain("author 3");
  });

  it("renders a link to view each search result", () => {
    let wrapper = mount(
      <CustomListEntriesEditor
        searchResults={searchResultsData}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
      />,
      { context: fullContext, childContextTypes }
    );
    let resultsContainer = wrapper.find(".custom-list-search-results");
    expect(resultsContainer.length).to.equal(1);

    let droppable = resultsContainer.find(Droppable);
    expect(droppable.length).to.equal(1);

    let results = droppable.find(Draggable);
    expect(results.length).to.equal(3);

    expect(results.at(0).find("CatalogLink").text()).to.equal("View details");
    expect(results.at(0).find("CatalogLink").prop("bookUrl")).to.equal("/some/url1");
    expect(results.at(1).find("CatalogLink").text()).to.equal("View details");
    expect(results.at(1).find("CatalogLink").prop("bookUrl")).to.equal("/some/url2");
    expect(results.at(2).find("CatalogLink").text()).to.equal("View details");
    expect(results.at(2).find("CatalogLink").prop("bookUrl")).to.equal("/some/url3");
  });

  it("renders SVG icons for each search results", () => {
    let wrapper = mount(
      <CustomListEntriesEditor
        searchResults={searchResultsData}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
      />,
      { context: fullContext, childContextTypes }
    );
    let resultsContainer = wrapper.find(".custom-list-search-results");
    const audioSVGs = resultsContainer.find(AudioHeadphoneIcon);
    const bookSVGs = resultsContainer.find(BookIcon);

    expect(audioSVGs.length).to.equal(1);
    expect(bookSVGs.length).to.equal(2);
  });

  it("doesn't render any SVG icon with bad medium value", () => {
    searchResultsData.books[2].raw["$"]["schema:additionalType"].value = "";
    let wrapper = mount(
      <CustomListEntriesEditor
        searchResults={searchResultsData}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
      />,
      { context: fullContext, childContextTypes }
    );
    let resultsContainer = wrapper.find(".custom-list-search-results");
    const audioSVGs = resultsContainer.find(AudioHeadphoneIcon);
    const bookSVGs = resultsContainer.find(BookIcon);

    expect(audioSVGs.length).to.equal(1);
    expect(bookSVGs.length).to.equal(1);

    searchResultsData.books[2].raw["$"]["schema:additionalType"].value = "http://schema.org/EBook";
  });

  it("renders list entries", () => {
    let wrapper = mount(
      <CustomListEntriesEditor
        entries={entriesData}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
      />,
      { context: fullContext, childContextTypes }
    );

    let entriesContainer = wrapper.find(".custom-list-entries");
    expect(entriesContainer.length).to.equal(1);

    let droppable = entriesContainer.find(Droppable);
    expect(droppable.length).to.equal(1);

    let entries = droppable.find(Draggable);
    expect(entries.length).to.equal(2);

    expect(entries.at(0).text()).to.contain("entry A");
    expect(entries.at(0).text()).to.contain("author A");
    expect(entries.at(1).text()).to.contain("entry B");
    expect(entries.at(1).text()).to.contain("author B1, author B2");
  });

  it("renders a link to view each entry", () => {
    let wrapper = mount(
      <CustomListEntriesEditor
        entries={entriesData}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
        opdsFeedUrl="opdsFeedUrl"
      />,
      { context: fullContext, childContextTypes }
    );
    let entriesContainer = wrapper.find(".custom-list-entries");
    expect(entriesContainer.length).to.equal(1);

    let droppable = entriesContainer.find(Droppable);
    expect(droppable.length).to.equal(1);

    let entries = droppable.find(Draggable);
    expect(entries.length).to.equal(2);

    expect(entries.at(0).find("CatalogLink").text()).to.equal("View details");
    expect(entries.at(0).find("CatalogLink").prop("bookUrl")).to.equal("/some/urlA");
    expect(entries.at(1).find("CatalogLink").text()).to.equal("View details");
    expect(entries.at(1).find("CatalogLink").prop("bookUrl")).to.equal("/some/urlB");
  });

  it("renders SVG icons for each entry", () => {
    let wrapper = mount(
      <CustomListEntriesEditor
        entries={entriesData}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
      />,
      { context: fullContext, childContextTypes }
    );
    let entriesContainer = wrapper.find(".custom-list-entries");
    const audioSVGs = entriesContainer.find(AudioHeadphoneIcon);
    const bookSVGs = entriesContainer.find(BookIcon);

    expect(audioSVGs.length).to.equal(1);
    expect(bookSVGs.length).to.equal(1);
  });

  it("doesn't include search results that are already in the list", () => {
    let entriesData = [
      { id: "1", title: "result 1", authors: ["author 1"], language: "eng",
        raw: { "$": { "schema:additionalType": { "value": "http://bib.schema.org/Audiobook" }}} }
    ];

    let wrapper = mount(
      <CustomListEntriesEditor
        searchResults={searchResultsData}
        entries={entriesData}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
      />,
      { context: fullContext, childContextTypes }
    );

    let resultsContainer = wrapper.find(".custom-list-search-results");
    expect(resultsContainer.length).to.equal(1);

    let droppable = resultsContainer.find(Droppable);
    expect(droppable.length).to.equal(1);

    let results = droppable.find(Draggable);
    expect(results.length).to.equal(2);

    expect(results.at(0).text()).to.contain("result 2");
    expect(results.at(0).text()).to.contain("author 2a, author 2b");
    expect(results.at(1).text()).to.contain("result 3");
    expect(results.at(1).text()).to.contain("author 3");
  });

  it("prevents dragging within search results", () => {
    let wrapper = mount(
      <CustomListEntriesEditor
        searchResults={searchResultsData}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
      />,
      { context: fullContext, childContextTypes }
    );

    // simulate starting a drag from search results
    (wrapper.instance() as CustomListEntriesEditor).onDragStart({
      draggableId: "1",
      source: {
        droppableId: "search-results"
      }
    });

    let resultsContainer = wrapper.find(".custom-list-search-results");
    let droppable = resultsContainer.find(Droppable);
    expect(droppable.prop("isDropDisabled")).to.equal(true);
  });

  it("prevents dragging within list entries", () => {
    let wrapper = mount(
      <CustomListEntriesEditor
        entries={entriesData}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
      />,
      { context: fullContext, childContextTypes }
    );

    // simulate starting a drag from list entries
    (wrapper.instance() as CustomListEntriesEditor).onDragStart({
      draggableId: "A",
      source: {
        droppableId: "custom-list-entries"
      }
    });

    let entriesContainer = wrapper.find(".custom-list-entries");
    let droppable = entriesContainer.find(Droppable);
    expect(droppable.prop("isDropDisabled")).to.equal(true);
  });

  it("drags from search results to list entries", () => {
    let wrapper = mount(
      <CustomListEntriesEditor
        searchResults={searchResultsData}
        entries={entriesData}
        onUpdate={onUpdate}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
      />,
      { context: fullContext, childContextTypes }
    );

    // simulate starting a drag from search results
    (wrapper.instance() as CustomListEntriesEditor).onDragStart({
      draggableId: "1",
      source: {
        droppableId: "search-results"
      }
    });

    let entriesContainer = wrapper.find(".custom-list-entries");
    let droppable = entriesContainer.find(Droppable);
    expect(droppable.prop("isDropDisabled")).to.equal(false);

    // simulate dropping on the entries
    (wrapper.instance() as CustomListEntriesEditor).onDragEnd({
      draggableId: "1",
      source: {
        droppableId: "search-results"
      },
      destination: {
        droppableId: "custom-list-entries"
      }
    });

    // the dropped item has been added to entries at the beginning of the list
    let entries = droppable.find(Draggable);
    expect(entries.length).to.equal(3);
    expect(entries.at(0).text()).to.contain("result 1");
    expect(onUpdate.callCount).to.equal(1);
    const newEntry = {
      id: "1",
      title: "result 1",
      authors: ["author 1"],
      medium: "http://schema.org/EBook",
      language: "eng",
      url: "/some/url1"
    };
    const expectedEntries = [newEntry, entriesData[0], entriesData[1]];
    expect(onUpdate.args[0][0]).to.deep.equal(expectedEntries);
  });

  it("shows message in place of search results when dragging from list entries", () => {
    let wrapper = mount(
      <CustomListEntriesEditor
        entries={entriesData}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
      />,
      { context: fullContext, childContextTypes }
    );

    // simulate starting a drag from list entries
    (wrapper.instance() as CustomListEntriesEditor).onDragStart({
      draggableId: "A",
      source: {
        droppableId: "custom-list-entries"
      }
    });

    let resultsContainer = wrapper.find(".custom-list-search-results");
    let droppable = resultsContainer.find(Droppable);
    let message = droppable.find("p");
    expect(droppable.prop("isDropDisabled")).to.equal(false);
    expect(message.length).to.equal(1);
    expect(message.text()).to.contain("here to remove");

    // if you drop anywhere on the page, the message goes away.
    // simulate dropping outside a droppable (no destination)
    (wrapper.instance() as CustomListEntriesEditor).onDragEnd({
      draggableId: "A",
      source: {
        droppableId: "custom-list-entries"
      }
    });

    resultsContainer = wrapper.find(".custom-list-search-results");
    droppable = resultsContainer.find(Droppable);
    message = droppable.find("p");
    expect(droppable.prop("isDropDisabled")).to.equal(true);
    expect(message.length).to.equal(0);
  });

  it("drags from list entries to search results", () => {
    let wrapper = mount(
      <CustomListEntriesEditor
        searchResults={searchResultsData}
        entries={entriesData}
        onUpdate={onUpdate}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
      />,
      { context: fullContext, childContextTypes }
    );

    // simulate starting a drag from entries
    (wrapper.instance() as CustomListEntriesEditor).onDragStart({
      draggableId: "A",
      source: {
        droppableId: "custom-list-entries"
      }
    });

    let resultsContainer = wrapper.find(".custom-list-search-results");
    let droppable = resultsContainer.find(Droppable);
    expect(droppable.prop("isDropDisabled")).to.equal(false);

    // simulate dropping on the search results
    (wrapper.instance() as CustomListEntriesEditor).onDragEnd({
      draggableId: "A",
      source: {
        droppableId: "custom-list-entries"
      },
      destination: {
        droppableId: "search-results"
      }
    });

    // the dropped item has been removed from entries
    let entriesContainer = wrapper.find(".custom-list-entries");
    droppable = entriesContainer.find(Droppable);
    let entries = droppable.find(Draggable);
    expect(entries.length).to.equal(1);
    expect(entries.at(0).text()).to.contain("entry B");
    expect(onUpdate.callCount).to.equal(1);
    const expectedEntries = [entriesData[1]];
    expect(onUpdate.args[0][0]).to.deep.equal(expectedEntries);
  });

  it("adds a search result to the list", () => {
    let wrapper = mount(
      <CustomListEntriesEditor
        searchResults={searchResultsData}
        entries={entriesData}
        onUpdate={onUpdate}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
      />,
      { context: fullContext, childContextTypes }
    );

    let addLink = wrapper.find(".custom-list-search-results .links a");
    addLink.at(0).simulate("click");

    // the item has been added to entries at the beginning of the list
    let entriesContainer = wrapper.find(".custom-list-entries");
    let droppable = entriesContainer.find(Droppable);
    let entries = droppable.find(Draggable);
    expect(entries.length).to.equal(3);
    expect(entries.at(0).text()).to.contain("result 1");
    expect(onUpdate.callCount).to.equal(1);
    const newEntry = {
      id: "1",
      title: "result 1",
      authors: ["author 1"],
      medium: "http://schema.org/EBook",
      language: "eng",
      url: "/some/url1"
    };
    const expectedEntries = [newEntry, entriesData[0], entriesData[1]];
    expect(onUpdate.args[0][0]).to.deep.equal(expectedEntries);
  });

  it("removes an entry from the list and also adds to 'deleted' state", () => {
    let wrapper = mount(
      <CustomListEntriesEditor
        searchResults={searchResultsData}
        entries={entriesData}
        onUpdate={onUpdate}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
      />,
      { context: fullContext, childContextTypes }
    );

    let deleteLink = wrapper.find(".custom-list-entries .links a");
    deleteLink.at(0).simulate("click");

    // the item has been removed from entries
    let entriesContainer = wrapper.find(".custom-list-entries");
    let droppable = entriesContainer.find(Droppable);
    let entries = droppable.find(Draggable);
    expect(entries.length).to.equal(1);
    expect(entries.at(0).text()).to.contain("entry B");
    expect(onUpdate.callCount).to.equal(1);
    const expectedEntries = [entriesData[1]];
    expect(onUpdate.args[0][0]).to.deep.equal(expectedEntries);

    expect(wrapper.state().deleted.length).to.equal(1);
    expect(wrapper.state().deleted).to.eql([entriesData[0]]);
  });

  it("resets", () => {
    let wrapper = mount(
      <CustomListEntriesEditor
        searchResults={searchResultsData}
        onUpdate={onUpdate}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
      />,
      { context: fullContext, childContextTypes }
    );

    // simulate dropping a search result on entries
    (wrapper.instance() as CustomListEntriesEditor).onDragEnd({
      draggableId: "1",
      source: {
        droppableId: "search-results"
      },
      destination: {
        droppableId: "custom-list-entries"
      }
    });

    expect((wrapper.instance() as CustomListEntriesEditor).getEntries().length).to.equal(1);
    expect(onUpdate.callCount).to.equal(1);
    (wrapper.instance() as CustomListEntriesEditor).reset();
    expect((wrapper.instance() as CustomListEntriesEditor).getEntries().length).to.equal(0);
    expect(onUpdate.callCount).to.equal(2);

    wrapper = mount(
      <CustomListEntriesEditor
        entries={entriesData}
        onUpdate={onUpdate}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
      />,
      { context: fullContext, childContextTypes }
    );

    // simulate dropping an entry on search results
    (wrapper.instance() as CustomListEntriesEditor).onDragEnd({
      draggableId: "A",
      source: {
        droppableId: "custom-list-entries"
      },
      destination: {
        droppableId: "search-results"
      }
    });

    expect((wrapper.instance() as CustomListEntriesEditor).getEntries().length).to.equal(1);
    expect(onUpdate.callCount).to.equal(3);
    (wrapper.instance() as CustomListEntriesEditor).reset();
    expect((wrapper.instance() as CustomListEntriesEditor).getEntries().length).to.equal(2);
    expect(onUpdate.callCount).to.equal(4);
  });

  it("hides add all button when there are no search results", () => {
    let wrapper = shallow(
      <CustomListEntriesEditor
        entries={entriesData}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
      />,
      { context: fullContext, childContextTypes }
    );
    let button = wrapper.find(".add-all-button");
    expect(button.length).to.equal(0);
  });

  it("adds all search results to list", () => {
    let wrapper = mount(
      <CustomListEntriesEditor
        searchResults={searchResultsData}
        entries={entriesData}
        onUpdate={onUpdate}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
      />,
      { context: fullContext, childContextTypes }
    );
    let button = wrapper.find(".add-all-button");
    button.simulate("click");

    let entriesContainer = wrapper.find(".custom-list-entries");
    let droppable = entriesContainer.find(Droppable);
    let entries = droppable.find(Draggable);
    expect(entries.length).to.equal(5);

    expect(entries.at(0).text()).to.contain("result 1");
    expect(entries.at(1).text()).to.contain("result 2");
    expect(entries.at(2).text()).to.contain("result 3");
    expect(entries.at(3).text()).to.contain("entry A");
    expect(entries.at(4).text()).to.contain("entry B");
    expect(onUpdate.callCount).to.equal(1);
    expect(onUpdate.args[0][0].length).to.equal(5);
  });

  it("hides delete all button when there are no entries", () => {
    let wrapper = shallow(
      <CustomListEntriesEditor
        searchResults={searchResultsData}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
      />,
      { context: fullContext, childContextTypes }
    );
    let button = wrapper.find(".delete-all-button");
    expect(button.length).to.equal(0);
  });

  it("deletes all entries from list", () => {
    let wrapper = mount(
      <CustomListEntriesEditor
        entries={entriesData}
        onUpdate={onUpdate}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
      />,
      { context: fullContext, childContextTypes }
    );
    let button = wrapper.find(".delete-all-button");
    button.simulate("click");
    let entriesContainer = wrapper.find(".custom-list-entries");
    let droppable = entriesContainer.find(Droppable);
    let entries = droppable.find(Draggable);
    expect(entries.length).to.equal(0);
    expect(onUpdate.callCount).to.equal(1);
    expect(onUpdate.args[0][0].length).to.equal(0);
  });

  it("hides load more button when there's no next link for search results", () => {
    let wrapper = mount(
      <CustomListEntriesEditor
        entries={entriesData}
        onUpdate={onUpdate}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
      />,
      { context: fullContext, childContextTypes }
    );
    // no search results at all
    let button = wrapper.find(".custom-list-search-results .load-more-button");
    expect(button.length).to.equal(0);

    // search results with no next link
    wrapper.setProps({ searchResults: searchResultsData });
    button = wrapper.find(".custom-list-search-results .load-more-button");
    expect(button.length).to.equal(0);
  });

  it("hides load more button when there's no next link for a list's entries", () => {
    let wrapper = mount(
      <CustomListEntriesEditor
        onUpdate={onUpdate}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
      />,
      { context: fullContext, childContextTypes }
    );
    // no search results at all
    let button = wrapper.find(".custom-list-entries .load-more-button");
    expect(button.length).to.equal(0);

    // search results with no next link
    wrapper.setProps({ entries: entriesData });
    button = wrapper.find(".custom-list-entries .load-more-button");
    expect(button.length).to.equal(0);
  });

  it("disables load more button when loading more search results", () => {
    let searchResultsWithNext = Object.assign({}, searchResultsData, {
      nextPageUrl: "next"
    });
    let wrapper = mount(
      <CustomListEntriesEditor
        searchResults={searchResultsWithNext}
        entries={entriesData}
        onUpdate={onUpdate}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
      />,
      { context: fullContext, childContextTypes }
    );
    let button = wrapper.find(".custom-list-search-results .load-more-button");
    expect(button.length).to.equal(1);
    expect(button.prop("disabled")).to.equal(false);

    wrapper.setProps({ isFetchingMoreSearchResults: true });
    button = wrapper.find(".custom-list-search-results .load-more-button");
    expect(button.length).to.equal(1);
    expect(button.prop("disabled")).to.equal(true);
  });

  it("disables load more button when loading more entries for a list", () => {
    let wrapper = mount(
      <CustomListEntriesEditor
        entries={entriesData}
        nextPageUrl={entriesNextPageUrl}
        onUpdate={onUpdate}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
      />,
      { context: fullContext, childContextTypes }
    );
    let button = wrapper.find(".custom-list-entries .load-more-button");
    expect(button.length).to.equal(1);
    expect(button.prop("disabled")).to.equal(false);

    wrapper.setProps({ isFetchingMoreCustomListEntries: true });
    button = wrapper.find(".custom-list-entries .load-more-button");
    expect(button.length).to.equal(1);
    expect(button.prop("disabled")).to.equal(true);
  });

  it("loads more search results", () => {
    let searchResultsWithNext = Object.assign({}, searchResultsData, {
      nextPageUrl: "next"
    });
    let wrapper = mount(
      <CustomListEntriesEditor
        searchResults={searchResultsWithNext}
        entries={entriesData}
        onUpdate={onUpdate}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
      />,
      { context: fullContext, childContextTypes }
    );

    let button = wrapper.find(".custom-list-search-results .load-more-button");
    button.simulate("click");
    expect(loadMoreSearchResults.callCount).to.equal(1);
  });

  it("loads more entries in a list", () => {
    let wrapper = mount(
      <CustomListEntriesEditor
        entries={entriesData}
        nextPageUrl={entriesNextPageUrl}
        onUpdate={onUpdate}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
      />,
      { context: fullContext, childContextTypes }
    );

    let button = wrapper.find(".custom-list-entries .load-more-button");
    button.simulate("click");
    expect(loadMoreEntries.callCount).to.equal(1);
  });

  it("should properly display how many books are in the entry list", () => {
    let wrapper = mount(
      <CustomListEntriesEditor
        entries={entriesData}
        nextPageUrl={entriesNextPageUrl}
        onUpdate={onUpdate}
        loadMoreSearchResults={loadMoreSearchResults}
        loadMoreEntries={loadMoreEntries}
        isFetchingMoreSearchResults={false}
        isFetchingMoreCustomListEntries={false}
        entryCount={"10"}
      />,
      { context: fullContext, childContextTypes }
    );

    let display = wrapper.find(".custom-list-entries h4");

    expect(display.text()).to.equal("Displaying 1 - 2 of 10 Books");

    wrapper.setState({ entries: [] });

    expect(display.text()).to.equal("No books in this list");

    wrapper.setState({ entries: entriesData.concat(entriesDataExtra) });
    wrapper.setProps({ entryCount: "20" });

    expect(display.text()).to.equal("Displaying 1 - 4 of 20 Books");

    wrapper.setProps({ entryCount: "1047" });

    expect(display.text()).to.equal("Displaying 1 - 4 of 1047 Books");
  });
});
