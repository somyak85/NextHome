// migrate_images.js
const mongoose = require("mongoose");
const Listing = require("./models/listing"); // Make sure this path is correct relative to migrate_images.js
require("dotenv").config(); // Load environment variables from your .env file

// Make sure your DB_URL is correctly set in your .env file
const dbUrl = process.env.MONGODB_URL; // Or process.env.DB_URL, whatever you use

async function runMigration() {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB for migration.");

    const listings = await Listing.find({}); // Fetch all listings

    let migratedCount = 0;
    for (let listing of listings) {
      // Check if the old 'image' field exists and the new 'images' array is empty or undefined
      if (
        listing.image &&
        listing.image.url &&
        (!listing.images || listing.images.length === 0)
      ) {
        // Populate the new 'images' array with the old single image
        listing.images = [
          {
            url: listing.image.url,
            filename: listing.image.filename || "placeholder_filename", // Provide a default if filename was truly optional
          },
        ];
        // Set the mainImage to the URL of the migrated single image
        listing.mainImage = listing.image.url;

        // IMPORTANT: You might also want to remove the old 'image' field if it's no longer needed
        // You can do this by setting it to undefined or using $unset in an update query
        // For now, if you just update listing.images and listing.mainImage,
        // the old 'image' field will remain but become effectively unused if your app only relies on the new fields.
        // If you want to explicitly remove it from existing documents:
        // listing.image = undefined; // This will trigger $unset on save

        await listing.save(); // Save the modified listing
        migratedCount++;
        console.log(
          `Migrated listing: ${listing._id} - Old image: ${listing.image.url}`
        );
      }
    }

    console.log(`Migration complete! ${migratedCount} listings were migrated.`);
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await mongoose.disconnect(); // Always disconnect from the DB
    console.log("Disconnected from DB.");
  }
}

runMigration(); // Execute the migration function when this script is run
