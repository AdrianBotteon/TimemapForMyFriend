import React from "react";
import { connect } from "react-redux";
import { generateCardLayout, Card } from "./Card";

import * as selectors from "../../selectors";
import {
  getFilterIdxFromColorSet, isValidHttpUrl,
  typeForPath,
} from "../../common/utilities";
import copy from "../../common/data/copy.json";
import hash from "object-hash";
const internalDomains = ["pad.ma"];

class CardStack extends React.Component {
  constructor() {
    super();
    this.refs = {};
    this.refCardStack = React.createRef();
    this.refCardStackContent = React.createRef();
  }

  componentDidUpdate() {
    const isNarrative = !!this.props.narrative;

    if (isNarrative) {
      this.scrollToCard();
    }
  }

  scrollToCard() {
    const duration = 500;
    const element = this.refCardStack.current;
    const cardScroll =
      this.refs[this.props.narrative.current].current.offsetTop;

    const start = element.scrollTop;
    const change = cardScroll - start;
    let currentTime = 0;
    const increment = 20;

    // t = current time
    // b = start value
    // c = change in value
    // d = duration
    Math.easeInOutQuad = function (t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t -= 1;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    const animateScroll = function () {
      currentTime += increment;
      const val = Math.easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) setTimeout(animateScroll, increment);
    };
    animateScroll();
  }

  // renderCards(events, selections) {
  //   // if no selections provided, select all
  //   console.log(events)
  //   if (!selections) {
  //     selections = events.map((e) => true);
  //   }
  //   this.refs = [];

  //   const generateTemplate =
  //   // generateCardLayout["sourced"];
  //   generateCardLayout[this.props.cardUI.layout.template];


  //   return events.map((event, idx) => {
  //     const thisRef = React.createRef();
  //     this.refs[idx] = thisRef;

  //     const content = generateTemplate({
  //       event,
  //       colors: this.props.colors,
  //       coloringSet: this.props.coloringSet,
  //       getFilterIdxFromColorSet,
  //     });
  //     console.log(content)
  //     return (
  //       <Card
  //         key={hash(content)}
  //         content={content}
  //         language={this.props.language}
  //         isLoading={this.props.isLoading}
  //         isSelected={selections[idx]}
  //       />
  //     );
  //   });
  // }

  renderSourcePath = (path, index) => {
    if (!isValidHttpUrl(path)) return "";

    if (internalDomains.some((domain) => path?.includes(domain))) {
      let typeOfPath = typeForPath(path);
      switch (typeOfPath) {
        case "Video":
          return (
            <a
              className="c-source"
              target="_default"
              onClick={() =>
                this.setState({
                  showInternalSource: true,
                  selectedSource: path,
                })
              }
            >
              Sources {index + 1}
            </a>
          );
        default:
          return (
            <a className="c-source" target="_default" href={path}>
              Sources {index + 1}
            </a>
          );
      }
    } else
      return (
        <a className="c-source" target="_default" href={path}>
          Sources {index + 1}
        </a>
      );
  };

  renderCards(events, selections) {
    // if no selections provided, select all
    if (!selections) {
      selections = events.map((e) => true);
    }
    this.refs = [];
    console.log("events", events);
    const generateTemplate =
      generateCardLayout[this.props.cardUI.layout.template];

    return events.map((event, idx) => {
      const thisRef = React.createRef();
      this.refs[idx] = thisRef;

      return (
        <>
          <div className="card-row">
            <div className="event-card selected">
              <div className="card-row">
                <div className="card-cell">
                  <h4>Incident Date</h4>
                  {new Date(event.date).toDateString()}
                </div>
                <div className="card-cell">
                  <h4>Location</h4>
                  {event?.location}
                </div>
              </div>
              <div className="card-row">
                <div className="card-cell">
                  <h4>Summary</h4>
                  {event?.description}
                </div>
              </div>
              <div className="card-row">
                <div className="card-cell">
                  <h4>Sources</h4>
                  {event?.sources?.map((eachSource) => {
                    return (
                      <div>
                        {/* <button style={{ "border-radius": 12 }} onclick=")"> */}
                        {eachSource?.paths?.map((eachPath, i) =>
                          <a target="blank" href={eachPath} style={{ "margin":"3px", "border-radius": 5, "border": "1px solid black", "color":"black" }}>
                            {eachSource?.id + "-" + (i+1)}
                          </a>
                        )}
                        {/* <a target="blank" href={"https://github.com/AdrianBotteon/TimemapForMyFriend.git"} style={{ "border-radius": 6, "border": "1px solid black" }}>
                          {eachSource?.id}
                          {eachSource?.paths} */}

                          {/* <span>{eachSource?.id}</span> */}
                          {/* <div
                            style={{
                              display: "flex",
                              flexDirections: "row",
                              gap: 10,
                              alignItems: "center",
                              marginTop: 5,
                            }}
                          >
                            {eachSource?.paths?.map((eachPath, i) =>
                              this.renderSourcePath(eachPath, i)
                            )}
                          </div> */}
                        {/* </a> */}
                        {/* </button> */}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          {/* <Card
            ref={thisRef}
            content={generateTemplate({
              event,
              colors: this.props.colors,
              coloringSet: this.props.coloringSet,
              getFilterIdxFromColorSet,
            })}
            language={this.props.language}
            isLoading={this.props.isLoading}
            isSelected={selections[idx]}
          /> */}
        </>
      );
    });
  }

  renderSelectedCards() {
    const { selected } = this.props;

    if (selected.length > 0) {
      return this.renderCards(selected);
    }
    return null;
  }

  renderNarrativeCards() {
    const { narrative } = this.props;
    const showing = narrative.steps;

    const selections = showing.map((_, idx) => idx === narrative.current);

    return this.renderCards(showing, selections);
  }

  renderCardStackHeader() {
    const headerLang = copy[this.props.language].cardstack.header;

    return (
      <div
        id="card-stack-header"
        className="card-stack-header"
        onClick={() => this.props.onToggleCardstack()}
      >
        <button className="side-menu-burg is-active">
          <span />
        </button>
        <p className="header-copy top">
          {`${this.props.selected.length} ${headerLang}`}
        </p>
      </div>
    );
  }

  renderCardStackContent() {
    return (
      <div id="card-stack-content" className="card-stack-content">
        <ul>{this.renderSelectedCards()}</ul>
      </div>
    );
  }

  renderNarrativeContent() {
    return (
      <div
        id="card-stack-content"
        className="card-stack-content"
        ref={this.refCardStackContent}
      >
        <ul>{this.renderNarrativeCards()}</ul>
      </div>
    );
  }

  render() {
    const { isCardstack, selected, narrative } = this.props;
    if (selected.length > 0) {
      if (!narrative) {
        return (
          <div
            id="card-stack"
            className={`card-stack ${isCardstack ? "" : " folded"}`}
          >
            {this.renderCardStackHeader()}
            {this.renderCardStackContent()}
          </div>
        );
      } else {
        return (
          <div
            id="card-stack"
            ref={this.refCardStack}
            className={`card-stack narrative-mode
            ${isCardstack ? "" : " folded"}`}
          >
            {this.renderNarrativeContent()}
          </div>
        );
      }
    }

    return <div />;
  }
}

function mapStateToProps(state) {
  return {
    narrative: selectors.selectActiveNarrative(state),
    selected: selectors.selectSelected(state),
    sourceError: state.app.errors.source,
    language: state.app.language,
    isCardstack: state.app.flags.isCardstack,
    isLoading: state.app.flags.isFetchingSources,
    cardUI: state.ui.card,
    colors: state.ui.coloring.colors,
    coloringSet: state.app.associations.coloringSet,
    features: state.features,
  };
}

export default connect(mapStateToProps)(CardStack);
