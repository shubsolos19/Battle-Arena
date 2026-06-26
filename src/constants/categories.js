export const CATEGORIES = [
  {
    id: 'text',
    label: 'Text',
    iconName: 'MessageSquare',
    systemPrompt: 'Answer the following in 50-60 words maximum. Be concise and clear: {prompt}',
    renderType: 'text',
  },
  {
    id: 'poem',
    label: 'Poem',
    iconName: 'PenTool',
    systemPrompt: 'Write a beautiful, creative poem about: {prompt}. \nMake it 12-16 lines with vivid imagery.',
    renderType: 'text',
  },
  {
    id: 'roast',
    label: 'Roast',
    iconName: 'Flame',
    systemPrompt: 'Write a savage but funny roast about: {prompt}. 10-15 lines, witty and punchy. No offensive slurs, keep it clever humor only.',
    renderType: 'text',
  },
  {
    id: 'story',
    label: 'Story',
    iconName: 'BookOpen',
    systemPrompt: 'Write a short creative story (200-250 words) about: {prompt}. Engaging opening, vivid details, satisfying ending.',
    renderType: 'text',
  },
  {
    id: 'summary',
    label: 'Summary',
    iconName: 'Brain',
    systemPrompt: 'Explain {prompt} like I am 5 years old. Simple words, fun analogies, max 150 words. No jargon.',
    renderType: 'text',
  },
];
