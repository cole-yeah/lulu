const shell = require("shelljs");
const fs = require("fs");
const chokidar = require("chokidar");
const path = require("path");

const checkPkg = (pkgName) => {
  shell.echo(`检查是否安装${pkgName}`);
  if (!shell.which(pkgName)) {
    shell.echo(`找不到${pkgName}模块`);
    shell.exit(1);
  }
  shell.echo(`${pkgName}已安装`);
};

const VIDEO = [".mp4", ".mkv"];
const IMAGE = [".png", ".jpg", ".jpeg"];

const VIDEO_TO_IMG_SHELL = `ffmpeg -i video_demo.mp4 -qscale:v 1 -qmin 1 -qmax 1 -vsync 0 imgs/frame%08d.png`;

const videoReg = /(\w+).(mp4|mkv)/;

const run = () => {
  checkPkg("ffmpeg");
  // shell.exec();

  // const watcher = chokidar.watch("../assets/input");
  // watcher.on("all", (evt, path) => {
  //   console.log("xxxxxx", evt, path);
  // });

  const inputDir = path.resolve(__dirname, "../assets/input");
  const outputDir = path.resolve(__dirname, '../assets/output');
  const libDir = path.resolve(__dirname, '../lib')
  const stat = fs.statSync(inputDir);

  if (stat.isDirectory()) {
    const dirs = fs.readdirSync(inputDir);
    dirs.forEach((item) => {
      const matchRes = item.match(videoReg);
      if (matchRes) {
        const name = matchRes[1];
        const filePath = path.join(inputDir, item);
        if(!fs.existsSync(path.join(outputDir, `${name}_imgs`))) {
          fs.mkdirSync(path.join(outputDir, `${name}_imgs`));
          const outputImgsDir = path.join(outputDir, `${name}_imgs`)
          shell.exec(
            `ffmpeg -i ${filePath} -qscale:v 1 -qmin 1 -qmax 1 -vsync 0 ${outputImgsDir}/frame%08d.png`,
            () => {}
          );
        }
        const outputImgsDir = path.join(outputDir, `${name}_imgs`)
        if(!fs.existsSync(path.join(outputDir, `${name}_imgs_2k`))) {
          fs.mkdirSync(path.join(outputDir, `${name}_imgs_2k`));
        }
        const outputImgs2KDir = path.join(outputDir, `${name}_imgs_2k`);
        shell.exec(
          `${libDir}/realesrgan-ncnn-vulkan -i ${outputImgsDir} -o ${outputImgs2KDir} -s 2 -f jpg`,
          (a, b, c) => {
            console.log('xxxx', a, b, c)
          }
        )
      }
    });
  }

  // const dirs = fs.readdirSync()
};

run();
