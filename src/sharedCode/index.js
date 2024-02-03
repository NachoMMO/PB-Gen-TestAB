import GlobalGen from './global/index.js';

const main = () => {
  const data = GlobalGen.getFromSS('data');
  console.log(data);
}

main();