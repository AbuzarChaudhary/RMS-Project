// The four reasons from the mockups. `requiresPhoto` drives the AI step.
export const RETURN_REASONS = [
  { id: 'not_fit', label: 'Item did not fit', requiresPhoto: false },
  { id: 'wrong_item', label: 'I received the wrong item', requiresPhoto: false },
  { id: 'not_liked', label: 'I did not like the item', requiresPhoto: false },
  { id: 'defected', label: 'The item is defected', requiresPhoto: true },
];
