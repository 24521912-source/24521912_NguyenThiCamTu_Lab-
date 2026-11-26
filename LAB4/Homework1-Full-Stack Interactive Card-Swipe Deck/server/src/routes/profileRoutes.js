import { Router } from 'express';
import Profile from '../models/Profile.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find()
      .sort({ id: 1 })
      .select('-_id -createdAt -updatedAt')
      .lean();

    return res.status(200).json(profiles);
  } catch {
    return res.status(500).json({
      message: 'Failed to retrieve profiles',
    });
  }
});

export default router;