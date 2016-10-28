import { expect } from "chai";

import * as React from "react";
import { shallow } from "enzyme";
import * as jsdom from "jsdom";

import ContextProvider from "../ContextProvider";

class FakeChild extends React.Component<any, any> {}

describe("ContextProvider", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <ContextProvider
        csrfToken="token"
        homeUrl="home url">
        <FakeChild />
      </ContextProvider>
    );
  });

  it("provides child context", () => {
    let context = wrapper.instance().getChildContext();
    expect(context.editorStore.getState().editor).to.be.ok;
    expect(context.editorStore.getState().catalog).to.be.ok;
    expect(context.pathFor).to.equal(wrapper.instance().pathFor);
    expect(context.csrfToken).to.equal("token");
    expect(context.homeUrl).to.equal("home url");
  });

  it("renders child", () => {
    let children = wrapper.find(FakeChild);
    expect(children.length).to.equal(1);
  });

  describe("pathFor", () => {
    let collectionUrl = "collection/url";
    let bookUrl = "book/url";
    let tab = "tab";

    it("prepares collection url", () => {
      let host = "http://example.com";
      (jsdom as any).changeURL(window, host + "/test");
      let url = host + "/groups/eng/Adult%20Fiction";
      expect(wrapper.instance().prepareCollectionUrl(url)).to.equal("groups%2Feng%2FAdult%2520Fiction");
    });

    it("prepares book url", () => {
      let host = "http://example.com";
      (jsdom as any).changeURL(window, host + "/test");
      let url = host + "/works/Axis%20360/Axis%20360%20ID/0016201449";
      expect(wrapper.instance().prepareBookUrl(url)).to.equal("Axis%2520360%2FAxis%2520360%2520ID%2F0016201449");
    });

    it("returns a path with collection, book, and tab", () => {
      let instance = wrapper.instance();
      let path = instance.pathFor(collectionUrl, bookUrl, tab);
      expect(path).to.equal(
        `/admin/web/collection/${instance.prepareCollectionUrl(collectionUrl)}` +
        `/book/${instance.prepareBookUrl(bookUrl)}/tab/${tab}`
      );
    });

    it("returns a path with collection and book", () => {
      let instance = wrapper.instance();
      let path = instance.pathFor(collectionUrl, bookUrl, null);
      expect(path).to.equal(
        `/admin/web/collection/${instance.prepareCollectionUrl(collectionUrl)}` +
        `/book/${instance.prepareBookUrl(bookUrl)}`
      );
    });

    it("returns a path with only collection", () => {
      let instance = wrapper.instance();
      let path = instance.pathFor(collectionUrl, null, null);
      expect(path).to.equal(`/admin/web/collection/${instance.prepareCollectionUrl(collectionUrl)}`);
    });

    it("returns a path with only book", () => {
      let instance = wrapper.instance();
      let path = instance.pathFor(null, bookUrl, null);
      expect(path).to.equal(`/admin/web/book/${instance.prepareBookUrl(bookUrl)}`);
    });

    it("returns a path with book and tab", () => {
      let instance = wrapper.instance();
      let path = instance.pathFor(null, bookUrl, tab);
      expect(path).to.equal(`/admin/web/book/${instance.prepareBookUrl(bookUrl)}/tab/${tab}`);
    });

    it("returns a path with no collection, book, or tab", () => {
      let path = wrapper.instance().pathFor(null, null, null);
      expect(path).to.equal(`/admin/web`);
    });
  });
});