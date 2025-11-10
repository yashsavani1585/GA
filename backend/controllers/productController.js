// import { v2 as cloudinary } from "cloudinary";
// import productModel from "../models/productModel.js";
// import { cleanupTempFiles } from "../middleware/cloudinaryUpload.js";
// import { COLOR_ENUM, SHAPE_ENUM } from "../models/productModel.js";

// // ---- helpers ----
// const parseSpecs = (body) => {
//   const shape = (body.diamondShape || "round").toLowerCase();
//   return {
//     productWeight: Number(body.productWeight ?? 0),
//     goldWeight: Number(body.goldWeight ?? 0),
//     diamondCarat: Number(body.diamondCarat ?? 0),
//     diamondShape: SHAPE_ENUM.includes(shape) ? shape : "other",
//     numberOfDiamonds: Number(body.numberOfDiamonds ?? 0),
//     makingCharge: Number(body.makingCharge ?? 0),
//   };
// };

// const uploadMany = async (filesArr = []) => {
//   if (!Array.isArray(filesArr) || !filesArr.length) return [];
//   const sliced = filesArr.slice(0, 10); // cap per color
//   const uploaded = await Promise.all(
//     sliced.map((f) =>
//       cloudinary.uploader.upload(f.path, {
//         resource_type: "image",
//         folder: "everglow-jewellery",
//         transformation: [{ width: 800, height: 800, crop: "fill" }, { quality: "auto" }],
//       })
//     )
//   );
//   return uploaded.map((r) => r.secure_url);
// };

// // ---------- ADD ----------
// const addProduct = async (req, res) => {
//   console.log(req.body)
//   console.log(req.files)
//   try {
//     const { name, description, price, discountPrice, category, bestseller, productWeight, goldWeight, diamondCarat, diamondShape, numberOfDiamonds, makingCharge, gstPercent, makingChargePerGram, skuGold, skuRose, skuWhite} = req.body;
//     if (!name || !description || !price || !category) {
//       return res.json({ success: false, message: "Missing required fields" });
//     }

//     // uploads by color
//     const imagesGold  = await uploadMany(req.files?.goldImages || []);
//     const imagesRose  = await uploadMany(req.files?.roseImages || []);
//     const imagesWhite = await uploadMany(req.files?.whiteImages || []);

//     // must have at least one image overall
//     const flatImages = [...imagesGold, ...imagesRose, ...imagesWhite];
//     if (!flatImages.length) {
//       cleanupTempFiles(req.files);
//       return res.json({ success: false, message: "At least one image is required" });
//     }

//     // carats per color (string: "", "14", "18")
//     // const caratByColor = {
//     //   gold: String(req.body.goldCarat ?? ""),
//     //   "rose-gold": String(req.body.roseCarat ?? ""),
//     //   "white-gold": String(req.body.whiteCarat ?? ""),
//     // };

//     // defaultColor
//     const defRaw = String(req.body.defaultColor || "").toLowerCase();
//     let defaultColor = COLOR_ENUM.includes(defRaw) ? defRaw : "gold";
//     // ensure default has images; otherwise pick first non-empty
//     const firstNonEmpty =
//       imagesGold.length ? "gold" : imagesRose.length ? "rose-gold" : "white-gold";
//     if (
//       (defaultColor === "gold" && !imagesGold.length) ||
//       (defaultColor === "rose-gold" && !imagesRose.length) ||
//       (defaultColor === "white-gold" && !imagesWhite.length)
//     ) {
//       defaultColor = firstNonEmpty;
//     }

//     // discount %
//     const priceNum = Number(price);
//     const discountNum = discountPrice ? Number(discountPrice) : 0;
//     const discountPercentage =
//       discountNum > 0 && discountNum < priceNum
//         ? Math.round(((priceNum - discountNum) / priceNum) * 100)
//         : 0;

//     const specs = parseSpecs(req.body);

//     const product = new productModel({
//       name,
//       description,
//       category,
//       price: priceNum,
//       discountPrice: discountNum,
//       discountPercentage,
//       bestseller: bestseller === "true" || bestseller === true,
//       image: flatImages, // legacy flat list
//       imagesByColor: {
//         gold: imagesGold,
//         "rose-gold": imagesRose,
//         "white-gold": imagesWhite,
//       },
//            skuByColor: {
//         gold: (skuGold || "").trim(),
//         "rose-gold": (skuRose || "").trim(),
//         "white-gold": (skuWhite || "").trim(),
//       },
//         gstPercent: Number(gstPercent ?? 3),
//       makingChargePerGram: Number(makingChargePerGram || 0),
//       // caratByColor,
//       defaultColor,
//       specs,
//       date: Date.now(),
//     });

//     await product.save();
//     cleanupTempFiles(req.files);
//     res.json({ success: true, message: "Product Added Successfully" });
//   } catch (err) {
//     console.log("addProduct error:", err);
//     cleanupTempFiles(req.files);
//     res.json({ success: false, message: err.message });
//   }
// };

// // ---------- UPDATE ----------
// const updateProduct = async (req, res) => {
//   try {
//     const { productId, name, description, price, category, bestseller } = req.body;
//     if (!productId || !name || !description || !price || !category) {
//       return res.json({ success: false, message: "Missing required fields" });
//     }

//     const priceNum = Number(price);
//     const discountRaw = req.body.discountPrice;
//     const discountNum =
//       discountRaw !== undefined && discountRaw !== "" ? Number(discountRaw) : 0;
//     const discountPercentage =
//       discountNum > 0 && discountNum < priceNum
//         ? Math.round(((priceNum - discountNum) / priceNum) * 100)
//         : 0;

//     const updateData = {
//       name,
//       description,
//       price: priceNum,
//       discountPrice: discountNum,
//       discountPercentage,
//       category,
//       bestseller: bestseller === "true" || bestseller === true,
//     };

//     // carat updates (optional)
//     const caratByColor = {};
//     if ("goldCarat" in req.body) caratByColor["gold"] = String(req.body.goldCarat ?? "");
//     if ("roseCarat" in req.body) caratByColor["rose-gold"] = String(req.body.roseCarat ?? "");
//     if ("whiteCarat" in req.body) caratByColor["white-gold"] = String(req.body.whiteCarat ?? "");
//     if (Object.keys(caratByColor).length) {
//       updateData.caratByColor = caratByColor;
//     }

//     // default color (optional)
//     if (req.body.defaultColor) {
//       const dc = String(req.body.defaultColor).toLowerCase();
//       if (COLOR_ENUM.includes(dc)) updateData.defaultColor = dc;
//     }

//     // specs (optional)
//     const specs = parseSpecs(req.body);
//     if (Object.values(specs).some((v) => v !== 0 && v !== "other")) {
//       updateData.specs = specs;
//     }

//     // replace images per color if new ones were sent
//     const imagesGold  = await uploadMany(req.files?.goldImages || []);
//     const imagesRose  = await uploadMany(req.files?.roseImages || []);
//     const imagesWhite = await uploadMany(req.files?.whiteImages || []);

//     const product = await productModel.findById(productId);
//     if (!product) {
//       cleanupTempFiles(req.files);
//       return res.json({ success: false, message: "Product not found" });
//     }

//     const nextImagesByColor = { ...product.imagesByColor.toObject?.() || product.imagesByColor };

//     if (imagesGold.length)  nextImagesByColor["gold"] = imagesGold;
//     if (imagesRose.length)  nextImagesByColor["rose-gold"] = imagesRose;
//     if (imagesWhite.length) nextImagesByColor["white-gold"] = imagesWhite;

//     // If any color changed, also refresh legacy flat image list
//     if (imagesGold.length || imagesRose.length || imagesWhite.length) {
//       updateData.imagesByColor = nextImagesByColor;
//       const flat = [
//         ...(nextImagesByColor["gold"] || []),
//         ...(nextImagesByColor["rose-gold"] || []),
//         ...(nextImagesByColor["white-gold"] || []),
//       ];
//       if (flat.length) updateData.image = flat;
//     }

//     const updated = await productModel.findByIdAndUpdate(productId, updateData, { new: true });
//     cleanupTempFiles(req.files);
//     res.json({ success: true, message: "Product Updated Successfully", product: updated });
//   } catch (err) {
//     console.log("updateProduct error:", err);
//     cleanupTempFiles(req.files);
//     res.json({ success: false, message: err.message });
//   }
// };

// // function for list product
// const listProducts = async (req, res) => {
//   try {
//     // const { color } = req.query;
//     // const filter = {};
//     // if (color && COLOR_ENUM.includes(String(color).toLowerCase())) {
//     //   filter.availableColors = String(color).toLowerCase(); // matches array contains color
//     // }
//     const products = await productModel.find({});
//     res.json({ success: true, products });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };
// // function for removing product
// const removeProduct = async (req, res) => {
//   try {
//     await productModel.findByIdAndDelete(req.body.id);
//     res.json({ success: true, message: "Product Removed" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };
// // function for single product info
// const singleProduct = async (req, res) => {
//   try {
//     const { productId } = req.body;
//     const product = await productModel.findById(productId);
//     res.json({ success: true, product });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };


// // function to get products by category
// const getProductsByCategory = async (req, res) => {
//   try {
//     const { category } = req.params;
//     const products = await productModel.find({ category });
//     res.json({ success: true, products });
    
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// const getRelatedProducts = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const current = await productModel.findById(id);
//     if (!current) return res.json({ success: false, message: "Product not found" });

//     // fetch products in same category, exclude current
//     const related = await productModel.find({
//       category: current.category,
//       _id: { $ne: id }
//     }).limit(6);

//     res.json({ success: true, products: related });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// export {
//   listProducts,
//   addProduct,
//   removeProduct,
//   singleProduct,
//   updateProduct,
//   getProductsByCategory,
//   getRelatedProducts
// };

// import { v2 as cloudinary } from "cloudinary";
// import productModel from "../models/productModel.js";
// import { cleanupTempFiles } from "../middleware/cloudinaryUpload.js";
// import { COLOR_ENUM, SHAPE_ENUM } from "../models/productModel.js";
// import connectRedis from "../config/redis.js";

// // ---- helpers ----
// const parseSpecs = (body) => {
//   const shape = (body.diamondShape || "round").toLowerCase();
//   return {
//     productWeight: Number(body.productWeight ?? 0),
//     goldWeight: Number(body.goldWeight ?? 0),
//     diamondCarat: Number(body.diamondCarat ?? 0),
//     diamondShape: SHAPE_ENUM.includes(shape) ? shape : "other",
//     numberOfDiamonds: Number(body.numberOfDiamonds ?? 0),
//     makingCharge: Number(body.makingCharge ?? 0),
//   };
// };

// const uploadMany = async (filesArr = []) => {
//   if (!Array.isArray(filesArr) || !filesArr.length) return [];
//   const sliced = filesArr.slice(0, 10); // cap per color
//   const uploaded = await Promise.all(
//     sliced.map((f) =>
//       cloudinary.uploader.upload(f.path, {
//         resource_type: "image",
//         folder: "everglow-jewellery",
//         transformation: [
//           { width: 800, height: 800, crop: "fill" },
//           { quality: "auto" },
//         ],
//       })
//     )
//   );
//   return uploaded.map((r) => r.secure_url);
// };

// // ---------- ADD ----------
// const addProduct = async (req, res) => {
//   try {
//     const {
//       name,
//       description,
//       price,
//       discountPrice,
//       category,
//       bestseller,
//       productWeight,
//       goldWeight,
//       diamondCarat,
//       diamondShape,
//       numberOfDiamonds,
//       makingCharge,
//       gstPercent,
//       makingChargePerGram,
//       skuGold,
//       skuRose,
//       skuWhite,
//     } = req.body;

//     if (!name || !description || !price || !category) {
//       return res.json({ success: false, message: "Missing required fields" });
//     }

//     const imagesGold = await uploadMany(req.files?.goldImages || []);
//     const imagesRose = await uploadMany(req.files?.roseImages || []);
//     const imagesWhite = await uploadMany(req.files?.whiteImages || []);

//     const flatImages = [...imagesGold, ...imagesRose, ...imagesWhite];
//     if (!flatImages.length) {
//       cleanupTempFiles(req.files);
//       return res.json({ success: false, message: "At least one image is required" });
//     }

//     const defRaw = String(req.body.defaultColor || "").toLowerCase();
//     let defaultColor = COLOR_ENUM.includes(defRaw) ? defRaw : "gold";
//     const firstNonEmpty =
//       imagesGold.length ? "gold" : imagesRose.length ? "rose-gold" : "white-gold";
//     if (
//       (defaultColor === "gold" && !imagesGold.length) ||
//       (defaultColor === "rose-gold" && !imagesRose.length) ||
//       (defaultColor === "white-gold" && !imagesWhite.length)
//     ) {
//       defaultColor = firstNonEmpty;
//     }

//     const priceNum = Number(price);
//     const discountNum = discountPrice ? Number(discountPrice) : 0;
//     const discountPercentage =
//       discountNum > 0 && discountNum < priceNum
//         ? Math.round(((priceNum - discountNum) / priceNum) * 100)
//         : 0;

//     const specs = parseSpecs(req.body);

//     const product = new productModel({
//       name,
//       description,
//       category,
//       price: priceNum,
//       discountPrice: discountNum,
//       discountPercentage,
//       bestseller: bestseller === "true" || bestseller === true,
//       image: flatImages,
//       imagesByColor: {
//         gold: imagesGold,
//         "rose-gold": imagesRose,
//         "white-gold": imagesWhite,
//       },
//       skuByColor: {
//         gold: (skuGold || "").trim(),
//         "rose-gold": (skuRose || "").trim(),
//         "white-gold": (skuWhite || "").trim(),
//       },
//       gstPercent: Number(gstPercent ?? 3),
//       makingChargePerGram: Number(makingChargePerGram || 0),
//       defaultColor,
//       specs,
//       date: Date.now(),
//     });

//     await product.save();
//     cleanupTempFiles(req.files);

//     // 🔥 Invalidate Redis cache
//     const redisClient = await connectRedis();
//     await redisClient.del("all_products");

//     res.json({ success: true, message: "Product Added Successfully" });
//   } catch (err) {
//     console.log("addProduct error:", err);
//     cleanupTempFiles(req.files);
//     res.json({ success: false, message: err.message });
//   }
// };

// // ---------- UPDATE ----------
// const updateProduct = async (req, res) => {
//   try {
//     const { productId, name, description, price, category, bestseller } = req.body;
//     if (!productId || !name || !description || !price || !category) {
//       return res.json({ success: false, message: "Missing required fields" });
//     }

//     const priceNum = Number(price);
//     const discountRaw = req.body.discountPrice;
//     const discountNum =
//       discountRaw !== undefined && discountRaw !== "" ? Number(discountRaw) : 0;
//     const discountPercentage =
//       discountNum > 0 && discountNum < priceNum
//         ? Math.round(((priceNum - discountNum) / priceNum) * 100)
//         : 0;

//     const updateData = {
//       name,
//       description,
//       price: priceNum,
//       discountPrice: discountNum,
//       discountPercentage,
//       category,
//       bestseller: bestseller === "true" || bestseller === true,
//     };

//     const specs = parseSpecs(req.body);
//     if (Object.values(specs).some((v) => v !== 0 && v !== "other")) {
//       updateData.specs = specs;
//     }

//     const imagesGold = await uploadMany(req.files?.goldImages || []);
//     const imagesRose = await uploadMany(req.files?.roseImages || []);
//     const imagesWhite = await uploadMany(req.files?.whiteImages || []);

//     const product = await productModel.findById(productId);
//     if (!product) {
//       cleanupTempFiles(req.files);
//       return res.json({ success: false, message: "Product not found" });
//     }

//     const nextImagesByColor = {
//       ...product.imagesByColor.toObject?.() || product.imagesByColor,
//     };

//     if (imagesGold.length) nextImagesByColor["gold"] = imagesGold;
//     if (imagesRose.length) nextImagesByColor["rose-gold"] = imagesRose;
//     if (imagesWhite.length) nextImagesByColor["white-gold"] = imagesWhite;

//     if (imagesGold.length || imagesRose.length || imagesWhite.length) {
//       updateData.imagesByColor = nextImagesByColor;
//       const flat = [
//         ...(nextImagesByColor["gold"] || []),
//         ...(nextImagesByColor["rose-gold"] || []),
//         ...(nextImagesByColor["white-gold"] || []),
//       ];
//       if (flat.length) updateData.image = flat;
//     }

//     const updated = await productModel.findByIdAndUpdate(productId, updateData, {
//       new: true,
//     });
//     cleanupTempFiles(req.files);

//     // 🔥 Invalidate Redis cache
//     const redisClient = await connectRedis();
//     await redisClient.del("all_products");
//     await redisClient.del(`product_${productId}`);

//     res.json({ success: true, message: "Product Updated Successfully", product: updated });
//   } catch (err) {
//     console.log("updateProduct error:", err);
//     cleanupTempFiles(req.files);
//     res.json({ success: false, message: err.message });
//   }
// };

// // ---------- LIST ----------
// const listProducts = async (req, res) => {
//   try {
//     const redisClient = await connectRedis();
//     const cacheKey = "all_products";

//     const cached = await redisClient.get(cacheKey);
//     if (cached) {
//       console.log("⚡ Served from Redis Cache");
//       return res.json({ success: true, products: JSON.parse(cached) });
//     }

//     const products = await productModel.find({});
//     await redisClient.setEx(cacheKey, 60, JSON.stringify(products));

//     res.json({ success: true, products });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// // ---------- REMOVE ----------
// const removeProduct = async (req, res) => {
//   try {
//     await productModel.findByIdAndDelete(req.body.id);

//     // 🔥 Invalidate Redis cache
//     const redisClient = await connectRedis();
//     await redisClient.del("all_products");
//     await redisClient.del(`product_${req.body.id}`);

//     res.json({ success: true, message: "Product Removed" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// // ---------- SINGLE PRODUCT ----------
// const singleProduct = async (req, res) => {
//   try {
//     const { productId } = req.body;
//     const redisClient = await connectRedis();
//     const cacheKey = `product_${productId}`;

//     const cached = await redisClient.get(cacheKey);
//     if (cached) {
//       console.log("⚡ Served from Redis Cache");
//       return res.json({ success: true, product: JSON.parse(cached) });
//     }

//     const product = await productModel.findById(productId);
//     await redisClient.setEx(cacheKey, 120, JSON.stringify(product));

//     res.json({ success: true, product });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// // ---------- CATEGORY ----------
// const getProductsByCategory = async (req, res) => {
//   try {
//     const { category } = req.params;
//     const redisClient = await connectRedis();
//     const cacheKey = `category_${category}`;

//     const cached = await redisClient.get(cacheKey);
//     if (cached) {
//       console.log("⚡ Served from Redis Cache");
//       return res.json({ success: true, products: JSON.parse(cached) });
//     }

//     const products = await productModel.find({ category });
//     await redisClient.setEx(cacheKey, 60, JSON.stringify(products));

//     res.json({ success: true, products });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// // ---------- RELATED ----------
// const getRelatedProducts = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const current = await productModel.findById(id);
//     if (!current) return res.json({ success: false, message: "Product not found" });

//     const related = await productModel
//       .find({ category: current.category, _id: { $ne: id } })
//       .limit(6);

//     res.json({ success: true, products: related });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// export {
//   listProducts,
//   addProduct,
//   removeProduct,
//   singleProduct,
//   updateProduct,
//   getProductsByCategory,
//   getRelatedProducts,
// };

// controllers/productController.js
import { v2 as cloudinary } from "cloudinary";
import productModel, { COLOR_ENUM, SHAPE_ENUM, PLACEMENT_ENUM } from "../models/productModel.js";
import { cleanupTempFiles } from "../middleware/cloudinaryUpload.js";
import connectRedis from "../config/redis.js";

/* ---------- helpers ---------- */
const parseSpecs = (body) => {
 
  // Parse diamond types array (simplified fields only)
  let diamondTypes = [];
  if (body.diamondTypes) {    
    try {
      const parsedTypes = JSON.parse(body.diamondTypes);
      diamondTypes = Array.isArray(parsedTypes) ? parsedTypes.filter(d => 
        d.carat || d.numberOfDiamonds || d.pricePerDiamond
      ).map(d => ({
        carat: Number(d.carat || 0),
        shape: (d.shape || "round").toLowerCase(),
        numberOfDiamonds: Number(d.numberOfDiamonds || 0),
        pricePerDiamond: Number(d.pricePerDiamond || 0),
        placement: PLACEMENT_ENUM.includes(d.placement) ? d.placement : "center"
      })) : [];
    } catch (e) {
      console.warn("Failed to parse diamondTypes:", e);
    }
  } else {
    console.log("No diamondTypes found in body");
  }
  
  const result = {
    productWeight: Number(body.productWeight ?? 0),
    goldWeight: Number(body.goldWeight ?? 0),
    diamondTypes: diamondTypes, // Simplified diamond types array
  };
  return result;
};
const parseBool = (v) => {
  if (typeof v === "boolean") return v;
  if (v == null) return false;
  const s = String(v).trim().toLowerCase();
  return s === "true" || s === "1" || s === "on" || s === "yes";
};


const uploadMany = async (filesArr = []) => {
  if (!Array.isArray(filesArr) || !filesArr.length) return [];
  const sliced = filesArr.slice(0, 10); // limit
  const uploaded = await Promise.all(
    sliced.map((f) =>
      cloudinary.uploader.upload(f.path, {
        resource_type: "image",
        folder: "everglow-jewellery",
        transformation: [
          { width: 800, height: 800, crop: "fill" },
          { quality: "auto" },
        ],
      })
    )
  );
  return uploaded.map((r) => r.secure_url);
};

/* ---------- cache invalidation helper ---------- */
const invalidateProductsCache = async (redisClient, productId = null) => {
  try {
    const keys = [];

    // collect keys
    for await (const key of redisClient.scanIterator({ MATCH: "products_preview:*", COUNT: 100 })) {
      keys.push(key);
    }
    for await (const key of redisClient.scanIterator({ MATCH: "category_*", COUNT: 100 })) {
      keys.push(key);
    }
    for await (const key of redisClient.scanIterator({ MATCH: "for_him:*", COUNT: 100 })) {
      keys.push(key);
    }
    for await (const key of redisClient.scanIterator({ MATCH: "for_her:*", COUNT: 100 })) {
      keys.push(key);
    }

    // de-dup + sanitize
    const uniq = [...new Set(keys)]
      .filter(k => typeof k === "string" && k.length > 0);

    // delete via pipeline to avoid arity/encoding issues
    if (uniq.length) {
      const multi = redisClient.multi();
      uniq.forEach(k => multi.del(k));
      await multi.exec();
    }

    if (productId) {
      await redisClient.del(`product_${productId}`);
    }
    await redisClient.del("all_products");
  } catch (e) {
    console.error("invalidateProductsCache error:", e);
  }
};



/* ---------- ADD ---------- */
const addProduct = async (req, res) => {
  try {
    const { name, description, discountPercentage, category, bestseller, forHim, forHer, gstPercent, makingChargePerGram, skuGold, skuRose, skuWhite} = req.body;
    if (!name || !description || !category) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const imagesGold = await uploadMany(req.files?.goldImages || []);
    const imagesRose = await uploadMany(req.files?.roseImages || []);
    const imagesWhite = await uploadMany(req.files?.whiteImages || []);
    const flatImages = [...imagesGold, ...imagesRose, ...imagesWhite];

    if (!flatImages.length) {
      cleanupTempFiles(req.files);
      return res.status(400).json({ success: false, message: "At least one image is required" });
    }

    let defaultColor = (req.body.defaultColor || "gold").toLowerCase();
    if (!COLOR_ENUM.includes(defaultColor)) {
      defaultColor = imagesGold.length ? "gold" : imagesRose.length ? "rose-gold" : "white-gold";
    }

    const discountPercentageNum = discountPercentage ? Number(discountPercentage) : 0;

    const specs = parseSpecs(req.body);

    const productData = {
      name,
      description,
      category,
      discountPercentage: discountPercentageNum,
      bestseller: parseBool(bestseller),
      forHim: parseBool(forHim),
      forHer: parseBool(forHer),
      image: flatImages,
      thumbnail: flatImages[0], // ✅ always ensure thumbnail
      imagesByColor: {
        gold: imagesGold,
        "rose-gold": imagesRose,
        "white-gold": imagesWhite,
      },
      skuByColor: {
        gold: (skuGold || "").trim(),
        "rose-gold": (skuRose || "").trim(),
        "white-gold": (skuWhite || "").trim(),
      },
      gstPercent: Number(gstPercent ?? 3),
      makingChargePerGram: Number(makingChargePerGram || 0),
      defaultColor,
      specs,
      date: Date.now(),
    };

    const product = new productModel(productData);
    const savedProduct = await product.save();    
    cleanupTempFiles(req.files);

    const redisClient = await connectRedis();
    await invalidateProductsCache(redisClient);

    res.json({ success: true, message: "Product Added Successfully", productId: product._id });
  } catch (err) {
    console.error("addProduct error:", err);
    cleanupTempFiles(req.files);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------- REMOVE ---------- */
 const removeProduct = async (req, res) => {
   try {
     await productModel.findByIdAndDelete(req.body.id);
     res.json({ success: true, message: "Product Removed" });
   } catch (error) {
     console.log(error);
     res.json({ success: false, message: error.message });
   }
 };








/* ---------- UPDATE ---------- */
const updateProduct = async (req, res) => {
  try {
    console.log("=== UPDATE PRODUCT DEBUG ===");
    console.log("req.body forHim:", req.body.forHim, typeof req.body.forHim);
    console.log("req.body forHer:", req.body.forHer, typeof req.body.forHer);
    
    const { productId, name, description, discountPercentage, category, bestseller, forHim, forHer, gstPercent, makingChargePerGram, skuGold, skuRose, skuWhite } = req.body;
    if (!productId || !name || !description || !category) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const discountPercentageNum = discountPercentage ? Number(discountPercentage) : 0;

    const forHimParsed = parseBool(forHim);
    const forHerParsed = parseBool(forHer);
    
    console.log("parseBool results - forHim:", forHimParsed, "forHer:", forHerParsed);

    const updateData = {
      name,
      description,
      discountPercentage: discountPercentageNum,
      category,
      bestseller: parseBool(bestseller),
      forHim: forHimParsed,
      forHer: forHerParsed,
      gstPercent: Number(gstPercent ?? 3),
      makingChargePerGram: Number(makingChargePerGram || 0),
    };

    console.log("updateData:", updateData);
    
    // Handle SKUs
    if (skuGold !== undefined || skuRose !== undefined || skuWhite !== undefined) {
      updateData.skuByColor = {
        gold: (skuGold || "").trim(),
        "rose-gold": (skuRose || "").trim(),
        "white-gold": (skuWhite || "").trim(),
      };
    }

    // Handle default color
    if (req.body.defaultColor) {
      const dc = String(req.body.defaultColor).toLowerCase();
      if (COLOR_ENUM.includes(dc)) updateData.defaultColor = dc;
    }

    const specs = parseSpecs(req.body);
    if (Object.values(specs).some((v) => v !== 0 && v !== "other")) {
      updateData.specs = specs;
    }

    // Handle color-based image uploads
    const imagesGold = await uploadMany(req.files?.goldImages || []);
    const imagesRose = await uploadMany(req.files?.roseImages || []);
    const imagesWhite = await uploadMany(req.files?.whiteImages || []);

    const product = await productModel.findById(productId).lean();
    if (!product) {
      cleanupTempFiles(req.files);
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const nextImagesByColor = { ...(product.imagesByColor || {}) };
    if (imagesGold.length) nextImagesByColor["gold"] = imagesGold;
    if (imagesRose.length) nextImagesByColor["rose-gold"] = imagesRose;
    if (imagesWhite.length) nextImagesByColor["white-gold"] = imagesWhite;

    if (imagesGold.length || imagesRose.length || imagesWhite.length) {
      updateData.imagesByColor = nextImagesByColor;
      const allImages = [
        ...(nextImagesByColor["gold"] || []),
        ...(nextImagesByColor["rose-gold"] || []),
        ...(nextImagesByColor["white-gold"] || []),
      ];
      updateData.image = allImages;
      updateData.thumbnail = allImages[0] || product.thumbnail;
    }

    const updated = await productModel.findByIdAndUpdate(productId, updateData, { new: true }).lean();
    console.log("Updated product in DB - forHim:", updated.forHim, "forHer:", updated.forHer);
    
    cleanupTempFiles(req.files);

    const redisClient = await connectRedis();
    await invalidateProductsCache(redisClient, productId);
    
    // Additional manual cache clearing for gender-based caches
    try {
      await redisClient.del('for_him:page:1:limit:20');
      await redisClient.del('for_her:page:1:limit:20');
      // Clear all for_him and for_her cache variations
      const himKeys = await redisClient.keys('for_him:*');
      const herKeys = await redisClient.keys('for_her:*');
      if (himKeys.length > 0) await redisClient.del(...himKeys);
      if (herKeys.length > 0) await redisClient.del(...herKeys);
      console.log('Manual cache clear completed - himKeys:', himKeys.length, 'herKeys:', herKeys.length);
    } catch (cacheError) {
      console.error('Cache clearing error:', cacheError);
    }

    res.json({ success: true, message: "Product Updated Successfully", product: updated });
  } catch (err) {
    console.error("updateProduct error:", err);
    cleanupTempFiles(req.files);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------- LIST (full docs, not projection) ---------- */
const listProducts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(10, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    // Check if this is an admin request (no pagination for admin)
    const isAdmin = req.query.admin === 'true' || req.query.all === 'true';

    let query = productModel.find({}, { __v: 0 }).sort({ date: -1 });

    // Apply pagination only if not admin request
    if (!isAdmin) {
      query = query.skip(skip).limit(limit);
    }

    const docs = await query.lean();

    // Ensure thumbnail exists
    const productsPreview = docs.map((d) => ({
      ...d,
      thumbnail: d.thumbnail || (Array.isArray(d.image) && d.image.length ? d.image[0] : null),
    }));

    return res.json({ success: true, products: productsPreview });
  } catch (error) {
    console.error("listProducts error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ---------- SINGLE PRODUCT ---------- */
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: "Missing productId" });

    const redisClient = await connectRedis();
    const cacheKey = `product_${productId}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json({ success: true, product: JSON.parse(cached), cached: true });
    }


    const product = await productModel.findById(productId).lean();
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.thumbnail = product.thumbnail || (Array.isArray(product.image) && product.image.length ? product.image[0] : null);

    await redisClient.setEx(cacheKey, 900, JSON.stringify(product));
    return res.json({ success: true, product, cached: false });
  } catch (error) {
    console.error("singleProduct error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------- CATEGORY ---------- */
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    // Check if pagination is requested via query params
    const isPaginated = req.query.page || req.query.limit;
    
    let query = productModel.find({ category }).sort({ date: -1 });
    
    // Only apply pagination if explicitly requested
    if (isPaginated) {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, Math.max(10, parseInt(req.query.limit) || 20));
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
    }

    const redisClient = await connectRedis();
    const cacheKey = isPaginated 
      ? `category_${category}:page:${req.query.page || 1}:limit:${req.query.limit || 20}`
      : `category_${category}:all`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json({ success: true, products: JSON.parse(cached), cached: true });
    }

    const products = await query.lean();

    const productsPreview = products.map((d) => ({
      ...d,
      thumbnail: d.thumbnail || (Array.isArray(d.image) && d.image.length ? d.image[0] : null),
    }));

    await redisClient.setEx(cacheKey, 300, JSON.stringify(productsPreview));
    return res.json({ success: true, products: productsPreview, cached: false });
  } catch (error) {
    console.error("getProductsByCategory error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------- RELATED ---------- */
const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const current = await productModel.findById(id).lean();
    if (!current) return res.status(404).json({ success: false, message: "Product not found" });

    const related = await productModel.find({ category: current.category, _id: { $ne: id } }).limit(6).lean();

    const relatedPreview = related.map((d) => ({
      ...d,
      thumbnail: d.thumbnail || (Array.isArray(d.image) && d.image.length ? d.image[0] : null),
    }));

    res.json({ success: true, products: relatedPreview });
  } catch (err) {
    console.error("getRelatedProducts error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------- FOR HIM PRODUCTS ---------- */
const getForHimProducts = async (req, res) => {
  try {
    // Prevent browser caching
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    
    // Check if pagination is requested via query params
    const isPaginated = req.query.page || req.query.limit;
    
    let query = productModel.find({ forHim: true }).sort({ date: -1 });
    
    // Only apply pagination if explicitly requested
    if (isPaginated) {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, Math.max(10, parseInt(req.query.limit) || 20));
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
    }

    const redisClient = await connectRedis();
    const cacheKey = isPaginated 
      ? `for_him:page:${req.query.page || 1}:limit:${req.query.limit || 20}`
      : `for_him:all`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json({ success: true, products: JSON.parse(cached), cached: true });
    }

    const products = await query.lean();
    console.log(`Found ${products.length} products for him:`, products.map(p => ({id: p._id, name: p.name, forHim: p.forHim, forHer: p.forHer})));

    const productsPreview = products.map((d) => ({
      ...d,
      thumbnail: d.thumbnail || (Array.isArray(d.image) && d.image.length ? d.image[0] : null),
    }));

    await redisClient.setEx(cacheKey, 300, JSON.stringify(productsPreview));
    return res.json({ success: true, products: productsPreview, cached: false });
  } catch (error) {
    console.error("getForHimProducts error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------- FOR HER PRODUCTS ---------- */
const getForHerProducts = async (req, res) => {
  try {
    // Prevent browser caching
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    
    // Check if pagination is requested via query params
    const isPaginated = req.query.page || req.query.limit;
    
    let query = productModel.find({ forHer: true }).sort({ date: -1 });
    
    // Only apply pagination if explicitly requested
    if (isPaginated) {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(100, Math.max(10, parseInt(req.query.limit) || 20));
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
    }

    const redisClient = await connectRedis();
    const cacheKey = isPaginated 
      ? `for_her:page:${req.query.page || 1}:limit:${req.query.limit || 20}`
      : `for_her:all`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json({ success: true, products: JSON.parse(cached), cached: true });
    }

    const products = await query.lean();
    console.log(`Found ${products.length} products for her:`, products.map(p => ({id: p._id, name: p.name, forHim: p.forHim, forHer: p.forHer})));

    const productsPreview = products.map((d) => ({
      ...d,
      thumbnail: d.thumbnail || (Array.isArray(d.image) && d.image.length ? d.image[0] : null),
    }));

    await redisClient.setEx(cacheKey, 300, JSON.stringify(productsPreview));
    return res.json({ success: true, products: productsPreview, cached: false });
  } catch (error) {
    console.error("getForHerProducts error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Get filtered products by category with filters
const getFilteredProducts = async (req, res) => {
  try {
    const { category } = req.params;
    const {
      minPrice,
      maxPrice,
      forHim,
      forHer,
      goldCarat, // This will be used for material filtering (14K, 18K, etc.)
      bestseller
    } = req.query;

    // Build the base query
    let query = { category };

    // Gender filters
    if (forHim === 'true') {
      query.forHim = true;
    }
    if (forHer === 'true') {
      query.forHer = true;
    }

    // Bestseller filter
    if (bestseller === 'true') {
      query.bestseller = true;
    }

    const redisClient = await connectRedis();
    
    // Create cache key based on filters
    const filterKey = `${category}_${forHim || 'false'}_${forHer || 'false'}_${goldCarat || 'all'}_${bestseller || 'false'}_${minPrice || 0}_${maxPrice || 'max'}`;
    const cacheKey = `filtered_products:${filterKey}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json({ success: true, products: JSON.parse(cached), cached: true });
    }

    let products = await productModel.find(query).sort({ date: -1 }).lean();

    // Apply price filtering on the calculated price (this needs to be done after fetching)
    // For now, we'll return all products and let frontend handle price filtering
    // since pricing is dynamic based on gold rates

    const productsPreview = products.map((d) => ({
      ...d,
      thumbnail: d.thumbnail || (Array.isArray(d.image) && d.image.length ? d.image[0] : null),
    }));

    await redisClient.setEx(cacheKey, 300, JSON.stringify(productsPreview));
    return res.json({ success: true, products: productsPreview, cached: false });
  } catch (error) {
    console.error("getFilteredProducts error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  listProducts,
  addProduct,
  removeProduct,
  singleProduct,
  updateProduct,
  getProductsByCategory,
  getRelatedProducts,
  getForHimProducts,
  getForHerProducts,
  getFilteredProducts,
};
