import React, { useState, useRef } from 'react';
import Moveable from 'react-moveable';
import { flushSync } from 'react-dom';

function Test2() {
  const boxRef = useRef(null);
  // const targetRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 200, height: 200 });
  const targetRef = useRef(null);
  const moveableRef = useRef(null);
  return (
    <div>
      <div
        className='box'
        ref={boxRef}
        style={{
          height: '600px',
          width: '600px',
          border: '1px solid black',
          borderRadius: '50%',
          position: 'relative',
          overflow: 'hidden',
          background: 'lightblue',
          padding: '0',
        }}
      >
        <div className='container'>
          <div
            className='target'
            ref={targetRef}
            style={{
              maxWidth: 'auto',
              maxHeight: 'auto',
              minWidth: 'auto',
              minHeight: 'auto',
            }}
          >
            <img
              src={
                'https://w7.pngwing.com/pngs/285/461/png-transparent-bmw-m-car-bmw-5-series-logo-bmw-emblem-trademark-logo.png'
              }
              alt='Logo'
              style={{
                width: '100%',
                height: '100%',
                // width:initialDimention.x,
                // height:initialDimention.y
                // transform: `rotate(${logo.rotate}deg)`,
                // filter: `hue-rotate(${logo.color})`,
              }}
            />
          </div>
          <Moveable
            flushSync={flushSync}
            target={targetRef}
            ref={moveableRef}
            draggable={true}
            throttleDrag={1}
            edgeDraggable={false}
            startDragRotate={0}
            throttleDragRotate={0}
            resizable={true}
            keepRatio={false}
            throttleResize={1}
            renderDirections={['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']}
            rotatable={true}
            throttleRotate={0}
            rotationPosition={'top'}
            onDragStart={({ target, clientX, clientY }) => {
              console.log('onDragStart', target);
              setPosition({ x: clientX, y: clientY });
            }}
            onDrag={(e) => {
              e.target.style.transform = e.transform;
            }}
            onDragEnd={({ target, isDrag, clientX, clientY }) => {
              console.log('onDragEnd', target, isDrag);
            }}
            /* When resize or scale, keeps a ratio of the width, height. */
            // keepRatio={true}

            /* resizable*/
            /* Only one of resizable, scalable, warpable can be used. */
            onResizeStart={({ target, clientX, clientY }) => {
              console.log('onResizeStart', target);
            }}
            onResize={(e) => {
              e.target.style.width = `${e.width}px`;
              e.target.style.height = `${e.height}px`;
              e.target.style.transform = e.drag.transform;
            }}
            // onResize={({
            //     target, width, height,
            //     dist, delta, direction,
            //     clientX, clientY,
            // }) => {
            //     console.log("onResize", target);
            //     delta[0] && (target.style.width = `${width}px`);
            //     delta[1] && (target.style.height = `${height}px`);
            // }}
            onResizeEnd={({ target, isDrag, clientX, clientY }) => {
              console.log('onResizeEnd', target, isDrag);
            }}
            /* scalable */
            /* Only one of resizable, scalable, warpable can be used. */
            scalable={true}
            throttleScale={0}
            onScaleStart={({ target, clientX, clientY }) => {
              console.log('onScaleStart', target);
            }}
            onScale={({
              target,
              scale,
              dist,
              delta,
              transform,
              clientX,
              clientY,
            }) => {
              console.log('onScale scale', scale);
              target.style.transform = transform;
            }}
            onScaleEnd={({ target, isDrag, clientX, clientY }) => {
              console.log('onScaleEnd', target, isDrag);
            }}
            /* rotatable */
            onRotateStart={({ target, clientX, clientY }) => {
              console.log('onRotateStart', target);
            }}
            onRotate={({
              target,
              delta,
              dist,
              transform,
              clientX,
              clientY,
            }) => {
              console.log('onRotate', dist);
              target.style.transform = transform;
            }}
            onRotateEnd={({ target, isDrag, clientX, clientY }) => {
              console.log('onRotateEnd', target, isDrag);
            }}
            // Enabling pinchable lets you use events that
            // can be used in draggable, resizable, scalable, and rotateable.
            pinchable={true}
            onPinchStart={({ target, clientX, clientY, datas }) => {
              // pinchStart event occur before dragStart, rotateStart, scaleStart, resizeStart
              console.log('onPinchStart');
            }}
            onPinch={({ target, clientX, clientY, datas }) => {
              // pinch event occur before drag, rotate, scale, resize
              console.log('onPinch');
            }}
            onPinchEnd={({ isDrag, target, clientX, clientY, datas }) => {
              // pinchEnd event occur before dragEnd, rotateEnd, scaleEnd, resizeEnd
              console.log('onPinchEnd');
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Test2;
