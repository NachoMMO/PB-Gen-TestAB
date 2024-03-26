import Experiments from './api/experiments'

const main = async () => {
  try {
    const path = "./build/index.js";
    const file = Bun.file(path);

    const text = await file.text();

    await Experiments.updateSharedCode(28340810873, text);

    process.exit();
  } catch (err) {
    console.error(err)
  }
}

main()