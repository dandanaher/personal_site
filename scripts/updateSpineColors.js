import sharp from 'sharp';
import fs from 'fs/promises';
import https from 'https';
import http from 'http';

// Function to calculate relative luminance and determine contrasting text color
function getContrastingTextColor(hexColor) {
  // Remove # if present
  const hex = hexColor.replace('#', '');

  // Parse RGB values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Calculate relative luminance (sRGB)
  const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  const luminance = 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;

  // Return white for dark backgrounds, black for light backgrounds
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

// Function to fetch image from URL with retry logic
async function fetchImage(url, retries = 3, delay = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const request = client.get(url, { timeout: 10000 }, (response) => {
          if (response.statusCode === 302 || response.statusCode === 301) {
            // Handle redirect
            fetchImage(response.headers.location, retries, delay).then(resolve).catch(reject);
            return;
          }

          const chunks = [];
          response.on('data', (chunk) => chunks.push(chunk));
          response.on('end', () => resolve(Buffer.concat(chunks)));
          response.on('error', reject);
        });

        request.on('error', reject);
        request.on('timeout', () => {
          request.destroy();
          reject(new Error('Request timeout'));
        });
      });
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
}

// Function to calculate most common color of the left 10% of an image
async function getLeftEdgeColor(imageBuffer) {
  try {
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();

    // Calculate the width of the left 10%
    const cropWidth = Math.floor(metadata.width * 0.1);

    // Extract the left 10% of the image
    const leftSection = await image
      .extract({
        left: 0,
        top: 0,
        width: cropWidth,
        height: metadata.height
      })
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Count color occurrences using color buckets for efficiency
    const pixels = leftSection.data;
    const colorCounts = new Map();
    const bucketSize = 16; // Reduce color space to 16x16x16 = 4096 possible colors for efficiency

    for (let i = 0; i < pixels.length; i += leftSection.info.channels) {
      // Bucket the RGB values to reduce color space
      const r = Math.floor(pixels[i] / bucketSize) * bucketSize;
      const g = Math.floor(pixels[i + 1] / bucketSize) * bucketSize;
      const b = Math.floor(pixels[i + 2] / bucketSize) * bucketSize;

      const colorKey = `${r},${g},${b}`;
      colorCounts.set(colorKey, (colorCounts.get(colorKey) || 0) + 1);
    }

    // Find the most common color
    let maxCount = 0;
    let mostCommonColor = null;

    for (const [colorKey, count] of colorCounts.entries()) {
      if (count > maxCount) {
        maxCount = count;
        mostCommonColor = colorKey;
      }
    }

    if (!mostCommonColor) {
      return null;
    }

    // Convert back to RGB
    const [r, g, b] = mostCommonColor.split(',').map(Number);

    // Convert to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
  } catch (error) {
    console.error('Error processing image:', error.message);
    return null;
  }
}

// Main function
async function updateSpineColors() {
  console.log('Reading library.ts...');
  const libraryPath = 'c:\\Users\\jonat\\Desktop\\Projects\\personal_site\\src\\data\\library.ts';
  const content = await fs.readFile(libraryPath, 'utf-8');

  // Parse the books from the file
  const booksMatch = content.match(/export const libraryBooks: LibraryBook\[\] = \[([\s\S]*)\];/);
  if (!booksMatch) {
    console.error('Could not parse library books');
    return;
  }

  // Extract individual book objects using regex
  const bookRegex = /{\s*id:\s*"([^"]+)"[\s\S]*?coverImage[?]?:\s*"([^"]+)"[\s\S]*?spineColor:\s*"([^"]+)"[\s\S]*?}/g;
  const updates = [];

  // Count total books first
  const allMatches = [...content.matchAll(bookRegex)];
  const totalBooks = allMatches.length;
  let processedCount = 0;
  let skippedCount = 0;

  console.log(`Found ${totalBooks} books to process\n`);

  // Process books in parallel batches for efficiency
  const batchSize = 5;
  for (let i = 0; i < allMatches.length; i += batchSize) {
    const batch = allMatches.slice(i, i + batchSize);

    await Promise.all(batch.map(async (match) => {
      const [fullMatch, id, coverImage, currentSpineColor] = match;

      // Skip local images
      if (coverImage.startsWith('/')) {
        processedCount++;
        skippedCount++;
        console.log(`[${processedCount}/${totalBooks}] Skipping ${id} (local image)`);
        return;
      }

      processedCount++;
      const percentage = Math.round((processedCount / totalBooks) * 100);
      const progressBar = '█'.repeat(Math.floor(percentage / 2)) + '░'.repeat(50 - Math.floor(percentage / 2));

      console.log(`\n[${processedCount}/${totalBooks}] ${progressBar} ${percentage}%`);
      console.log(`Processing ${id}...`);

      try {
        const imageBuffer = await fetchImage(coverImage);
        const newSpineColor = await getLeftEdgeColor(imageBuffer);

        if (newSpineColor) {
          const newTextColor = getContrastingTextColor(newSpineColor);
          console.log(`  ✓ Spine: ${currentSpineColor} -> ${newSpineColor}`);
          console.log(`  ✓ Text:  -> ${newTextColor}`);
          updates.push({
            id,
            oldSpineColor: currentSpineColor,
            newSpineColor: newSpineColor,
            newTextColor: newTextColor
          });
        }
      } catch (error) {
        console.error(`  ✗ Failed after 3 retries: ${error.message}`);
      }
    }));

    // Small delay between batches
    if (i + batchSize < allMatches.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  const failedCount = (processedCount - skippedCount) - updates.length;

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Processing Summary:`);
  console.log(`  Total books: ${totalBooks}`);
  console.log(`  ✓ Successfully processed: ${updates.length}`);
  console.log(`  ✗ Failed: ${failedCount}`);
  console.log(`  ⊘ Skipped (local images): ${skippedCount}`);
  console.log('='.repeat(60));

  // Apply updates to the file
  console.log('\n\nApplying updates to library.ts...');
  let updatedContent = content;

  for (const update of updates) {
    // Update spineColor
    const spineColorPattern = new RegExp(
      `(id:\\s*"${update.id}"[\\s\\S]*?spineColor:\\s*)"${update.oldSpineColor}"`,
      'g'
    );
    updatedContent = updatedContent.replace(spineColorPattern, `$1"${update.newSpineColor}"`);

    // Add or update spineTextColor - look for existing spineTextColor field or add after spineColor
    const hasTextColorPattern = new RegExp(
      `(id:\\s*"${update.id}"[\\s\\S]*?spineColor:\\s*"[^"]+",\\s*)(spineTextColor:\\s*"[^"]+",)`
    );

    if (hasTextColorPattern.test(updatedContent)) {
      // Update existing spineTextColor
      const textColorPattern = new RegExp(
        `(id:\\s*"${update.id}"[\\s\\S]*?spineTextColor:\\s*)"[^"]+"`,
        'g'
      );
      updatedContent = updatedContent.replace(textColorPattern, `$1"${update.newTextColor}"`);
    } else {
      // Add spineTextColor after spineColor
      const addTextColorPattern = new RegExp(
        `(id:\\s*"${update.id}"[\\s\\S]*?spineColor:\\s*"${update.newSpineColor}",)`,
        'g'
      );
      updatedContent = updatedContent.replace(
        addTextColorPattern,
        `$1\n    spineTextColor: "${update.newTextColor}",`
      );
    }
  }

  // Write the updated content back
  await fs.writeFile(libraryPath, updatedContent, 'utf-8');

  console.log('\n' + '='.repeat(60));
  console.log(`✓ Successfully updated ${updates.length} books!`);
  console.log('='.repeat(60));

  // Print summary
  console.log('\nSummary:');
  updates.forEach(u => {
    console.log(`  ${u.id}:`);
    console.log(`    Spine: ${u.oldSpineColor} -> ${u.newSpineColor}`);
    console.log(`    Text:  -> ${u.newTextColor}`);
  });

  console.log('\n' + '='.repeat(60));
  console.log('Done!');
  console.log('='.repeat(60));
}

updateSpineColors().catch(console.error);
