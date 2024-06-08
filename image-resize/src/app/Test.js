import React from 'react';
import { Rnd } from 'react-rnd';
import { useState } from 'react';
// 'use client';

function Test() {
  const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'solid 1px #ddd',
    background: '#f0f0f0',
  };

  const [initialDimention, setInitialDimention] = useState({
    width: 200,
    height: 200,
    x: 150,
    y: 150,
  });
  return (
    <div>
      <Rnd
        style={style}
        size={{
          width: initialDimention.width,
          height: initialDimention.height,
        }}
        position={{ x: initialDimention.x, y: initialDimention.y }}
        onDragStop={(e, d) => {
          setInitialDimention({ x: d.x, y: d.y });
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          setInitialDimention({
            width: ref.style.width,
            height: ref.style.height,
            ...position,
          });
        }}
      >
        <div>
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
        {/* uytserfiyerfgui */}
      </Rnd>
    </div>
  );
}

export default Test;
