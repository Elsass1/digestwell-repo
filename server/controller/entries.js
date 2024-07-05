const { Items, Symptoms, User } = require('../models/entries');

exports.getEntries = async (req, res) => {
  try {

    const itemsWithSymptoms = await Items.findAll({
      include: [
        {
          model: Symptoms,
          as: 'symptoms',
        },
        {
          model: User,
          as: 'user',
        },
      ],
    });


    const symptomsWithoutItems = await Symptoms.findAll({
      where: {
        itemId: null,
      },
      include: [
        {
          model: User,
          as: 'user',
        },
      ],
    });

    const entries = [...itemsWithSymptoms, ...symptomsWithoutItems];

    res.status(200).json(entries);
  } catch (error) {
    console.error('Failed to fetch entries:', error);
    res.status(500).json('Failed to fetch entries');
  }
};

exports.postEntry = async (req, res) => {
  const { name, select, other_symptoms, stool_type, is_bleeding, user_id } =
    req.body;

  try {
    let newItem = null;
    let newSymptom = null;

    if (name && select) {
      newItem = await Items.create({ name, select, userId: user_id });
    }

    if (stool_type || other_symptoms || is_bleeding !== undefined) {
      const symptomData = {
        stool_type: stool_type || null,
        is_bleeding: is_bleeding || false,
        other_symptoms: other_symptoms || null,
        userId: user_id,
        itemId: newItem ? newItem.id : null,
      };
      newSymptom = await Symptoms.create(symptomData);
    }

    let createdItemWithSymptoms = null;
    if (newItem) {
      createdItemWithSymptoms = await Items.findByPk(newItem.id, {
        include: Symptoms,
      });
    } else if (newSymptom) {
      createdItemWithSymptoms = newSymptom;
    }

    res.status(201).json(createdItemWithSymptoms);
  } catch (error) {
    console.error(error);
    res.status(500).json('Failed to post the new entry');
  }
};


exports.modifyEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await Items.findByPk(id);

    if (!entry) {
      return res.status(404).json('Entry not found');
    }

    const updatedEntry = await entry.update(req.body, { returning: true });
    res.json(updatedEntry);
  } catch (error) {
    res.status(500).json('Failed to update the entry');
  }
};

exports.deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const itemEntry = await Items.findByPk(id);
    if (itemEntry) {
      await itemEntry.destroy();
      return res.status(200).json('Item delete was successful');
    }

    const symptomEntry = await Symptoms.findByPk(id);
    if (symptomEntry) {
      await symptomEntry.destroy();
      return res.status(200).json('Symptom delete was successful');
    }

    return res.status(404).json('Entry not found');
  } catch (error) {
    console.error('Failed to delete the entry:', error);
    return res.status(500).json('Failed to delete the entry');
  }
};
