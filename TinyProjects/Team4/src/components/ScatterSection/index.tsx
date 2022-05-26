import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';

/**
 *
 * https://www.framer.com/docs/gestures/#viewport
 * https://www.framer.com/docs/motionvalue/##useviewportscroll
 */

interface IConfetti {
  width: number;
  height: number;
  color: string;
  speed: number;
  x: number;
  y: number;
  rotation: number;
  shape: string;
}

export function ScatterSection(): React.ReactElement {
  const AMOUNT = 50;
  const INTERVAL = 1000;
  const COLORS = [
    '#131eff',
    '#1fb736',
    '#FAB1C0',
    '#ffe600',
    '#5e2297',
    '#ff9900',
    '#F81C4D',
  ];
  const wW = window.innerWidth;
  const wH = window.innerHeight;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const [confetties, setConfetties] = useState<Array<IConfetti>>([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    canvasRef.current.width = wW;
    canvasRef.current.height = wH;

    // setCtx(canvasRef.current.getContext('2d') as CanvasRenderingContext2D);
    const ctx = canvasRef.current.getContext('2d') as CanvasRenderingContext2D;
    renderConfetti(ctx);
  }, []);

  // useEffect(() => {
  //   if (ctx) renderConfetti();
  // }, [ctx]);

  const renderConfetti = (ctx: CanvasRenderingContext2D) => {
    let count = 0;
    const newConfetti = getConfetti();
    const stagger = setInterval(() => {
      if (count < AMOUNT) {
        setConfetties([...confetties, newConfetti]);
      } else {
        clearInterval(stagger);
      }
      count += 1;
    }, INTERVAL);

    drawConfetti(ctx, newConfetti);
  };

  const drawConfetti = (ctx: CanvasRenderingContext2D, confetti: IConfetti) => {
    if (confetti.shape === 'rect') ctx.clearRect(0, 0, wW, wH);
    // else if (confetti.shape === 'circle') {
    // clear circle
    // }

    confetties.forEach((confetti) => {
      update(ctx, confetti);
    });

    requestAnimationFrame(() => drawConfetti(ctx, confetti));
  };

  const getConfetti = () => {
    const x = random(0, wW);
    const speed = random(2.2, 2.8);
    const width = 24 / speed;
    const height = 48 / speed;
    const color = COLORS[randomInt(0, COLORS.length)];
    const shape = Math.floor(Math.random() * 10) % 2 === 0 ? 'circle' : 'rect';
    return {
      width,
      height,
      color,
      speed,
      x,
      y: -20,
      rotation: 0,
      shape,
    };
  };

  const update = (ctx: CanvasRenderingContext2D, confetti: IConfetti) => {
    const y = confetti.y < wH ? (confetti.y += confetti.speed) : -20;
    const x = confetti.x + Math.sin(confetti.y * (confetti.speed / 100));
    confetti = { ...confetti, x: x > wW ? 0 : x };
    ctx.fillStyle = confetti.color;
    ctx.save();
    ctx.translate(x + confetti.width / 2, y + confetti.height / 2);
    ctx.rotate((y * confetti.speed * Math.PI) / 180);
    ctx.scale(Math.cos(y / 10), 1);

    if (confetti.shape === 'circle') {
      // ctx.arc(
      //   -confetti.width / 2,
      //   -confetti.height / 2,
      //   confetti.width,
      //   0,
      //   2 * Math.PI
      // );
      // ctx.fill();
    } else if (confetti.shape === 'rect') {
      ctx.fillRect(
        -confetti.width / 2,
        -confetti.height / 2,
        confetti.width,
        confetti.height
      );
    }
    ctx.restore();
  };

  const random = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const randomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) +
    Math.ceil(min);

  return (
    <Wrapper
      style={{ height: 5000 }}
      whileInView={{ backgroundColor: '#eee' }}
      onViewportEnter={(en) => console.log('ScatterSection viewport enter', en)}
      onViewportLeave={(en) => console.log('ScatterSection viewport leave', en)}
    >
      <canvas id="confetti" ref={canvasRef} />
    </Wrapper>
  );
}

const Wrapper = styled(motion.section)`
  width: 100%;
  height: 100%;
  margin: 0;
  background-color: #fff;
  overflow: hidden;

  #confetti {
    position: relative;
    top: 0;
    left: 0;
    z-index: 1;
  }
`;
