import sharp from 'sharp';
import fs from 'fs/promises';
import https from 'https';
import http from 'http';

// Function to fetch image from URL
async function fetchImage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirect
        fetchImage(response.headers.location).then(resolve).catch(reject);
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

// Function to calculate average color of the left 10% of an image
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

    // Calculate average color
    const pixels = leftSection.data;
    const pixelCount = pixels.length / leftSection.info.channels;

    let r = 0, g = 0, b = 0;

    for (let i = 0; i < pixels.length; i += leftSection.info.channels) {
      r += pixels[i];
      g += pixels[i + 1];
      b += pixels[i + 2];
    }

    r = Math.round(r / pixelCount);
    g = Math.round(g / pixelCount);
    b = Math.round(b / pixelCount);

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
  const bookRegex = /{\s*id:\s*"([^"]+)"[\s\S]*?coverImage:\s*"([^"]+)"[\s\S]*?spineColor:\s*"([^"]+)"[\s\S]*?}/g;
  const updates = [];

  let match;
  while ((match = bookRegex.exec(content)) !== null) {
    const [fullMatch, id, coverImage, currentSpineColor] = match;

    // Skip local images
    if (coverImage.startsWith('/')) {
      console.log(`Skipping ${id} (local image)`);
      continue;
    }

    console.log(`Processing ${id}...`);

    try {
      const imageBuffer = await fetchImage(coverImage);
      const newSpineColor = await getLeftEdgeColor(imageBuffer);

      if (newSpineColor) {
        console.log(`  ${id}: ${currentSpineColor} -> ${newSpineColor}`);
        updates.push({
          id,
          oldColor: currentSpineColor,
          newColor: newSpineColor
        });
      }

      // Add a small delay to avoid overwhelming servers
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`  Failed to process ${id}:`, error.message);
    }
  }

  // Apply updates to the file
  let updatedContent = content;
  for (const update of updates) {
    // Use a more specific regex to replace only the spineColor for this book
    const bookPattern = new RegExp(
      `(id:\\s*"${update.id}"[\\s\\S]*?spineColor:\\s*)"${update.oldColor}"`,
      'g'
    );
    updatedContent = updatedContent.replace(bookPattern, `$1"${update.newColor}"`);
  }

  // Write the updated content back
  await fs.writeFile(libraryPath, updatedContent, 'utf-8');
  console.log(`\nUpdated ${updates.length} spine colors!`);

  // Print summary
  console.log('\nSummary:');
  updates.forEach(u => {
    console.log(`  ${u.id}: ${u.oldColor} -> ${u.newColor}`);
  });
}

updateSpineColors().catch(console.error);
