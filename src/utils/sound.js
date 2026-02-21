export const playSound = (src) => {
  const audio = new Audio(src);
  audio.play();
};