// Example Flashcard Record Created for Mask #1 in an Image Occlusion Set
const occlusionFlashcardRecord = {
  id: 'card-uuid-occlusion-1',
  pageId: 'page-uuid-123',
  sourceBlockId: 'block-uuid-canvas-456',
  type: 'image_occlusion',
  front: JSON.stringify({
    imageUri: 'file:///storage/images/brain_diagram.png',
    mode: 'HIDE_ALL_REVEAL_ONE',
    masks: allMasksArray,
    targetMaskId: 'mask-1-uuid',
  } as ImageOcclusionPayload),
  back: 'Frontal Lobe', // Target mask label / text answer
  clozeHint: 'Responsible for executive function & decision making',
  
  // Initial FSRS State Fields (Sector 4 Specification)
  due: new Date().toISOString(),
  stability: 0.0,
  difficulty: 0.0,
  elapsedDays: 0,
  scheduledDays: 0,
  repetition: 0,
  lapses: 0,
  state: 'New',
  lastReview: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};