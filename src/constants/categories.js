export const CATEGORIES = [
  {
    id: 'text',
    label: 'Text',
    emoji: '💬',
    systemPrompt: 'Respond to the following request: {prompt}. Provide a clear, helpful, and well-structured response.',
    renderType: 'text',
  },
  {
    id: 'website',
    label: 'Website',
    emoji: '🌐',
    systemPrompt: 'Generate complete single-file HTML with embedded CSS and JS for: {prompt}. Output ONLY the HTML code, no explanation.',
    renderType: 'iframe',
  },
  {
    id: 'image',
    label: 'Image',
    emoji: '🖼️',
    systemPrompt: 'Write a detailed image generation prompt for: {prompt}. Output ONLY the prompt text, optimized for image AI models.',
    renderType: 'text',
  },
];
