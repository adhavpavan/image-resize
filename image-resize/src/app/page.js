'use client';
import Image from 'next/image';
// import { Rnd } from 'react-rnd';
import styles from './page.module.css';
import Test from './Test';
// import { useState } from 'react';


export default function Home() {
  // const [initialDimention, setInitialDimention] = useState({
  //   width: 200,
  //   height: 200,
  //   x: 10,
  //   y: 10,
  // });
  return (
    <main className={styles.main}>
      <div
        className='box'
        style={{
          height: '600px',
          width: '600px',
          border: '1px solid black',
          borderRadius: '50%',
          position: 'relative',
          overflow: 'hidden',
          padding: '0',
        }}
      >

      <Test/>
      </div>

   
    </main>
  );
}
