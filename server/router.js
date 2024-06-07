const router = require('express').Router();

const {
  getEntries,
  postEntry,
  modifyEntry,
  deleteEntry,
} = require('./controller/entries');

router.get('/entries', getEntries);

router.post('/entries', postEntry);

// to edit an entry
router.put('/entries/:id/edit', modifyEntry);

router.delete('/entries/:id', deleteEntry);

module.exports = router;
