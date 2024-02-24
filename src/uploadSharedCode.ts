import Experiments from './api/experiments'

const main = async () => {
  try {
    const path = "./build/index.js";
    const file = Bun.file(path);

    const text = await file.text();
    console.log(text);

    await Experiments.updateSharedCode(27975160161, text);

    process.exit();
  } catch (err) {
    console.error(err)
  }
}

main()