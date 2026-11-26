import { Router } from 'express';
import mongoose from 'mongoose';

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

function serializeSwipe(swipe) {
  return {
    id: swipe._id.toString(),
    sessionId: swipe.sessionId,
    profileId: swipe.profileId,
    action: swipe.action,
    createdAt: swipe.createdAt,
  };
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

    return res.status(201).json(
      serializeSwipe(swipe),
    );
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

router.get('/history/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  if (!isValidIdentifier(sessionId)) {
    return res.status(400).json({
      message: 'A valid sessionId is required',
    });
  }

  try {
    const history = await Swipe.find({
      sessionId: sessionId.trim(),
    })
      .sort({
        createdAt: 1,
        _id: 1,
      })
      .lean();

    return res.status(200).json(
      history.map(serializeSwipe),
    );
  } catch {
    return res.status(500).json({
      message: 'Failed to retrieve swipe history',
    });
  }
});

router.delete(
  '/history/:sessionId/last',
  async (req, res) => {
    const { sessionId } = req.params;

    const {
      expectedActionId,
    } = req.body ?? {};

    if (!isValidIdentifier(sessionId)) {
      return res.status(400).json({
        message: 'A valid sessionId is required',
      });
    }

    if (
      typeof expectedActionId !== 'string' ||
      !mongoose.isObjectIdOrHexString(expectedActionId)
    ) {
      return res.status(400).json({
        message: 'A valid expectedActionId is required',
      });
    }

    try {
      const latestSwipe = await Swipe.findOne({
        sessionId: sessionId.trim(),
      })
        .sort({
          createdAt: -1,
          _id: -1,
        })
        .lean();

      if (!latestSwipe) {
        return res.status(404).json({
          message: 'No swipe action to undo',
        });
      }

      if (
        latestSwipe._id.toString() !== expectedActionId
      ) {
        return res.status(409).json({
          message: 'Swipe history has changed',
        });
      }

      const deletedSwipe = await Swipe.findOneAndDelete({
        _id: latestSwipe._id,
        sessionId: sessionId.trim(),
      });

      if (!deletedSwipe) {
        return res.status(409).json({
          message: 'Swipe history has changed',
        });
      }

      return res.status(200).json(
        serializeSwipe(deletedSwipe),
      );
    } catch {
      return res.status(500).json({
        message: 'Failed to undo swipe action',
      });
    }
  },
);

export default router;