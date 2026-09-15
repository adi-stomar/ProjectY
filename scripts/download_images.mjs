import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const DATASET_DIR = path.join(rootDir, 'dataset');
const OUTPUT_DIR = path.join(rootDir, 'public', 'topic-images');

// Ensure output dir exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 1. Gather all unique topics
const topics = new Set();

const subjects = ['chemistry', 'physics', 'mathematics'];
for (const subj of subjects) {
  const subjDir = path.join(DATASET_DIR, subj);
  for (const file of ['test.jsonl', 'train.jsonl']) {
    const filePath = path.join(subjDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const q = JSON.parse(line);
          const topic = q.topic?.trim() || 'General';
          if (topic !== 'Miscellaneous') {
            topics.add(topic);
          }
        } catch (e) {}
      }
    }
  }
}

console.log(`Found ${topics.size} unique topics. Fetching images from Wikipedia...`);

// 2. Fetch images
async function fetchWikiImage(topic) {
  let searchQuery = topic;
  
  // Cleanups for better wiki matching
  const map = {
    'Application of derivatives': 'Derivative',
    'Definite Integration': 'Integral',
    'Indefinite Integration': 'Integral',
    'Trigonometry': 'Trigonometry',
    'Logarithm and its applications': 'Logarithm',
    'Quadratic Equations': 'Quadratic_equation',
    'Continuity and differentiability': 'Continuous_function',
    'Functions': 'Function_(mathematics)',
    'Special functions': 'Special_function',
    'Integrals': 'Integral',
    'Relation': 'Finitary_relation',
    'Differcntiation': 'Derivative',
    'Monotonocity': 'Monotonic_function',
    'Sequence & Series': 'Series_(mathematics)',
    'Matrix and determinant': 'Matrix_(mathematics)',
    'Area under curve': 'Integral',
    'Mathematical reasoning': 'Logic',
    'Statistics': 'Statistics',
    'Compound angles': 'Trigonometric_functions',
    'Properties of triangle': 'Triangle',
    'Integration': 'Integral',
    'Pemutation and combination': 'Combinatorics',
    'Inequalities and absolute value': 'Inequality_(mathematics)',
    'Circle and parabola': 'Conic_section',
    'Differential Equation': 'Differential_equation',
    'Limit': 'Limit_(mathematics)',
    'Thoery of equation': 'Theory_of_equations',
    'Matrix': 'Matrix_(mathematics)',
    'Mathematical induction': 'Mathematical_induction',
    'Inequalities': 'Inequality_(mathematics)',
    'Logical reasoning': 'Logic'
  };

  if (map[topic]) searchQuery = map[topic];
  if (topic.includes('General')) searchQuery = 'Physics';
  
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(searchQuery)}&pithumbsize=600&format=json&redirects=1`;
  
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'JEE-Prep-AI-Bot/1.0 (contact@aditya.com) Node-fetch'
      }
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const pages = data.query?.pages;
    if (pages) {
      const pageId = Object.keys(pages)[0];
      if (pageId !== '-1' && pages[pageId].thumbnail) {
        return pages[pageId].thumbnail.source;
      }
    }
  } catch (err) {
    console.error(`Error searching wiki for ${topic}:`, err.message);
  }
  return null;
}

async function downloadImage(url, destPath) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'JEE-Prep-AI-Bot/1.0' }
    });
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(buffer));
    return true;
  } catch (e) {
    return false;
  }
}

async function main() {
  let successCount = 0;
  for (const topic of topics) {
    const slug = topic.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const destPath = path.join(OUTPUT_DIR, `${slug}.jpg`);
    
    if (fs.existsSync(destPath)) {
      console.log(`[SKIP] ${topic} already downloaded.`);
      continue;
    }

    console.log(`[FETCH] Searching image for: ${topic}...`);
    const imageUrl = await fetchWikiImage(topic);
    
    if (imageUrl) {
      const downloaded = await downloadImage(imageUrl, destPath);
      if (downloaded) {
        console.log(`  -> Saved ${slug}.jpg`);
        successCount++;
      }
    } else {
      console.log(`  -> No image found on Wikipedia for ${topic}`);
    }
    
    // Polite delay for API (1000ms to avoid rate limits)
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log(`\nFinished! Successfully downloaded ${successCount} new images.`);
}

main();
