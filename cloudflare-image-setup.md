# Setting up Cloudflare for Image Optimization

This guide will help you set up Cloudflare to optimize and serve your trek images efficiently.

## Step 1: Sign up for a Cloudflare Account

1. Go to [Cloudflare.com](https://www.cloudflare.com/) and create a free account if you don't have one already.
2. After signing up, you'll be prompted to add a site. You can add your production domain if you have one.

## Step 2: Setting Up Cloudflare Images

### Option 1: Cloudflare Images Service (Recommended)

Cloudflare Images is a dedicated service for image optimization and delivery.

1. From your Cloudflare dashboard, go to "Images" in the sidebar.
2. Sign up for the Cloudflare Images service (pricing starts at $5/month for 100,000 images).
3. Once activated, you can upload images using:
   - The Cloudflare dashboard
   - The Cloudflare API
   - Direct Upload URLs

#### Using the API to Upload Images

```javascript
// Example code to upload an image to Cloudflare Images
async function uploadImageToCloudflare(file) {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await fetch("https://api.cloudflare.com/client/v4/accounts/{account_id}/images/v1", {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_API_TOKEN"
    },
    body: formData
  });
  
  const data = await response.json();
  return data.result.variants[0]; // This returns the URL of the optimized image
}
```

### Option 2: Cloudflare Workers + Images API (Free Tier Option)

If you want to use the free tier, you can create a Cloudflare Worker to resize images on-the-fly:

1. Go to Workers & Pages in your Cloudflare dashboard.
2. Create a new Worker.
3. Use the following code template for image resizing:

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const imageURL = url.searchParams.get('url')
  const width = url.searchParams.get('width') || 800
  
  if (!imageURL) {
    return new Response('Missing "url" parameter', { status: 400 })
  }
  
  // Fetch the original image
  const imageResponse = await fetch(imageURL)
  if (!imageResponse.ok) {
    return new Response('Failed to fetch image', { status: 404 })
  }
  
  // Transform the image using Cloudflare's service
  return new Response(imageResponse.body, {
    headers: {
      'Content-Type': imageResponse.headers.get('Content-Type'),
      'Cache-Control': 'public, max-age=31536000',
      'CF-Image-Width': width
    }
  })
}
```

4. Deploy the worker to your subdomain, e.g., `images.yourdomain.workers.dev`.
5. Access optimized images through your worker: `https://images.yourdomain.workers.dev/?url=https://original-image-url.com/image.jpg&width=800`

## Step 3: Update Your Firebase Trek Data with Cloudflare Image URLs

Once your images are uploaded to Cloudflare, update your trek data in Firebase:

1. Go to `/admin/treks` in your application.
2. Edit each trek and update the image URL with the Cloudflare-hosted version.

## Step 4: Recommended Image Sizes for Trek Cards

For optimal performance, use these image sizes:
- Trek Card Thumbnails: 800px width
- Full-size Trek Detail Images: 1200px width

## Testing Your Setup

1. Open your application and check the Network tab in your browser's developer tools.
2. Verify that images are being served from Cloudflare's CDN.
3. Check that image sizes are appropriately optimized for their display size.

## Benefits of Cloudflare for Images

- Global CDN for fast loading worldwide
- Automatic format optimization (WebP, AVIF)
- Responsive images for different devices
- Reduced bandwidth costs
- Improved Core Web Vitals scores

For more detailed documentation, visit [Cloudflare Images Documentation](https://developers.cloudflare.com/images/).
