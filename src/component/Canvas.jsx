import React, { useEffect, useRef, useState } from 'react';
import Konva from 'konva';

const CanvasComponent = () => {
  const [stage, setStage] = useState(null);
  const [layer, setLayer] = useState(null);
  const [image, setImage] = useState(null);
  const [textNode, setTextNode] = useState(null);
  const [videoNode, setVideoNode] = useState(null);
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const stageRef = useRef(null);

  useEffect(() => {
    if (stageRef.current && !stage) {
      const newStage = new Konva.Stage({
        container: stageRef.current,
        width: window.innerWidth,
        height: window.innerHeight,
      });
      const newLayer = new Konva.Layer();
      newStage.add(newLayer);
      setStage(newStage);
      setLayer(newLayer);
    }
  }, [stage, layer]);

  useEffect(() => {
    if (stage && layer) {
      if (image) {
        const konvaImage = new Konva.Image({
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          image: image,
          draggable: true,
        });
        layer.add(konvaImage);
        layer.draw();

        konvaImage.on('transformend', () => {
          konvaImage.scaleX(konvaImage.scaleX());
          konvaImage.scaleY(konvaImage.scaleY());
          konvaImage.position({
            x: konvaImage.x() * konvaImage.scaleX(),
            y: konvaImage.y() * konvaImage.scaleY(),
          });
          konvaImage.scaleX(1);
          konvaImage.scaleY(1);
          layer.draw();
        });
      }

      if (textNode) {
        const konvaText = new Konva.Text({
          x: 50,
          y: 50,
          text: text,
          fontSize: fontSize,
          fill: 'black',
          draggable: true,
        });
        layer.add(konvaText);
        layer.draw();

        konvaText.on('transformend', () => {
          konvaText.fontSize(konvaText.fontSize());
          konvaText.position({
            x: konvaText.x() * konvaText.scaleX(),
            y: konvaText.y() * konvaText.scaleY(),
          });
          konvaText.scaleX(1);
          konvaText.scaleY(1);
          layer.draw();
        });

        setTextNode(konvaText);
      }

      if (videoNode) {
        const konvaVideo = new Konva.Image({
          x: 100,
          y: 100,
          width: 320,
          height: 240,
          draggable: true,
          image: videoNode,
        });
        layer.add(konvaVideo);
        layer.draw();
      }
    }
  }, [stage, layer, image, textNode, videoNode, text, fontSize]);

  const handleAddRemoveText = () => {
    if (textNode) {
      textNode.destroy();
      setTextNode(null);
    } else {
      setTextNode(true);
    }
    layer.draw();
  };

  const handleAddVideo = () => {
    if (videoNode) {
      layer.findOne('Image').destroy();
      setVideoNode(null);
    } else {
      const videoElement = document.createElement('video');
      videoElement.src = 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c4/Physicsworks.ogv/Physicsworks.ogv.240p.vp9.webm'; 
      videoElement.width = 320;
      videoElement.height = 240;
      setVideoNode(videoElement);
    }
  };

  const handlePlayPauseVideo = () => {
    if (videoNode) {
      if (videoNode.paused) {
        videoNode.play();
      } else {
        videoNode.pause();
      }
    }
  };

  const handleStopVideo = () => {
    if (videoNode) {
      videoNode.pause();
      videoNode.currentTime = 0;
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (textNode) {
      textNode.text(e.target.value);
      layer.draw();
    }
  };

  const handleFontSizeChange = (e) => {
    setFontSize(Number(e.target.value));
    if (textNode) {
      textNode.fontSize(Number(e.target.value));
      layer.draw();
    }
  };

  useEffect(() => {
    const img = new Image();
    img.src = 'https://konvajs.org/assets/lion.png'; 
    img.onload = () => {
      setImage(img);
    };
  }, []);

  return (
    <div>
      <button onClick={handleAddRemoveText}>
        {textNode ? 'Remove Text' : 'Add Text'}
      </button>
      <button onClick={handleAddVideo}>
        {videoNode ? 'Remove Video' : 'Add Video'}
      </button>
      <button onClick={handlePlayPauseVideo}>Play/Pause Video</button>
      <button onClick={handleStopVideo}>Stop Video</button>

      {textNode && (
        <div>
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            placeholder="Edit text"
          />
          <input
            type="number"
            value={fontSize}
            onChange={handleFontSizeChange}
            placeholder="Font size"
            min="1"
          />
        </div>
      )}

      <div ref={stageRef} />
    </div>
  );
};

export default CanvasComponent;
