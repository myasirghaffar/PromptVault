-- Insert sample prompts for testing
insert into public.prompts (title, description, prompt_text, category, tags, image_url) values
(
  'Cyberpunk City Night',
  'A stunning neon-lit cityscape with futuristic architecture',
  'A breathtaking cyberpunk city at night, neon lights reflecting off wet streets, towering skyscrapers with holographic advertisements, flying cars in the distance, rain-soaked pavement, cinematic lighting, ultra detailed, 8k resolution',
  'Landscapes',
  array['cyberpunk', 'city', 'neon', 'futuristic'],
  '/placeholder.svg?height=400&width=600'
),
(
  'Fantasy Dragon Portrait',
  'Majestic dragon with intricate scales and glowing eyes',
  'A majestic dragon portrait, intricate scales with iridescent colors, piercing glowing eyes, smoke wisps from nostrils, fantasy art style, dramatic lighting, highly detailed, digital painting',
  'Characters',
  array['dragon', 'fantasy', 'creature', 'portrait'],
  '/placeholder.svg?height=400&width=600'
),
(
  'Minimalist Product Shot',
  'Clean and modern product photography style',
  'Minimalist product photography, clean white background, soft studio lighting, professional commercial style, high-end aesthetic, sharp focus, 4k quality',
  'Product',
  array['minimalist', 'product', 'commercial', 'clean'],
  '/placeholder.svg?height=400&width=600'
),
(
  'Anime Character Design',
  'Vibrant anime-style character illustration',
  'Anime character design, vibrant colors, expressive eyes, dynamic pose, detailed clothing with intricate patterns, studio ghibli inspired, cel-shaded style, high quality illustration',
  'Characters',
  array['anime', 'character', 'illustration', 'vibrant'],
  '/placeholder.svg?height=400&width=600'
),
(
  'Abstract Geometric Art',
  'Modern abstract composition with geometric shapes',
  'Abstract geometric art, bold colors, overlapping shapes, modern minimalist design, balanced composition, vector style, clean lines, contemporary aesthetic',
  'Abstract',
  array['abstract', 'geometric', 'modern', 'minimalist'],
  '/placeholder.svg?height=400&width=600'
),
(
  'Cozy Coffee Shop Interior',
  'Warm and inviting cafe atmosphere',
  'Cozy coffee shop interior, warm lighting, wooden furniture, plants on shelves, steam rising from coffee cups, bokeh background, inviting atmosphere, photorealistic, golden hour lighting',
  'Interiors',
  array['interior', 'cozy', 'cafe', 'warm'],
  '/placeholder.svg?height=400&width=600'
);
