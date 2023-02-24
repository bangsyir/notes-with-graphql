import { join } from "path";
import { finished } from "stream/promises";
import { Image } from "../entity/Image";

export default async function ImagesUpload(files: any, note: any) {
  try {
    for (var i = 0; i < files.length; i++) {
      const { createReadStream } = await files[i];
      const stream = createReadStream();
      const name = Math.floor(Math.random() * 10000 + 1);
      const url = join(
        __dirname,
        `../../public/upload/${name}-${Date.now()}.jpg`
      );
      const image = new Image();
      image.url = `${name}-${Date.now()}.jpg`;
      image.note = note;
      await image.save();
      const out = require("fs").createWriteStream(url);
      await stream.pipe(out);
      await finished(out);
    }
  } catch (error) {
    console.log("File upload failed", error);
    return { status: "failed" };
  }
}
