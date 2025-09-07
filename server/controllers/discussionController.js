const Discussion = require('../models/discussionModel');

exports.createDiscussion = async (req, res) => {
  try {
    const { title, content, courseId, createdBy } = req.body;
    const discussion = await Discussion.create({ title, content, courseId, createdBy });
    res.status(201).json(discussion);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create discussion' });
  }
};

exports.getDiscussionsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const discussions = await Discussion.find({ courseId }).populate('createdBy', 'name').sort({ isPinned: -1, createdAt: -1 });
    res.json(discussions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch discussions' });
  }
};

exports.addReply = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { userId, content } = req.body;

    const updated = await Discussion.findByIdAndUpdate(
      discussionId,
      {
        $push: { replies: { userId, content } }
      },
      { new: true }
    ).populate('replies.userId', 'name');

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add reply' });
  }
};

exports.togglePin = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const discussion = await Discussion.findById(discussionId);
    discussion.isPinned = !discussion.isPinned;
    await discussion.save();
    res.json({ message: 'Pin toggled', discussion });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle pin' });
  }
};
