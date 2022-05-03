var cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "200mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    // console.log("bakend begins...");
    // Process a POST request
    let response = "";
    try {
      let fileStr = req.body.data;
      console.log("backend received");

      const uploadedResponse = await cloudinary.uploader.upload(
        fileStr,
        { ocr: "adv_ocr" },
        function (error, result) {
          response = result;
          console.log(
            response.info.ocr.adv_ocr.data[0].textAnnotations[0].description
          );
        }
      );
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ error: "Something wrong" });
    }

    res
      .status(200)
      .json(response.info.ocr.adv_ocr.data[0].textAnnotations[0].description);
  }
}
