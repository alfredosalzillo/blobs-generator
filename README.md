# 💧 Blobs Generator

A simple API to generate cute, customizable SVG blobs. Perfect for placeholders, avatars, or decorative elements.

![Blob 1](https://blobs-six.vercel.app/api/blob?width=150&height=150)
![Blob 2](https://blobs-six.vercel.app/api/blob?version=v1&d=MTYxNjg3MTgzMTY2NjM3MA==%7C100%7C100%7C200%7C200%7C133.49-100,100-136.32,62.56-100,100-61.81%7C100-100-13%7C299,75%25,75%25-299,75%25,2%25-299,75%25,98%25)
![Blob 3](https://blobs-six.vercel.app/api/blob?version=v1&d=MTYxNjg3MTg3MTg5ODcyMw==%7C100%7C100%7C200%7C200%7C150.86-100,100-146.78,51.01-100,100-53.23%7C100-100-24%7C149,81%25,84%25-149,81%25,2%25-149,81%25,98%25)

## 🚀 API Endpoints

### 1. Get a Blob Image (SVG)
Returns a random or deterministic SVG image of a blob.

**Endpoint:** `GET /api/blob`

**Query Parameters:**
- `width`: (Optional) The width of the SVG (default: 200).
- `height`: (Optional) The height of the SVG (default: 200).
- `d`: (Optional) A blob descriptor to generate a specific blob (encoded string).

**Examples:**
- [Random Blob](https://blobs-six.vercel.app/api/blob)
- [Custom Size (150x150)](https://blobs-six.vercel.app/api/blob?width=150&height=150)

### 2. Generate Blob Data (JSON)
Returns the metadata and a direct link for a random blob.

**Endpoint:** `GET /api/blob/generate`

**Query Parameters:**
- `width`: (Optional) The width for the generated blob (default: 200).
- `height`: (Optional) The height for the generated blob (default: 200).

**Example Response:**
```json
{
  "type": "blob",
  "version": "v1",
  "descriptor": { ... },
  "link": "https://blobs-six.vercel.app/api/blob?version=v1&d=..."
}
```

---
Built with Next.js and ❤️.

