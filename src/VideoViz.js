import React from 'react';
import PropTypes from 'prop-types';
import hexRgb from 'hex-rgb';
import hsvToRgb from './util/hsvToRgb';
import times from 'lodash/times';
import sum from 'lodash/sum';
import config from './config/config';

import './VideoViz.css';


let WIDTH = 1920 / 2;
let HEIGHT = 1080;
let H = 0;

class VideoViz extends React.Component {
  constructor(props) {
    super(props);
    this.state = { videoIndex: 0 };
    this.player = React.createRef();
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.videoSrc = `${this.state.videoIndex}.mp4`;
  }

  componentDidUpdate(prevProps) {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    if (!prevProps.playing && this.props.playing) {
      this.audioCtx.resume().then(() => {
        this.player.current.play();
      });
    }

    if (!prevProps.videoPlaying && this.props.videoPlaying) {
      // this.video0.current.play();
    }
  }

  componentDidMount() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    const audioElement = this.player.current;
    let audioCtx = this.audioCtx;

    var analyser = audioCtx.createAnalyser();

    const videoCtx0 = document.getElementById('video0');
    const videoCtx1 = document.getElementById('video1');
    const videoCtx2 = document.getElementById('video2');

    let source = audioCtx.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    analyser.fftSize = 2048;
    analyser.minDecibels = -80;

    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    const bassArray = new Uint8Array(bufferLength);

    const artistElem = document.getElementById('artist');
    const albumElem = document.getElementById('album');
    const bgElem = document.getElementById('bg');
    const overlayElem = document.getElementById('text-overlay');

    const draw = () => {
      HEIGHT = window.innerHeight;
      WIDTH = window.innerWidth;

      requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);
      analyser.getByteFrequencyData(bassArray);

      let bassValue = (bassArray[0] + bassArray[1] + bassArray[2] + bassArray[3] + bassArray[4]) / 5;
      bassValue = Math.max(0, 10 * (Math.exp(bassValue * 0.02) - 2));
      const bassNormalized = Math.min(bassValue / 1500, 1) / 2;

      let highValue = sum(bassArray.slice(768));
      highValue = Math.max(0, 10 * (Math.exp(highValue * 0.02) - 2));
      let midValue = sum(bassArray.slice(128)) / 896;
      // let midValue = sum(bassArray.slice(128));
      // midValue = Math.max(0, 10 * (Math.exp(midValue * 0.02) - 2));

      window.bassNormalized = bassNormalized;
      bgElem.style.transform = `scale(${1 + bassValue * 0.0001})`;
      bgElem.style.filter = `blur(${bassValue * 0.004}px)`;
      // overlayElem.style.filter = `blur(${bassValue * 0.002}px)`;
      // overlayElem.style.transform = `translateY(${midValue * .15}px)`;

      let greyscale = Math.max(50 - midValue * 4, 0);
      // let filterString = `grayscale(${greyscale}%)`;
      let blurValue = bassValue * bassValue * 0.00001 * 0.25;
      // blurValue = Math.min(bassValue, 5);
      blurValue = bassValue / 256;
      let filterString = `${config.invert ? 'invert(1) ' : '' }blur(${blurValue}px)`;
      // bgElem.style.filter = filterString;
      // videoCtx.style.filter = `grayscale(${Math.max(70 - bassValue * 0.15, 0)}%)`;
      // slideCtx.filter = `blur(200px)`;
    };

    draw();
  }

  render() {
    return (
      <div className={`viz ${config.invert ? 'invert' : ''}`}>
        <audio
          ref={this.player}
          src={this.props.audioSrc}
          type="audio/mpeg"
          preload="auto"
        />
      </div>
    );
  }
}

VideoViz.propTypes = {
  audioSrc: PropTypes.string.isRequired,
};

export default VideoViz;
