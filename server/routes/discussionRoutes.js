const express = require('express');
const router = express.Router();
const {
  createDiscussion,
  getDiscussionsByCourse,
  addReply,
  togglePin
} = require('../controllers/discussionController');

router.post('/', createDiscussion);                           // POST /api/discussions
router.get('/:courseId', getDiscussionsByCourse);             // GET /api/discussions/:courseId
router.post('/:discussionId/reply', addReply);                // POST /api/discussions/:discussionId/reply
router.put('/:discussionId/pin', togglePin);                  // PUT /api/discussions/:discussionId/pin

module.exports = router;
