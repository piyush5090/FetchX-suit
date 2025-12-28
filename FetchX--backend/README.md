# Welcome to FetchX! 🚀

Thank you for choosing FetchX! This guide will walk you through the simple steps to start searching for beautiful photos and videos from multiple stock media providers, all from one place.

## Getting Started: Your 3-Step Guide

Follow these three simple steps to get your API key and start using the FetchX service.

### Step 1: Create Your Account

First things first, you'll need an account.

1.  **Visit our website:** Go to the FetchX homepage.
2.  **Sign Up or Log In:** You can create a new account using your email and a password, or you can sign up even faster using your Google account. If you already have an account, simply log in.

### Step 2: Get Your API Key

Once you're logged in, you'll land on your personal dashboard. Your API key is waiting for you there.

1.  **Find the "API Key" section** on your dashboard.
2.  **Click the "Copy" button** next to your key. This key is your personal pass to access the FetchX search engine. Keep it safe!

![API Key Dashboard](https://i.imgur.com/example.png)  *\(This is an illustrative example of where you might find your key on the dashboard.)*

### Step 3: Make Your First API Request

Now you're ready to start searching! You can use your API key in any application that can make web requests.

To use your key, you need to include it in the `Authorization` header of your request, like this:

`Authorization: Bearer YOUR_API_KEY`

Just replace `YOUR_API_KEY` with the key you copied from your dashboard.

---

## API Examples: Let's Start Searching!

Here are some examples of how to use the FetchX API. We'll use the popular `curl` command-line tool for these examples, but you can use any HTTP client you like.

### 1. Check Available Media Counts (`/search`)

Before you download, you might want to see how many images or videos are available for your search term. This endpoint is perfect for that.

**Example: How many mountain images are available?**

```bash
curl "https://fetchx-backend.onrender.com/search?query=mountains&type=images" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**✅ Example Response:**

This tells you the total number of images found across all our providers.

```json
{
  "query": "mountains",
  "mediaType": "images",
  "maxDownloadLimit": 15500,
  "providers": {
    "pexels": {
      "images": 10000,
      "available": 10000,
      "usable": 10000
    },
    "unsplash": {
      "images": 5000,
      "available": 10000,
      "usable": 5000
    },
    "pixabay": {
      "images": 500,
      "available": 1200,
      "usable": 500
    }
  }
}
```

### 2. Get All Images (`/metadata/all/images`)

This is the most popular endpoint! It fetches a mixed list of images from all our providers in a single request.

**Example: Get a list of "nature" images.**

```bash
curl "https://fetchx-backend.onrender.com/metadata/all/images?query=nature" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**✅ Example Response:**

You get a list of items, each with a direct URL to the image.

```json
{
  "provider": "all",
  "type": "images",
  "query": "nature",
  "page": 1,
  "perPage": 60,
  "total": 25000,
  "items": [
    {
      "id": 2845013,
      "type": "image",
      "source": "pexels",
      "url": "https://images.pexels.com/photos/2845013/pexels-photo-2845013.jpeg",
      "width": 4000,
      "height": 6000
    },
    {
      "id": "LBI7cgq3pbM",
      "type": "image",
      "source": "unsplash",
      "url": "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=2070",
      "width": 5472,
      "height": 3648
    }
  ]
}
```

### 3. Get All Videos (`/metadata/all/videos`)

Just like the images endpoint, but for videos!

**Example: Get "ocean" videos.**

```bash
curl "https://fetchx-backend.onrender.com/metadata/all/videos?query=ocean" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**✅ Example Response:**

```json
{
  "provider": "all",
  "type": "videos",
  "query": "ocean",
  "page": 1,
  "perPage": 40,
  "total": 8000,
  "items": [
    {
      "id": 2586823,
      "type": "video",
      "source": "pexels",
      "url": "https://player.vimeo.com/external/348578984.hd.mp4?s=1a2b3c...",
      "width": 1920,
      "height": 1080
    },
    {
      "id": 1968819,
      "type": "video",
      "source": "pixabay",
      "url": "https://player.vimeo.com/external/349021873.hd.mp4?s=4d5e6f...",
      "width": 1920,
      "height": 1080
    }
  ]
}
```

### 4. Get Media from a Specific Provider

Want images or videos from just one provider? No problem! Here are the endpoints you can use:

-   `/metadata/pexels/images`
-   `/metadata/pexels/videos`
-   `/metadata/unsplash/images`
-   `/metadata/pixabay/photos`
-   `/metadata/pixabay/videos`
-   `/metadata/pixabay/illustrations`
-   `/metadata/pixabay/vectors`

**Example: Get only "cat" images from Pexels.**

```bash
curl "https://fetchx-backend.onrender.com/metadata/pexels/images?query=cats" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**✅ Example Response (from Pexels):**

```json
{
    "provider": "pexels",
    "type": "photos",
    "query": "cats",
    "page": 1,
    "perPage": 80,
    "total": 10000,
    "items": [
        {
            "id": 45201,
            "width": 3000,
            "height": 2000,
            "url": "https://www.pexels.com/photo/white-and-gray-cat-on-white-textile-45201/",
            "photographer": "Pixabay",
            "photographer_url": "https://www.pexels.com/@pixabay",
            "photographer_id": 2659,
            "avg_color": "#A9A5A1",
            "src": {
                "original": "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg",
                "large2x": "https://images.pexels.com/photos/45201/pexels-photo-45201.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                "large": "https://images.pexels.com/photos/45201/pexels-photo-45201.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
                "medium": "https://images.pexels.com/photos/45201/pexels-photo-45201.jpeg?auto=compress&cs=tinysrgb&h=350",
                "small": "https://images.pexels.com/photos/45201/pexels-photo-45201.jpeg?auto=compress&cs=tinysrgb&h=130",
                "portrait": "https://images.pexels.com/photos/45201/pexels-photo-45201.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
                "landscape": "https://images.pexels.com/photos/45201/pexels-photo-45201.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
                "tiny": "https://images.pexels.com/photos/45201/pexels-photo-45201.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"
            },
            "liked": false,
            "alt": "White and Gray Cat on White Textile"
        }
    ]
}
```

---

That's it! You're all set. If you have any questions, feel free to reach out to our support.

Happy searching! 🎉
