const Listing = require("../models/listing");

const listingController = {
  index: async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  },

  renderNewForm: (req, res) => {
    res.render("listings/new");
  },

  showListing: async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "The Home you're trying to access has been removed");
      return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show", { listing });
  },

  createListing: async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    const images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    newListing.images = images;
    newListing.mainImage = images.length > 0 ? images[0].url : "";
    await newListing.save();
    req.flash("success", "New Home added!");
    res.redirect("/listings");
  },

  editListing: async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "listing you requested for doesn't exist");
      return res.redirect("/listings");
    }
    // let originalUrl = listing.image.url;
    // originalUrl = originalUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit", { listing });
  },

  updateListing: async (req, res) => {
    const { id } = req.params;
    console.log(`[Update Listing] Attempting to update listing ID: ${id}`);

    // 1. Find the listing first to get its current state (crucial for deletion/appending)
    let listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing you requested for doesn't exist.");
      console.error(`[Update Listing] Listing with ID ${id} not found.`);
      return res.redirect("/listings");
    }

    // --- Debugging logs (keep these for initial testing, then remove) ---
    console.log(
      "[Update Listing] req.body (non-file fields & delete requests):",
      req.body
    );
    console.log(
      "[Update Listing] req.files (uploaded files by Multer):",
      req.files
    );
    console.log(
      "[Update Listing] Current listing images BEFORE update logic:",
      listing.images
    );

    // 2. Update general listing properties (non-file fields)
    // .set() applies the updates from req.body.listing to the fetched Mongoose document in memory.
    listing.set(req.body.listing);

    // 3. Handle deletion of existing images
    // req.body.deleteImageFilenames will be an array of filenames from the checkboxes
    if (
      req.body.deleteImageFilenames &&
      Array.isArray(req.body.deleteImageFilenames) &&
      req.body.deleteImageFilenames.length > 0
    ) {
      console.log(
        "[Update Listing] User requested deletion of images with filenames:",
        req.body.deleteImageFilenames
      );

      // Delete from Cloudinary
      const deletePromises = req.body.deleteImageFilenames.map(
        async (filename) => {
          try {
            await cloudinary.uploader.destroy(filename);
            console.log(
              `[Update Listing] Successfully deleted Cloudinary asset: ${filename}`
            );
          } catch (deleteError) {
            console.error(
              `[Update Listing] Error deleting Cloudinary asset ${filename}:`,
              deleteError
            );
          }
        }
      );
      await Promise.all(deletePromises); // Wait for all deletions to complete

      // Remove these images from the Mongoose document's 'images' array in memory
      listing.images = listing.images.filter(
        (img) => !req.body.deleteImageFilenames.includes(img.filename)
      );
      console.log(
        "[Update Listing] Listing images after deletion filter:",
        listing.images
      );
    }

    // 4. Handle new image uploads (if any)
    if (req.files && req.files.length > 0) {
      console.log(
        `[Update Listing] Processing ${req.files.length} new files for upload.`
      );

      // Map the uploaded file paths and filenames into the format needed for your schema
      const newImages = req.files.map((f) => ({
        url: f.path, // Cloudinary's secure_url (from Multer-Cloudinary-Storage)
        filename: f.filename, // Cloudinary's public_id (from Multer-Cloudinary-Storage)
      }));

      // Append the new images to the existing 'images' array of the listing
      listing.images.push(...newImages);
      console.log(
        "[Update Listing] Listing images after appending new files:",
        listing.images
      );
    }

    // 5. Re-evaluate mainImage after all additions and deletions
    // Ensure mainImage always points to the URL of the first image in the *final* array.
    if (listing.images.length > 0) {
      listing.mainImage = listing.images[0].url;
      console.log(
        `[Update Listing] Final mainImage set to: ${listing.mainImage}`
      );
    } else {
      listing.mainImage = ""; // If no images are left, set mainImage to empty
      console.warn("[Update Listing] Listing has no images after update.");
    }

    // 6. Save the modified listing document to the database
    console.log(
      "[Update Listing] Listing document state BEFORE final save:",
      listing
    );
    await listing.save();
    console.log("[Update Listing] Listing saved successfully.");

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
  },

  deleteListing: async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "home removed :(!");
    res.redirect("/listings");
  },
};

module.exports = listingController;
