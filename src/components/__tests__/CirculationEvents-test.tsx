jest.autoMockOff();

import * as React from "react";
import { shallow } from "enzyme";

import { CirculationEvents } from "../CirculationEvents";
import ErrorMessage from "../ErrorMessage";
import CatalogLink from "opds-web-client/lib/components/CatalogLink";
import { CirculationEventData } from "../../interfaces";

describe("CirculationEvents", () => {
  let eventsData: CirculationEventData[] = [
    {
      id: 1,
      type: "check_in",
      patron_id: "patron id",
      time: "Wed, 01 Jun 2016 16:49:17 GMT",
      book: {
        title: "book 1 title",
        url: "book 1 url"
      }
    },
    {
      id: 2,
      type: "check_out",
      patron_id: null,
      time: "Wed, 01 Jun 2016 12:00:00 GMT",
      book: {
        title: "book 2 title",
        url: "book 2 url"
      }
    },
  ];

  describe("rendering", () => {
    let wrapper;
    let fetchError = { status: 401, response: "test", url: "test url" };
    let fetchCirculationEvents;

    beforeEach(() => {
      wrapper = shallow(
        <CirculationEvents
          events={eventsData}
          fetchCirculationEvents={jest.genMockFunction()}
          />
      );
    });

    it("shows header", () => {
      let header = wrapper.find("h3");
      expect(header.text()).toBe("Circulation Events");
    });

    it("shows error message", () => {
      let error = wrapper.find(ErrorMessage);
      expect(error.length).toBe(0);
      wrapper.setProps({ fetchError });
      error = wrapper.find(ErrorMessage);
      expect(error.length).toBe(1);
    });

    it("shows table data", () => {
      let instance = wrapper.instance();
      let table = wrapper.find("table").find("tbody");
      let rows = table.find("tr");

      rows.forEach((row, i) => {
        let data = eventsData[i];
        let link = row.find(CatalogLink);
        expect(link.prop("bookUrl")).toBe(data.book.url);
        expect(link.children().text()).toBe(data.book.title);
        let patronId = row.find("td").at(1);
        expect(patronId.text()).toBe(data.patron_id || "-");
        let type = row.find("td").at(2);
        expect(type.text()).toBe(instance.formatType(data.type));
        let time = row.find("td").at(3);
        expect(time.text()).toBe(instance.formatTime(data.time));
      });
    });
  });

  describe("behavior", () => {
    let wrapper;
    let fetchCirculationEvents = jest.genMockFunction();

    beforeEach(() => {
      wrapper = shallow(
        <CirculationEvents
          events={eventsData}
          fetchCirculationEvents={fetchCirculationEvents}
          wait={1}
          />
      );
    });

    afterEach(() => {

    });

    it("fetches events data on mount", () => {
      expect(fetchCirculationEvents.mock.calls.length).toBe(1);
    });

    it("sets interval for fetches", () => {
      expect((setInterval as any).mock.calls.length).toBe(1);
      expect((setInterval as any).mock.calls[0][0]).toBe(fetchCirculationEvents);
      expect((setInterval as any).mock.calls[0][1]).toBe(1000);
    });
  });
});
