import "./bubbles.css";
import { useEffect } from "react";

const { innerHeight, innerWidth } = window;
const FADE_ANIMATION_TIME = 2000;

class Bubble {
  root: Element;
  bubbleSpan: HTMLElement | undefined;
  color: string;
  posY: number;
  posX: number;
  height: number;
  width: number;

  constructor(root: Element) {
    this.root = root;
    this.bubbleSpan = undefined;

    this.color = this.randomColor();

    this.posY = this.randomNumber(innerHeight - 50, 0);
    this.posX = this.randomNumber(innerWidth - 50, 0);

    // setting height and width of the bubble
    if (innerWidth < 600) {
      this.height = this.randomNumber(300, 100);
    } else {
      this.height = this.randomNumber(800, 300);
    }
    this.width = this.height;

    this.handleNewBubble();

    this.bubbleEnd(this.randomNumber(15000, 10000));
  }
  randomNumber(max: number, min: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  randomColor() {
    return `rgba(
            ${this.randomNumber(0, 255)},
            ${this.randomNumber(0, 255)},
            ${this.randomNumber(0, 255)}, 
            ${0.7})`;
  }

  // creates and appends a new bubble in the DOM
  handleNewBubble() {
    this.bubbleSpan = document.createElement("div");
    this.bubbleSpan.classList.add("bubble");
    this.bubbleSpan.style.backgroundColor = this.color;
    this.bubbleSpan.style.height = this.height + "px";
    this.bubbleSpan.style.width = this.height + "px";
    this.bubbleSpan.style.transform = `translate(${this.posX}px, ${this.posY}px)`;

    this.root.append(this.bubbleSpan);
  }

  bubbleEnd(removingTime = 0) {
    setTimeout(
      () => {
        this.bubbleSpan?.classList.add("bubble-fade-out");
      },
      removingTime === 0 ? removingTime : removingTime - FADE_ANIMATION_TIME
    );

    setTimeout(() => {
      this.bubbleSpan?.remove();
    }, removingTime);
  }
}

export default function Bubbles() {
  useEffect(() => {
    const root = document.querySelector("#bubbles-container");
    if (root) {
      setInterval(function () {
        new Bubble(root);
      }, 1000);
    }
  }, []);

  return (
    <div
      data-testid="bubbles_container"
      id="bubbles-container"
      className="bubbles-container"
    ></div>
  );
}
