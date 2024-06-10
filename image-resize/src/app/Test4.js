import React, { useState, useRef } from 'react';
import Moveable from 'react-moveable';

function Test4() {
  const targetRef = useRef(null);
  const moveableRef = useRef(null);
  return (
    <div className='root'>
      <div
        className='container'
        style={{
          width: '500px',
          height: '500px',
          border: '1px solid #ccc',
        }}
      >
        <div className='target' ref={targetRef}>
          Target
        </div>
        <Moveable
          ref={moveableRef}
          target={targetRef}
          draggable={true}
          throttleDrag={1}
          edgeDraggable={false}
          startDragRotate={0}
          throttleDragRotate={0}
          resizable={true}
          keepRatio={false}
          snappable={true}
          bounds={{ left: 0, top: 0, right: 0, bottom: 0, position: 'css' }}
          edge={[]}
          onDrag={(e) => {
            e.target.style.transform = e.transform;
          }}
          onResize={(e) => {
            e.target.style.width = `${e.width}px`;
            e.target.style.height = `${e.height}px`;
            e.target.style.transform = e.drag.transform;
          }}
          onBound={(e) => {
            console.log(e);
          }}
        />
      </div>
    </div>
  );
}


export default Test4;