import { Router } from 'express';

import Profile from '../models/Profile.js';
import Swipe, { SWIPE_ACTIONS } from '../models/Swipe.js';

const router = Router();

function isValidIdentifier(value) {
  return (
    typeof value === 'string' &&
    value.trim().length > 0 &&
    value.trim().length <= 100
  );
}

router.post('/', async (req, res) => {
  const {
    sessionId,
    profileId,
    action,
  } = req.body ?? {};

  if (!isValidIdentifier(sessionId)) {
    return res.status(400).json({
      message: 'A valid sessionId is required',
    });
  }

  if (!isValidIdentifier(profileId)) {
    return res.status(400).json({
      message: 'A valid profileId is required',
    });
  }

  if (!SWIPE_ACTIONS.includes(action)) {
    return res.status(400).json({
      message: 'Invalid swipe action',
    });
  }

  try {
    const profile = await Profile.exists({
      id: profileId.trim(),
    });

    if (!profile) {
      return res.status(404).json({
        message: 'Profile not found',
      });
    }

    const swipe = await Swipe.create({
      sessionId: sessionId.trim(),
      profileId: profileId.trim(),
      action,
    });

    return res.status(201).json({
      id: swipe._id.toString(),
      sessionId: swipe.sessionId,
      profileId: swipe.profileId,
      action: swipe.action,
      createdAt: swipe.createdAt,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Profile has already been swiped',
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Invalid swipe data',
      });
    }

    return res.status(500).json({
      message: 'Failed to save swipe action',
    });
  }
});

export default router;