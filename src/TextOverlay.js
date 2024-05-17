import React from 'react';
import PropTypes from 'prop-types';
import config from './config/config';

import './TextOverlay.css';

const TextOverlay = (props) => {
  // const artistColor = config.invert ? '#000000' : '#FFFFFF';
  const artistColor = '#000000';
  const svgFillColor = config.invert ? '#000000' : '#FFFFFF';
  const mixBlendMode = config.invert ? 'color-burn' : 'color-dodge';


  const ART_SIZE = 858;
  const minsText = config.album || "44 MINUTES";
  const mixText1 = "VERSION";
  const mixText2 = "VERSION";

  const LETTER_WIDTH = 51.3;
  const LETTER_HEIGHT = 66;
  const titleSpacing = ((ART_SIZE + 6) - LETTER_WIDTH * props.title.length) / (props.title.length - 1);
  const minSpacing = ((ART_SIZE + 14) - LETTER_WIDTH * minsText.length) / (minsText.length - 1);
  const mix1Spacing = ((ART_SIZE + 14) - LETTER_HEIGHT * mixText1.length) / (mixText1.length - 1);
  const mix2Spacing = ((ART_SIZE + 14) - LETTER_HEIGHT * mixText2.length) / (mixText2.length - 1);

  let instrumentalText;

  if (config.invert) {
    instrumentalText = (
      <div className="instrumental-text-container">
        <div className="intrume" style={{letterSpacing: mix1Spacing}}>VERSION</div>
        <br />
        <div className="ntalmix" style={{letterSpacing: mix2Spacing}}>VERSION</div>
      </div>
    );
  }

  return (
    <div className="text-container fill-layer" id="text-overlay" style={{ color: artistColor }}>
      <svg fill="#FFF"><rect x="0"  width="100%" height="100%" y="0" /></svg>
      <div className="square-layer" />
      <div className="artist artist1 mins" id="artist" style={{ letterSpacing: minSpacing }}>
        {minsText}
      </div>
        <br />
        <div className="fury">FURY</div>
        <div className="title" style={{letterSpacing: titleSpacing}}>{props.title}</div>
        <br />
        {instrumentalText}
    </div>
  );
}

TextOverlay.propTypes = {
  artist: PropTypes.string,
  title: PropTypes.string,
  album: PropTypes.string,
};

TextOverlay.defaultProps = {
  artist: '',
  title: '',
  album: '',
}

export default TextOverlay;
